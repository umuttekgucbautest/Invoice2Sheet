import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SecurityManager } from '../services/security';
import { db } from '../services/db';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const [apiKey, setApiKey]         = useState('');
  const [showKey, setShowKey]       = useState(false);
  const [autoSync, setAutoSync]     = useState(true);
  const [darkMode, setDarkMode]     = useState(false);
  const [rootFolder, setRootFolder] = useState('Invoices_2024');
  const [saved, setSaved]           = useState(false);

  useEffect(() => {
    const key = SecurityManager.getApiKey();
    if (key) setApiKey(key);
    setRootFolder(localStorage.getItem('rootFolder') || 'Invoices_2024');
    setAutoSync(localStorage.getItem('autoSync') !== 'false');
    setDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const handleSaveApiKey = () => {
    SecurityManager.saveApiKey(apiKey);
    localStorage.setItem('rootFolder', rootFolder);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDarkModeToggle = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('darkMode', String(next));
  };

  const handleAutoSyncToggle = () => {
    const next = !autoSync;
    setAutoSync(next);
    localStorage.setItem('autoSync', String(next));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  const handleClearHistory = async () => {
    if (window.confirm(t('settings.clearHistory') + '?')) {
      await db.pendingInvoices.clear();
    }
  };

  return (
    /* Settings page — tasarım HTML: pt-24 px-margin-mobile max-w-3xl mx-auto space-y-8 */
    <div className="pt-8 max-w-3xl mx-auto space-y-8">

      {/* ── Page Title ────────────────────────────────── */}
      <section className="flex flex-col gap-2">
        <h2 className="font-headline-md text-headline-md text-primary">
          {t('settings.title')}
        </h2>
        <p className="text-on-surface-variant font-body-md">
          {t('settings.description')}
        </p>
      </section>

      {/* ── API Configuration Card ────────────────────── */}
      <div className="bg-surface-container-low rounded-xl border border-outline-variant p-6 space-y-6">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary">vpn_key</span>
          <h3 className="font-title-md text-title-md">{t('settings.auth')}</h3>
        </div>
        <div className="space-y-2">
          <label className="block font-label-lg text-label-lg text-on-surface-variant" htmlFor="api_key">
            {t('settings.apiKey')}
          </label>
          <div className="relative group">
            <input
              id="api_key"
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="w-full bg-surface border border-outline rounded-lg px-4 py-3 font-body-md focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all pr-12 text-on-surface"
              placeholder="AIza..."
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
              onClick={() => setShowKey(v => !v)}
              type="button"
            >
              <span className="material-symbols-outlined">
                {showKey ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            {t('settings.authDesc')}
          </p>
        </div>
        <button
          onClick={handleSaveApiKey}
          className="flex items-center gap-2 bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full font-label-lg text-label-lg hover:brightness-95 active:scale-95 duration-150 transition-all"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            {saved ? 'check_circle' : 'save'}
          </span>
          {saved ? 'Kaydedildi!' : t('settings.save')}
        </button>
      </div>

      {/* ── Folder Selection Card ─────────────────────── */}
      <div className="bg-surface-container-low rounded-xl border border-outline-variant p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary">folder_shared</span>
            <h3 className="font-title-md text-title-md">{t('settings.targetFolder')}</h3>
          </div>
          <button className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full font-label-lg text-label-lg flex items-center gap-2 hover:brightness-95 active:scale-95 duration-150">
            <span className="material-symbols-outlined">create_new_folder</span>
            {t('settings.browse')}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Selected folder */}
          <div className="flex items-center p-4 bg-surface rounded-lg border border-secondary/30 hover:border-secondary transition-colors cursor-pointer group">
            <span className="material-symbols-outlined text-secondary mr-4" style={{ fontVariationSettings: "'FILL' 1" }}>folder</span>
            <div className="flex-grow">
              <div className="font-body-lg text-primary">{rootFolder}</div>
              <div className="font-label-sm text-on-surface-variant">Google Drive / Documents / Finans</div>
            </div>
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          {/* Alternate folder */}
          <div className="flex items-center p-4 bg-surface-container-highest/30 rounded-lg border border-transparent hover:border-outline-variant transition-colors cursor-pointer group">
            <span className="material-symbols-outlined text-outline-variant mr-4">folder</span>
            <div className="flex-grow">
              <div className="font-body-lg text-on-surface-variant">Archived_Receipts</div>
              <div className="font-label-sm text-outline">Google Drive / Backup</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Toggles Section ──────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Auto-sync Toggle */}
        <div className="bg-surface-container-low rounded-xl border border-outline-variant p-6 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="font-title-md text-title-md">{t('settings.autoSync')}</h3>
            <p className="font-label-sm text-label-sm text-on-surface-variant">{t('settings.autoSyncDesc')}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={autoSync} onChange={handleAutoSyncToggle} />
            <div className="w-12 h-7 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
          </label>
        </div>

        {/* Dark Mode Toggle */}
        <div className="bg-surface-container-low rounded-xl border border-outline-variant p-6 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="font-title-md text-title-md">{t('settings.darkMode')}</h3>
            <p className="font-label-sm text-label-sm text-on-surface-variant">{t('settings.darkModeDesc')}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={darkMode} onChange={handleDarkModeToggle} />
            <div className="w-12 h-7 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
          </label>
        </div>

        {/* Language Selection */}
        <div className="bg-surface-container-low rounded-xl border border-outline-variant p-6 flex items-center justify-between md:col-span-2 lg:col-span-1">
          <div className="flex flex-col gap-1">
            <h3 className="font-title-md text-title-md">{t('settings.language')} (Language)</h3>
            <p className="font-label-sm text-label-sm text-on-surface-variant">{t('settings.languageDesc')}</p>
          </div>
          <div className="relative">
            <select
              className="appearance-none bg-surface border border-outline rounded-lg pl-4 pr-10 py-2 font-label-lg text-label-lg focus:border-secondary focus:ring-1 focus:ring-secondary outline-none cursor-pointer text-on-surface"
              value={i18n.language}
              onChange={handleLanguageChange}
            >
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* ── Danger Zone ───────────────────────────────── */}
      <div className="bg-error-container/30 rounded-xl border border-error/20 p-6 space-y-4">
        <h3 className="font-title-md text-title-md text-error">{t('settings.dataManagement')}</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleClearHistory}
            className="border border-error text-error px-4 py-2 rounded-lg font-label-lg hover:bg-error/5 transition-colors"
          >
            {t('settings.clearHistory')}
          </button>
          <button className="bg-error text-on-error px-4 py-2 rounded-lg font-label-lg hover:brightness-110 shadow-sm">
            {t('settings.deleteAccount')}
          </button>
        </div>
      </div>

    </div>
  );
}

