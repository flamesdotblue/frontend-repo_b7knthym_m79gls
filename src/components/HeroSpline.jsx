import Spline from '@splinetool/react-spline';

export default function HeroSpline() {
  return (
    <section className="relative h-[420px] w-full">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/WCoEDSwacOpKBjaC/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Cross-Protocol Fuzzing Suite</h1>
            <p className="mt-3 text-neutral-700 dark:text-neutral-300">Modern, responsive interface for multi-protocol fuzzing: design testcases, run jobs, monitor performance, and explore findings across ICMP, SSH, TCP, and SNMP.</p>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white dark:from-neutral-950 via-transparent to-transparent" />
    </section>
  );
}
