# 🚀 mvp_scope.md (v2.1 - Global & Intelligent MVP)

## 1. Core Product Vision
Kullanıcının kendi Google altyapısını (Drive, Sheets, Vision API) kullanarak, sıfır sunucu maliyetiyle, çevrimdışı çalışabilen ve her ay verileri otomatik klasörleyen küresel uyumlu bir fatura takip asistanı.

---

## 2. Must-Have Özellikler (MVP Kapsamı)

### 2.1 Çoklu Dil Yönetimi (i18n)
* **ML-01:** Uygulama açılışında Türkçe/İngilizce dil seçimi.
* **ML-02:** Dil seçimine göre dinamik butonlar ve Sheets sütun başlıkları (Date/Tarih, Amount/Tutar vb.).

### 2.2 Akıllı Otonomi (GAS Katmanı)
* **AUT-01 (Auto-Folder):** Fatura tarihindeki yıl/ay bilgisini kullanarak Drive'da otomatik hiyerarşik klasör oluşturma (`Root/2026/05`).
* **AUT-02 (Auto-Sheet):** Her ay için otomatik yeni Google Sheet oluşturma ve başlık satırlarını seçili dilde yazma.

### 2.3 Offline Kapasitesi (Local Queue)
* **OFF-01:** İnternet yokken çekilen fotoğrafların Base64 formatında `IndexedDB` (Dexie.js) üzerinde saklanması.
* **OFF-02:** Maksimum 5 adetlik "Bekleyen Fatura" kuyruğu ve bağlantı geldiğinde manuel "Senkronize Et" tetikleyicisi.

### 2.4 Veri Ayıklama ve Doğrulama (OCR & Verify)
* **OCR-01:** Kullanıcının kendi API anahtarı ile Google Vision API üzerinden Firma, Tarih ve Tutar ayıklama.
* **UI-01:** Kayıt öncesi düzenlenebilir "Onay Ekranı".

---

## 3. "Şimdilik" Kapsam Dışı (Won't-Have)
* **Kategori Seçimi:** (Yemek, Akaryakıt vb.) - *Bir sonraki fazda eklenecek.*
* **Çoklu Fatura Çekimi:** Aynı anda 10 fotoğraf çekme - *MVP'de tekli işlem yapılacak.*
* **İstatistik ve Grafik:** Sheets içindeki verilerin uygulama içinde analizi.
* **Otomatik Doviz Çevirici:** Döviz kurlarını çekip ana para birimine dönüştürme.

---

## 4. Teknik Başarı Kriterleri (MVP)

| Özellik | Hedef Metrik |
| :--- | :--- |
| **Kurulum Hızı** | Kullanıcının API Key girmesi ve ilk faturayı işlemesi < 2 dakika. |
| **Kayıt Hızı** | Onay butonuna basıldıktan sonra Sheets'e yazma < 5 saniye. |
| **Offline Güvenliği** | Tarayıcı kapansa bile kuyruktaki faturanın kaybolmaması. |
| **Maliyet** | Geliştirici için aylık sabit/değişken maliyet = **0 TL**. |

---

## 5. Uygulama Akışı (User Journey)

1. **Launch:** Dil seçilir (TR/EN) + API Key girilir.
2. **Action:** Fatura fotoğrafı çekilir.
3. **Logic (Offline):** İnternet yoksa kuyruğa atılır.
4. **Logic (Online):** Vision API çalışır -> Veriler onay ekranına düşer.
5. **Final:** "Onayla" denir -> GAS arka planda `/2026/05` klasörünü ve `2026-05_Expenses` dosyasını kontrol eder/oluşturur -> Veriyi yazar.

---