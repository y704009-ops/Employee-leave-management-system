import React from 'react';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * LandingFooter Component (Phase 7 Enterprise Polish)
 *
 * Clean, consistent enterprise dark footer with authentic system navigation,
 * dynamic year, operational status pill, and security disclaimer.
 */
const CURRENT_YEAR = new Date().getFullYear();

const LandingFooter = () => {
  return (
    <footer className="w-full bg-[#030712] border-t border-slate-800/80 py-12 lg:py-16 font-sans text-slate-400">
      <div className="w-[calc(100%-32px)] sm:w-[calc(100%-48px)] max-w-[1280px] mx-auto">
        
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-700 to-brand-900 border border-sky-400/30 flex items-center justify-center shadow-xs">
              <span className="text-white font-extrabold text-sm tracking-wider font-mono">E</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white leading-tight">SkillMate ELMS</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-900 font-mono text-[10px] text-sky-400 font-bold border border-slate-800">
                  v2.4
                </span>
              </div>
              <span className="text-xs text-slate-400 leading-tight">
                Workforce operations, simplified.
              </span>
            </div>
          </div>

          {/* Quick Navigation Anchors */}
          <nav className="flex flex-wrap items-center gap-5 sm:gap-6 text-xs font-semibold text-slate-300" aria-label="Footer Navigation">
            <a href="#hero" className="hover:text-white transition-colors">
              Product
            </a>
            <a href="#capabilities" className="hover:text-white transition-colors">
              Capabilities
            </a>
            <a href="#product-experience" className="hover:text-white transition-colors">
              Role Consoles
            </a>
            <a href="#workflow" className="hover:text-white transition-colors">
              Workflow
            </a>
            <a href="#security" className="hover:text-white transition-colors">
              Security
            </a>
            <Link to="/login" className="hover:text-sky-300 transition-colors text-sky-400 font-bold">
              Sign In
            </Link>
          </nav>

          {/* Operational Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono font-semibold text-emerald-400 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Product Preview</span>
          </div>
        </div>

        {/* Sub-Footer Copyright & Security Notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400 font-mono">
          <p>© {CURRENT_YEAR} SkillMate / ELMS. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Role-Based Corporate Gateway • Authorized Personnel Only</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default LandingFooter;
