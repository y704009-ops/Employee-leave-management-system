import React, { useState, useEffect, useCallback } from 'react';
import LandingNavbar from '../../components/landing/LandingNavbar';
import HeroSection from '../../components/landing/HeroSection';
import StatsSection from '../../components/landing/StatsSection';
import CapabilitiesSection from '../../components/landing/CapabilitiesSection';
import WorkflowSection from '../../components/landing/WorkflowSection';
import RoleConsolesSection from '../../components/landing/RoleConsolesSection';
import SecurityGovernanceSection from '../../components/landing/SecurityGovernanceSection';
import CTASection from '../../components/landing/CTASection';
import LandingFooter from '../../components/landing/LandingFooter';
import CommandPalette from '../../components/landing/CommandPalette';

/**
 * SkillMate Public Landing Page
 * Complete corporate enterprise landing page based on Stitch design specifications.
 * Pure 2D high-assurance architecture featuring live absence ledger console,
 * modular capabilities, procedural workflow steps, RBAC governance console views,
 * and keyboard-driven command palette.
 */
const LandingPage = () => {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener
  const handleGlobalKeyDown = useCallback((e) => {
    if ((e.metaKey || e.ctrlKey) && e.key?.toLowerCase() === 'k') {
      const targetTag = e.target?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || e.target?.isContentEditable) {
        return;
      }
      e.preventDefault();
      setIsCommandPaletteOpen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleGlobalKeyDown]);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white antialiased overflow-x-hidden w-full">
      {/* Fixed Navigation Header */}
      <LandingNavbar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

      {/* Main Page Flow: Hero -> Trust -> Capabilities -> Workflow -> Roles -> Security -> CTA */}
      <main className="flex-1 w-full pt-16 overflow-x-hidden">
        <HeroSection />
        <StatsSection />
        <CapabilitiesSection />
        <WorkflowSection />
        <RoleConsolesSection />
        <SecurityGovernanceSection />
        <CTASection />
      </main>

      {/* Institutional Corporate Footer */}
      <LandingFooter />

      {/* Enterprise Command Palette Modal (Ctrl+K / Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
};

export default LandingPage;
