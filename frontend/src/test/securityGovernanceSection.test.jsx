import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SecurityGovernanceSection from '../components/landing/SecurityGovernanceSection';

describe('SecurityGovernanceSection Phase 5 Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders eyebrow, headline, supporting text, and status badge correctly', () => {
    render(<SecurityGovernanceSection />);

    // Eyebrow
    expect(screen.getAllByText(/SECURITY ARCHITECTURE/i).length).toBeGreaterThan(0);

    // Headline
    expect(
      screen.getByRole('heading', {
        name: /Security controls built into every layer\./i,
      })
    ).toBeInTheDocument();

    // Supporting text
    expect(
      screen.getByText(
        /Explore the access and operational boundaries that shape the ELMS experience\./i
      )
    ).toBeInTheDocument();

    // Status Badges
    expect(screen.getByText('SECURITY ARCHITECTURE PREVIEW')).toBeInTheDocument();
    expect(screen.getByText('● CONTROL LAYERS DEFINED')).toBeInTheDocument();
  });

  it('renders all 4 architecture layer cards with titles, descriptions, and mini UI components', () => {
    render(<SecurityGovernanceSection />);

    // Layer 01: Identity
    expect(screen.getByRole('button', { name: /Layer 01: Identity/i })).toBeInTheDocument();
    expect(
      screen.getAllByText("Users enter through the application's authentication boundary before accessing protected workspaces.").length
    ).toBeGreaterThan(0);
    expect(screen.getByText('IDENTITY GATE')).toBeInTheDocument();
    expect(screen.getAllByText('ACCESS BOUNDARY').length).toBeGreaterThan(0);

    // Layer 02: Access Control
    expect(screen.getByRole('button', { name: /Layer 02: Access Control/i })).toBeInTheDocument();
    expect(
      screen.getAllByText('Role-based access boundaries separate employee, manager, and administrator workflows.').length
    ).toBeGreaterThan(0);
    expect(screen.getByText('ROLE ROUTING')).toBeInTheDocument();
    expect(screen.getAllByText('ROLE-BASED ACCESS').length).toBeGreaterThan(0);

    // Layer 03: Data Isolation
    expect(screen.getByRole('button', { name: /Layer 03: Data Isolation/i })).toBeInTheDocument();
    expect(
      screen.getAllByText("Application workspaces expose information according to the user's authorized role and workflow.").length
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('WORKSPACE BOUNDARIES').length).toBeGreaterThan(0);

    // Layer 04: Audit Trail
    expect(screen.getByRole('button', { name: /Layer 04: Audit Trail/i })).toBeInTheDocument();
    expect(
      screen.getAllByText('Operational events can be represented as traceable workflow activity.').length
    ).toBeGreaterThan(0);
    expect(screen.getByText('TIMELINE STREAM')).toBeInTheDocument();
    expect(screen.getAllByText('SIMULATED SECURITY FLOW').length).toBeGreaterThan(0);
  });

  it('allows selecting layers and updates Active Control Detail Panel', () => {
    render(<SecurityGovernanceSection />);

    const identityLayer = screen.getByRole('button', { name: /Layer 01: Identity/i });
    const accessLayer = screen.getByRole('button', { name: /Layer 02: Access Control/i });
    const dataLayer = screen.getByRole('button', { name: /Layer 03: Data Isolation/i });
    const auditLayer = screen.getByRole('button', { name: /Layer 04: Audit Trail/i });

    // Initial default: Layer 01 selected
    expect(identityLayer).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('CONTROL LAYER')).toBeInTheDocument();
    expect(screen.getByText('01 — Identity')).toBeInTheDocument();
    expect(screen.getByText('CONCEPTUAL CONTROL')).toBeInTheDocument();

    // Click Layer 02
    fireEvent.click(accessLayer);
    expect(accessLayer).toHaveAttribute('aria-pressed', 'true');
    expect(identityLayer).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('02 — Access Control')).toBeInTheDocument();

    // Click Layer 03
    fireEvent.click(dataLayer);
    expect(dataLayer).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('03 — Data Isolation')).toBeInTheDocument();

    // Click Layer 04
    fireEvent.click(auditLayer);
    expect(auditLayer).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('04 — Audit Trail')).toBeInTheDocument();
  });

  it('opens VIEW AUDIT FLOW modal and allows stepping through simulated flow', () => {
    render(<SecurityGovernanceSection />);

    const viewAuditBtn = screen.getByRole('button', { name: /VIEW AUDIT FLOW →/i });
    fireEvent.click(viewAuditBtn);

    // Modal opens
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'SECURITY FLOW PREVIEW' })).toBeInTheDocument();
    expect(screen.getAllByText('SIMULATED SECURITY FLOW').length).toBeGreaterThan(0);

    // Step 01 is active
    expect(screen.getByText('STEP 01: IDENTITY VERIFIED')).toBeInTheDocument();

    // Press Escape to close modal
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders all 3 Security Principles accurately', () => {
    render(<SecurityGovernanceSection />);

    // Principle 01
    expect(screen.getByText('CONTROLLED ACCESS')).toBeInTheDocument();
    expect(
      screen.getByText('"Access boundaries are defined by application roles."')
    ).toBeInTheDocument();

    // Principle 02
    expect(screen.getByText('SEPARATED WORKSPACES')).toBeInTheDocument();
    expect(
      screen.getByText('"Different application roles operate within distinct workspace contexts."')
    ).toBeInTheDocument();

    // Principle 03
    expect(screen.getByText('TRACEABLE OPERATIONS')).toBeInTheDocument();
    expect(
      screen.getByText('"Workflow activity can be represented as a structured process trace."')
    ).toBeInTheDocument();
  });
});
