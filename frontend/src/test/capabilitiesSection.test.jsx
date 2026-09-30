import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CapabilitiesSection from '../components/landing/CapabilitiesSection';

describe('CapabilitiesSection Phase 2 Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders eyebrow, heading, and supporting text correctly', () => {
    render(<CapabilitiesSection />);

    // Eyebrow
    expect(screen.getByText(/WORKFORCE OPERATIONS/i)).toBeInTheDocument();
    expect(screen.getByText(/02 \/ 06 • WORKFORCE OPERATIONS/i)).toBeInTheDocument();

    // Heading
    expect(
      screen.getByRole('heading', { name: /Everything your workforce needs, in one place\./i })
    ).toBeInTheDocument();

    // Supporting text
    expect(
      screen.getByText(/One connected workspace for employees, managers, and HR teams\./i)
    ).toBeInTheDocument();
  });

  it('renders all 6 capability cards with correct numbers, titles, and descriptions', () => {
    render(<CapabilitiesSection />);

    // Card 1
    expect(screen.getByText('01 • SUBMISSION')).toBeInTheDocument();
    expect(screen.getByText('Employee Leave Requests')).toBeInTheDocument();
    expect(
      screen.getByText('Submit, track, and manage leave requests from one workspace.')
    ).toBeInTheDocument();

    // Card 2
    expect(screen.getByText('02 • REVIEW')).toBeInTheDocument();
    expect(screen.getByText('Manager Approvals')).toBeInTheDocument();
    expect(
      screen.getByText('Review requests while keeping team coverage visible.')
    ).toBeInTheDocument();

    // Card 3
    expect(screen.getByText('03 • BALANCES')).toBeInTheDocument();
    expect(screen.getByText('Leave Balance Tracking')).toBeInTheDocument();
    expect(
      screen.getByText('Maintain a clear view of available and used leave.')
    ).toBeInTheDocument();

    // Card 4
    expect(screen.getByText('04 • COMPLIANCE')).toBeInTheDocument();
    expect(screen.getByText('Statutory Leave Policies')).toBeInTheDocument();
    expect(
      screen.getByText('Keep leave rules and organizational policies structured.')
    ).toBeInTheDocument();

    // Card 5
    expect(screen.getByText('05 • WORKFORCE')).toBeInTheDocument();
    expect(screen.getByText('Employee Management')).toBeInTheDocument();
    expect(
      screen.getByText('Manage workforce records through role-based controls.')
    ).toBeInTheDocument();

    // Card 6
    expect(screen.getByText('06 • INSIGHTS')).toBeInTheDocument();
    expect(screen.getByText('Reports & Visibility')).toBeInTheDocument();
    expect(
      screen.getByText('Turn workforce activity into clear operational insight.')
    ).toBeInTheDocument();
  });

  it('renders the embedded mini UI previews for all 6 capabilities', () => {
    render(<CapabilitiesSection />);

    // Card 1 Mini UI
    expect(screen.getByText('LEAVE REQUEST')).toBeInTheDocument();
    expect(screen.getByText('Annual Leave')).toBeInTheDocument();
    expect(screen.getByText('Dec 24 → Dec 29')).toBeInTheDocument();
    expect(screen.getByText(/Pending Review/i)).toBeInTheDocument();

    // Card 2 Mini UI
    expect(screen.getByText('APPROVAL QUEUE')).toBeInTheDocument();
    expect(screen.getByText('Employee A')).toBeInTheDocument();
    expect(screen.getByText('5 days')).toBeInTheDocument();
    expect(screen.getByText('ACTION REQUIRED')).toBeInTheDocument();

    // Card 3 Mini UI
    expect(screen.getByText('AVAILABLE: 18 DAYS')).toBeInTheDocument();
    expect(screen.getByText('USED: 7 DAYS')).toBeInTheDocument();

    // Card 4 Mini UI
    expect(screen.getByText('POLICY STATUS')).toBeInTheDocument();
    expect(screen.getByText('● ACTIVE')).toBeInTheDocument();

    // Card 5 Mini UI
    expect(screen.getByText('ACTIVE EMPLOYEES: 250+ (DEMO)')).toBeInTheDocument();
    expect(screen.getByText('DEPARTMENTS: 12 (DEMO)')).toBeInTheDocument();

    // Card 6 Mini UI
    expect(screen.getByText('REPORT STATUS: ● READY')).toBeInTheDocument();
  });

  it('sets Manager Approvals (Card 02) as active by default and allows activating other cards', () => {
    render(<CapabilitiesSection />);

    const managerCard = screen.getByRole('button', { name: /Select capability: Manager Approvals/i });
    expect(managerCard).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('ACTIVE SUBSYSTEM')).toBeInTheDocument();

    // Click on Card 01 (Employee Leave Requests)
    const employeeCard = screen.getByRole('button', { name: /Select capability: Employee Leave Requests/i });
    expect(employeeCard).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(employeeCard);
    expect(employeeCard).toHaveAttribute('aria-pressed', 'true');
    expect(managerCard).toHaveAttribute('aria-pressed', 'false');

    // Keyboard activation (Enter on Card 03)
    const balanceCard = screen.getByRole('button', { name: /Select capability: Leave Balance Tracking/i });
    fireEvent.keyDown(balanceCard, { key: 'Enter', code: 'Enter' });
    expect(balanceCard).toHaveAttribute('aria-pressed', 'true');
    expect(employeeCard).toHaveAttribute('aria-pressed', 'false');
  });

  it('maintains the interactive leave simulation functionality', async () => {
    render(<CapabilitiesSection />);

    expect(screen.getByText('Simulate a Leave Request & Live Validation')).toBeInTheDocument();
    expect(screen.getByText('Statutory balance verification')).toBeInTheDocument();

    // Change duration to 5 days
    const fiveDaysBtn = screen.getByRole('button', { name: '5 Days' });
    fireEvent.click(fiveDaysBtn);
    expect(screen.getByText('-5.0d')).toBeInTheDocument();

    // Submit simulation
    const submitBtn = screen.getByRole('button', { name: /Run Policy Pre-Check \(Demo\)/i });
    fireEvent.click(submitBtn);

    // Wait for the simulated async submission (450ms)
    await waitFor(
      () => {
        expect(screen.getByText(/PRE-CHECK VERIFIED \(DEMO\)/i)).toBeInTheDocument();
        expect(screen.getByText('✓ Ledger event recorded')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Reset simulation
    const resetBtn = screen.getByRole('button', { name: /Reset Simulation/i });
    fireEvent.click(resetBtn);

    expect(screen.getByRole('button', { name: /Run Policy Pre-Check \(Demo\)/i })).toBeInTheDocument();
  });
});
