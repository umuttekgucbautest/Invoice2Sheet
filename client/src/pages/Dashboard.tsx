import { useTranslation } from 'react-i18next';
import { db } from '../services/db';
import { syncPendingInvoices } from '../services/api';
import { useLiveQuery } from 'dexie-react-hooks';

export default function Dashboard() {
  const { t } = useTranslation();
  const invoices = useLiveQuery(() => db.pendingInvoices.toArray()) || [];

  const pendingCount  = invoices.filter(i => i.status === 'pending').length;
  const syncingCount  = invoices.filter(i => i.status === 'syncing').length;
  const failedCount   = invoices.filter(i => i.status === 'failed').length;
  const totalCount    = invoices.length;
  const hasErrors     = failedCount > 0;
  const queueCount    = pendingCount + failedCount;

  return (
    <>
      {/* ── Dashboard Welcome Section ─────────────────── */}
      <section className="mb-8">
        <h1 className="font-headline-md text-headline-md text-on-surface mb-2">
          {t('dashboard.welcome')}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          {t('dashboard.welcomeSubtitle')}
        </p>
      </section>

      {/* ── Stats Bento Grid ─────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        {/* Card 1 — Bu ay aktarılan */}
        <div className="bg-secondary-container p-6 rounded-xl flex flex-col justify-between h-40">
          <span className="font-label-lg text-label-lg text-on-secondary-container">
            {t('dashboard.thisMonthSync')}
          </span>
          <div className="flex items-end justify-between">
            <span className="text-4xl font-bold text-on-secondary-fixed">{totalCount}</span>
            <span className="material-symbols-outlined text-on-secondary-container">auto_awesome</span>
          </div>
        </div>

        {/* Card 2 — Sistem Durumu */}
        <div className="bg-surface-container-high p-6 rounded-xl flex flex-col justify-between h-40 border border-outline-variant">
          <span className="font-label-lg text-label-lg text-on-surface-variant">
            {t('dashboard.systemStatus')}
          </span>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${hasErrors ? 'bg-error animate-pulse' : 'bg-secondary'}`}></div>
            <span className="font-title-md text-title-md text-on-surface">
              {syncingCount > 0
                ? t('dashboard.uploading')
                : hasErrors
                  ? t('dashboard.errorDetected')
                  : t('dashboard.optimized')}
            </span>
          </div>
        </div>

        {/* Card 3 — Bağlı Tablo */}
        <div className="bg-tertiary-container p-6 rounded-xl flex flex-col justify-between h-40 text-on-tertiary">
          <span className="font-label-lg text-label-lg text-on-tertiary-container">
            {t('dashboard.connectedTable')}
          </span>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-on-tertiary-container">table_chart</span>
            <span className="font-title-md text-title-md text-on-tertiary-container truncate">
              Gider_Raporu_2024
            </span>
          </div>
        </div>

      </div>

      {/* ── Offline Queue Section ────────────────────── */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-title-lg text-title-lg text-on-surface">
            {t('dashboard.offlineQueue')}
          </h2>
          {queueCount > 0 && (
            <span className="px-3 py-1 bg-error-container text-on-error-container rounded-full font-label-sm text-label-sm">
              {queueCount} {t('dashboard.itemsPending')}
            </span>
          )}
        </div>

        <div className="space-y-3">
          {invoices.length === 0 ? (
            /* Empty State */
            <div className="bg-surface-container-low p-10 rounded-xl flex flex-col items-center justify-center text-center border border-outline-variant">
              <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '32px' }}>description</span>
              </div>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                {t('dashboard.noInvoices')}
              </p>
            </div>
          ) : (
            invoices.map(invoice => (
              <div
                key={invoice.id}
                className="bg-surface-container-low p-4 rounded-xl border border-outline-variant flex items-center justify-between group hover:bg-surface-container transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface-container-highest rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant">
                      {invoice.status === 'failed' ? 'receipt_long' : 'description'}
                    </span>
                  </div>
                  <div>
                    <p className="font-title-md text-title-md text-on-surface">
                      {invoice.vendor || invoice.id?.slice(0, 12)}
                    </p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      {invoice.status === 'pending'  && t('dashboard.syncStopped')}
                      {invoice.status === 'syncing'  && t('dashboard.uploading')}
                      {invoice.status === 'failed'   && t('dashboard.uploadError')}
                    </p>
                  </div>
                </div>

                {invoice.status !== 'syncing' ? (
                  <button
                    onClick={() => syncPendingInvoices()}
                    className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-high active:scale-90 transition-all text-primary"
                  >
                    <span className="material-symbols-outlined">replay</span>
                  </button>
                ) : (
                  <div className="flex items-center justify-center w-10 h-10">
                    <span className="material-symbols-outlined text-secondary animate-spin">sync</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── Visual Hero Card ──────────────────────────── */}
      <div className="relative w-full h-48 rounded-3xl overflow-hidden mb-8">
        <img
          alt="Automation Illustration"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCND7VD9wdPcpwuJsjSWAjaQ0bK9mRh-ucBM5YnIBd4YP-PQj_4fts-1CpfTHQztobPZDsAxmpJHHPb4PhAQnIMJPCh__UShlQOvqDf4LHT2bCrisu326TGsyA6xNRP5B3ju23FKM31Y_vHwCnBNBnF7OfnJJ2L5JcEbJROeKyG2Dv28n9n1G6pSfZ9Ap0cFjm-RuWT77Dk3TMIqjtrthk8BPwvAryUIRjfD4AHIitH7h9O04WZpUFI3xbsH0Sjsabj6OjWblxcFtE"
          loading="lazy"
          onError={e => {
            // Fallback: gradient card if image fails
            const img = e.currentTarget;
            img.style.display = 'none';
            const parent = img.parentElement;
            if (parent) parent.style.background = 'linear-gradient(135deg, #001e2c 0%, #396755 100%)';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-on-tertiary-fixed/80 to-transparent flex flex-col justify-center px-8">
          <h3 className="text-white font-title-lg text-title-lg mb-1">
            {t('dashboard.ocrPower')}
          </h3>
          <p className="text-tertiary-fixed-dim font-body-md text-body-md max-w-xs">
            {t('dashboard.ocrDesc')}
          </p>
        </div>
      </div>
    </>
  );
}
