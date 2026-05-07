# ✅ acceptance_criteria.md (v2.1 - Global & Quality-First)

## 1. Feature: Global Onboarding & Language Setup
* **Functional:**
    * Kullanıcı uygulamayı ilk açtığında Dil Seçimi (TR/EN) ekranı ile karşılaşmalı.
    * Dil seçildiğinde tüm UI bileşenleri (butonlar, placeholderlar, uyarılar) anında seçilen dile dönmeli.
    * Seçilen dil `localStorage` üzerinde saklanmalı ve uygulama yeniden başlatıldığında korunmalı.
* **Non-Functional:**
    * Dil geçişleri < 100ms sürmeli (anlık hissettirmeli).
* **Edge Cases:**
    * Tarayıcı dili uygulama tarafından desteklenmiyorsa (örn: Fransızca), sistem varsayılan olarak "English" dilini seçmeli (Fallback).

## 2. Feature: BYOK (Vision API) & Security
* **Functional:**
    * Kullanıcı kendi API anahtarını girebilmeli ve "Test Bağlantısı" yaparak "Valid/Invalid" geri bildirimi almalı.
    * API anahtarı kaydedildiğinde, kullanıcıya anahtarın sadece kendi cihazında saklandığına dair bir güvenlik rozeti gösterilmeli.
* **Security:**
    * API anahtarı ağ trafiğinde sadece `vision.googleapis.com` adresine gitmeli. Başka hiçbir endpoint'e sızmamalı.
    * Anahtar, tarayıcı hafızasında plain-text (açık metin) olarak değil, şifrelenmiş olarak tutulmalı.

## 3. Feature: Offline Capture & Global Sync
* **Functional:**
    * İnternet yokken çekilen fotoğraf `IndexedDB`'ye başarıyla kaydedilmeli ve kullanıcıya "Çevrimdışı Mod: Faturanız Saklandı" mesajı verilmeli.
    * İnternet geri geldiğinde, "Eşitle" butonu üzerinde bekleyen fatura sayısı (Badge) güncellenmeli.
* **Edge Cases:**
    * Kullanıcı internet yokken dil değiştirirse, kuyrukta bekleyen faturanın Sheets'e yazılacak "başlık dili", eşitleme anındaki seçili dile göre güncellenmeli.
    * Hafıza dolu (5 fatura sınırı) uyarısı alındığında, kullanıcı yeni fotoğraf çekememeli.

## 4. Feature: Autonomous Drive & Sheets Management (GAS)
* **Functional:**
    * **Klasörleme:** GAS, faturadaki tarihe göre `Root > 2026 > 05` yapısını saniyeler içinde oluşturmalı/bulmalı.
    * **Sheet Oluşturma:** Yeni ayın dosyası (`2026-05_Giderler`) oluşturulurken, sütun başlıkları seçili dile göre yazılmalı (Örn: EN ise "Date", TR ise "Tarih").
* **Performance:**
    * "Onayla" butonuna basıldıktan sonra Sheets'e satırın düşmesi ve "Başarılı" dönmesi < 8 saniye olmalı.
* **Edge Cases:**
    * Faturadaki tarih gelecekte bir tarih olarak yanlış okunursa (OCR hatası), kullanıcı onay ekranında tarihi düzelttiğinde GAS o düzeltilmiş tarihe göre (gelecek yılın klasörü olsa bile) işlem yapmalı.

## 5. Feature: Verification UI (The Last Gate)
* **Functional:**
    * Vision API'den dönen veriler form alanlarına (Firma, Tarih, Tutar) otomatik dolmalı.
    * Kullanıcı bu alanları manuel olarak düzenleyebilmeli.
    * "Onayla" denmeden Sheets'e hiçbir veri yazılmamalı.
* **UI/UX:**
    * Mobil klavye açıldığında "Onayla" butonu ekranın altında erişilebilir kalmalı veya form kaydırılabilir (scrollable) olmalı.

---

### 🛡️ QA "Definition of Done" Checklist
- [ ] Birim testler (Unit Tests) i18n çeviri anahtarlarını doğruluyor mu?
- [ ] Android/Chrome ve iOS/Safari üzerinde "PWA" kurulumu test edildi mi?
- [ ] Vision API faturayı okuyamazsa kullanıcıya manuel giriş formu açılıyor mu?
- [ ] Google Drive'da `drive.file` kısıtlı erişim yetkisiyle sistem çalışıyor mu?
- [ ] Offline çekilen 3 farklı fatura, internet geldiğinde sırayla ve doğru klasörlere işlendi mi?

---