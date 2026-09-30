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
    expect(screen.getByText(/05 \/ 06 • SECURITY ARCHITECTURE/i)).toBeInTheDocument();

    // Headline
    expect(
      screen.getByRole('heading', {
        name: /Security controls built into every layer\./i,
      })
    ).toBeInTheDocument();

    // Supporting text
    expect(
      screen.getByText(
        /Access, permissions, and operational records are structured around controlled workforce workflows\./i
      )
    ).toBeInTheDocument();

    // Status Indicator
    expect(screen.getByText('SECURITY CONTROLS ACTIVE')).toBeInTheDocument();
  });

  it('renders all 3 Core Control Cards with accurate claims and mini UI components', () => {
    render(<SecurityGovernanceSection />);

    // Control 01: Enterprise Authentication
    expect(screen.getByText('CONTROL 01')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'ENTERPRISE AUTHENTICATION' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Authenticated access keeps workforce workspaces protected behind the existing identity layer.'
      )
    ).toBeInTheDocument();
    expect(screen.getAllByText('IDENTITY VERIFIED').length).toBeGreaterThan(0);
    expect(screen.getByText('HMAC-SHA256 Stateless')).toBeInTheDocument();
    expect(screen.getByText('BCrypt Work Factor 12')).toBeInTheDocument();

    // Control 02: Role-Based Data Isolation
    expect(screen.getByText('CONTROL 02')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'ROLE-BASED DATA ISOLATION' })).toBeInTheDocument();
    expect(
      screen.getByText(/Granular endpoint authorization guarantees employee data segregation\./i)
    ).toBeInTheDocument();
    expect(screen.getByText('EMPLOYEE:')).toBeInTheDocument();
    expect(screen.getByText('PERSONAL WORKSPACE')).toBeInTheDocument();
    expect(screen.getByText('MANAGER:')).toBeInTheDocument();
    expect(screen.getByText('TEAM WORKSPACE')).toBeInTheDocument();
    expect(screen.getByText('ADMIN / HR:')).toBeInTheDocument();
    expect(screen.getByText('ORGANIZATION WORKSPACE')).toBeInTheDocument();
    expect(screen.getByText('CONTROLLED ACCESS')).toBeInTheDocument();

    // Control 03: Audit Logging
    expect(screen.getByText('CONTROL 03')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'AUDIT LOGGING' })).toBeInTheDocument();
    expect(
      screen.getByText(/Every leave submission, manager sign-off, cancellation, and mandatory rejection comment/i)
    ).toBeInTheDocument();
    expect(screen.getByText('SIMULATED PRODUCT DATA')).toBeInTheDocument();
    expect(screen.getAllByText('AUDIT TRAIL').length).toBeGreaterThan(0);
    expect(screen.getByText('09:42')).toBeInTheDocument();
    expect(screen.getByText('Leave request submitted')).toBeInTheDocument();
    expect(screen.getByText('09:37')).toBeInTheDocument();
    expect(screen.getByText('Manager review completed')).toBeInTheDocument();
    expect(screen.getByText('09:21')).toBeInTheDocument();
    expect(screen.getByText('Decision recorded')).toBeInTheDocument();
    expect(screen.getByText('09:14')).toBeInTheDocument();
    expect(screen.getByText('Policy validation completed')).toBeInTheDocument();
  });

  it('renders the 4-layer architecture pipeline and updates specification inspector on layer click', () => {
    render(<SecurityGovernanceSection />);

    // 4 Layers present
    expect(screen.getByText('4-LAYER ARCHITECTURE PIPELINE')).toBeInTheDocument();
    const identityBtn = screen.getByRole('button', { name: /LAYER 01.*IDENTITY/i });
    const accessBtn = screen.getByRole('button', { name: /LAYER 02.*ACCESS CONTROL/i });
    const dataBtn = screen.getByRole('button', { name: /LAYER 03.*DATA ISOLATION/i });
    const auditBtn = screen.getByRole('button', { name: /LAYER 04.*AUDIT TRAIL/i });

    expect(identityBtn).toBeInTheDocument();
    expect(accessBtn).toBeInTheDocument();
    expect(dataBtn).toBeInTheDocument();
    expect(auditBtn).toBeInTheDocument();

    // Initial default: Layer 01 is selected
    expect(identityBtn).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/SPECIFICATION • LAYER 01: Enterprise Authentication/i)).toBeInTheDocument();
    expect(screen.getByText('JwtAuthenticationFilter.java')).toBeInTheDocument();

    // Click Layer 02 (Access Control)
    fireEvent.click(accessBtn);
    expect(accessBtn).toHaveAttribute('aria-pressed', 'true');
    expect(identityBtn).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText(/SPECIFICATION • LAYER 02: Role-Based Authorization/i)).toBeInTheDocument();
    expect(screen.getByText('@PreAuthorize("hasRole(...)")')).toBeInTheDocument();

    // Click Layer 03 (Data Isolation)
    fireEvent.click(dataBtn);
    expect(dataBtn).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/SPECIFICATION • LAYER 03: Workspace Data Isolation/i)).toBeInTheDocument();
    expect(screen.getByText('READ_COMMITTED (@Transactional)')).toBeInTheDocument();

    // Click Layer 04 (Audit Trail)
    fireEvent.click(auditBtn);
    expect(auditBtn).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/SPECIFICATION • LAYER 04: Audited Operations Ledger/i)).toBeInTheDocument();
    expect(screen.getByText('Append-Only Relational Ledger')).toBeInTheDocument();
  });

  it('supports simulated security event demo with manual stepping and reset controls', () => {
    render(<SecurityGovernanceSection />);

    expect(screen.getByText('SIMULATED SECURITY FLOW')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /VIEW AUDIT FLOW →/i })).toBeInTheDocument();

    // Verify 5 stages are rendered
    expect(screen.getByRole('button', { name: /Audit Flow Step 01: IDENTITY VERIFIED/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Audit Flow Step 02: ROLE CHECKED/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Audit Flow Step 03: ACCESS GRANTED/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Audit Flow Step 04: WORKFLOW EVENT/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Audit Flow Step 05: AUDIT RECORD/i })).toBeInTheDocument();

    // Stage 1 active initially
    expect(screen.getByText(/STAGE 01: IDENTITY VERIFIED/i)).toBeInTheDocument();
    expect(screen.getByText(/employee\.a@example\.com/i)).toBeInTheDocument();

    // Click Stage 4 (Workflow Event)
    const stage4Btn = screen.getByRole('button', { name: /Audit Flow Step 04: WORKFLOW EVENT/i });
    fireEvent.click(stage4Btn);
    expect(screen.getByText(/STAGE 04: WORKFLOW EVENT/i)).toBeInTheDocument();
    expect(screen.getByText(/Leave Engine & Policy Validator/i)).toBeInTheDocument();

    // Click Stage 5 (Audit Record)
    const stage5Btn = screen.getByRole('button', { name: /Audit Flow Step 05: AUDIT RECORD/i });
    fireEvent.click(stage5Btn);
    expect(screen.getByText(/STAGE 05: AUDIT RECORD/i)).toBeInTheDocument();
    expect(screen.getByText(/Tamper-evident operational record committed/i)).toBeInTheDocument();

    // Click Reset
    const resetBtn = screen.getByRole('button', { name: /RESET/i });
    fireEvent.click(resetBtn);
    expect(screen.getByText(/STAGE 01: IDENTITY VERIFIED/i)).toBeInTheDocument();
  });

  it('runs automated audit flow runner when clicking VIEW AUDIT FLOW →', () => {
    vi.useFakeTimers();
    render(<SecurityGovernanceSection />);

    const runBtn = screen.getByRole('button', { name: /VIEW AUDIT FLOW →/i });
    fireEvent.click(runBtn);

    // Initial state
    expect(screen.getByText(/STAGE 01: IDENTITY VERIFIED/i)).toBeInTheDocument();

    // Advance 1400ms -> Stage 02
    act(() => {
      vi.advanceTimersByTime(1400);
    });
    expect(screen.getByText(/STAGE 02: ROLE CHECKED/i)).toBeInTheDocument();

    // Advance 1400ms -> Stage 03
    act(() => {
      vi.advanceTimersByTime(1400);
    });
    expect(screen.getByText(/STAGE 03: ACCESS GRANTED/i)).toBeInTheDocument();

    // Advance 1400ms -> Stage 04
    act(() => {
      vi.advanceTimersByTime(1400);
    });
    expect(screen.getByText(/STAGE 04: WORKFLOW EVENT/i)).toBeInTheDocument();

    // Advance 1400ms -> Stage 05
    act(() => {
      vi.advanceTimersByTime(1400);
    });
    expect(screen.getByText(/STAGE 05: AUDIT RECORD/i)).toBeInTheDocument();
  });

  it('renders the 3 Security Principles accurately', () => {
    render(<SecurityGovernanceSection />);

    // Principle 01
    expect(screen.getByText('01 CONTROLLED ACCESS')).toBeInTheDocument();
    expect(
      screen.getByText('"Access is structured around user roles."')
    ).toBeInTheDocument();

    // Principle 02
    expect(screen.getByText('02 SEPARATED WORKSPACES')).toBeInTheDocument();
    expect(
      screen.getByText('"Employee, manager, and administrative views remain role-specific."')
    ).toBeInTheDocument();

    // Principle 03
    expect(screen.getByText('03 TRACEABLE OPERATIONS')).toBeInTheDocument();
    expect(
      screen.getByText('"Workflow activity can be represented through auditable operational records."')
    ).toBeInTheDocument();
  });
});
