import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { PendingInvoice } from '../services/db';

// Preview fallback from Stitch design
const INVOICE_PREVIEW = 'https://lh3.googleusercontent.com/aida-public/AB6AXuARHU-i7BTe755iyvp1e5d-zPcv_g5B0rPac1mi7QZcfDKalE9A75fsIYYIV5B3m8VdXZms2phEEevWw1-BfBsYST4ehrl07zoW8THn8GqngNHWdq1XtbJ_3rFNHj2yCd60u_Gv7DoyVeBXkkCPzCXW2ORNdVCca7RMj7-pzMl6HcPEoPuWg3tn1SUlopchUoR8t-X8eM9QULBZAbogPSjsFYHfUGpq88YQ0a-N-mQwZ6rzsze7GIJ3Dm7lGpfY8LYGIi_zaxHWej4';

interface VerificationProps {
  invoice: PendingInvoice;
  onCancel: () => void;
  onConfirm: (updatedInvoice: PendingInvoice) => void;
}

export default function Verification({ invoice, onCancel, onConfirm }: VerificationProps) {
  const { t } = useTranslation();

  const [vendor,   setVendor]   = useState(invoice.vendor || '');
  const [date,     setDate]     = useState(invoice.date   || new Date().toISOString().split('T')[0]);
  const [amount,   setAmount]   = useState(invoice.totalAmount ? invoice.totalAmount.toString() : '');
  const [currency, setCurrency] = useState(invoice.currency || 'TRY');

  const rootFolder  = localStorage.getItem('rootFolder') || 'Muhasebe';
  const monthLabel  = date ? date.substring(0, 7).replace('-', '_') : 'Ocak_2024';
  const targetLabel = `Hedef: ${rootFolder} / ${monthLabel}.xlsx`;

  const handleConfirm = () => {
    onConfirm({
      ...invoice,
      vendor:      vendor || 'Unknown Vendor',
      date,
      totalAmount: parseFloat(amount) || 0,
      currency,
      status:      'pending'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background text-on-background min-h-screen">

      {/* ── TopAppBar ─────────────────────────────────── */}
      <header className="bg-surface-container fixed top-0 z-40 w-full border-b border-outline-variant">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-tablet h-16 w-full max-w-container-max mx-auto">
          <div className="flex items-center gap-4">
            <div className="cursor-pointer active:scale-95 duration-200" onClick={onCancel}>
              <span className="material-symbols-outlined text-on-surface">arrow_back</span>
            </div>
            <h1 className="font-display-lg text-title-lg font-bold text-primary">Invoice2Sheet</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden">
            <span className="material-symbols-outlined text-on-secondary-container">person</span>
          </div>
        </div>
      </header>

      {/* ── Main Canvas ───────────────────────────────── */}
      <main className="flex-grow pt-20 pb-24 px-margin-mobile md:px-margin-tablet max-w-md mx-auto w-full overflow-y-auto">
        <div className="flex flex-col gap-6">

          {/* Context Header */}
          <div className="flex flex-col gap-2">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              {t('verification.title')}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {t('verification.description')}
            </p>
          </div>

          {/* Destination Chip */}
          <div className="flex">
            <div className="inline-flex items-center gap-2 bg-secondary-container/30 text-on-secondary-container px-3 py-1.5 rounded-lg border border-secondary-container">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>table_chart</span>
              <span className="font-label-lg text-label-lg">{targetLabel}</span>
            </div>
          </div>

          {/* ── Verification Form ─────────────────────── */}
          <section className="bg-surface-container-low p-6 rounded-xl border border-outline-variant shadow-lg flex flex-col gap-6">

            {/* Firma Adı */}
            <div className="relative">
              <label className="absolute -top-2 left-3 bg-surface-container-low px-1 font-label-sm text-label-sm text-on-surface-variant z-10">
                {t('verification.vendor')}
              </label>
              <div className="group flex items-center border border-outline rounded-lg focus-within:border-secondary bg-surface-container-lowest transition-all">
                <input
                  type="text"
                  value={vendor}
                  onChange={e => setVendor(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 px-4 py-3 font-body-lg text-body-lg text-on-surface outline-none"
                />
                <span className="material-symbols-outlined text-on-surface-variant px-3 cursor-pointer">edit</span>
              </div>
            </div>

            {/* Tarih */}
            <div className="relative">
              <label className="absolute -top-2 left-3 bg-surface-container-low px-1 font-label-sm text-label-sm text-on-surface-variant z-10">
                {t('verification.date')}
              </label>
              <div className="group flex items-center border border-outline rounded-lg focus-within:border-secondary bg-surface-container-lowest transition-all">
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 px-4 py-3 font-body-lg text-body-lg text-on-surface outline-none"
                />
                <span className="material-symbols-outlined text-on-surface-variant px-3 cursor-pointer">calendar_today</span>
              </div>
            </div>

            {/* Toplam Tutar */}
            <div className="relative">
              <label className="absolute -top-2 left-3 bg-surface-container-low px-1 font-label-sm text-label-sm text-on-surface-variant z-10">
                {t('verification.amount')}
              </label>
              <div className="group flex items-center border border-outline rounded-lg focus-within:border-secondary bg-surface-container-lowest transition-all">
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 px-4 py-3 font-title-md text-title-md text-primary font-bold outline-none"
                />
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="bg-transparent border-none outline-none text-on-surface-variant font-label-lg text-label-lg px-1"
                >
                  <option value="TRY">₺</option>
                  <option value="USD">$</option>
                  <option value="EUR">€</option>
                </select>
                <span className="material-symbols-outlined text-on-surface-variant px-3 cursor-pointer">payments</span>
              </div>
            </div>

          </section>

          {/* ── Invoice Image Preview ─────────────────── */}
          <div className="bg-surface-container rounded-xl overflow-hidden border border-outline-variant shadow-md">
            <div className="p-3 border-b border-outline-variant bg-surface-container-high flex justify-between items-center">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                {t('verification.invoiceImage')}
              </span>
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '18px' }}>zoom_in</span>
            </div>
            <div className="aspect-[4/3] w-full bg-surface-dim opacity-90 hover:opacity-100 transition-opacity">
              <img
                className="w-full h-full object-cover"
                src={invoice.image || INVOICE_PREVIEW}
                alt="Invoice"
                onError={e => { (e.currentTarget as HTMLImageElement).src = INVOICE_PREVIEW; }}
              />
            </div>
          </div>

          {/* ── Confirm Button ────────────────────────── */}
          <div className="mt-4 pb-8">
            <button
              onClick={handleConfirm}
              className="w-full flex items-center justify-center gap-3 bg-secondary-container text-on-secondary-container py-4 rounded-xl font-title-md text-title-md hover:bg-on-secondary-fixed-variant hover:text-secondary-fixed transition-all active:scale-[0.98] cursor-pointer shadow-md border border-secondary/20"
            >
              <span className="material-symbols-outlined">cloud_upload</span>
              {t('verification.confirm')}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
