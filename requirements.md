# 📄 requirements.md (v2.1 - Global MVP)

## 1. Executive Summary
**Project Name:** Invoice2Sheet Lite (Global Edition)
**Vision:** A zero-infrastructure, serverless mobile web application that allows users to scan invoices, extract data via Google Vision API, and organize them into auto-generated Google Drive folders and Google Sheets using the user's own credentials and API keys.

---

## 2. User Personas
* **The Global Freelancer:** Needs to track expenses in multiple currencies and languages; values data privacy and zero monthly subscription costs.
* **The Small Business Owner (KOBİ):** Wants an automated way to archive physical receipts into Google Drive without manual data entry.

---

## 3. Functional Requirements (FR)

### 3.1 Onboarding & Configuration
* **FR-1.1 (Auth):** User must authenticate via Google OAuth 2.0.
* **FR-1.2 (BYOK):** User must be able to input and validate their own Google Vision API Key.
* **FR-1.3 (Localization):** User can select the UI language (e.g., Turkish, English) during setup or in Settings.

### 3.2 Invoice Processing (The Core)
* **FR-2.1 (Capture):** Capture a single invoice image via mobile camera or file upload.
* **FR-2.2 (OCR Extraction):** Use Vision API to detect: **Vendor Name, Date, and Total Amount**.
* **FR-2.3 (Verification UI):** Display extracted data in an editable form for user confirmation before saving.

### 3.3 Storage & Automation (GAS Logic)
* **FR-3.1 (Smart Folders):** Automatically create/use folders in Drive following the `Root/YYYY/MM` pattern based on the invoice date.
* **FR-3.2 (Smart Sheets):** Automatically create/use a Google Sheet for the current month (e.g., `2026-05_Expenses`).
* **FR-3.3 (Dynamic Headers):** Sheet column headers must match the selected UI language (e.g., "Date" vs "Tarih").

### 3.4 Offline & Sync
* **FR-4.1 (Local Queue):** Store up to 5 images in local browser storage if the device is offline.
* **FR-4.2 (Manual Sync):** Provide a "Sync Now" button when a connection is detected to process the offline queue.

---

## 4. Non-Functional Requirements (NFR)

### 4.1 Performance & Usability
* **Latency:** OCR extraction and UI response should take less than 5 seconds under stable 4G/Wi-Fi.
* **Mobile-First:** The UI must be optimized for one-handed operation (Material Design 3 / Stitch).

### 4.2 Security & Privacy
* **Data Scoping:** Use `drive.file` scope to ensure the app only accesses files it creates.
* **Encryption:** Store the Vision API Key encrypted in `localStorage`.
* **Zero-Server:** No user data or images shall be stored on any third-party server other than Google's infrastructure.

---

## 5. Success Metrics (KPIs)
* **OCR Accuracy:** >90% correct detection of the "Total Amount" field across supported languages.
* **Onboarding Success:** % of users who successfully link their API Key and complete their first scan.
* **Retention:** Number of users who process more than 10 invoices per month.

---

## 6. Language Support Matrix

| Key | English (en) | Turkish (tr) |
| :--- | :--- | :--- |
| UI Language | English | Türkçe |
| Date Header | Date | Tarih |
| Vendor Header | Vendor / Company | Firma / Satıcı |
| Amount Header | Total Amount | Toplam Tutar |

---
