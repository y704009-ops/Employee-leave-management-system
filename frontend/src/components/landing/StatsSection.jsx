import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap, Users, Lock } from 'lucide-react';
import { useInView } from '../../hooks/useInView';

const stats = [
  {
    icon: ShieldCheck,
    label: 'ACCESS CONTROL',
    value: '3 Segregated Roles',
    description: 'Strict permission boundaries for Employee, Manager, and HR Admin',
    badge: 'Role Enforced',
    badgeColor: 'text-brand-700 bg-brand-50 border-brand-200',
    topBorder: 'border-t-brand-700',
  },
  {
    icon: Zap,
    label: 'LEAVE INTEGRITY',
    value: 'Zero Deficit',
    description: 'Real-time entitlement balance calculation prevents overdraft submissions',
    badge: 'Pre-check Verified',
    badgeColor: 'text-sky-700 bg-sky-50 border-sky-200',
    topBorder: 'border-t-sky-600',
  },
  {
    icon: Users,
    label: 'QUORUM GUARD',
    value: 'Team Coverage',
    description: 'Concurrent absence detection prevents staffing conflicts during approvals',
    badge: 'Overlap Checked',
    badgeColor: 'text-slate-800 bg-slate-100 border-slate-300',
    topBorder: 'border-t-slate-700',
  },
  {
    icon: Lock,
    label: 'COMPLIANCE TRAIL',
    value: '100% Traceable',
    description: 'Immutable transaction logs with timestamped decisions and notes',
    badge: 'Audit Ready',
    badgeColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    topBorder: 'border-t-indigo-600',
  },
];

const StatCounter = ({ value, isInView }) => {
  const [display, setDisplay] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      return value;
    }
    if (value === '3 Segregated Roles') return '0 Segregated Roles';
    if (value === '100% Traceable') return '0% Traceable';
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
    } else if (value === '100% Traceable') {
      let start = null;
      const duration = 1000;
      let frameId;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(100 * ease);
        setDisplay(`${current}% Traceable`);
        if (progress < 1) {
          frameId = requestAnimationFrame(step);
        } else {
          setDisplay('100% Traceable');
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
      className="w-full bg-white py-12 sm:py-16 border-b border-slate-200/80 relative z-20 overflow-hidden"
    >
      {/* Subtle Background Accent */}
      <div className="absolute inset-0 bg-enterprise-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      {/* Centered Responsive Container with Protected Margins */}
      <div className="relative z-10 w-[calc(100%-32px)] sm:w-[calc(100%-48px)] max-w-[1280px] mx-auto">
        
        {/* Section Header: Eyebrow ↓ Heading ↓ Short Supporting Text */}
        <div
          className={`max-w-2xl mb-8 sm:mb-10 transition-all duration-600 ease-out ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="font-mono text-xs text-brand-700 font-bold uppercase tracking-wider mb-2">
            ARCHITECTURAL GUARANTEES
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            High-assurance operational guarantees.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-normal">
            Deterministic leave quota calculations, zero-trust role segregation, and immutable auditability.
          </p>
        </div>

        {/* 4-Card Responsive Grid: Desktop (>=1200px) 4 cols, Tablet (768-1199px) 2 cols, Mobile (<768px) 1 col */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6 w-full">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                style={{
                  transitionDelay: isInView ? `${index * 80}ms` : '0ms',
                }}
                className={`flex flex-col justify-between h-full p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 border-t-[3px] ${item.topBorder} shadow-2xs hover:shadow-md hover:border-slate-300 hover:-translate-y-1 transition-all duration-200 ease-out group ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                <div>
                  {/* Category Label and Icon Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      {item.label}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-700 shadow-2xs group-hover:bg-brand-50 group-hover:text-brand-700 group-hover:border-brand-200 transition-colors">
                      <Icon className="w-4.5 h-4.5 text-brand-700" />
                    </div>
                  </div>

                  {/* Large Metric / Headline */}
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-sans my-1">
                    <StatCounter value={item.value} isInView={isInView} />
                  </div>

                  {/* Supporting Explanation */}
                  <p className="text-xs text-slate-600 leading-relaxed font-normal mt-2.5">
                    {item.description}
                  </p>
                </div>

                {/* Divider & Status / Verification Indicator */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 group-hover:text-slate-600 transition-colors font-medium">
                    VERIFIED
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
