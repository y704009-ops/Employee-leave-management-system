import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, getDashboardForRole } from '../../context/AuthContext';
import { Lock, Compass, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useInView } from '../../hooks/useInView';

/**
 * Final CTA Section (Phase 7 Enterprise Polish)
 *
 * Premium enterprise conversion section:
 * - Eyebrow: READY TO WORK SMARTER?
 * - Headline: "Bring your workforce operations into one connected system."
 * - Supporting text: "Give employees a simpler way to manage leave, give managers clearer visibility, and give HR a reliable operational record."
 * - Primary CTA: "Sign In to ELMS"
 * - Secondary CTA: "Explore Product"
 * - Trust Microcopy: "Role-based access • Centralized leave records • Auditable workflows"
 * - Deep navy (#030712) enterprise SaaS design with ambient atmospheric glow.
 */
const CTASection = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });

  const handlePrimaryAction = () => {
    if (isAuthenticated && user?.role) {
      navigate(getDashboardForRole(user.role));
    } else {
      navigate('/login');
    }
  };

  const handleExploreProduct = (e) => {
    e.preventDefault();
    const el = document.querySelector('#product-experience') || document.querySelector('#capabilities');
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="w-full bg-[#030712] py-20 sm:py-24 relative border-b border-slate-800/80 overflow-hidden text-slate-100"
    >
      {/* 1. Subtle Background Architectural Depth */}
      <div className="absolute inset-0 bg-enterprise-dark-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)] pointer-events-none opacity-60" />

      {/* 2. Atmospheric Lighting Glows */}
      <div className="absolute top-1/4 left-1/3 w-[36rem] h-[36rem] bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Centered Responsive Container with Protected Margins */}
      <div className="relative z-10 w-[calc(100%-32px)] sm:w-[calc(100%-48px)] max-w-[1280px] mx-auto">
        
        {/* Main Enterprise Conversion Block */}
        <div
          className={`p-8 sm:p-12 lg:p-14 rounded-3xl bg-[#090e1a]/95 text-white border border-slate-800/90 shadow-2xl relative overflow-hidden backdrop-blur-xl transition-all duration-700 ease-out ${
            isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.99]'
          }`}
        >
          {/* Subtle Ambient Light Sources inside container */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Connected Operations Status Ribbon */}
          <div className="relative z-10 mb-8 pb-4 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="inline-flex items-center gap-2 text-sky-400 font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span>CONNECTED WORKFORCE OPERATIONS</span>
            </div>
            
            {/* Visual Process Lifecycle Pipeline: REQUEST -> REVIEW -> RECONCILE -> AUDIT */}
            <div className="hidden md:flex items-center gap-2.5 text-[11px] text-slate-400 font-mono">
              <span className="text-slate-300 font-medium">EMPLOYEE INGRESS</span>
              <span className="text-slate-600">→</span>
              <span className="text-slate-300 font-medium">MANAGER QUORUM</span>
              <span className="text-slate-600">→</span>
              <span className="text-slate-300 font-medium">POLICY AUDIT</span>
              <span className="text-slate-600">→</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                SYSTEM ACTIVE
              </span>
            </div>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
            {/* Left Content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-xs mb-3.5 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-mono text-xs font-bold text-sky-400 uppercase tracking-wider">
                  READY TO WORK SMARTER?
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-4">
                Bring your workforce operations into one connected system.
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Give employees a simpler way to manage leave, give managers clearer visibility, and give HR a reliable operational record.
              </p>

              {/* Trust Microcopy (Descriptive Product Capabilities) */}
              <div className="mt-6 flex flex-wrap items-center gap-2.5 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-1.5 text-sky-300 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Role-based access • Centralized leave records • Auditable workflows</span>
                </div>
              </div>

              {/* Metadata Badges */}
              <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-[10px]">
                <span className="px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-slate-400 font-semibold">
                  WORKFORCE OPERATIONS
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-slate-400 font-semibold">
                  CONNECTED WORKSPACE
                </span>
                <span className="px-2.5 py-1 rounded bg-sky-950/80 border border-sky-800 text-sky-300 font-bold">
                  READ-ONLY PRODUCT PREVIEW
                </span>
              </div>
            </div>

            {/* Right Action Cluster */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 shrink-0">
              <button
                type="button"
                onClick={handlePrimaryAction}
                className="inline-flex items-center justify-center gap-2.5 h-12 px-7 bg-brand-700 hover:bg-brand-600 active:scale-[0.98] text-white text-sm font-semibold rounded-xl shadow-lg shadow-sky-950/50 border border-sky-400/30 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 group"
              >
                <Lock className="w-4 h-4 text-sky-200 group-hover:scale-105 transition-transform" />
                <span>Sign In to ELMS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <a
                href="#product-experience"
                onClick={handleExploreProduct}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-slate-900/80 hover:bg-slate-800 active:scale-[0.98] text-slate-200 hover:text-white text-sm font-semibold rounded-xl border border-slate-700/80 hover:border-slate-600 shadow-xs transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 cursor-pointer group"
              >
                <Compass className="w-4 h-4 text-sky-300 group-hover:rotate-45 transition-transform duration-300" />
                <span>Explore Product</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CTASection;
