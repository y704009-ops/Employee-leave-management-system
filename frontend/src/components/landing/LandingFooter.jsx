import React from 'react';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * LandingFooter Component (Phase 7 Polish)
 *
 * Clean, consistent enterprise footer with authentic system navigation,
 * dynamic year, operational status pill, and security disclaimer.
 */
const CURRENT_YEAR = new Date().getFullYear();

const LandingFooter = () => {

  return (
    <footer className="w-full bg-white border-t border-slate-200/80 py-12 lg:py-16">
      <div className="w-[calc(100%-32px)] sm:w-[calc(100%-48px)] max-w-[1280px] mx-auto">
        
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-700 to-brand-900 border border-brand-600/30 flex items-center justify-center shadow-xs">
              <span className="text-white font-extrabold text-sm tracking-wider font-mono">E</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900 leading-tight">SkillMate ELMS</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[10px] text-slate-700 font-bold border border-slate-200">
                  v2.4
                </span>
              </div>
              <span className="text-xs text-slate-500 leading-tight">
                Workforce operations, simplified.
              </span>
            </div>
          </div>

          {/* Quick Navigation Anchors */}
          <nav className="flex flex-wrap items-center gap-5 sm:gap-6 text-xs font-semibold text-slate-600" aria-label="Footer Navigation">
            <a href="#hero" className="hover:text-brand-700 transition-colors">
              Product
            </a>
            <a href="#capabilities" className="hover:text-brand-700 transition-colors">
              Capabilities
            </a>
            <a href="#product-experience" className="hover:text-brand-700 transition-colors">
              Role Consoles
            </a>
            <a href="#workflow" className="hover:text-brand-700 transition-colors">
              Workflow
            </a>
            <a href="#security" className="hover:text-brand-700 transition-colors">
              Security
            </a>
            <Link to="/login" className="hover:text-brand-700 transition-colors text-brand-700 font-bold">
              Sign In
            </Link>
          </nav>

          {/* Operational Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/70 text-[11px] font-mono font-semibold text-emerald-800 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Systems Operational</span>
          </div>
        </div>

        {/* Sub-Footer Copyright & Security Notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500 font-mono">
          <p>© {CURRENT_YEAR} SkillMate / ELMS. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Role-Based Corporate Gateway • Authorized Personnel Only</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default LandingFooter;
