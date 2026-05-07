# 🛠️ tech_stack.md (v2.2 - Final & Robust Edition)

## 1. Frontend: The Client-Side Powerhouse
* **Core Framework:** **React 18+ (Vite)**
    * *Gerekçe:* Hızlı HMR (Hot Module Replacement) ve optimize edilmiş PWA build süreci.
* **Language:** **TypeScript**
    * *Gerekçe:* Hexagonal mimarideki "Interfaces" ve "Domain Models" yapılarını tip güvenli tanımlamak için zorunlu.
* **State & Sync Management:** **TanStack Query v5 (React Query)**
    * *Gerekçe:* Offline-first stratejisinde "Network Status" takibi ve internet geldiğinde kuyruğu otomatik "flush" etmek için.
* **Local Database:** **Dexie.js (IndexedDB wrapper)**
    * *Gerekçe:* Base64 fatura görsellerini ve işlem kuyruğunu tarayıcıda yapısal olarak saklamak için en performanslı çözüm.
* **PWA Management:** **Vite PWA Plugin (Workbox)**
    * **[EKLENDİ]** *Gerekçe:* "Offline-first" vizyonu için Service Worker'ın otomatik güncellenmesi ve `CacheStorage` yönetimi.
* **Internationalization (i18n):** **react-i18next + i18next**
    * *Gerekçe:* Dinamik dil değişimi ve JSON tabanlı global destek.

## 2. Backend: The Google Serverless Engine
* **Environment:** **Google Apps Script (GAS)**
    * *Gerekçe:* Sıfır maliyetli backend ve Google Drive/Sheets ekosistemine yerleşik erişim.
* **Infrastructure APIs:**
    * **Google Cloud Vision API:** OCR işlemleri (BYOK modeliyle).
    * **Google Drive API:** Klasör hiyerarşisi (YYYY/MM) otonomisi için.
    * **Google Sheets API:** Veri kaydı ve dil bazlı sütun yönetimi için.

## 3. UI/UX & Design (Material You)
* **Styling:** **Tailwind CSS**
    * *Gerekçe:* Stitch promptlarındaki Dark/Light mode geçişlerini `dark:` prefixi ile kolayca yönetmek için.
* **Components:** **Shadcn/UI + Lucide React Icons**
    * *Gerekçe:* Material Design 3 prensiplerine uygun, erişilebilir ve özelleştirilebilir bileşen seti.
* **Animations:** **Framer Motion**
    * **[EKLENDİ]** *Gerekçe:* OCR işleme sırasındaki skeleton loader ve geçiş efektlerinin akıcılığını (UX) artırmak için.

## 4. Security & Utility
* **Encryption:** **Crypto-JS**
    * **[EKLENDİ]** *Gerekçe:* Kullanıcının Vision API anahtarını LocalStorage'da AES-256 ile şifreleyerek saklamak için.
* **Date Handling:** **date-fns**
    * **[EKLENDİ]** *Gerekçe:* Fatura tarihlerini parse edip GAS tarafındaki otonom klasörleme (YYYY/MM) mantığına uygun formata getirmek için.

---

### Mimari Uyumluluk Kontrolü (Architectural Alignment)

| Eksiklik Alanı | Eklenen Teknoloji | Çözülen Mimari Sorun |
| :--- | :--- | :--- |
| **Offline Persistency** | Workbox (Vite PWA) | Uygulamanın uçak modunda bile açılabilmesini sağlar. |
| **Data Integrity** | Dexie.js | Senkronize edilmemiş faturaların tarayıcı kapansa bile kaybolmamasını garanti eder. |
| **BYOK Security** | Crypto-JS | Kullanıcı anahtarının düz metin (plain text) olarak çalınmasını önler. |
| **UX Responsiveness** | Framer Motion | Yavaş internet veya OCR bekleme sürelerinde kullanıcının sistemin donduğunu sanmasını engeller. |

---
