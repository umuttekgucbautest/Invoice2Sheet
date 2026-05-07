import { type ReactNode, useRef, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { SecurityManager } from '../services/security';
import { extractInvoiceData } from '../services/ocr';
import type { PendingInvoice } from '../services/db';
import { fetchUserInfo } from '../services/api';

interface LayoutProps {
  children: ReactNode;
  activeTab: 'home' | 'settings';
  onTabChange: (tab: 'home' | 'settings') => void;
  onScanResult: (invoice: PendingInvoice) => void;
}

// Default avatar from the Stitch design
const STITCH_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsY8yjy8dKp8XQPsDihhoUCfWO6BSDsX6oQMo1f5m29GLJJRb_KXS0Flphc7VCTv9xh-7xnfgzrhe4wvT0eJdhXJjaHzUhIDm8Z9ZIQLz8xYI-kFRbibsMVUSaBARpt2kC89pvPXRSdvV_69eefRV_R_Yt54z6M0uzBXMjUSjvxKHhUgSLwT1QVS3crlDf89Hg5KVA1uF_WY7mEieDHBo1Z0DlhhR6A4K1JNB-PTalE_eSmBxRv2NeLYZurPq60L0DReI2JmThWnk';

export default function Layout({ children, activeTab, onTabChange, onScanResult }: LayoutProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string>(STITCH_AVATAR);

  useEffect(() => {
    fetchUserInfo().then(info => {
      if (info?.photoUrl) setUserPhoto(info.photoUrl);
    });
  }, []);

  const handleScanClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const apiKey = SecurityManager.getApiKey();
      if (!apiKey) {
        alert(t('settings.authDesc') || 'API Key eksik. Lütfen Ayarlar\'dan girin.');
        setIsProcessing(false);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        try {
          const ocrData = await extractInvoiceData(base64Data);
          const newInvoice: PendingInvoice = {
            id: crypto.randomUUID(),
            image: reader.result as string,
            vendor: ocrData.vendor,
            date: ocrData.date,
            totalAmount: ocrData.totalAmount,
            currency: 'TRY',
            status: 'pending',
            createdAt: Date.now()
          };
          onScanResult(newInvoice);
        } catch (err: any) {
          alert('OCR Hatası: ' + err.message);
        } finally {
          setIsProcessing(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Beklenmeyen bir hata oluştu.');
      setIsProcessing(false);
    }
  };

  const handleCancelProcessing = useCallback(() => {
    setIsProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  return (
    <div className="font-body-md text-on-surface bg-background min-h-screen">

      {/* ── TopAppBar (birebir tasarım HTML ile) ─────── */}
      <header className="bg-surface dark:bg-on-tertiary-fixed flex justify-between items-center px-margin-mobile md:px-margin-tablet h-16 w-full max-w-container-max mx-auto top-0 sticky z-40">
        <div className="flex items-center gap-3">
          <span className="font-display-lg text-title-lg font-bold text-primary dark:text-primary-fixed">
            Invoice2Sheet
          </span>
        </div>
        <div
          className="flex items-center cursor-pointer active:scale-95 duration-200"
          onClick={() => onTabChange('settings')}
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant">
            <img
              alt="User Profile"
              className="w-full h-full object-cover"
              src={userPhoto}
              referrerPolicy="no-referrer"
              onError={e => { (e.currentTarget as HTMLImageElement).src = STITCH_AVATAR; }}
            />
          </div>
        </div>
      </header>

      {/* ── Main Content ──────────────────────────────── */}
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-tablet pb-32 pt-6">
        {children}
      </main>

      {/* ── Hidden File Input ─────────────────────────── */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* ── Processing Overlay — Kamera_Onizleme.html skeleton bento ── */}
      {isProcessing && (
        <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center px-margin-mobile">
          <div className="w-full max-w-sm space-y-6">

            {/* Status Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                <h2 className="font-title-lg text-title-lg">{t('common.extracting')}</h2>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {t('actions.scanInstruction')}
              </p>
            </div>

            {/* Skeleton Bento Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 h-24 rounded-xl bg-surface-container-high skeleton-shimmer border border-outline-variant/30 flex flex-col p-4 space-y-3">
                <div className="h-4 w-1/3 bg-surface-container-highest rounded-full"></div>
                <div className="h-6 w-2/3 bg-surface-container-highest rounded-full"></div>
              </div>
              <div className="h-32 rounded-xl bg-surface-container-high skeleton-shimmer border border-outline-variant/30 flex flex-col p-4 space-y-3">
                <div className="h-3 w-1/2 bg-surface-container-highest rounded-full"></div>
                <div className="h-5 w-full bg-surface-container-highest rounded-full"></div>
                <div className="mt-auto h-2 w-full bg-surface-container-highest rounded-full opacity-50"></div>
              </div>
              <div className="h-32 rounded-xl bg-surface-container-high skeleton-shimmer border border-outline-variant/30 flex flex-col p-4 space-y-3">
                <div className="h-3 w-2/3 bg-surface-container-highest rounded-full"></div>
                <div className="h-5 w-1/2 bg-surface-container-highest rounded-full"></div>
                <div className="mt-auto h-2 w-full bg-surface-container-highest rounded-full opacity-50"></div>
              </div>
              <div className="col-span-2 h-16 rounded-xl bg-surface-container-high skeleton-shimmer border border-outline-variant/30 flex items-center justify-between px-4">
                <div className="h-4 w-1/4 bg-surface-container-highest rounded-full"></div>
                <div className="h-6 w-1/3 bg-surface-container-highest rounded-full"></div>
              </div>
            </div>

            {/* OCR Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant px-1">
                <span>OCR ANALİZİ</span>
                <span>—</span>
              </div>
              <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary rounded-full"
                  style={{ animation: 'ocr-grow 2.5s ease-out forwards' }}
                ></div>
              </div>
            </div>

            {/* Cancel */}
            <div className="pt-4 flex justify-center">
              <button
                onClick={handleCancelProcessing}
                className="px-6 py-2.5 rounded-full border border-outline text-on-surface-variant font-label-lg text-label-lg hover:bg-surface-container-high active:scale-95 transition-all"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FAB: Fatura Çek (birebir tasarım HTML ile) ── */}
      {activeTab === 'home' && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={handleScanClick}
            disabled={isProcessing}
            className="bg-primary text-on-primary rounded-full px-8 py-4 flex items-center gap-3 shadow-xl active:scale-95 duration-150 group disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span
              className="material-symbols-outlined group-hover:rotate-12 transition-transform"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              photo_camera
            </span>
            <span className="font-title-md text-title-md">{t('dashboard.scanInvoice')}</span>
          </button>
        </div>
      )}

      {/* ── BottomNavBar (birebir tasarım HTML ile) ───── */}
      <nav className="fixed bottom-0 w-full flex justify-around items-center h-20 px-gutter bg-surface-container dark:bg-on-tertiary-fixed z-50 shadow-sm">

        {/* Home */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center rounded-full px-5 py-1 active:scale-90 duration-150 transition-all ${
            activeTab === 'home'
              ? 'bg-secondary-container dark:bg-on-secondary-fixed-variant text-on-secondary-container dark:text-secondary-fixed-dim'
              : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-on-tertiary-fixed-variant'
          }`}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: activeTab === 'home' ? "'FILL' 1" : "'FILL' 0" }}
          >
            home
          </span>
          <span className="font-label-lg text-label-lg">{t('nav.home')}</span>
        </button>

        {/* Scan */}
        <button
          onClick={handleScanClick}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline-variant py-1 hover:bg-surface-container-high dark:hover:bg-on-tertiary-fixed-variant transition-all active:scale-90 duration-150 px-5 rounded-full"
        >
          <span className="material-symbols-outlined">document_scanner</span>
          <span className="font-label-lg text-label-lg">{t('nav.scan')}</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => onTabChange('settings')}
          className={`flex flex-col items-center justify-center rounded-full px-5 py-1 active:scale-90 duration-150 transition-all ${
            activeTab === 'settings'
              ? 'bg-secondary-container dark:bg-on-secondary-fixed-variant text-on-secondary-container dark:text-secondary-fixed-dim'
              : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-on-tertiary-fixed-variant'
          }`}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: activeTab === 'settings' ? "'FILL' 1" : "'FILL' 0" }}
          >
            settings
          </span>
          <span className="font-label-lg text-label-lg">{t('nav.settings')}</span>
        </button>

      </nav>
    </div>
  );
}
