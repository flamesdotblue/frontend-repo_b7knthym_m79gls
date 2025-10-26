import { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, StopCircle, Save, Download, CheckCircle2, XCircle, AlertTriangle, Search } from 'lucide-react';

export function DashboardPage({ protocol }) {
  const [paused, setPaused] = useState(false);
  const [lines, setLines] = useState([]);
  const timer = useRef(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      setLines((l) => [
        ...l.slice(-100),
        `${new Date().toLocaleTimeString()} — info: ${protocol} packet processed`,
        Math.random() < 0.15 ? `${new Date().toLocaleTimeString()} — warning: RTT spike detected` : null,
        Math.random() < 0.05 ? `${new Date().toLocaleTimeString()} — error: malformed response` : null,
      ].filter(Boolean));
    }, 1000);
    return () => clearInterval(timer.current);
  }, [protocol]);

  useEffect(() => {
    if (paused) clearInterval(timer.current);
  }, [paused]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="space-y-4">
        <KPICard title="Packets / sec" value={Math.floor(Math.random()*1000)+500} />
        <KPICard title="Avg RTT" value={`${(Math.random()*80+20).toFixed(1)} ms`} />
        <KPICard title="Crashes Detected" value={Math.floor(Math.random()*3)} />
        <KPICard title="Errors" value={Math.floor(Math.random()*20)} />
        <KPICard title="Last Run Time" value={`${Math.floor(Math.random()*10)}m ${Math.floor(Math.random()*59)}s`} />
      </div>
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
          <h4 className="font-semibold text-neutral-900 dark:text-white mb-3">Throughput</h4>
          <MockLineChart />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
            <h4 className="font-semibold text-neutral-900 dark:text-white mb-3">Pass / Fail</h4>
            <Donut pass={82} />
          </div>
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
            <h4 className="font-semibold text-neutral-900 dark:text-white mb-3">Latency Trend</h4>
            <MockLineChart color="purple" />
          </div>
        </div>
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
            <h4 className="font-semibold text-neutral-900 dark:text-white">Live Console</h4>
            <div className="flex gap-2">
              <IconButton icon={paused?Play:Pause} label={paused?"Resume":"Pause"} onClick={() => setPaused(v=>!v)} />
              <IconButton icon={StopCircle} label="Clear" onClick={() => setLines([])} />
              <IconButton icon={Save} label="Save" onClick={() => alert('Saved to logs/console.txt')} />
            </div>
          </div>
          <div className="max-h-64 overflow-auto p-4 font-mono text-sm space-y-1">
            {lines.map((line, i) => (
              <ConsoleLine key={i} text={line} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function InteropPage() {
  const matrix = useMemo(() => Array.from({length:6},()=>Array.from({length:6},()=> Math.random()>0.2)), []);
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
        <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">Compatibility Matrix</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {matrix.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="p-2 text-center">
                      {cell ? <CheckCircle2 className="text-green-500 inline"/> : <XCircle className="text-red-500 inline"/>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
          <h4 className="font-semibold text-neutral-900 dark:text-white mb-3">Latency Comparison</h4>
          <MockBarChart />
        </div>
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
          <h4 className="font-semibold text-neutral-900 dark:text-white mb-3">Results Summary</h4>
          <SummaryTable />
        </div>
      </div>
      <div className="fixed bottom-6 right-6">
        <button className="px-4 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg">Run Test Suite</button>
      </div>
    </section>
  );
}

export function TestcaseGenPage() {
  const [profile, setProfile] = useState('Normal');
  const [count, setCount] = useState(128);
  const [seed, setSeed] = useState('0xBEEF');
  const [prefix, setPrefix] = useState('FUZZ');
  const [start, setStart] = useState(0);

  const samples = useMemo(() => Array.from({length:8}, (_,i)=>{
    const idx = start + i;
    const hex = Array.from({length:8},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join(' ');
    return { idx, hex, size: 32 + Math.floor(Math.random()*64) };
  }), [start, seed, prefix, count, profile]);

  const totalSizeKB = (count * 64) / 1024;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 space-y-4">
        <h4 className="font-semibold text-neutral-900 dark:text-white">Generator</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Labeled name="Profile">
            <select value={profile} onChange={e=>setProfile(e.target.value)} className="w-full rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900">
              {['Easy','Normal','Hard'].map(p=> <option key={p}>{p}</option>)}
            </select>
          </Labeled>
          <Labeled name="Payload count">
            <input type="number" value={count} min={1} onChange={e=>setCount(parseInt(e.target.value||'0'))} className="w-full rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900" />
          </Labeled>
          <Labeled name="Seed">
            <input value={seed} onChange={e=>setSeed(e.target.value)} className="w-full rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900" />
          </Labeled>
          <Labeled name="Prefix">
            <input value={prefix} onChange={e=>setPrefix(e.target.value)} className="w-full rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900" />
          </Labeled>
          <Labeled name="Start Index">
            <input type="number" value={start} onChange={e=>setStart(parseInt(e.target.value||'0'))} className="w-full rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900" />
          </Labeled>
        </div>
        <div className="pt-2 text-sm text-neutral-600 dark:text-neutral-400">Estimated total payload size: {totalSizeKB.toFixed(1)} KB</div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white">Generate</button>
          <button className="px-4 py-2 rounded-md border border-neutral-200 dark:border-neutral-800">Advanced Options</button>
        </div>
      </div>
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-neutral-900 dark:text-white">Preview</h4>
          <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition">
            <Download size={16} /> Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-neutral-500">
              <tr>
                <th className="p-2">Index</th>
                <th className="p-2">Hex Preview</th>
                <th className="p-2">Size</th>
              </tr>
            </thead>
            <tbody>
              {samples.map(s => (
                <tr key={s.idx} className="border-t border-neutral-200 dark:border-neutral-800">
                  <td className="p-2">{s.idx}</td>
                  <td className="p-2 font-mono">{s.hex}</td>
                  <td className="p-2">{s.size} B</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function FuzzingPage({ protocol, onNotify }) {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [target, setTarget] = useState('127.0.0.1');
  const [timeout, setTimeoutMs] = useState(1000);
  const [concurrency, setConcurrency] = useState(10);
  const [payloadDir, setPayloadDir] = useState('/payloads');

  useEffect(() => {
    let t;
    if (running) {
      t = setInterval(() => setProgress(p => Math.min(100, p + Math.random()*5)), 500);
    }
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    if (progress >= 100 && running) {
      setRunning(false);
      onNotify && onNotify('Completed');
    }
  }, [progress, running, onNotify]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="space-y-4 lg:col-span-1">
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 space-y-3">
          <h4 className="font-semibold text-neutral-900 dark:text-white">Control Panel</h4>
          <Labeled name="Target IP / Host"><input value={target} onChange={e=>setTarget(e.target.value)} className="w-full rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900" /></Labeled>
          <Labeled name="Timeout (ms)"><input type="number" value={timeout} onChange={e=>setTimeoutMs(parseInt(e.target.value||'0'))} className="w-full rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900" /></Labeled>
          <Labeled name="Concurrency"><input type="number" value={concurrency} onChange={e=>setConcurrency(parseInt(e.target.value||'0'))} className="w-full rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900" /></Labeled>
          <Labeled name="Payload dir"><input value={payloadDir} onChange={e=>setPayloadDir(e.target.value)} className="w-full rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900" /></Labeled>
          <div className="flex gap-2 pt-2">
            <Button icon={Play} onClick={() => { setRunning(true); setProgress(0); onNotify && onNotify('Job Started'); }} primary>Start</Button>
            <Button icon={Pause} onClick={() => setRunning(false)}>Pause</Button>
            <Button icon={StopCircle} onClick={() => { setRunning(false); setProgress(0); onNotify && onNotify('Stopped'); }}>Stop</Button>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-neutral-600 dark:text-neutral-400">Progress</span>
              <span className="text-neutral-900 dark:text-neutral-100 font-medium">{progress.toFixed(0)}% • 00:{String(Math.floor(progress)).padStart(2,'0')}</span>
            </div>
            <div className="h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden"><div className="h-full bg-blue-600 transition-all" style={{width: `${progress}%`}}/></div>
          </div>
        </div>
      </div>
      <div className="space-y-4 lg:col-span-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MiniChart title="Speed (pkt/s)" />
          <MiniChart title="RTT (ms)" color="purple" />
          <MiniChart title="Error rate (%)" color="red" />
        </div>
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-neutral-900 dark:text-white">Structured Log Feed</h4>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800">
                <Search size={16} /> <input placeholder="Filter..." className="bg-transparent outline-none" />
              </div>
            </div>
          </div>
          <div className="mt-3 max-h-64 overflow-auto space-y-2 text-sm">
            {Array.from({length:20}).map((_,i)=>{
              const r = Math.random();
              const type = r<0.7?'info': r<0.9?'warning':'error';
              return <LogLine key={i} type={type} text={`Event ${i} — ${type}`} />
            })}
          </div>
          <div className="mt-4">
            <details className="rounded-md border border-neutral-200 dark:border-neutral-800 p-3">
              <summary className="cursor-pointer font-medium">Findings</summary>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Possible crash signature in sequence 1024-1028</li>
                <li>High RTT tail at P99: 350ms</li>
              </ul>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ResultsPage() {
  const rows = useMemo(()=> Array.from({length:12}, (_,i)=>({
    id: i+1,
    protocol: ['ICMP','SSH','TCP','SNMP'][i%4],
    target: `10.0.0.${i+1}`,
    date: new Date(Date.now()-i*86400000).toLocaleDateString(),
    duration: `${10+i}m`,
    status: ['OK','OK','OK','Crash'][i%4],
    findings: Math.floor(Math.random()*5),
  })), []);
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="p-4 flex items-center justify-between">
          <h4 className="font-semibold text-neutral-900 dark:text-white">Run History</h4>
          <div className="flex items-center gap-2">
            <input placeholder="Search" className="px-3 py-2 rounded-md bg-neutral-100 dark:bg-neutral-800" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-neutral-500">
              <tr>
                <th className="p-2">Protocol</th>
                <th className="p-2">Target</th>
                <th className="p-2">Date</th>
                <th className="p-2">Duration</th>
                <th className="p-2">Status</th>
                <th className="p-2">Findings</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="border-t border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                  <td className="p-2">{r.protocol}</td>
                  <td className="p-2">{r.target}</td>
                  <td className="p-2">{r.date}</td>
                  <td className="p-2">{r.duration}</td>
                  <td className="p-2">{r.status}</td>
                  <td className="p-2">{r.findings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function AdvancedSettingsPage() {
  const [scheduler, setScheduler] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [compact, setCompact] = useState(false);
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Accordion title="General">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Labeled name="Theme"><span className="text-sm">Use the toggle in the header</span></Labeled>
          <Labeled name="Default directories"><input className="w-full rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900" placeholder="/var/log/fuzzer"/></Labeled>
          <Labeled name="Log verbosity">
            <select className="w-full rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"><option>Info</option><option>Warning</option><option>Error</option></select>
          </Labeled>
        </div>
      </Accordion>
      <Accordion title="Fuzzing Defaults">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Labeled name="Timeout (ms)"><input type="number" className="w-full rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900" defaultValue={1000}/></Labeled>
          <Labeled name="Rate limits"><input type="number" className="w-full rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900" defaultValue={10000}/></Labeled>
          <Labeled name="Concurrency"><input type="number" className="w-full rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900" defaultValue={16}/></Labeled>
        </div>
      </Accordion>
      <Accordion title="Scheduler">
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={scheduler} onChange={()=>setScheduler(v=>!v)} /> Enable Scheduled Runs</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Labeled name="Start time"><input type="time" className="w-full rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"/></Labeled>
            <Labeled name="Repeat interval"><input placeholder="e.g., 1h" className="w-full rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"/></Labeled>
          </div>
        </div>
      </Accordion>
      <Accordion title="UI Preferences">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={compact} onChange={()=>setCompact(v=>!v)} /> Compact mode</label>
          <Labeled name={`Font size (${fontSize}px)`}><input type="range" min={12} max={20} value={fontSize} onChange={e=>setFontSize(parseInt(e.target.value))} className="w-full"/></Labeled>
        </div>
      </Accordion>
    </section>
  );
}

// UI helpers
function KPICard({ title, value }) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
      <div className="text-sm text-neutral-500">{title}</div>
      <div className="text-2xl font-semibold text-neutral-900 dark:text-white">{value}</div>
    </div>
  );
}

function MockLineChart({ color = 'blue' }) {
  return (
    <div className="h-32 w-full bg-gradient-to-b from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 rounded-md relative overflow-hidden">
      <div className={`absolute inset-0 opacity-70`}>
        <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="w-full h-full">
          <polyline fill="none" strokeWidth="3" stroke={`url(#grad-${color})`} points={Array.from({length:20},(_,i)=>`${i*20},${50+Math.sin(i/2)*30+Math.random()*10}`).join(' ')} />
          <defs>
            <linearGradient id={`grad-${color}`} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor={color==='purple'? '#a855f7' : color==='red'? '#ef4444' : '#2563eb'} />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Donut({ pass=75 }) {
  const radius = 40;
  const circ = 2 * Math.PI * radius;
  const done = circ * (pass/100);
  return (
    <div className="flex items-center gap-4">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} stroke="#e5e7eb" strokeWidth="12" fill="none"/>
        <circle cx="50" cy="50" r={radius} stroke="#22c55e" strokeWidth="12" fill="none" strokeDasharray={`${done} ${circ}`} strokeLinecap="round" transform="rotate(-90 50 50)" />
      </svg>
      <div>
        <div className="text-2xl font-semibold text-neutral-900 dark:text-white">{pass}%</div>
        <div className="text-sm text-neutral-500">Pass rate</div>
      </div>
    </div>
  );
}

function IconButton({ icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-100 transition" aria-label={label}>
      <Icon size={16} /> <span className="hidden sm:inline text-sm">{label}</span>
    </button>
  );
}

function ConsoleLine({ text }) {
  let color = 'text-neutral-800';
  if (text.includes('warning')) color = 'text-yellow-600';
  if (text.includes('error')) color = 'text-red-600';
  return <div className={`text-xs ${color}`}>{text}</div>;
}

function MockBarChart() {
  return (
    <div className="h-40 flex items-end gap-2">
      {Array.from({length:12}).map((_,i)=>{
        const h = 20 + Math.random()*80;
        return <div key={i} className="flex-1 bg-blue-500/70 dark:bg-blue-400/70 rounded-t" style={{height: `${h}%`}}/>;
      })}
    </div>
  );
}

function SummaryTable() {
  const rows = useMemo(()=> Array.from({length:6}, (_,i)=>({
    name: `Test ${i+1}`,
    result: Math.random()>0.3 ? 'Pass' : 'Fail',
    duration: `${(Math.random()*3+0.5).toFixed(1)}s`,
    remarks: Math.random()>0.5 ? 'OK' : 'Handshake delay',
  })), []);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-neutral-500">
          <tr>
            <th className="p-2">Test</th>
            <th className="p-2">Result</th>
            <th className="p-2">Duration</th>
            <th className="p-2">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r,idx)=> (
            <tr key={idx} className="border-t border-neutral-200 dark:border-neutral-800">
              <td className="p-2">{r.name}</td>
              <td className={`p-2 ${r.result==='Pass'?'text-green-600':'text-red-600'}`}>{r.result}</td>
              <td className="p-2">{r.duration}</td>
              <td className="p-2">{r.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MiniChart({ title, color='blue' }) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
      <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">{title}</div>
      <MockLineChart color={color} />
    </div>
  );
}

function Labeled({ name, children }) {
  return (
    <label className="text-sm space-y-1">
      <div className="text-neutral-600 dark:text-neutral-400">{name}</div>
      {children}
    </label>
  );
}

function Button({ children, primary=false, icon: Icon, onClick }) {
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-2 px-3 py-2 rounded-md transition ${primary? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border border-neutral-200 dark:border-neutral-800'}`}>
      {Icon && <Icon size={16} />} {children}
    </button>
  );
}
