import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ApplyLeavePage from '../pages/employee/ApplyLeavePage';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { leaveTypeService } from '../services/leaveTypeService';
import { balanceService } from '../services/balanceService';
import { leaveService } from '../services/leaveService';

vi.mock('../services/leaveTypeService', () => ({
  leaveTypeService: {
    getActive: vi.fn(),
  },
}));

vi.mock('../services/balanceService', () => ({
  balanceService: {
    getByEmployeeId: vi.fn(),
  },
}));

vi.mock('../services/leaveService', () => ({
  leaveService: {
    create: vi.fn(),
  },
}));

describe('ApplyLeavePage Validation and Submission Tests', () => {
  const mockUser = { id: 10, name: 'Alice Developer', role: 'EMPLOYEE' };
  const mockLeaveTypes = [
    { id: 1, name: 'Annual Leave', requiresAttachment: false },
    { id: 2, name: 'Sick Leave', requiresAttachment: true },
  ];
  const mockBalances = [
    { leaveTypeId: 1, remainingDays: 10, allocatedDays: 14, usedDays: 4 },
    { leaveTypeId: 2, remainingDays: 3, allocatedDays: 7, usedDays: 4 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    leaveTypeService.getActive.mockResolvedValue({ data: mockLeaveTypes });
    balanceService.getByEmployeeId.mockResolvedValue({ data: mockBalances });
  });

  const renderApplyPage = () => {
    return render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: mockUser, isAuthenticated: true }}>
          <ToastContext.Provider value={{ showSuccess: vi.fn(), showError: vi.fn() }}>
            <ApplyLeavePage />
          </ToastContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    );
  };

  it('renders loading state initially while fetching leave policies and balances', () => {
    renderApplyPage();
    expect(screen.getByText('Loading application form...')).toBeInTheDocument();
  });

  it('validates required fields when submitting an empty form', async () => {
    renderApplyPage();

    await waitFor(() => {
      expect(screen.getByText('Submit Leave Application')).toBeInTheDocument();
    });

    const submitBtn = screen.getByText('Submit Leave Application');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Please select a leave category')).toBeInTheDocument();
      expect(screen.getByText('Start date is required')).toBeInTheDocument();
      expect(screen.getByText('End date is required')).toBeInTheDocument();
      expect(screen.getByText('Reason for leave is required')).toBeInTheDocument();
    });

    expect(leaveService.create).not.toHaveBeenCalled();
  });

  it('validates start date cannot be after end date', async () => {
    renderApplyPage();

    await waitFor(() => {
      expect(screen.getByLabelText(/leave category/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/leave category/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/start date/i), { target: { value: '2026-10-15' } });
    fireEvent.change(screen.getByLabelText(/end date/i), { target: { value: '2026-10-10' } });

    const reasonInput = screen.getByPlaceholderText(/explain the context of your leave request/i);
    fireEvent.change(reasonInput, { target: { value: 'Vacation with family' } });

    fireEvent.click(screen.getByText('Submit Leave Application'));

    await waitFor(() => {
      expect(screen.getByText('End date cannot be earlier than start date')).toBeInTheDocument();
    });

    expect(leaveService.create).not.toHaveBeenCalled();
  });

  it('validates insufficient balance when requesting more days than remaining quota', async () => {
    renderApplyPage();

    await waitFor(() => {
      expect(screen.getByLabelText(/leave category/i)).toBeInTheDocument();
    });

    // Select Sick Leave (remaining: 3 days)
    fireEvent.change(screen.getByLabelText(/leave category/i), { target: { value: '2' } });
    // Request 5 days: Oct 10 to Oct 14
    fireEvent.change(screen.getByLabelText(/start date/i), { target: { value: '2026-10-10' } });
    fireEvent.change(screen.getByLabelText(/end date/i), { target: { value: '2026-10-14' } });

    const reasonInput = screen.getByPlaceholderText(/explain the context of your leave request/i);
    fireEvent.change(reasonInput, { target: { value: 'Medical treatment' } });

    await waitFor(() => {
      expect(screen.getByText(/exceeds available quota/i)).toBeInTheDocument();
      const submitBtn = screen.getByRole('button', { name: /submit leave application/i });
      expect(submitBtn).toBeDisabled();
    });

    expect(leaveService.create).not.toHaveBeenCalled();
  });

  it('requires an attachment for leave types with requiresAttachment = true', async () => {
    renderApplyPage();

    await waitFor(() => {
      expect(screen.getByLabelText(/leave category/i)).toBeInTheDocument();
    });

    // Sick leave requires attachment
    fireEvent.change(screen.getByLabelText(/leave category/i), { target: { value: '2' } });
    // Request 2 days (within 3 available)
    fireEvent.change(screen.getByLabelText(/start date/i), { target: { value: '2026-10-10' } });
    fireEvent.change(screen.getByLabelText(/end date/i), { target: { value: '2026-10-11' } });

    const reasonInput = screen.getByPlaceholderText(/explain the context of your leave request/i);
    fireEvent.change(reasonInput, { target: { value: 'Doctor appointment' } });

    // Submit without attachment
    fireEvent.click(screen.getByText('Submit Leave Application'));

    await waitFor(() => {
      expect(screen.getByText(/an attachment or supporting document is required for sick leave/i)).toBeInTheDocument();
    });

    expect(leaveService.create).not.toHaveBeenCalled();
  });
});
