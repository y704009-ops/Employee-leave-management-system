import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ApprovalQueuePage from '../pages/manager/ApprovalQueuePage';
import LeaveDetailsPage from '../pages/employee/LeaveDetailsPage';
import { ToastContext } from '../context/ToastContext';
import { AuthContext } from '../context/AuthContext';
import { leaveService } from '../services/leaveService';

vi.mock('../services/leaveService', () => ({
  leaveService: {
    getPendingLeaves: vi.fn(),
    approveLeave: vi.fn(),
    rejectLeave: vi.fn(),
    getReviewDetails: vi.fn(),
    getById: vi.fn(),
    cancelLeave: vi.fn(),
  },
}));

describe('Approval Queue and Leave Cancellation UI Tests', () => {
  const mockShowSuccess = vi.fn();
  const mockShowError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProviders = (component) => {
    return render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: { id: 1, name: 'Manager Bob', role: 'MANAGER' }, isAuthenticated: true }}>
          <ToastContext.Provider value={{ showSuccess: mockShowSuccess, showError: mockShowError }}>
            {component}
          </ToastContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    );
  };

  it('ApprovalQueue renders empty state when no pending approvals exist', async () => {
    leaveService.getPendingLeaves.mockResolvedValueOnce({
      data: { success: true, data: [] },
    });

    renderWithProviders(<ApprovalQueuePage />);

    await waitFor(() => {
      expect(screen.getByText('Queue is clear')).toBeInTheDocument();
      expect(screen.getByText(/no pending leave requests requiring manager review/i)).toBeInTheDocument();
    });
  });

  it('ApprovalQueue renders pending list and approves leave request', async () => {
    const mockPendingLeaves = [
      {
        id: 101,
        employeeName: 'Alice Dev',
        employeeEmail: 'alice@elms.com',
        leaveTypeName: 'Annual Leave',
        startDate: '2026-10-10',
        endDate: '2026-10-12',
        requestedDays: 3,
        reason: 'Family trip',
        status: 'PENDING',
      },
    ];

    leaveService.getPendingLeaves.mockResolvedValue({
      data: { success: true, data: mockPendingLeaves },
    });

    leaveService.approveLeave.mockResolvedValueOnce({
      data: { success: true, data: { ...mockPendingLeaves[0], status: 'APPROVED' } },
    });

    renderWithProviders(<ApprovalQueuePage />);

    await waitFor(() => {
      expect(screen.getByText('Alice Dev')).toBeInTheDocument();
      expect(screen.getByText('Annual Leave')).toBeInTheDocument();
    });

    // Click Approve button in table action
    const approveBtn = screen.getByRole('button', { name: /approve/i });
    fireEvent.click(approveBtn);

    // Approve confirmation modal opens
    await waitFor(() => {
      expect(screen.getByText('Approve Leave — Alice Dev')).toBeInTheDocument();
    });

    // Confirm approval
    const confirmApproveBtn = screen.getByRole('button', { name: /^confirm approval$/i });
    fireEvent.click(confirmApproveBtn);

    await waitFor(() => {
      expect(leaveService.approveLeave).toHaveBeenCalledWith(101, '');
      expect(mockShowSuccess).toHaveBeenCalledWith('Approved leave request for Alice Dev');
    });
  });

  it('ApprovalQueue strictly mandates comment before rejecting a leave request', async () => {
    const mockPendingLeaves = [
      {
        id: 102,
        employeeName: 'Charlie Brown',
        employeeEmail: 'charlie@elms.com',
        leaveTypeName: 'Sick Leave',
        startDate: '2026-10-15',
        endDate: '2026-10-16',
        requestedDays: 2,
        reason: 'Cold',
        status: 'PENDING',
      },
    ];

    leaveService.getPendingLeaves.mockResolvedValue({
      data: { success: true, data: mockPendingLeaves },
    });

    renderWithProviders(<ApprovalQueuePage />);

    await waitFor(() => {
      expect(screen.getByText('Charlie Brown')).toBeInTheDocument();
    });

    // Click Reject button
    const rejectBtn = screen.getByRole('button', { name: /reject/i });
    fireEvent.click(rejectBtn);

    await waitFor(() => {
      expect(screen.getByText('Reject Leave — Charlie Brown')).toBeInTheDocument();
    });

    // Attempt to submit empty reject comment
    const confirmRejectBtn = screen.getByRole('button', { name: /^confirm rejection$/i });
    fireEvent.click(confirmRejectBtn);

    expect(mockShowError).toHaveBeenCalledWith(
      'A manager comment (min 3 characters) is strictly mandatory when rejecting'
    );
    expect(leaveService.rejectLeave).not.toHaveBeenCalled();

    // Now type a valid rejection comment
    const commentInput = screen.getByPlaceholderText(/inadequate team coverage/i);
    fireEvent.change(commentInput, { target: { value: 'Critical release sprint in progress.' } });

    leaveService.rejectLeave.mockResolvedValueOnce({
      data: { success: true, data: { ...mockPendingLeaves[0], status: 'REJECTED' } },
    });

    fireEvent.click(confirmRejectBtn);

    await waitFor(() => {
      expect(leaveService.rejectLeave).toHaveBeenCalledWith(102, 'Critical release sprint in progress.');
      expect(mockShowSuccess).toHaveBeenCalledWith('Rejected request for Charlie Brown');
    });
  });

  it('LeaveDetailsPage displays cancellation modal and cancels PENDING request', async () => {
    const mockLeave = {
      id: 55,
      employeeName: 'Alice Dev',
      leaveTypeName: 'Annual Leave',
      startDate: '2026-11-01',
      endDate: '2026-11-03',
      requestedDays: 3,
      reason: 'Autumn travel',
      status: 'PENDING',
      createdAt: '2026-10-01T10:00:00Z',
    };

    leaveService.getById.mockResolvedValueOnce({ data: mockLeave });
    leaveService.cancelLeave.mockResolvedValueOnce({
      data: { success: true, message: 'Cancelled' },
    });

    render(
      <MemoryRouter initialEntries={['/employee/leaves/55']}>
        <AuthContext.Provider value={{ user: { id: 10, name: 'Alice Dev', role: 'EMPLOYEE' } }}>
          <ToastContext.Provider value={{ showSuccess: mockShowSuccess, showError: mockShowError }}>
            <Routes>
              <Route path="/employee/leaves/:id" element={<LeaveDetailsPage />} />
            </Routes>
          </ToastContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Autumn travel')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel request/i })).toBeInTheDocument();
    });

    // Click cancel button to open confirmation dialog
    fireEvent.click(screen.getByRole('button', { name: /cancel request/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /confirm cancellation/i })).toBeInTheDocument();
    });

    // Confirm cancellation
    const confirmCancelBtn = screen.getByRole('button', { name: /^confirm cancellation$/i });
    fireEvent.click(confirmCancelBtn);

    await waitFor(() => {
      expect(leaveService.cancelLeave).toHaveBeenCalledWith('55');
      expect(mockShowSuccess).toHaveBeenCalledWith('Leave application cancelled successfully.');
    });
  });
});
