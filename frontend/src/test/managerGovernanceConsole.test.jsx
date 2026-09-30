import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import RoleConsolesSection from '../components/landing/RoleConsolesSection';

describe('Manager Team Governance Console Product Preview', () => {
  it('renders the Manager Governance Console by default with live team data indicator', () => {
    render(
      <MemoryRouter>
        <RoleConsolesSection />
      </MemoryRouter>
    );

    // Section Eyebrow and Role Tag
    expect(screen.getByText('MANAGER TEAM GOVERNANCE CONSOLE')).toBeInTheDocument();
    expect(screen.getByText('Team Absence Ledger & Approval Queue')).toBeInTheDocument();
    expect(screen.getByText('LIVE TEAM DATA')).toBeInTheDocument();

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

    // Subordinates in queue
    expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
    expect(screen.getByText('Marcus Vance')).toBeInTheDocument();
    expect(screen.getByText('Elena Rostova')).toBeInTheDocument();
  });

  it('opens governance review modal upon clicking Review on an action-required request', () => {
    render(
      <MemoryRouter>
        <RoleConsolesSection />
      </MemoryRouter>
    );

    const reviewButtons = screen.getAllByRole('button', { name: 'Review' });
    fireEvent.click(reviewButtons[0]);

    // Modal elements scoped within dialog
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText('REQUEST GOVERNANCE REVIEW')).toBeInTheDocument();
    expect(within(dialog).getByText('Leave Approval Protocol')).toBeInTheDocument();
    expect(within(dialog).getByText('Platform Engineering')).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: /approve request/i })).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: 'Reject' })).toBeInTheDocument();
  });

  it('simulates approval interaction and updates quorum and queue consistently', () => {
    render(
      <MemoryRouter>
        <RoleConsolesSection />
      </MemoryRouter>
    );

    // Open modal for Sarah Chen
    const reviewButtons = screen.getAllByRole('button', { name: 'Review' });
    fireEvent.click(reviewButtons[0]);

    // Click Approve
    const dialog = screen.getByRole('dialog');
    const approveBtn = within(dialog).getByRole('button', { name: /approve request/i });
    fireEvent.click(approveBtn);

    // Confirmation banner appears
    expect(screen.getByText('✓ REQUEST APPROVED')).toBeInTheDocument();
    expect(screen.getByText(/Sarah Chen • Dec 24 → Dec 29/i)).toBeInTheDocument();

    // Simulated quorum numbers update consistently: 16 of 18 staff active = 89% Safe
    expect(screen.getByText('89% Safe')).toBeInTheDocument();
    expect(screen.getByText('16 of 18 staff active')).toBeInTheDocument();
    expect(screen.getByText('1 Request')).toBeInTheDocument();
    expect(screen.getByText('2 Members')).toBeInTheDocument();
    expect(screen.getByText('16 / 18 active')).toBeInTheDocument();

    // Status badge for Sarah Chen becomes APPROVED
    expect(screen.getAllByText('APPROVED').length).toBeGreaterThanOrEqual(2);
  });

  it('supports rejection workflow with audited reason', () => {
    render(
      <MemoryRouter>
        <RoleConsolesSection />
      </MemoryRouter>
    );

    // Open modal for Sarah Chen
    const reviewButtons = screen.getAllByRole('button', { name: 'Review' });
    fireEvent.click(reviewButtons[0]);

    // Click Reject in modal
    const dialog = screen.getByRole('dialog');
    const rejectBtn = within(dialog).getByRole('button', { name: 'Reject' });
    fireEvent.click(rejectBtn);

    // Rejection confirmation dialog
    const rejectDialog = screen.getByRole('dialog');
    expect(within(rejectDialog).getByText('REJECT LEAVE REQUEST?')).toBeInTheDocument();
    expect(within(rejectDialog).getByLabelText(/rejection reason/i)).toBeInTheDocument();

    // Confirm rejection
    const confirmRejectBtn = within(rejectDialog).getByRole('button', { name: /confirm rejection/i });
    fireEvent.click(confirmRejectBtn);

    // Confirmation message and state update
    expect(screen.getByText('REQUEST REJECTED')).toBeInTheDocument();
    expect(screen.getByText('1 Request')).toBeInTheDocument();
    // Quorum remains safe at 94%
    expect(screen.getByText('94% Safe')).toBeInTheDocument();
    expect(screen.getByText('REJECTED')).toBeInTheDocument();
  });

  it('allows smooth switching to Employee and Admin consoles', () => {
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

    // Switch to Admin
    const adminTab = screen.getByRole('button', { name: 'ADMIN' });
    fireEvent.click(adminTab);
    expect(screen.getByText('Global Statutory Policy & Audit Management')).toBeInTheDocument();
    expect(screen.getByText('Statutory Policies')).toBeInTheDocument();

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

    // Open and approve
    const reviewButtons = screen.getAllByRole('button', { name: 'Review' });
    fireEvent.click(reviewButtons[0]);
    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: /approve request/i }));
    expect(screen.getByText('89% Safe')).toBeInTheDocument();

    // Click Reset Preview
    const resetBtn = screen.getByRole('button', { name: /reset preview/i });
    fireEvent.click(resetBtn);

    // Values restored to initial
    expect(screen.getByText('94% Safe')).toBeInTheDocument();
    expect(screen.getByText('2 Requests')).toBeInTheDocument();
    expect(screen.getByText('1 Member')).toBeInTheDocument();
  });
});
