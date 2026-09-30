import React, { useState } from 'react';
import {
  CalendarPlus,
  ClipboardCheck,
  Wallet,
  Scale,
  Users,
  BarChart3,
  Layers,
  RefreshCw,
  CheckCircle2,
  RotateCcw,
  Send,
} from 'lucide-react';
import { useInView } from '../../hooks/useInView';

const LEAVE_TYPES = {
  ANNUAL: { name: 'Annual Paid Leave', total: 20.0, available: 18.5, quotaColor: 'text-blue-600', unit: 'Days' },
  SICK: { name: 'Statutory Sick Leave', total: 12.0, available: 10.0, quotaColor: 'text-emerald-600', unit: 'Days' },
  CASUAL: { name: 'Casual Floating Leave', total: 4.0, available: 3.0, quotaColor: 'text-indigo-600', unit: 'Days' },
};

const CapabilitiesSection = () => {
  const [sectionRef, isInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [selectedType, setSelectedType] = useState('ANNUAL');
  const [selectedDays, setSelectedDays] = useState(3);
  const [simState, setSimState] = useState('IDLE');

  const activeLeave = LEAVE_TYPES[selectedType] || LEAVE_TYPES.ANNUAL;
  const projectedBalance = Math.max(0, Number((activeLeave.available - selectedDays).toFixed(1)));
  const isSufficient = selectedDays <= activeLeave.available;

  const handleSubmitSimulation = () => {
    if (!isSufficient) return;
    setSimState('SUBMITTING');
    setTimeout(() => {
      setSimState('SUBMITTED');
    }, 450);
  };

  const handleResetSimulation = () => {
    setSimState('IDLE');
    setSelectedDays(3);
  };

  return (
    <section
      id="capabilities"
      ref={sectionRef}
      className="w-full py-16 sm:py-20 bg-slate-50/70 relative border-b border-slate-200/80 overflow-hidden"
    >
      {/* Subtle Background Architectural Depth */}
      <div className="absolute inset-0 bg-enterprise-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_50%,transparent_100%)] pointer-events-none opacity-30" />

      {/* Centered Responsive Container with Protected Margins */}
      <div className="relative z-10 w-[calc(100%-32px)] sm:w-[calc(100%-48px)] max-w-[1280px] mx-auto">
        
        {/* Section Header (Storytelling 02 / 06) */}
        <div
          className={`max-w-2xl mb-10 sm:mb-12 transition-all duration-600 ease-out ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="inline-flex items-center gap-2 font-mono text-xs text-brand-700 uppercase font-bold tracking-wider mb-2.5">
            <Layers className="w-4 h-4 text-brand-700" />
            <span>02 / 06 • STATUTORY CAPABILITIES & GOVERNANCE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-slate-900 tracking-tight">
            Everything your workforce needs, in one place.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-normal">
            Designed by enterprise HR architects for seamless self-service, streamlined multi-level approvals,
            and strictly enforced global policy compliance.
          </p>
        </div>

        {/* 3x2 Modular Card Grid (Desktop: 3 cols, Tablet: 2 cols, Mobile: 1 col) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 w-full">
          
          {/* Card 1: Employee Leave Requests */}
          <div
            style={{ transitionDelay: isInView ? '60ms' : '0ms' }}
            className={`flex flex-col justify-between h-full p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 hover:-translate-y-1 transition-all duration-200 ease-out group ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50/70 border border-blue-200/60 flex items-center justify-center text-blue-700 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                  <CalendarPlus className="w-5 h-5" />
                </div>
                <span className="font-mono text-[9px] font-semibold tracking-wider text-blue-700/90 bg-blue-50/60 border border-blue-200/50 px-2 py-0.5 rounded">
                  01 • SUBMISSION
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Employee Leave Requests
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Fast intuitive submission with real-time statutory deductions, conflict detection, and native calendar synchronization.
              </p>
            </div>

            {/* Product Glimpse 1: Request Draft */}
            <div className="mt-2 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 group-hover:bg-slate-50 group-hover:border-slate-300/80 transition-colors shadow-2xs h-[112px] flex flex-col justify-between">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
                <span className="text-xs text-slate-800 font-semibold">Request Draft #4092</span>
                <span className="font-mono text-[9px] text-emerald-700 bg-emerald-50/80 border border-emerald-200/60 px-1.5 py-0.5 rounded font-bold uppercase">
                  NO CONFLICT
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px] text-slate-600">
                  <span>Annual Paid Leave</span>
                  <span className="font-mono font-bold text-slate-900">3.0 Days</span>
                </div>
                <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full w-[65%] rounded-full" />
                </div>
              </div>
              <div className="flex justify-between items-center font-mono text-[10px] text-slate-500 pt-1.5 border-t border-slate-200/60">
                <span>Available after: 11.0d</span>
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Auto-checked
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Manager Approvals */}
          <div
            style={{ transitionDelay: isInView ? '120ms' : '0ms' }}
            className={`flex flex-col justify-between h-full p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 hover:-translate-y-1 transition-all duration-200 ease-out group ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-sky-50/70 border border-sky-200/60 flex items-center justify-center text-sky-700 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <span className="font-mono text-[9px] font-semibold tracking-wider text-sky-700/90 bg-sky-50/60 border border-sky-200/50 px-2 py-0.5 rounded">
                  02 • REVIEW
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Manager Approvals
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Consolidated team approval desk featuring critical timeline overlaps, minimum peer staffing guarantees, and automated delegation.
              </p>
            </div>

            {/* Product Glimpse 2: Approval Overlap Check */}
            <div className="mt-2 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 group-hover:bg-slate-50 group-hover:border-slate-300/80 transition-colors shadow-2xs h-[112px] flex flex-col justify-between">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
                <span className="text-xs text-slate-800 font-semibold">Engineering Queue</span>
                <span className="font-mono text-[9px] text-sky-700 bg-sky-50/80 border border-sky-200/60 px-1.5 py-0.5 rounded font-bold uppercase">
                  84% CAPACITY
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <div className="flex items-center gap-1">
                    <div className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center text-[9px] font-bold font-mono">
                      MK
                    </div>
                    <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[9px] font-bold font-mono">
                      AL
                    </div>
                    <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[9px] font-bold font-mono">
                      +5
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-slate-600">
                    Quorum Met (75% Req)
                  </span>
                </div>
                <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-sky-600 h-full w-[84%] rounded-full" />
                </div>
              </div>
              <div className="flex justify-between items-center font-mono text-[10px] text-slate-500 pt-1.5 border-t border-slate-200/60">
                <span>2 Pending In-Review</span>
                <span className="text-sky-700 font-medium">1-Click Decision</span>
              </div>
            </div>
          </div>

          {/* Card 3: Leave Balance Tracking */}
          <div
            style={{ transitionDelay: isInView ? '180ms' : '0ms' }}
            className={`flex flex-col justify-between h-full p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 hover:-translate-y-1 transition-all duration-200 ease-out group ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet-50/70 border border-violet-200/60 flex items-center justify-center text-violet-700 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="font-mono text-[9px] font-semibold tracking-wider text-violet-700/90 bg-violet-50/60 border border-violet-200/50 px-2 py-0.5 rounded">
                  03 • SETTLEMENT
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Leave Balance Tracking
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Transparent accrual ledgers, multi-tier rollover carryover limits, and projected balance calculations up to 12 months ahead.
              </p>
            </div>

            {/* Product Glimpse 3: Ledger Balance Progress */}
            <div className="mt-2 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 group-hover:bg-slate-50 group-hover:border-slate-300/80 transition-colors shadow-2xs h-[112px] flex flex-col justify-between">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
                <span className="text-xs text-slate-800 font-semibold">Accrual Ledger</span>
                <span className="font-mono text-[9px] text-violet-700 bg-violet-50/80 border border-violet-200/60 px-1.5 py-0.5 rounded font-bold uppercase">
                  18.5d AVAIL
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="grid grid-cols-12 gap-0.5 h-1.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
                  <div className="col-span-2 bg-slate-400 rounded-l-full" title="Taken: 4.0d" />
                  <div className="col-span-1 bg-amber-400" title="Pending: 1.5d" />
                  <div className="col-span-9 bg-violet-600 rounded-r-full" title="Vested: 18.5d" />
                </div>
                <div className="flex justify-between items-center font-mono text-[10px] text-slate-600">
                  <span>Taken: 4.0d</span>
                  <span>Pending: 1.5d</span>
                  <span className="text-violet-700 font-semibold">Vested: 18.5d</span>
                </div>
              </div>
              <div className="flex justify-between items-center font-mono text-[10px] text-slate-500 pt-1.5 border-t border-slate-200/60">
                <span>Rollover Cap: 5.0d</span>
                <span className="text-violet-700 font-medium">FY2026 Active</span>
              </div>
            </div>
          </div>

          {/* Card 4: Statutory Leave Policies */}
          <div
            style={{ transitionDelay: isInView ? '240ms' : '0ms' }}
            className={`flex flex-col justify-between h-full p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 hover:-translate-y-1 transition-all duration-200 ease-out group ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50/60 border border-emerald-200/50 flex items-center justify-center text-emerald-700 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                  <Scale className="w-5 h-5" />
                </div>
                <span className="font-mono text-[9px] font-semibold tracking-wider text-emerald-700/80 bg-emerald-50/50 border border-emerald-200/40 px-2 py-0.5 rounded">
                  GOVERNANCE
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Statutory Leave Policies
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Granular legal rules, statutory maternity/paternity frameworks, emergency bereavement, and custom tenure-tier allocations.
              </p>
            </div>

            {/* Product Glimpse 4: Policy Rule Set */}
            <div className="mt-2 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 group-hover:bg-slate-50 group-hover:border-slate-300/80 transition-colors shadow-2xs h-[112px] flex flex-col justify-between">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
                <span className="text-xs text-slate-800 font-semibold">Statutory Framework</span>
                <span className="font-mono text-[9px] text-emerald-700 bg-emerald-50/80 border border-emerald-200/60 px-1.5 py-0.5 rounded font-bold uppercase">
                  COMPLIANT
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span>Standard Tenure Tier</span>
                  <span className="font-mono font-medium text-slate-900">Min: 14.0d</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
                  <span>Medical Cert: &gt; 3d</span>
                  <span>Rollover: 5d Max</span>
                </div>
              </div>
              <div className="flex justify-between items-center font-mono text-[10px] text-slate-500 pt-1.5 border-t border-slate-200/60">
                <span>Zero Audit Deficit</span>
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Rule Enforced
                </span>
              </div>
            </div>
          </div>

          {/* Card 5: Employee Management */}
          <div
            style={{ transitionDelay: isInView ? '300ms' : '0ms' }}
            className={`flex flex-col justify-between h-full p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 hover:-translate-y-1 transition-all duration-200 ease-out group ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50/70 border border-purple-200/60 flex items-center justify-center text-purple-700 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                  <Users className="w-5 h-5" />
                </div>
                <span className="font-mono text-[9px] font-semibold tracking-wider text-purple-700/80 bg-purple-50/60 border border-purple-200/50 px-2 py-0.5 rounded">
                  HIERARCHY
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Employee Management
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Departmental reporting structures, synchronized cross-office schedules, and seamless organization-wide hierarchy governance.
              </p>
            </div>

            {/* Product Glimpse 5: Hierarchy Directory */}
            <div className="mt-2 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 group-hover:bg-slate-50 group-hover:border-slate-300/80 transition-colors shadow-2xs h-[112px] flex flex-col justify-between">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
                <span className="text-xs text-slate-800 font-semibold">Department Directory</span>
                <span className="font-mono text-[9px] text-purple-700 bg-purple-50/80 border border-purple-200/60 px-1.5 py-0.5 rounded font-bold uppercase">
                  SYNCED
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span>Reporting Structure</span>
                  <span className="font-mono font-medium text-slate-900">8 Directs</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                  <RefreshCw className="w-3 h-3 text-purple-600" />
                  <span>Direct-Line Mapping Bound</span>
                </div>
              </div>
              <div className="flex justify-between items-center font-mono text-[10px] text-slate-500 pt-1.5 border-t border-slate-200/60">
                <span>Active Directory / LDAP</span>
                <span className="text-purple-700 font-medium">Bound</span>
              </div>
            </div>
          </div>

          {/* Card 6: Reports & Visibility */}
          <div
            style={{ transitionDelay: isInView ? '360ms' : '0ms' }}
            className={`flex flex-col justify-between h-full p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 hover:-translate-y-1 transition-all duration-200 ease-out group ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-center text-amber-700 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span className="font-mono text-[9px] font-semibold tracking-wider text-amber-700/80 bg-amber-50/60 border border-amber-200/50 px-2 py-0.5 rounded">
                  ANALYTICS
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Reports & Visibility
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Executive absence planning, departmental utilization analytics, and one-click ISO-compliant payroll export journals.
              </p>
            </div>

            {/* Product Glimpse 6: Mini Bar Sparkline */}
            <div className="mt-2 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 group-hover:bg-slate-50 group-hover:border-slate-300/80 transition-colors shadow-2xs h-[112px] flex flex-col justify-between">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
                <span className="text-xs text-slate-800 font-semibold">Utilization Trend</span>
                <span className="font-mono text-[9px] text-amber-700 bg-amber-50/80 border border-amber-200/60 px-1.5 py-0.5 rounded font-bold uppercase">
                  78% OPTIMAL
                </span>
              </div>
              <div className="space-y-1">
                <div className="h-4 w-full flex items-end gap-1">
                  <div className="w-1/12 bg-amber-200/80 h-1.5 rounded-t" />
                  <div className="w-1/12 bg-amber-300/80 h-2.5 rounded-t" />
                  <div className="w-1/12 bg-amber-200/80 h-2 rounded-t" />
                  <div className="w-1/12 bg-amber-400/80 h-3 rounded-t" />
                  <div className="w-1/12 bg-amber-500/80 h-3.5 rounded-t" />
                  <div className="w-1/12 bg-amber-600/90 h-4 rounded-t" />
                  <div className="w-1/12 bg-amber-600/90 h-3.5 rounded-t" />
                  <div className="w-1/12 bg-amber-500/80 h-3 rounded-t" />
                  <div className="w-1/12 bg-amber-400/80 h-2.5 rounded-t" />
                  <div className="w-1/12 bg-amber-300/80 h-2 rounded-t" />
                  <div className="w-1/12 bg-amber-200/80 h-1.5 rounded-t" />
                  <div className="w-1/12 bg-amber-300/80 h-2 rounded-t" />
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>Q3 Peak Absence Covered</span>
                </div>
              </div>
              <div className="flex justify-between items-center font-mono text-[10px] text-slate-500 pt-1.5 border-t border-slate-200/60">
                <span>Payroll Journal Ready</span>
                <span className="text-amber-700 font-medium">ISO-27001 Valid</span>
              </div>
            </div>
          </div>

        </div>

        {/* Interactive Simulated Leave-Request Sandbox */}
        <div
          style={{ transitionDelay: isInView ? '450ms' : '0ms' }}
          className={`mt-10 p-5 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm transition-all duration-500 ease-out ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
                <span className="font-mono text-xs font-bold text-brand-700 uppercase tracking-wider">
                  INTERACTIVE SIMULATOR • STATUTORY LEAVE ENGINE
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                Simulate a Leave Request & Live Validation
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-normal">
                Test how SkillMate validates real-time statutory balances, policy gates, and manager routing before database commit.
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 font-mono text-[10px] text-slate-500 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg self-start sm:self-auto shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>LIVE CLIENT SANDBOX</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Controls: Leave Type & Days */}
            <div className="lg:col-span-7 space-y-5">
              {/* 1. Leave Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono mb-2">
                  1. Select Leave Category
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {Object.entries(LEAVE_TYPES).map(([key, item]) => {
                    const isSelected = selectedType === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setSelectedType(key);
                          if (simState === 'SUBMITTED') setSimState('IDLE');
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-brand-50/60 border-brand-500/80 ring-2 ring-brand-500/15 shadow-2xs'
                            : 'bg-slate-50/80 border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-xs font-bold text-slate-900 block truncate">
                          {item.name}
                        </span>
                        <span className={`font-mono text-[11px] font-semibold block mt-0.5 ${item.quotaColor}`}>
                          {item.available} {item.unit} Avail
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Duration Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono mb-2">
                  2. Select Duration
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {[1, 2, 3, 5, 10].map((d) => {
                    const isSelected = selectedDays === d;
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          setSelectedDays(d);
                          if (simState === 'SUBMITTED') setSimState('IDLE');
                        }}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {d} {d === 1 ? 'Day' : 'Days'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                {simState === 'SUBMITTED' ? (
                  <button
                    type="button"
                    onClick={handleResetSimulation}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
                    <span>Reset Simulation</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!isSufficient || simState === 'SUBMITTING'}
                    onClick={handleSubmitSimulation}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                      !isSufficient
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                        : simState === 'SUBMITTING'
                        ? 'bg-brand-600 text-white opacity-80'
                        : 'bg-brand-700 hover:bg-brand-800 active:scale-[0.98] text-white shadow-brand-900/20'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5 text-sky-200" />
                    <span>{simState === 'SUBMITTING' ? 'Evaluating Statutory Ledger...' : 'Simulate Submit Request'}</span>
                  </button>
                )}

                <span className="font-mono text-[10px] text-slate-500">
                  {simState === 'SUBMITTED' ? '✓ Ledger event recorded' : 'Mock sandbox • no database writes'}
                </span>
              </div>
            </div>

            {/* Right Live Verification Preview */}
            <div className="lg:col-span-5 p-4 rounded-xl bg-slate-50/90 border border-slate-200/90 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200/70">
                  <span className="font-mono text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    POLICY EVALUATION REPORT
                  </span>
                  <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                    simState === 'SUBMITTED'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : isSufficient
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {simState === 'SUBMITTED' ? 'SUBMITTED (TX#9832-SIM)' : isSufficient ? 'RULE COMPLIANT' : 'EXCEEDS QUOTA'}
                  </span>
                </div>

                {/* Balance Delta Display */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-white border border-slate-200/70 mb-3 text-center font-mono">
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Current</span>
                    <span className="text-xs font-bold text-slate-800">{activeLeave.available}d</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Request</span>
                    <span className="text-xs font-bold text-brand-700">-{selectedDays}.0d</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Projected</span>
                    <span className={`text-xs font-bold ${isSufficient ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {projectedBalance}d
                    </span>
                  </div>
                </div>

                {/* Validation Checklist */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isSufficient ? 'text-emerald-600' : 'text-rose-500'}`} />
                      <span>Statutory balance verification</span>
                    </span>
                    <span className="font-mono text-[10px] font-bold text-slate-800">
                      {isSufficient ? 'PASSED' : 'INSUFFICIENT'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Team quorum threshold (&gt;75%)</span>
                    </span>
                    <span className="font-mono text-[10px] font-bold text-emerald-700">
                      94% SAFE
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Line manager auto-routing</span>
                    </span>
                    <span className="font-mono text-[10px] font-bold text-slate-800">
                      M#308 BOUND
                    </span>
                  </div>
                </div>
            </div>

            {/* Status Note */}
            <div className="pt-3 mt-3 border-t border-slate-200/70 font-mono text-[10px] text-slate-500 flex items-center justify-between">
              <span>Verification latency: &lt;45ms</span>
              <span className="text-emerald-700 font-semibold">Zero Discrepancy</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  </section>
);
};

export default CapabilitiesSection;
