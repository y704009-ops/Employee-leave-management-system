import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from '../context/ToastContext';
import { useToast } from '../hooks/useToast';
import AppLayout from '../layouts/AppLayout';
import { AuthContext } from '../context/AuthContext';

// Test consumer component to trigger toast actions
const ToastTestHarness = () => {
  const { showSuccess, showError, showWarning, showInfo, clearToasts } = useToast();

  return (
    <div>
      <button onClick={() => showSuccess('Logged out successfully')}>Trigger Logout Toast</button>
      <button onClick={() => showSuccess('Welcome back, Robert Manager!')}>Trigger Welcome Toast</button>
      <button onClick={() => showError('An error occurred')}>Trigger Error Toast</button>
      <button onClick={() => showWarning('Warning alert')}>Trigger Warning Toast</button>
      <button onClick={() => showInfo('Informational message')}>Trigger Info Toast</button>
      <button onClick={() => clearToasts()}>Clear All Toasts</button>
    </div>
  );
};

describe('Toast and Notification Lifecycle Tests', () => {
  it('renders and auto-dismisses toast after duration', () => {
    vi.useFakeTimers();
    try {
      render(
        <ToastProvider>
          <ToastTestHarness />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Trigger Info Toast'));
      expect(screen.getByText('Informational message')).toBeInTheDocument();

      // Fast-forward 4000ms
      act(() => {
        vi.advanceTimersByTime(4000);
      });

      expect(screen.queryByText('Informational message')).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('allows manual dismissal of toast via close button', () => {
    render(
      <ToastProvider>
        <ToastTestHarness />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Trigger Error Toast'));
    expect(screen.getByText('An error occurred')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /close toast/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByText('An error occurred')).not.toBeInTheDocument();
  });

  it('clears all active toasts when clearToasts is called', () => {
    render(
      <ToastProvider>
        <ToastTestHarness />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Trigger Error Toast'));
    fireEvent.click(screen.getByText('Trigger Warning Toast'));
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
    expect(screen.getByText('Warning alert')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Clear All Toasts'));
    expect(screen.queryByText('An error occurred')).not.toBeInTheDocument();
    expect(screen.queryByText('Warning alert')).not.toBeInTheDocument();
  });

  it('prevents contradictory auth state: logging in immediately purges stale logout notification', () => {
    render(
      <ToastProvider>
        <ToastTestHarness />
      </ToastProvider>
    );

    // Simulate user logging out
    fireEvent.click(screen.getByText('Trigger Logout Toast'));
    expect(screen.getByText('Logged out successfully')).toBeInTheDocument();

    // User immediately logs back in before logout toast timeout
    fireEvent.click(screen.getByText('Trigger Welcome Toast'));

    // Contradictory logout toast must be dismissed, ONLY welcome toast should remain
    expect(screen.queryByText('Logged out successfully')).not.toBeInTheDocument();
    expect(screen.getByText('Welcome back, Robert Manager!')).toBeInTheDocument();
  });

  it('prevents contradictory auth state: logging out terminates session and flushes welcome / prior toasts', () => {
    render(
      <ToastProvider>
        <ToastTestHarness />
      </ToastProvider>
    );

    // Simulate active session with welcome toast and warning
    fireEvent.click(screen.getByText('Trigger Welcome Toast'));
    fireEvent.click(screen.getByText('Trigger Warning Toast'));
    expect(screen.getByText('Welcome back, Robert Manager!')).toBeInTheDocument();
    expect(screen.getByText('Warning alert')).toBeInTheDocument();

    // User logs out
    fireEvent.click(screen.getByText('Trigger Logout Toast'));

    // Stale session toasts must be removed, ONLY logout toast should appear
    expect(screen.queryByText('Welcome back, Robert Manager!')).not.toBeInTheDocument();
    expect(screen.queryByText('Warning alert')).not.toBeInTheDocument();
    expect(screen.getByText('Logged out successfully')).toBeInTheDocument();
  });

  it('deduplicates identical toasts preventing duplicate banners from StrictMode or double-triggers', () => {
    render(
      <ToastProvider>
        <ToastTestHarness />
      </ToastProvider>
    );

    // Trigger welcome toast twice in rapid succession
    fireEvent.click(screen.getByText('Trigger Welcome Toast'));
    fireEvent.click(screen.getByText('Trigger Welcome Toast'));

    const welcomeToasts = screen.getAllByText('Welcome back, Robert Manager!');
    expect(welcomeToasts).toHaveLength(1);
  });

  it('AppLayout purges any stale logout notification on mount while preserving welcome toast', () => {
    const mockAuthContext = {
      user: { name: 'Robert Manager', role: 'MANAGER' },
      isAuthenticated: true,
      isLoading: false,
      logout: vi.fn(),
    };

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <ToastProvider>
            <ToastTestHarness />
            <AppLayout />
          </ToastProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Welcome toast should be present if triggered
    fireEvent.click(screen.getByText('Trigger Welcome Toast'));
    expect(screen.getByText('Welcome back, Robert Manager!')).toBeInTheDocument();

    // Now verify that any stale logout toast is not rendered in AppLayout
    expect(screen.queryByText('Logged out successfully')).not.toBeInTheDocument();
  });
});
