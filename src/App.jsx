import { useMemo, useState } from 'react';
import TopNav from './components/TopNav';
import HeroSpline from './components/HeroSpline';
import ProtocolGrid from './components/ProtocolGrid';
import { AdvancedSettingsPage, DashboardPage, FuzzingPage, InteropPage, ResultsPage, TestcaseGenPage } from './components/Pages';

function App() {
  const [page, setPage] = useState('Home');
  const [protocol, setProtocol] = useState('ICMP');
  const [toast, setToast] = useState(null);

  const pageTitle = useMemo(() => page === 'Home' ? '' : `${page}${page==='Dashboard' ? ` — ${protocol}` : ''}`, [page, protocol]);

  function handleNavigate(next) {
    setPage(next);
  }

  function quickRun(p) {
    setProtocol(p);
    setPage('Fuzzing');
    setToast('Job Started');
    setTimeout(()=>setToast(null), 2500);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <TopNav onNavigate={handleNavigate} currentPage={page} />

      {page === 'Home' && (
        <>
          <HeroSpline />
          <ProtocolGrid
            onSelect={(p)=>{ setProtocol(p); setPage('Dashboard'); }}
            onQuickRun={quickRun}
          />
        </>
      )}

      {page !== 'Home' && (
        <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{pageTitle}</h2>
        </header>
      )}

      {page === 'Dashboard' && <DashboardPage protocol={protocol} />}
      {page === 'Interoperability' && <InteropPage />}
      {page === 'Testcase Generation' && <TestcaseGenPage />}
      {page === 'Fuzzing' && <FuzzingPage protocol={protocol} onNotify={(msg)=>{ setToast(msg); setTimeout(()=>setToast(null), 2500); }} />}
      {page === 'Results' && <ResultsPage />}
      {page === 'Advanced Settings' && <AdvancedSettingsPage />}

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-xs text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center justify-between">
          <span>© {new Date().getFullYear()} FuzzSuite UI</span>
          <span>v0.1.0</span>
        </div>
      </footer>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900 text-white px-4 py-2 rounded-md shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
