import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HeroSection from '../components/landing/HeroSection';
import { AuthContext } from '../context/AuthContext';

describe('HeroSection Phase 1 Tests', () => {
  const renderHero = (authValues = { isAuthenticated: false, user: null }) => {
    return render(
      <AuthContext.Provider value={authValues}>
        <MemoryRouter>
          <HeroSection />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders branding, headline, and value proposition correctly', () => {
    renderHero();

    // Headline
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Work\.\s*Manage\.\s*Grow\./i);

    // Eyebrows & Branding
    expect(screen.getAllByText(/SYSTEM OPERATIONAL/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/01 \/ 06 • WORKFORCE OPERATIONS/i)).toBeInTheDocument();
    expect(screen.getByText(/CORP-NET v2.4/i)).toBeInTheDocument();

    // Value proposition
    expect(screen.getByText(/The enterprise leave management platform built for modern organizations/i)).toBeInTheDocument();
  });

  it('renders CTAs and trust markers', () => {
    renderHero();

    // CTAs
    expect(screen.getByRole('button', { name: /SIGN IN WITH SSO/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /EXPLORE ELMS/i })).toBeInTheDocument();

    // Trust markers
    expect(screen.getByText(/Instant Quota Balancing/i)).toBeInTheDocument();
    expect(screen.getByText(/Automated Quorum Guard/i)).toBeInTheDocument();
    expect(screen.getByText(/Multi-Tier Approval Routing/i)).toBeInTheDocument();
  });

  it('renders Live Workforce Operations console with live metrics and simulated badges', () => {
    renderHero();

    // KPI Cards: TEAM QUORUM 94%, ACTIVE STAFF 17 / 18, PENDING REQUESTS 02
    expect(screen.getByText('TEAM QUORUM')).toBeInTheDocument();
    expect(screen.getByText('94%')).toBeInTheDocument();

    expect(screen.getByText('ACTIVE STAFF')).toBeInTheDocument();
    expect(screen.getByText('17 / 18')).toBeInTheDocument();

    expect(screen.getByText('PENDING REQUESTS')).toBeInTheDocument();
    expect(screen.getAllByText('02').length).toBeGreaterThan(0);

    // PRODUCT PREVIEW • SIMULATED DATA
    expect(screen.getAllByText(/PRODUCT PREVIEW • SIMULATED DATA/i).length).toBeGreaterThan(0);
  });

  it('renders the simulated activity stream with submitted, pending, and recalculated items', () => {
    renderHero();

    // Activity Stream Items
    expect(screen.getByText(/Leave request submitted/i)).toBeInTheDocument();
    expect(screen.getByText(/Manager approval pending/i)).toBeInTheDocument();
    expect(screen.getByText(/Team coverage recalculated/i)).toBeInTheDocument();
  });

  it('allows pausing, resuming, and stage scrubber navigation', () => {
    renderHero();

    const pauseButton = screen.getByRole('button', { name: /PAUSE/i });
    expect(pauseButton).toBeInTheDocument();

    // Click pause -> toggles to resume
    fireEvent.click(pauseButton);
    expect(screen.getByRole('button', { name: /RESUME/i })).toBeInTheDocument();

    // Scrubber click to stage 2
    const reviewStep = screen.getByRole('button', { name: /REVIEW/i });
    fireEvent.click(reviewStep);
    expect(screen.getByText(/Staffing Quorum Verified/i)).toBeInTheDocument();
  });
});
