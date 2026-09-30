import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, getDashboardForRole } from '../../context/AuthContext';
import { Lock, Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import { useInView } from '../../hooks/useInView';

const CTASection = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });

  const handleAction = () => {
    if (isAuthenticated && user?.role) {
      navigate(getDashboardForRole(user.role));
    } else {
      navigate('/login');
    }
  };

  return (
    <section ref={sectionRef} className="w-full bg-white py-16 sm:py-20 shadow-xs relative border-b border-slate-200/80 overflow-hidden">
      {/* Subtle Background Architectural Depth */}
      <div className="absolute inset-0 bg-enterprise-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_65%,transparent_100%)] pointer-events-none opacity-40" />

      {/* Centered Responsive Container with Protected Margins */}
      <div className="relative z-10 w-[calc(100%-32px)] sm:w-[calc(100%-48px)] max-w-[1280px] mx-auto">
        
        {/* Main Enterprise Conversion Block */}
        <div className={`p-8 sm:p-12 lg:p-14 rounded-3xl bg-[#090d1a] text-white border border-slate-800 shadow-2xl relative overflow-hidden transition-all duration-700 ease-out ${
          isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.98]'
        }`}>
          
          {/* Subtle Ambient Light Sources with soft pulse */}
          <div className="absolute top-0 right-0 w-[28rem] h-[28rem] bg-brand-900/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-900/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-enterprise-dark-grid opacity-60 pointer-events-none" />

          {/* Feature 11: System Journey Pipeline Conclusion Ribbon */}
          <div className="relative z-10 mb-8 pb-4 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="inline-flex items-center gap-2 text-sky-400 font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span>06 / 06 • ENTERPRISE READY PIPELINE</span>
            </div>
            
            {/* Visual Process Lifecycle Pipeline: REQUEST -> REVIEW -> RECONCILE -> AUDIT -> READY */}
            <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400">
              <span className="text-slate-300 font-semibold">REQUEST</span>
              <span className="text-slate-600">→</span>
              <span className="text-slate-300 font-semibold">REVIEW</span>
              <span className="text-slate-600">→</span>
              <span className="text-slate-300 font-semibold">RECONCILE</span>
              <span className="text-slate-600">→</span>
              <span className="text-slate-300 font-semibold">AUDIT</span>
              <span className="text-slate-600">→</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                SYSTEM READY
              </span>
            </div>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
            
            {/* Left Content */}
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-4xl lg:text-4xl font-extrabold text-white tracking-tight mb-4 uppercase">
                Ready to run your workforce with more control?
              </h2>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                SkillMate brings leave management, approvals, governance and audit visibility into one workspace. Access the environment through Enterprise Single Sign-On.
              </p>

              {/* Compliance Badges Row (Authentic Platform Guarantees) */}
              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" /> Role-Based Access Control
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 stroke-[2.5]" /> Encrypted JWT Session Auth
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 stroke-[2.5]" /> Immutable Audit Trail
                </span>
              </div>
            </div>

            {/* Right Action Cluster with Intentional Hierarchy */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
              <button
                onClick={handleAction}
                className="inline-flex items-center justify-center gap-2.5 h-12 px-7 bg-brand-700 hover:bg-brand-600 active:scale-[0.98] text-white text-sm font-semibold rounded-xl shadow-lg shadow-brand-950/70 hover:shadow-blue-500/25 ring-1 ring-sky-400/30 hover:ring-sky-400/60 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 group"
              >
                <Lock className="w-4 h-4 text-sky-200 group-hover:scale-105 transition-transform" />
                <span>{isAuthenticated ? 'OPEN YOUR WORKSPACE' : 'ENTER SKILLMATE'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-white/10 hover:bg-white/20 active:bg-white/25 text-white text-sm font-semibold rounded-xl border border-white/20 hover:border-white/40 shadow-xs transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 group"
              >
                <Compass className="w-4 h-4 text-sky-300 group-hover:rotate-45 transition-transform duration-300" />
                <span>EXPLORE THE PLATFORM</span>
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default CTASection;
