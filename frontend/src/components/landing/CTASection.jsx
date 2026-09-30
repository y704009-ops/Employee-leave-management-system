import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, getDashboardForRole } from '../../context/AuthContext';
import { Lock, Compass, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useInView } from '../../hooks/useInView';

/**
 * Final CTA Section (Phase 7)
 *
 * Premium enterprise conversion section:
 * - Eyebrow: READY TO WORK SMARTER?
 * - Headline: "Bring your workforce operations into one connected system."
 * - Supporting text: "Give employees a simpler way to manage leave, give managers clearer visibility, and give HR a reliable operational record."
 * - Primary CTA: "Sign In to ELMS"
 * - Secondary CTA: "Explore Product"
 * - Trust Microcopy: "Role-based access • Centralized leave records • Auditable workflows"
 * - Refined 2D enterprise visual communicating connected workforce operations.
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
    const el = document.querySelector('#product-experience') || document.querySelector('#roles');
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="w-full bg-white py-16 sm:py-20 lg:py-24 relative border-b border-slate-200/80 overflow-hidden"
    >
      {/* Subtle Background Architectural Depth */}
      <div className="absolute inset-0 bg-enterprise-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_65%,transparent_100%)] pointer-events-none opacity-30" />

      {/* Centered Responsive Container with Protected Margins */}
      <div className="relative z-10 w-[calc(100%-32px)] sm:w-[calc(100%-48px)] max-w-[1280px] mx-auto">
        
        {/* Main Enterprise Conversion Block */}
        <div
          className={`p-8 sm:p-12 lg:p-14 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden transition-all duration-700 ease-out ${
            isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.99]'
          }`}
        >
          {/* Subtle Ambient Light Sources */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-enterprise-dark-grid opacity-40 pointer-events-none" />

          {/* Connected Operations Status Ribbon */}
          <div className="relative z-10 mb-8 pb-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="inline-flex items-center gap-2 text-sky-400 font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span>CONNECTED WORKFORCE OPERATIONS</span>
            </div>
            
            {/* Visual Process Lifecycle Pipeline: REQUEST -> REVIEW -> RECONCILE -> AUDIT */}
            <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400 font-mono">
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
              <div className="inline-flex items-center gap-2 font-mono text-xs text-sky-400 font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>READY TO WORK SMARTER?</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight mb-4">
                Bring your workforce operations into one connected system.
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Give employees a simpler way to manage leave, give managers clearer visibility, and give HR a reliable operational record.
              </p>

              {/* Trust Microcopy (Descriptive Product Capabilities) */}
              <div className="mt-6 flex items-center gap-2 text-xs font-mono text-slate-400">
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-slate-300">
                  Role-based access • Centralized leave records • Auditable workflows
                </span>
              </div>
            </div>

            {/* Right Action Cluster */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 shrink-0">
              <button
                type="button"
                onClick={handlePrimaryAction}
                className="inline-flex items-center justify-center gap-2.5 h-12 px-7 bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-brand-950/50 hover:shadow-brand-500/25 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 group"
              >
                <Lock className="w-4 h-4 text-sky-200 group-hover:scale-105 transition-transform" />
                <span>Sign In to ELMS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <a
                href="#product-experience"
                onClick={handleExploreProduct}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-white/10 hover:bg-white/20 active:bg-white/25 text-white text-sm font-semibold rounded-xl border border-white/20 hover:border-white/40 shadow-xs transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 cursor-pointer group"
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
