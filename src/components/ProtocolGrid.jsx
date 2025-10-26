import { Activity, Gauge, Rocket, ShieldCheck, AlarmClock } from 'lucide-react';

const protocols = [
  {
    key: 'ICMP',
    title: 'ICMP',
    description: 'Echo requests, TTL, fragmentation, and error handling.',
    icon: Activity,
    status: 'ok',
    lastRun: '5m ago',
  },
  {
    key: 'SSH',
    title: 'SSH',
    description: 'Handshake, key exchange, and auth edge cases.',
    icon: ShieldCheck,
    status: 'fail',
    lastRun: '2h ago',
  },
  {
    key: 'TCP',
    title: 'TCP',
    description: 'Sequence, retransmission, and congestion scenarios.',
    icon: Gauge,
    status: 'ok',
    lastRun: '1d ago',
  },
  {
    key: 'SNMP',
    title: 'SNMP',
    description: 'Community strings, OIDs, PDU boundary conditions.',
    icon: AlarmClock,
    status: 'ok',
    lastRun: '3d ago',
  },
];

export default function ProtocolGrid({ onSelect, onQuickRun }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {protocols.map((p) => (
          <ProtocolCard key={p.key} data={p} onSelect={onSelect} onQuickRun={onQuickRun} />)
        )}
      </div>
    </section>
  );
}

function ProtocolCard({ data, onSelect, onQuickRun }) {
  const { title, description, icon: Icon, status, lastRun } = data;
  const statusColor = status === 'ok' ? 'ring-green-400/50' : 'ring-red-400/50';
  const badgeColor = status === 'ok' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
  return (
    <div className={`group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-sm hover:shadow-md transition ring-2 ${statusColor}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 grid place-items-center text-white">
            <Icon size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{title}</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${badgeColor}`}>{status === 'ok' ? 'Last run OK' : 'Crash found'}</span>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400">
        <span>Last run: {lastRun}</span>
      </div>
      <div className="mt-5 flex gap-2">
        <button
          onClick={() => onQuickRun(title)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition"
        >
          <Rocket size={16} /> Quick Run
        </button>
        <button
          onClick={() => onSelect(title)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
        >
          View Dashboard
        </button>
      </div>
    </div>
  );
}
