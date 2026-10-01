import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap, Users, Lock, CheckCircle2 } from 'lucide-react';
import { useInView } from '../../hooks/useInView';

const TRUST_SIGNALS = [
  'WORKFORCE OPERATIONS',
  'ROLE-BASED ACCESS',
  'AUDIT READY',
  'POLICY GOVERNANCE',
  'LEAVE INTELLIGENCE',
];

const stats = [
  {
    num: '01',
    icon: Zap,
    label: 'UNIFIED OPERATIONS',
    title: 'Unified Leave Operations',
    metric: 'Real-Time Sync',
    description: 'Real-time entitlement balance calculation prevents overdraft submissions and manual spreadsheet re-entry.',
    badge: 'Pre-check Verified',
    badgeColor: 'text-sky-300 bg-sky-950/80 border-sky-800',
    topBorder: 'border-t-sky-500',
  },
  {
    num: '02',
    icon: ShieldCheck,
    label: 'ACCESS CONTROL',
    title: 'Role-Based Workflows',
    metric: '3 Segregated Roles',
    description: 'Strict permission boundaries and data segregation for Employee, Manager, and HR Administrator consoles.',
    badge: 'Role Enforced',
    badgeColor: 'text-amber-300 bg-amber-950/80 border-amber-800',
    topBorder: 'border-t-amber-500',
  },
  {
    num: '03',
    icon: Lock,
    label: 'AUDIT TRAIL',
    title: 'Auditable Decisions',
    metric: 'Traceable (Demo)',
    description: 'Structured transaction logs with sequential timestamping for every application, decision, and policy check.',
    badge: 'Audit Preview',
    badgeColor: 'text-indigo-300 bg-indigo-950/80 border-indigo-800',
    topBorder: 'border-t-indigo-500',
  },
  {
    num: '04',
    icon: Users,
    label: 'QUORUM GUARD',
    title: 'Central Workforce Visibility',
    metric: 'Team Coverage',
    description: 'Automated concurrent absence detection safeguards operational quorum before line managers sign off.',
    badge: 'Overlap Checked',
    badgeColor: 'text-emerald-300 bg-emerald-950/80 border-emerald-800',
    topBorder: 'border-t-emerald-500',
  },
];

const StatCounter = ({ value, isInView }) => {
  const [display, setDisplay] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      return value;
    }
    if (value === '3 Segregated Roles') return '0 Segregated Roles';
    return value;
  });

  useEffect(() => {
    if (!isInView) return;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      setDisplay(value);
      return;
    }

    if (value === '3 Segregated Roles') {
      let start = null;
      const duration = 800;
      let frameId;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(3 * ease);
        setDisplay(`${current} Segregated Roles`);
        if (progress < 1) {
          frameId = requestAnimationFrame(step);
        } else {
          setDisplay('3 Segregated Roles');
        }
      };
      frameId = requestAnimationFrame(step);
      return () => cancelAnimationFrame(frameId);
    } else {
      setDisplay(value);
    }
  }, [isInView, value]);

  return <span>{display}</span>;
};

const StatsSection = () => {
  const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });

  return (
    <section
      id="trust"
      ref={sectionRef}
      className="w-full bg-[#030712] border-b border-slate-800/80 relative z-20 overflow-hidden text-slate-100"
    >
      {/* 1. TRUST / ENTERPRISE SIGNALS STRIP */}
      <div className="w-full bg-slate-950/90 border-b border-slate-800/80 py-3.5 px-4 overflow-x-auto scrollbar-none">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-6 sm:gap-8 min-w-max text-[11px] font-mono text-slate-300">
          {TRUST_SIGNALS.map((signal, idx) => (
            <div key={idx} className="flex items-center gap-2 tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <span className="font-semibold text-slate-200">{signal}</span>
              {idx < TRUST_SIGNALS.length - 1 && (
                <span className="text-slate-700 ml-6 sm:ml-8 font-mono hidden md:inline">•</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Architectural Grid Texture */}
      <div className="absolute inset-0 bg-enterprise-dark-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      {/* 3. Ambient Lighting Glow */}
      <div className="absolute top-1/3 right-1/4 w-[32rem] h-[32rem] bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* 4. PREMIUM STATS SECTION CONTAINER */}
      <div className="relative z-10 w-[calc(100%-32px)] sm:w-[calc(100%-48px)] max-w-[1280px] mx-auto py-16 sm:py-20">
        {/* Section Header */}
        <div
          className={`max-w-2xl mb-10 sm:mb-12 transition-all duration-600 ease-out ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-xs mb-3.5 backdrop-blur-md">
            <span className="font-mono text-xs font-bold text-sky-400 uppercase tracking-wider">
              ARCHITECTURAL GUARANTEES
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-[-0.03em] leading-tight">
            High-assurance operational guarantees.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2.5 leading-relaxed font-normal">
            Deterministic leave quota calculations, role-based operational segregation, and auditable workflow traceability.
          </p>
        </div>

        {/* 4-Card Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6 w-full">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                style={{
                  transitionDelay: isInView ? `${index * 80}ms` : '0ms',
                }}
                className={`flex flex-col justify-between h-full p-5 sm:p-6 rounded-2xl bg-[#090e1a]/90 border border-slate-800/90 border-t-[3px] ${item.topBorder} shadow-md hover:border-slate-700 hover:bg-[#0c1324] hover:-translate-y-1 transition-all duration-200 ease-out group ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                <div>
                  {/* Step Number & Category Header */}
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {item.num}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 shadow-2xs group-hover:bg-sky-950 group-hover:text-sky-300 group-hover:border-sky-800 transition-colors">
                      <Icon className="w-4 h-4 text-sky-400" />
                    </div>
                  </div>

                  {/* Stat Title */}
                  <h3 className="text-base font-bold text-white mb-1 leading-snug">
                    {item.title}
                  </h3>

                  {/* Primary Numerical / Metric Signal */}
                  <div className="text-xl sm:text-2xl font-bold text-sky-400 tracking-tight font-mono my-1.5">
                    <StatCounter value={item.metric} isInView={isInView} />
                  </div>

                  {/* Supporting Explanation */}
                  <p className="text-xs text-slate-300 leading-relaxed font-normal mt-2">
                    {item.description}
                  </p>
                </div>

                {/* Divider & Status / Verification Indicator */}
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between font-mono">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-300 transition-colors font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>VERIFIED</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
