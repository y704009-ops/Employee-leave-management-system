import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RoleConsolesSection from '../components/landing/RoleConsolesSection';

describe('Product Experience Hardened Security & Privacy Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSection = () => {
    return render(
      <MemoryRouter>
        <RoleConsolesSection />
      </MemoryRouter>
    );
  };

  it('renders section header, value proposition, and top operational bar with read-only badges', () => {
    renderSection();

    // Section Header
    expect(screen.getByText('PRODUCT EXPERIENCE')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /One workforce\. Three connected perspectives\./i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Give employees, managers, and HR teams the tools they need to manage workforce operations from one connected workspace\./i
      )
    ).toBeInTheDocument();

    // Prominent Hardened Badges
    expect(screen.getByText('READ-ONLY DEMO PREVIEW')).toBeInTheDocument();
    expect(screen.getByText('DEMO DATA • NO REAL EMPLOYEE INFORMATION')).toBeInTheDocument();

    // Top Frame Bar
    expect(screen.getByText('ELMS WORKSPACE')).toBeInTheDocument();
    expect(screen.getByText('SYSTEM OPERATIONAL')).toBeInTheDocument();
  });

  it('renders role switcher segmented control with Manager default active', () => {
    renderSection();

    const employeeBtn = screen.getByRole('button', { name: 'EMPLOYEE' });
    const managerBtn = screen.getByRole('button', { name: 'MANAGER' });
    const adminBtn = screen.getByRole('button', { name: 'ADMIN' });

    expect(employeeBtn).toBeInTheDocument();
    expect(managerBtn).toBeInTheDocument();
    expect(adminBtn).toBeInTheDocument();

    // Manager active by default
    expect(managerBtn).toHaveAttribute('aria-pressed', 'true');
    expect(employeeBtn).toHaveAttribute('aria-pressed', 'false');
    expect(adminBtn).toHaveAttribute('aria-pressed', 'false');
  });

  it('supports Employee View with read-only entitlements and sign-in CTA without submission forms', () => {
    renderSection();

    // Switch to Employee
    const employeeBtn = screen.getByRole('button', { name: 'EMPLOYEE' });
    fireEvent.click(employeeBtn);

    // Check Employee workspace elements
    expect(screen.getByText('EMPLOYEE WORKSPACE • DEMO DATA')).toBeInTheDocument();
    expect(screen.getByText('Employee Self-Service (Demo Preview)')).toBeInTheDocument();
    expect(screen.getByText('18 days')).toBeInTheDocument();
    expect(screen.getByText('Pending Requests')).toBeInTheDocument();
    expect(screen.getAllByText('Dec 24 → Dec 29').length).toBeGreaterThan(0);
    expect(screen.getByText('Recent Activity (Demo)')).toBeInTheDocument();
    expect(screen.getByText('● Pending Manager Review')).toBeInTheDocument();

    // Sign in CTA is present
    expect(screen.getByRole('link', { name: 'Sign In to Apply' })).toBeInTheDocument();

    // PRIVACY & SECURITY: No leave request submission forms or input fields on public landing page
    expect(screen.queryByLabelText(/leave type/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/start date/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /submit request/i })).not.toBeInTheDocument();
  });

  it('supports Manager View protocol inspection with zero approve/reject decision controls', () => {
    renderSection();

    // Manager View check
    expect(screen.getByText('MANAGER TEAM GOVERNANCE')).toBeInTheDocument();
    expect(screen.getByText('94% Safe')).toBeInTheDocument();
    expect(screen.getByText('17 of 18 staff active')).toBeInTheDocument();
    expect(screen.getByText('2 Requests')).toBeInTheDocument();
    expect(screen.getByText('1 Member')).toBeInTheDocument();
    expect(screen.getByText('APPROVAL QUEUE (READ-ONLY DEMO)')).toBeInTheDocument();

    // Generic demo employee labels (no real PII)
    expect(screen.getByText('Employee A')).toBeInTheDocument();
    expect(screen.getByText('Employee B')).toBeInTheDocument();
    expect(screen.getByText('Employee C')).toBeInTheDocument();

    // Open Protocol Inspection Modal
    const inspectButtons = screen.getAllByRole('button', { name: 'Inspect Protocol' });
    fireEvent.click(inspectButtons[0]);

    const reviewDialog = screen.getByRole('dialog');
    expect(within(reviewDialog).getByText('REQUEST GOVERNANCE PROTOCOL PREVIEW')).toBeInTheDocument();
    expect(within(reviewDialog).getByText('Leave Approval Protocol Inspection (Read-Only Demo)')).toBeInTheDocument();
    expect(within(reviewDialog).getByText('Employee A')).toBeInTheDocument();
    expect(within(reviewDialog).getByText('5 days')).toBeInTheDocument();
    expect(within(reviewDialog).getByText('17 / 18 active')).toBeInTheDocument();
    expect(within(reviewDialog).getByText('READ-ONLY DEMO • DECISION CONTROLS RESTRICTED')).toBeInTheDocument();

    // STRICT CHECK: Decision controls are completely absent
    expect(within(reviewDialog).queryByRole('button', { name: /approve request/i })).not.toBeInTheDocument();
    expect(within(reviewDialog).queryByRole('button', { name: 'Reject' })).not.toBeInTheDocument();

    // Dismiss modal
    const closeBtn = within(reviewDialog).getByRole('button', { name: /close preview/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('supports Admin / HR View with generic demo metrics and simulated report modal', () => {
    renderSection();

    // Switch to Admin
    const adminBtn = screen.getByRole('button', { name: 'ADMIN' });
    fireEvent.click(adminBtn);

    // Check Admin elements
    expect(screen.getAllByText('ADMINISTRATION & HR CONSOLE').length).toBeGreaterThan(0);
    expect(screen.getByText('Organization Overview (Demo Data)')).toBeInTheDocument();
    expect(screen.getByText('250+ (DEMO)')).toBeInTheDocument();
    expect(screen.getByText('12 (DEMO)')).toBeInTheDocument();
    expect(screen.getByText('7 (DEMO)')).toBeInTheDocument();
    expect(screen.getByText('● COMPLIANT')).toBeInTheDocument();
    expect(screen.getByText('1,800+ (DEMO)')).toBeInTheDocument();

    // Workforce Overview table
    expect(screen.getByText('WORKFORCE OVERVIEW (DEMO DATA)')).toBeInTheDocument();
    expect(screen.getByText('Platform Engineering')).toBeInTheDocument();
    expect(screen.getByText('72 (Demo)')).toBeInTheDocument();

    // Open Reports Modal
    const viewReportsBtn = screen.getByRole('button', { name: /VIEW REPORTS →/i });
    fireEvent.click(viewReportsBtn);

    const reportDialog = screen.getByRole('dialog');
    expect(reportDialog).toBeInTheDocument();
    expect(within(reportDialog).getByText('SIMULATED REPORT')).toBeInTheDocument();
    expect(within(reportDialog).getByText('Leave Utilization')).toBeInTheDocument();
    expect(within(reportDialog).getByText('72%')).toBeInTheDocument();
    expect(within(reportDialog).getByText('Policy Compliance')).toBeInTheDocument();
    expect(within(reportDialog).getByText('98%')).toBeInTheDocument();

    // Close Report Modal
    const closeBtn = within(reportDialog).getByRole('button', { name: 'CLOSE' });
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders simulated activity strip and allows resetting preview state', () => {
    renderSection();

    // Activity Strip
    expect(screen.getByText('SIMULATED ACTIVITY (DEMO)')).toBeInTheDocument();
    expect(screen.getByText('Leave policy check evaluated (Demo)')).toBeInTheDocument();
    expect(screen.getByText('Manager review protocol logged')).toBeInTheDocument();
    expect(screen.getByText('Team quorum recalculated')).toBeInTheDocument();

    // Click Reset Preview
    const resetBtn = screen.getByRole('button', { name: /Reset Preview/i });
    fireEvent.click(resetBtn);

    // State is maintained at initial values
    expect(screen.getByText('94% Safe')).toBeInTheDocument();
    expect(screen.getByText('2 Requests')).toBeInTheDocument();
    expect(screen.getByText('1 Member')).toBeInTheDocument();
  });
});
