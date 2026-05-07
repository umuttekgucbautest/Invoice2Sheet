import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Verification from './pages/Verification';

import { db, type PendingInvoice } from './services/db';
import { syncPendingInvoices } from './services/api';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'settings'>('home');
  const [verifyingInvoice, setVerifyingInvoice] = useState<PendingInvoice | null>(null);


  return (
    <>
      <Layout activeTab={activeTab} onTabChange={setActiveTab} onScanResult={(inv) => setVerifyingInvoice(inv)}>
        {activeTab === 'home' && <Dashboard />}
        {activeTab === 'settings' && <Settings />}
      </Layout>

      <AnimatePresence>
        {verifyingInvoice && (
          <Verification 
            invoice={verifyingInvoice}
            onCancel={() => setVerifyingInvoice(null)}
            onConfirm={async (updated) => {
              await db.pendingInvoices.add(updated);
              setVerifyingInvoice(null);
              // Trigger synchronization immediately after saving
              syncPendingInvoices().catch(console.error);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
