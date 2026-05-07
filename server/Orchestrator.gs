/**
 * Invoice2Sheet - Global Edition
 * Backend: Google Apps Script (Orchestrator & Resource Manager)
 * Architecture: Hexagonal (Controllers separated from Core Logic)
 */

const RESPONSE_HEADERS = {
  "Content-Type": "application/json"
};

/**
 * Main Entry Point for Client Requests (CORS enabled by default in GAS when returning ContentService)
 * @param {Object} e - The event object from GAS
 * @returns {TextOutput} JSON response
 */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const { action, apiKey, data, lang } = payload;
    
    // Router Logic
    if (action === "OCR_PROXY") {
      return handleOCRRequest(apiKey, data);
    } else if (action === "SAVE_INVOICE") {
      return handleSaveRequest(apiKey, data, lang);
    } else if (action === "LIST_FOLDERS") {
      return handleListFolders();
    } else if (action === "GET_USER_INFO") {
      return handleGetUserInfo();
    } else {
      throw new Error("Invalid action provided.");
    }
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Acts as a proxy to Google Vision API to prevent CORS issues on the client and hide direct calls if needed.
 * @param {string} apiKey - User's BYOK Vision API Key
 * @param {string} base64Image - Base64 encoded image string (without data:image/jpeg;base64, prefix)
 * @returns {TextOutput} Extracted text/entities
 */
