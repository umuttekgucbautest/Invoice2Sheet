import { SecurityManager } from './security';

export interface OCRResult {
  vendor: string;
  date: string;
  totalAmount: number;
  currency: string;
  error?: string;
}

export async function extractInvoiceData(base64Image: string): Promise<OCRResult> {
  const apiKey = SecurityManager.getApiKey();
  
  // Default fallback values if OCR fails or no API key is set
  const defaultResult: OCRResult = {
    vendor: '',
    date: new Date().toISOString().split('T')[0],
    totalAmount: 0,
    currency: 'TRY'
  };

  if (!apiKey) {
    return { ...defaultResult, error: 'API Key is missing. Please set it in Settings.' };
  }

  try {
    // Remove the data URI prefix (e.g., "data:image/jpeg;base64,")
    const base64Content = base64Image.split(',')[1] || base64Image;

    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: base64Content
            },
            features: [
              {
                type: 'TEXT_DETECTION'
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(`Vision API error: ${response.status} - ${errData.error?.message || ''}`);
    }

    const data = await response.json();
    const textAnnotations = data.responses[0]?.textAnnotations;

    if (!textAnnotations || textAnnotations.length === 0) {
      return { ...defaultResult, error: 'No text found in the image.' };
    }

    // The first item contains the entire extracted text block
    const fullText: string = textAnnotations[0].description;
    
    // 1. Extract Date (Looking for DD.MM.YYYY, DD/MM/YYYY, or YYYY-MM-DD)
    const dateRegex = /(\d{2})[\s./-](\d{2})[\s./-](\d{4})|(\d{4})[\s./-](\d{2})[\s./-](\d{2})/;
    const dateMatch = fullText.match(dateRegex);
    let extractedDate = defaultResult.date;
    if (dateMatch) {
      if (dateMatch[1] && dateMatch[1].length === 2) {
        extractedDate = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;
      } else if (dateMatch[4]) {
        extractedDate = `${dateMatch[4]}-${dateMatch[5]}-${dateMatch[6]}`;
      }
    }

    // 2. Extract Amount (Looking for largest number with decimals)
    // Supports formats like 3.910.00, 3,910.00, 3910.00, 3910,00
    const lines = fullText.split('\n');
    let maxAmount = 0;
    
    const amountRegex = /\b\d{1,3}(?:[.,\s]\d{3})*[.,]\d{2}\b/g;
    const allAmountsStr = fullText.match(amountRegex);
    
    if (allAmountsStr) {
      const allAmounts = allAmountsStr.map(str => {
        const cleaned = str.replace(/\s/g, ''); // Remove spaces
        // If it ends with ,XX, replace , with .
        // Example: 1.234,56 -> 1234.56 or 3.910.00 -> 3910.00
        const lastPunctuationIndex = Math.max(cleaned.lastIndexOf('.'), cleaned.lastIndexOf(','));
        if (lastPunctuationIndex > -1 && cleaned.length - lastPunctuationIndex === 3) {
           const beforeDec = cleaned.substring(0, lastPunctuationIndex).replace(/[.,]/g, '');
           const afterDec = cleaned.substring(lastPunctuationIndex + 1);
           return parseFloat(`${beforeDec}.${afterDec}`);
        }
        return NaN;
      }).filter(num => !isNaN(num));

      if (allAmounts.length > 0) {
        maxAmount = Math.max(...allAmounts);
      }
    }

    // 3. Extract Vendor
    // Find lines that might be a company name (usually near the top, often capitalized)
    let vendor = '';
    // Let's grab the first line that is long enough and contains letters
    const potentialVendors = lines.filter(l => /[A-Za-zÇŞĞÜÖİçşğüöı]/.test(l) && l.trim().length > 3);
    if (potentialVendors.length > 0) {
       vendor = potentialVendors[0].trim();
    }

    return {
      vendor,
      date: extractedDate,
      totalAmount: maxAmount,
      currency: 'TRY'
    };

  } catch (error) {
    console.error('OCR Extraction failed:', error);
    return { ...defaultResult, error: error instanceof Error ? error.message : 'Unknown OCR Error' };
  }
}
