import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: null }),
  };
});

describe('LoginPage Frontend Tests', () => {
  const mockLogin = vi.fn();
  const mockShowSuccess = vi.fn();
  const mockClearToasts = vi.fn();

  const renderLoginPage = (loginFn = mockLogin) => {
    return render(
      <MemoryRouter>
        <AuthContext.Provider value={{ login: loginFn, isAuthenticated: false, isLoading: false, user: null }}>
          <ToastContext.Provider value={{ showSuccess: mockShowSuccess, showError: vi.fn(), clearToasts: mockClearToasts }}>
            <LoginPage />
          </ToastContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form with email, password, and submit controls and NO demo access shortcuts', () => {
    renderLoginPage();

    expect(screen.getByRole('heading', { level: 1, name: 'WORKORA' })).toBeInTheDocument();
    expect(screen.getByText('Workforce Management System')).toBeInTheDocument();
    expect(screen.getByText('Back to WORKORA')).toBeInTheDocument();
    expect(screen.getByLabelText(/work email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument();

    // Verify demo access / autofill shortcuts are completely removed
    expect(screen.queryByText('DEMO ACCESS')).not.toBeInTheDocument();
    expect(screen.queryByText('Click to populate')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^admin$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^manager$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^employee$/i })).not.toBeInTheDocument();
  });

  it('validates empty inputs with inline validation messages', async () => {
    renderLoginPage();

    const submitBtn = screen.getByRole('button', { name: /^sign in$/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('validates email format before submitting', async () => {
    renderLoginPage();

    const emailInput = screen.getByLabelText(/work email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitBtn = screen.getByRole('button', { name: /^sign in$/i });

    fireEvent.change(emailInput, { target: { value: 'not-an-email' } });
    fireEvent.change(passwordInput, { target: { value: 'Password@123' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('displays error alert when login fails with invalid credentials', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid email or password'));
    renderLoginPage(mockLogin);

    const emailInput = screen.getByLabelText(/work email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitBtn = screen.getByRole('button', { name: /^sign in$/i });

    fireEvent.change(emailInput, { target: { value: 'employee@elms.com' } });
    fireEvent.change(passwordInput, { target: { value: 'WrongPass' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });

  it('submits valid credentials, shows success toast and navigates to role dashboard', async () => {
    mockLogin.mockResolvedValueOnce({
      id: 1,
      name: 'Alice Employee',
      email: 'employee@elms.com',
      role: 'EMPLOYEE',
    });

    renderLoginPage(mockLogin);

    const emailInput = screen.getByLabelText(/work email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitBtn = screen.getByRole('button', { name: /^sign in$/i });

    fireEvent.change(emailInput, { target: { value: 'employee@elms.com' } });
    fireEvent.change(passwordInput, { target: { value: 'ValidPass123' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('employee@elms.com', 'ValidPass123');
      expect(mockClearToasts).toHaveBeenCalled();
      expect(mockShowSuccess).toHaveBeenCalledWith('Welcome back, Alice Employee!');
      expect(mockNavigate).toHaveBeenCalledWith('/employee/dashboard', { replace: true });
    }, { timeout: 3000 });
  });
});
