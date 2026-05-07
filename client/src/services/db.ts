import Dexie, { type Table } from 'dexie';

export interface PendingInvoice {
  id?: string;
  image: string; // base64
  vendor: string;
  date: string;
  totalAmount: number;
  currency: string;
  status: 'pending' | 'syncing' | 'failed' | 'synced';
  createdAt: number;
  error?: string;
}

export class InvoiceDatabase extends Dexie {
  pendingInvoices!: Table<PendingInvoice>;

  constructor() {
    super('Invoice2SheetDB');
    this.version(1).stores({
      pendingInvoices: 'id, status, createdAt'
    });
    this.pendingInvoices = this.table('pendingInvoices');
  }
}

export const db = new InvoiceDatabase();
