# 🏗️ system_design.md (v2.1 - Global & Offline-First)

## 1. Mimari Prensipler (Architectural Principles)
* **Decoupled Logic (Ayrıştırılmış Mantık):** UI katmanı ile iş mantığı (OCR, Sync, Auth) birbirinden tamamen bağımsızdır.
* **Offline-First:** Veriler önce yerel veritabanına (`IndexedDB`) yazılır, ardından bulut ile senkronize edilir.
* **Stateless Backend:** Google Apps Script üzerinde oturum tutulmaz; her istek kullanıcının token'ı ve API anahtarıyla doğrulanır.

---

## 2. Sistem Bileşenleri (Component Map)

### A. İstemci Tarafı (Client - React PWA)
1.  **I18n Manager:** Uygulama içi metinlerin ve Google Sheets başlıklarının dile göre dinamik render edilmesi.
2.  **Sync Engine:** Bağlantı durumunu izler ve `Dexie.js` (Local DB) ile `GAS API` arasındaki veri trafiğini yönetir.
3.  **Security Manager:** API anahtarlarını istemci tarafında AES-256 ile şifreler.

### B. Bulut Tarafı (Backend - Google Apps Script)
1.  **Orchestrator:** Drive API ve Sheets API'yi koordine eder.
2.  **Resource Manager:** Klasör hiyerarşisini kontrol eder; yoksa oluşturur (Idempotent logic).
3.  **OCR Proxy:** İstemciden gelen isteği kullanıcının anahtarıyla Google Vision API'ye yönlendirir.

---

## 3. Veri Akış Diyagramı (Data Flow)



1.  **Input:** Kullanıcı fotoğrafı çeker.
2.  **Persistence:** Fotoğraf (Base64) + Metadata, `UUID` ile yerel DB'ye kaydedilir.
3.  **Trigger:** İnternet varsa, `Sync Engine` veriyi GAS'a gönderir.
4.  **Backend Process:**
    * GAS, faturadaki tarihi alır.
    * `CheckOrCreateFolder(Year, Month)` fonksiyonu çalışır.
    * `CheckOrCreateSheet(Year-Month)` fonksiyonu çalışır.
5.  **Output:** Veri Sheets'e eklenir ve istemciye "Success" döner. Yerel kopya silinir.

---

## 4. Çoklu Dil (i18n) Mimarisi
* **Metin Havuzu:** `locales/tr.json` ve `locales/en.json` dosyaları.
* **Dinamik Sütun Yönetimi:** GAS'a gönderilen istekte `lang` parametresi yer alır. GAS, Sheets dosyasını ilk kez oluştururken bu parametreye göre sütun isimlerini belirler.

---

## 5. Teknik Kısıtlar ve Çözümler (Constraints & Mitigations)

| Kısıt | Risk | Mimari Çözüm |
| :--- | :--- | :--- |
| **GAS Zaman Limiti** | Klasör/Dosya aramaları 6 dakikayı zorlayabilir. | **Batch Search:** `DriveApp.getFoldersByName()` yerine özel sorgularla tek seferde erişim. |
| **Storage Limiti** | Base64 görseller tarayıcı hafızasını doldurabilir. | **Queue Limit:** Yerel kuyruk 5 adet ile sınırlandırılır. |
| **CORS** | Browser -> GAS arası iletişim engellenebilir. | **ContentService:** GAS'ın `doPost(e)` metodunu kullanarak JSON çıktısı üretme. |

---

## 6. Güvenlik Tasarımı (Security Blueprint)
* **Transport:** Tüm trafik HTTPS üzerinden akar.
* **Secrets:** Vision API Key asla loglanmaz. Sadece API çağrısı sırasında geçici bellekte (RAM) tutulur.
* **Scopes:** `https://www.googleapis.com/auth/drive.file` (Sadece uygulama tarafından oluşturulan dosyalara erişim).