import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WorkflowSection from '../components/landing/WorkflowSection';

describe('WorkflowSection Phase 4 Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders eyebrow, headline, supporting text, and progress tracker correctly', () => {
    render(<WorkflowSection />);

    // Eyebrow
    expect(screen.getByText(/WORKFORCE WORKFLOW/i)).toBeInTheDocument();

    // Headline
    expect(
      screen.getByRole('heading', {
        name: /From request to record, every step stays connected\./i,
      })
    ).toBeInTheDocument();

    // Supporting text
    expect(
      screen.getByText(
        /Standardized workflows keep leave decisions visible, reviewable, and easy to reconcile\./i
      )
    ).toBeInTheDocument();

    // Progress tracker
    expect(screen.getByText('WORKFLOW PROGRESS')).toBeInTheDocument();
    expect(screen.getByText('SIMULATED PRODUCT FLOW')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /RUN DEMO →/i })).toBeInTheDocument();
  });

  it('renders all 3 stages with correct titles, descriptions, and mini UI components', () => {
    render(<WorkflowSection />);

    // Stage 01
    expect(screen.getByRole('button', { name: /Stage 01: Plan & Apply/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'PLAN & APPLY' })).toBeInTheDocument();
    expect(
      screen.getByText('Employees submit leave requests with dates, leave type, and optional context.')
    ).toBeInTheDocument();
    expect(screen.getByText('LEAVE REQUEST')).toBeInTheDocument();
    expect(screen.getByText('Annual Leave')).toBeInTheDocument();
    expect(screen.getAllByText('Dec 24 → Dec 29').length).toBeGreaterThan(0);
    expect(screen.getByText('● REQUEST READY')).toBeInTheDocument();

    // Stage 02
    expect(screen.getByRole('button', { name: /Stage 02: Multi-Tier Review/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'MULTI-TIER REVIEW' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Managers review requests against team coverage, policy rules, and operational requirements.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('MANAGER REVIEW')).toBeInTheDocument();
    expect(screen.getAllByText('Employee A').length).toBeGreaterThan(0);
    expect(screen.getByText('5 days')).toBeInTheDocument();
    expect(screen.getByText('TEAM QUORUM')).toBeInTheDocument();
    expect(screen.getByText('94%')).toBeInTheDocument();
    expect(screen.getByText('ACTION REQUIRED')).toBeInTheDocument();
    expect(screen.getByText('[ REVIEW ]')).toBeInTheDocument();

    // Stage 03
    expect(screen.getByRole('button', { name: /Stage 03: Record & Reconcile/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'RECORD & RECONCILE' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Approved decisions become part of the workforce record and downstream operational reporting.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('REQUEST APPROVED')).toBeInTheDocument();
    expect(screen.getByText('● RECORDED')).toBeInTheDocument();
    expect(screen.getByText('AUDIT EVENT CREATED')).toBeInTheDocument();
  });

  it('allows interactive clicking and keyboard navigation between stages with updated progress indicator and protocol inspector', () => {
    render(<WorkflowSection />);

    const stage1Btn = screen.getByRole('button', { name: /Stage 01: Plan & Apply/i });
    const stage2Btn = screen.getByRole('button', { name: /Stage 02: Multi-Tier Review/i });
    const stage3Btn = screen.getByRole('button', { name: /Stage 03: Record & Reconcile/i });

    // Initially Stage 1 is active
    expect(stage1Btn).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getAllByText('01 / 03').length).toBeGreaterThan(0);
    expect(screen.getByText(/STAGE 01 PROTOCOL/i)).toBeInTheDocument();

    // Click Stage 2
    fireEvent.click(stage2Btn);
    expect(stage2Btn).toHaveAttribute('aria-pressed', 'true');
    expect(stage1Btn).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getAllByText('02 / 03').length).toBeGreaterThan(0);
    expect(screen.getByText(/STAGE 02 PROTOCOL/i)).toBeInTheDocument();

    // Keyboard activate Stage 3 with Enter
    fireEvent.keyDown(stage3Btn, { key: 'Enter', code: 'Enter' });
    expect(stage3Btn).toHaveAttribute('aria-pressed', 'true');
    expect(stage2Btn).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getAllByText('03 / 03').length).toBeGreaterThan(0);
    expect(screen.getByText(/STAGE 03 PROTOCOL/i)).toBeInTheDocument();
  });

  it('runs automated demo flow and finishes with workflow complete state', async () => {
    render(<WorkflowSection />);

    const runDemoBtn = screen.getByRole('button', { name: /RUN DEMO →/i });
    fireEvent.click(runDemoBtn);

    // Button updates to running state
    expect(screen.getByText(/RUNNING DEMO\.\.\./i)).toBeInTheDocument();

    // Fast wait for completion (approx 3.3s total)
    await waitFor(
      () => {
        expect(screen.getByText(/✓ WORKFLOW COMPLETE/i)).toBeInTheDocument();
      },
      { timeout: 4500 }
    );

    // End stage should be 03 / 03
    expect(screen.getAllByText('03 / 03').length).toBeGreaterThan(0);
    expect(screen.getByText(/STAGE 03 PROTOCOL/i)).toBeInTheDocument();
  });

  it('renders compact audit trail strip with simulated data', () => {
    render(<WorkflowSection />);

    expect(screen.getByText('AUDIT TRAIL')).toBeInTheDocument();
    expect(screen.getByText('SIMULATED DATA')).toBeInTheDocument();

    expect(screen.getByText('Request submitted')).toBeInTheDocument();
    expect(screen.getByText('09:14')).toBeInTheDocument();

    expect(screen.getByText('Manager review completed')).toBeInTheDocument();
    expect(screen.getByText('09:37')).toBeInTheDocument();

    expect(screen.getByText('Decision recorded')).toBeInTheDocument();
    expect(screen.getByText('09:42')).toBeInTheDocument();
  });
});