function handleOCRRequest(apiKey, base64Image) {
  const url = "https://vision.googleapis.com/v1/images:annotate?key=" + apiKey;
  
  const payload = {
    requests: [
      {
        image: { content: base64Image },
        features: [{ type: "TEXT_DETECTION" }]
      }
    ]
  };
  
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  const response = UrlFetchApp.fetch(url, options);
  const result = JSON.parse(response.getContentText());
  
  if (response.getResponseCode() !== 200) {
    throw new Error("Vision API Error: " + (result.error ? result.error.message : "Unknown error"));
  }
  
  // Extract full text from annotations
  const annotations = result.responses[0].textAnnotations;
  const fullText = annotations && annotations.length > 0 ? annotations[0].description : "";
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    fullText: fullText
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Orchestrates the persistence of invoice data.
 * 1. Resolves/Creates Year/Month Folder
 * 2. Resolves/Creates Google Sheet
 * 3. Appends the data row
 * @param {string} apiKey - (Optional here, unless used for further verification)
 * @param {Object} invoiceData - { vendor, date, amount }
 * @param {string} lang - 'tr' or 'en'
 * @returns {TextOutput} Success status
 */
/**
 * Orchestrates the persistence of invoice data.
 * @param {string} apiKey - (Optional here)
 * @param {Object} invoiceData - { vendor, date, amount }
 * @param {string} lang - 'tr' or 'en'
 * @returns {TextOutput} Success status
 */
function handleSaveRequest(apiKey, invoiceData, lang) {
  const date = new Date(invoiceData.date);
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  const rootName = invoiceData.rootFolder || "Invoice2Sheet_Records";
  const folderId = checkOrCreateFolder(rootName, year, month);
  const sheet = checkOrCreateSheet(folderId, year + "-" + month, lang);
  
  const imageUrl = saveImageToDrive(folderId, invoiceData.image, invoiceData.vendor + "_" + invoiceData.date);
  
  sheet.appendRow([
    invoiceData.date,
    invoiceData.vendor,
    invoiceData.amount,
    imageUrl, // Added image link
    new Date() // Timestamp
  ]);

  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: "Invoice saved successfully"
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Idempotent logic to ensure Drive folder hierarchy: Root -> YYYY -> MM
 * @param {string} rootName
 * @param {string} year
 * @param {string} month
 * @returns {string} Folder ID
 */
function checkOrCreateFolder(rootName, year, month) {
  let root = DriveApp.getFoldersByName(rootName);
  let rootFolder = root.hasNext() ? root.next() : DriveApp.createFolder(rootName);
  
  let yearIter = rootFolder.getFoldersByName(year);
  let yearFolder = yearIter.hasNext() ? yearIter.next() : rootFolder.createFolder(year);
  
  let monthIter = yearFolder.getFoldersByName(month);
  let monthFolder = monthIter.hasNext() ? monthIter.next() : yearFolder.createFolder(month);
  
  return monthFolder.getId();
}

/**
 * Ensures the monthly sheet exists and has localized headers.
 * @param {string} folderId
 * @param {string} yearMonth
 * @param {string} lang
 * @returns {Sheet}
 */
function checkOrCreateSheet(folderId, yearMonth, lang) {
  const fileName = yearMonth + (lang === 'tr' ? "_Giderler" : "_Expenses");
  const folder = DriveApp.getFolderById(folderId);
  const files = folder.getFilesByName(fileName);
  
  let spreadsheet;
  if (files.hasNext()) {
    spreadsheet = SpreadsheetApp.open(files.next());
  } else {
    spreadsheet = SpreadsheetApp.create(fileName);
    const file = DriveApp.getFileById(spreadsheet.getId());
    folder.addFile(file);
    DriveApp.getRootFolder().removeFile(file); // Move from root to target folder
    
    const sheet = spreadsheet.getSheets()[0];
    sheet.appendRow(getHeaders(lang));
    sheet.setFrozenRows(1);
  }
  
  return spreadsheet.getSheets()[0];
}

// ------------------------------------------------------------------
// i18n Helper for GAS (Ensures no hardcoded strings in Sheets headers)
// ------------------------------------------------------------------
const I18N_HEADERS = {
  en: ["Date", "Vendor / Company", "Total Amount", "Image Link", "Timestamp"],
  tr: ["Tarih", "Firma / Satıcı", "Toplam Tutar", "Fatura Görseli", "Zaman Damgası"]
};

function getHeaders(lang) {
  return I18N_HEADERS[lang] || I18N_HEADERS["en"];
}

/**
 * Saves base64 image to Drive and returns its URL.
 * @param {string} folderId
 * @param {string} base64Data
 * @param {string} fileName
 * @returns {string} File URL
 */
function saveImageToDrive(folderId, base64Data, fileName) {
  if (!base64Data) return "";
  
  try {
    // Strip prefix if exists (e.g. data:image/jpeg;base64,)
    const base64String = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
    const decoded = Utilities.base64Decode(base64String);
    const blob = Utilities.newBlob(decoded, "image/jpeg", fileName + ".jpg");
    
    const folder = DriveApp.getFolderById(folderId);
    const file = folder.createFile(blob);
    return file.getUrl();
  } catch (e) {
    return "Error saving image: " + e.message;
  }
}

/**
 * Lists top-level folders in the user's Google Drive.
 * @returns {TextOutput} JSON list of folders
 */
function handleListFolders() {
  try {
    const folders = DriveApp.getRootFolder().getFolders();
    const list = [];
    while (folders.hasNext()) {
      const f = folders.next();
      list.push({
        id: f.getId(),
        name: f.getName()
      });
    }
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      folders: list
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Fetches the user's Google profile information.
 * @returns {TextOutput} JSON info
 */
function handleGetUserInfo() {
  try {
    const user = Session.getActiveUser();
    const email = user.getEmail() || Session.getEffectiveUser().getEmail();
    
    // Attempt to get photo URL from multiple sources
    let photoUrl = "";
    
    // Source 1: Active User (most direct)
    try {
      photoUrl = user.getPhotoUrl();
    } catch (e) {}

    // Source 2: Effective User (fallback)
    if (!photoUrl) {
      try {
        photoUrl = Session.getEffectiveUser().getPhotoUrl();
      } catch (e) {}
    }

    // Source 3: Drive Owner (legacy/fallback)
    if (!photoUrl) {
      try {
        photoUrl = DriveApp.getRootFolder().getOwner().getPhotoUrl();
      } catch (e) {}
    }
    
    // If photoUrl is present, ensure it's a standard accessible size
    if (photoUrl && photoUrl.indexOf('=') !== -1) {
      photoUrl = photoUrl.split('=')[0] + "=s96-c"; 
    } else if (photoUrl && photoUrl.indexOf('?') !== -1) {
      // Handle other URL formats if necessary
      photoUrl = photoUrl + "&sz=96";
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      email: email,
      photoUrl: photoUrl || ""
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
