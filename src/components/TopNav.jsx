import { useEffect, useState } from 'react';
import { Plus, History, Settings, HelpCircle, Sun, Moon } from 'lucide-react';

export default function TopNav({ onNavigate, currentPage }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [dark]);

  return (
    <div className="w-full sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/70 dark:bg-neutral-900/70 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500" />
          <button onClick={() => onNavigate('Home')} className="text-lg font-semibold text-neutral-900 dark:text-white">Cross-Protocol Fuzzing Suite</button>
          <span className="hidden sm:inline text-xs text-neutral-500 dark:text-neutral-400 ml-2">v0.1.0</span>
        </div>
        <div className="flex items-center gap-2">
          <NavButton icon={Plus} label="New Job" onClick={() => onNavigate('Fuzzing')} />
          <NavButton icon={History} label="History" onClick={() => onNavigate('Results')} />
          <NavButton icon={Settings} label="Settings" onClick={() => onNavigate('Advanced Settings')} />
          <NavButton icon={HelpCircle} label="Help" onClick={() => alert('Documentation coming soon.')} />
          <button
            onClick={() => setDark(v => !v)}
            className="ml-2 inline-flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-100 transition"
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
            <span className="hidden sm:inline text-sm">{dark ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-3 py-2 text-sm">
            {['Home','Dashboard','Interoperability','Testcase Generation','Fuzzing','Results','Advanced Settings'].map(t => (
              <button
                key={t}
                onClick={() => onNavigate(t)}
                className={`px-3 py-1 rounded-md border transition whitespace-nowrap ${currentPage===t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NavButton({ icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-100 transition">
      <Icon size={18} />
      <span className="hidden sm:inline text-sm">{label}</span>
    </button>
  );
}
