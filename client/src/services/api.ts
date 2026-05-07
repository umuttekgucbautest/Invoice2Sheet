import { db } from './db';

const GAS_ENDPOINT = import.meta.env.VITE_GAS_URL;

export async function syncPendingInvoices() {
  if (!GAS_ENDPOINT) {
    console.warn('GAS_URL not set in .env');
    return;
  }

  const pending = await db.pendingInvoices
    .where('status')
    .equals('pending')
    .toArray();

  for (const invoice of pending) {
    try {
      // Durumu 'syncing' yap
      await db.pendingInvoices.update(invoice.id!, { status: 'syncing' });

      const lang = localStorage.getItem('lang') || 'en';
      const rootFolder = localStorage.getItem('rootFolder') || 'Invoice2Sheet_Records';
      
      await fetch(GAS_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain', // Required for GAS no-cors to avoid preflight
        },
        body: JSON.stringify({
          action: 'SAVE_INVOICE',
          lang: lang,
          data: {
            vendor: invoice.vendor,
            date: invoice.date,
            amount: invoice.totalAmount,
            currency: invoice.currency,
            rootFolder: rootFolder,
            image: invoice.image
          }
        }),
      });

      // In no-cors mode, we get an opaque response (response.ok is false, status 0).
      // We assume it succeeded if it didn't throw a network error.
      await db.pendingInvoices.update(invoice.id!, { status: 'synced' });
      
    } catch (error) {
      console.error('Sync failed for invoice:', invoice.id, error);
      await db.pendingInvoices.update(invoice.id!, { 
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

// Otomatik senkronizasyon döngüsü (5 dakikada bir)
setInterval(syncPendingInvoices, 5 * 60 * 1000);
window.addEventListener('online', syncPendingInvoices);

export async function fetchDriveFolders() {
  if (!GAS_ENDPOINT) {
    console.warn('GAS_URL not set');
    return [];
  }

  try {
    const response = await fetch(GAS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({
        action: 'LIST_FOLDERS'
      }),
    });

    // Note: GAS redirects can sometimes cause issues with fetch in some environments,
    // but usually it works if ContentService is used.
    const text = await response.text();
    const data = JSON.parse(text);
    return data.success ? data.folders : [];
  } catch (error) {
    console.error('Fetch folders failed:', error);
    return [];
  }
}

export async function fetchUserInfo() {
  if (!GAS_ENDPOINT) return null;

  try {
    const response = await fetch(GAS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({
        action: 'GET_USER_INFO'
      }),
    });

    const text = await response.text();
    const data = JSON.parse(text);
    return data.success ? data : null;
  } catch (error) {
    console.error('Fetch user info failed:', error);
    return null;
  }
}
