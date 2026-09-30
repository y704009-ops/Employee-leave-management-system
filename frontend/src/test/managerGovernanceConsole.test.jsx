import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import RoleConsolesSection from '../components/landing/RoleConsolesSection';

describe('Manager Team Governance Console Hardened Security & Privacy Tests', () => {
  it('renders the Manager Governance Console by default with generic demo data and read-only indicators', () => {
    render(
      <MemoryRouter>
        <RoleConsolesSection />
      </MemoryRouter>
    );

    // Section Eyebrow and Role Tag
    expect(screen.getByText('MANAGER TEAM GOVERNANCE CONSOLE')).toBeInTheDocument();
    expect(screen.getByText('Team Absence Ledger & Approval Queue')).toBeInTheDocument();
    expect(screen.getByText('DEMO DATA • READ-ONLY PREVIEW')).toBeInTheDocument();
    expect(screen.getByText('DEMO DATA • NO REAL EMPLOYEE INFORMATION')).toBeInTheDocument();

    // KPI Cards
    expect(screen.getByText('CURRENT TEAM QUORUM')).toBeInTheDocument();
    expect(screen.getByText('94% Safe')).toBeInTheDocument();
    expect(screen.getByText('17 of 18 staff active')).toBeInTheDocument();

    expect(screen.getByText('PENDING APPROVALS')).toBeInTheDocument();
    expect(screen.getByText('2 Requests')).toBeInTheDocument();

    expect(screen.getByText('TEAM ACTIVE ON LEAVE')).toBeInTheDocument();
    expect(screen.getByText('1 Member')).toBeInTheDocument();

    // Coverage indicator
    expect(screen.getByText('17 / 18 active')).toBeInTheDocument();

    // Generic demo employee labels in queue (NO real PII)
    expect(screen.getByText('Employee A')).toBeInTheDocument();
    expect(screen.getByText('Employee B')).toBeInTheDocument();
    expect(screen.getByText('Employee C')).toBeInTheDocument();

    // Verify absence of real PII
    expect(screen.queryByText('Sarah Chen')).not.toBeInTheDocument();
    expect(screen.queryByText('Marcus Vance')).not.toBeInTheDocument();
    expect(screen.queryByText('Elena Rostova')).not.toBeInTheDocument();
  });

  it('opens governance inspection modal and confirms strictly read-only presentation without approve/reject decision controls', () => {
    render(
      <MemoryRouter>
        <RoleConsolesSection />
      </MemoryRouter>
    );

    const inspectButtons = screen.getAllByRole('button', { name: 'Inspect Protocol' });
    fireEvent.click(inspectButtons[0]);

    // Modal elements scoped within dialog
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText('REQUEST GOVERNANCE PROTOCOL PREVIEW')).toBeInTheDocument();
    expect(within(dialog).getByText('Leave Approval Protocol Inspection (Read-Only Demo)')).toBeInTheDocument();
    expect(within(dialog).getByText('Employee A')).toBeInTheDocument();
    expect(within(dialog).getByText('READ-ONLY DEMO • DECISION CONTROLS RESTRICTED')).toBeInTheDocument();
    expect(within(dialog).getByText(/Approval and rejection authority is restricted to authenticated Line Managers/i)).toBeInTheDocument();

    // STRICT PRIVACY & SECURITY CHECK: No approve or reject buttons exist!
    expect(within(dialog).queryByRole('button', { name: /approve request/i })).not.toBeInTheDocument();
    expect(within(dialog).queryByRole('button', { name: 'Reject' })).not.toBeInTheDocument();

    // Only close preview button exists
    const closeBtn = within(dialog).getByRole('button', { name: /close preview/i });
    expect(closeBtn).toBeInTheDocument();

    // Clicking close dismisses modal
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('allows smooth switching to Employee and Admin consoles with generic demo data', () => {
    render(
      <MemoryRouter>
        <RoleConsolesSection />
      </MemoryRouter>
    );

    // Switch to Employee
    const employeeTab = screen.getByRole('button', { name: 'EMPLOYEE' });
    fireEvent.click(employeeTab);
    expect(screen.getByText('Employee Personal Leave & Quota Console')).toBeInTheDocument();
    expect(screen.getByText('Available Annual')).toBeInTheDocument();
    expect(screen.getByText('Employee Self-Service (Demo Preview)')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign In to Apply' })).toBeInTheDocument();

    // Switch to Admin
    const adminTab = screen.getByRole('button', { name: 'ADMIN' });
    fireEvent.click(adminTab);
    expect(screen.getByText('Global Statutory Policy & Audit Management')).toBeInTheDocument();
    expect(screen.getByText('Organization Overview (Demo Data)')).toBeInTheDocument();
    expect(screen.getByText('250+ (DEMO)')).toBeInTheDocument();

    // Switch back to Manager
    const managerTab = screen.getByRole('button', { name: 'MANAGER' });
    fireEvent.click(managerTab);
    expect(screen.getByText('Team Absence Ledger & Approval Queue')).toBeInTheDocument();
  });

  it('resets preview state back to initial values when Reset Preview is clicked', () => {
    render(
      <MemoryRouter>
        <RoleConsolesSection />
      </MemoryRouter>
    );

    // Click Reset Preview
    const resetBtn = screen.getByRole('button', { name: /reset preview/i });
    fireEvent.click(resetBtn);

    // Values remain safe and initial
    expect(screen.getByText('94% Safe')).toBeInTheDocument();
    expect(screen.getByText('2 Requests')).toBeInTheDocument();
    expect(screen.getByText('1 Member')).toBeInTheDocument();
  });
});
