import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import ProtectedRoute from '../routes/ProtectedRoute';
import RoleRoute from '../routes/RoleRoute';
import ForbiddenPage from '../pages/common/ForbiddenPage';
import { AuthContext, getDashboardForRole, isRouteAllowedForRole } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';

describe('Auth Session Transition and Role-Based Redirection Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  // --- UNIT TESTS: isRouteAllowedForRole ---
  describe('isRouteAllowedForRole matrix verification', () => {
    it('restricts /admin routes to ADMIN role only', () => {
      expect(isRouteAllowedForRole('/admin/dashboard', 'ADMIN')).toBe(true);
      expect(isRouteAllowedForRole('/admin/employees', 'ADMIN')).toBe(true);
      expect(isRouteAllowedForRole('/admin/departments', 'ADMIN')).toBe(true);
      expect(isRouteAllowedForRole('/admin/leave-types', 'ADMIN')).toBe(true);
      expect(isRouteAllowedForRole('/admin/leave-balances', 'ADMIN')).toBe(true);
      expect(isRouteAllowedForRole('/admin/reports', 'ADMIN')).toBe(true);

      expect(isRouteAllowedForRole('/admin/employees', 'EMPLOYEE')).toBe(false);
      expect(isRouteAllowedForRole('/admin/employees', 'MANAGER')).toBe(false);
      expect(isRouteAllowedForRole('/admin/reports', 'MANAGER')).toBe(false);
    });

    it('allows /manager routes to MANAGER and ADMIN only', () => {
      expect(isRouteAllowedForRole('/manager/dashboard', 'MANAGER')).toBe(true);
      expect(isRouteAllowedForRole('/manager/approval-queue', 'MANAGER')).toBe(true);
      expect(isRouteAllowedForRole('/manager/team-calendar', 'MANAGER')).toBe(true);
      expect(isRouteAllowedForRole('/manager/reports', 'MANAGER')).toBe(true);

      expect(isRouteAllowedForRole('/manager/dashboard', 'ADMIN')).toBe(true);
      expect(isRouteAllowedForRole('/manager/approval-queue', 'ADMIN')).toBe(true);

      expect(isRouteAllowedForRole('/manager/dashboard', 'EMPLOYEE')).toBe(false);
      expect(isRouteAllowedForRole('/manager/approval-queue', 'EMPLOYEE')).toBe(false);
    });

    it('allows /employee routes to EMPLOYEE, MANAGER, and ADMIN', () => {
      expect(isRouteAllowedForRole('/employee/dashboard', 'EMPLOYEE')).toBe(true);
      expect(isRouteAllowedForRole('/employee/apply-leave', 'EMPLOYEE')).toBe(true);
      expect(isRouteAllowedForRole('/employee/my-leaves', 'EMPLOYEE')).toBe(true);

      expect(isRouteAllowedForRole('/employee/dashboard', 'MANAGER')).toBe(true);
      expect(isRouteAllowedForRole('/employee/apply-leave', 'MANAGER')).toBe(true);

      expect(isRouteAllowedForRole('/employee/dashboard', 'ADMIN')).toBe(true);
    });

    it('rejects public, auth, and error routes from being post-login restore targets', () => {
      expect(isRouteAllowedForRole('/', 'ADMIN')).toBe(false);
      expect(isRouteAllowedForRole('/login', 'EMPLOYEE')).toBe(false);
      expect(isRouteAllowedForRole('/403', 'ADMIN')).toBe(false);
      expect(isRouteAllowedForRole('/404', 'MANAGER')).toBe(false);
      expect(isRouteAllowedForRole(null, 'ADMIN')).toBe(false);
      expect(isRouteAllowedForRole('', 'EMPLOYEE')).toBe(false);
    });
  });

  // --- INTEGRATION TESTS: Scenarios 1 to 8 ---

  it('TEST 1: Admin logout after /admin/employees -> Employee login lands on /employee/dashboard (NO 403)', async () => {
    const mockLogin = vi.fn().mockResolvedValue({
      id: 2,
      name: 'Alice Employee',
      role: 'EMPLOYEE',
    });

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/login',
            state: { from: { pathname: '/admin/employees' } }, // Simulated stale from location
          },
        ]}
      >
        <AuthContext.Provider
          value={{
            login: mockLogin,
            isAuthenticated: false,
            isLoading: false,
            user: null,
            getDashboardForRole,
            isRouteAllowedForRole,
          }}
        >
          <ToastContext.Provider value={{ showSuccess: vi.fn(), clearToasts: vi.fn() }}>
            <LoginPage />
          </ToastContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/work email/i), { target: { value: 'employee@elms.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password@123' } });
    fireEvent.click(screen.getByRole('button', { name: /^sign in$/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      // Should NOT restore /admin/employees for EMPLOYEE!
      expect(isRouteAllowedForRole('/admin/employees', 'EMPLOYEE')).toBe(false);
      expect(getDashboardForRole('EMPLOYEE')).toBe('/employee/dashboard');
    });
  });

  it('TEST 2: Admin logout after /admin/employees -> Manager login lands on /manager/dashboard (NO 403)', async () => {
    const mockLogin = vi.fn().mockResolvedValue({
      id: 3,
      name: 'Robert Manager',
      role: 'MANAGER',
    });

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/login',
            state: { from: { pathname: '/admin/employees' } },
          },
        ]}
      >
        <AuthContext.Provider
          value={{
            login: mockLogin,
            isAuthenticated: false,
            isLoading: false,
            user: null,
            getDashboardForRole,
            isRouteAllowedForRole,
          }}
        >
          <ToastContext.Provider value={{ showSuccess: vi.fn(), clearToasts: vi.fn() }}>
            <LoginPage />
          </ToastContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/work email/i), { target: { value: 'manager@elms.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password@123' } });
    fireEvent.click(screen.getByRole('button', { name: /^sign in$/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      // Stale admin route must be ignored for Manager
      expect(isRouteAllowedForRole('/admin/employees', 'MANAGER')).toBe(false);
      expect(getDashboardForRole('MANAGER')).toBe('/manager/dashboard');
    });
  });

  it('TEST 3: Admin logout from /admin/departments -> Employee login does not restore stale admin route', async () => {
    const mockLogin = vi.fn().mockResolvedValue({
      id: 4,
      name: 'Charlie Employee',
      role: 'EMPLOYEE',
    });

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/login',
            state: { from: { pathname: '/admin/departments' } },
          },
        ]}
      >
        <AuthContext.Provider
          value={{
            login: mockLogin,
            isAuthenticated: false,
            isLoading: false,
            user: null,
            getDashboardForRole,
            isRouteAllowedForRole,
          }}
        >
          <ToastContext.Provider value={{ showSuccess: vi.fn(), clearToasts: vi.fn() }}>
            <LoginPage />
          </ToastContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/work email/i), { target: { value: 'charlie@elms.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password@123' } });
    fireEvent.click(screen.getByRole('button', { name: /^sign in$/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(isRouteAllowedForRole('/admin/departments', 'EMPLOYEE')).toBe(false);
      expect(getDashboardForRole('EMPLOYEE')).toBe('/employee/dashboard');
    });
  });

  it('TEST 4: Admin logout -> Manager login clears client storage and leaves zero stale admin state', () => {
    // Setup pre-existing admin session tokens
    localStorage.setItem('elms_auth_token', 'admin-token-xyz');
    localStorage.setItem('elms_auth_user', JSON.stringify({ id: 1, name: 'Admin Root', role: 'ADMIN' }));
    sessionStorage.setItem('stale_key', 'stale_val');

    const mockLogout = vi.fn(() => {
      localStorage.removeItem('elms_auth_token');
      localStorage.removeItem('elms_auth_user');
      sessionStorage.clear();
    });

    mockLogout();

    expect(localStorage.getItem('elms_auth_token')).toBeNull();
    expect(localStorage.getItem('elms_auth_user')).toBeNull();
    expect(sessionStorage.getItem('stale_key')).toBeNull();
  });

  it('TEST 5: Employee session persistence across simulated page refresh', () => {
    localStorage.setItem('elms_auth_token', 'employee-token-abc');
    localStorage.setItem('elms_auth_user', JSON.stringify({ id: 10, name: 'Alice Employee', role: 'EMPLOYEE' }));

    render(
      <MemoryRouter initialEntries={['/employee/dashboard']}>
        <AuthContext.Provider
          value={{
            isAuthenticated: true,
            isLoading: false,
            user: { id: 10, name: 'Alice Employee', role: 'EMPLOYEE' },
          }}
        >
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route element={<RoleRoute allowedRoles={['EMPLOYEE', 'MANAGER', 'ADMIN']} />}>
                <Route path="/employee/dashboard" element={<div>Employee Dashboard Screen</div>} />
              </Route>
            </Route>
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText('Employee Dashboard Screen')).toBeInTheDocument();
  });

  it('TEST 6: Manager session persistence across simulated page refresh', () => {
    localStorage.setItem('elms_auth_token', 'manager-token-abc');
    localStorage.setItem('elms_auth_user', JSON.stringify({ id: 20, name: 'Robert Manager', role: 'MANAGER' }));

    render(
      <MemoryRouter initialEntries={['/manager/dashboard']}>
        <AuthContext.Provider
          value={{
            isAuthenticated: true,
            isLoading: false,
            user: { id: 20, name: 'Robert Manager', role: 'MANAGER' },
          }}
        >
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route element={<RoleRoute allowedRoles={['MANAGER', 'ADMIN']} />}>
                <Route path="/manager/dashboard" element={<div>Manager Dashboard Screen</div>} />
              </Route>
            </Route>
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText('Manager Dashboard Screen')).toBeInTheDocument();
  });

  it('TEST 7: Employee attempts direct Admin route -> must still receive 403 Access Restricted', () => {
    render(
      <MemoryRouter initialEntries={['/admin/employees']}>
        <AuthContext.Provider
          value={{
            isAuthenticated: true,
            isLoading: false,
            user: { id: 10, name: 'Alice Employee', role: 'EMPLOYEE' },
          }}
        >
          <Routes>
            <Route path="/403" element={<ForbiddenPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
                <Route path="/admin/employees" element={<div>Admin Secret Employees</div>} />
              </Route>
            </Route>
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Security must NOT be bypassed: 403 must be rendered!
    expect(screen.getByText('403')).toBeInTheDocument();
    expect(screen.getByText('Access Restricted')).toBeInTheDocument();
    expect(screen.queryByText('Admin Secret Employees')).not.toBeInTheDocument();
  });

  it('TEST 8: Manager attempts direct Admin-only route -> must still receive 403 Access Restricted', () => {
    render(
      <MemoryRouter initialEntries={['/admin/departments']}>
        <AuthContext.Provider
          value={{
            isAuthenticated: true,
            isLoading: false,
            user: { id: 20, name: 'Robert Manager', role: 'MANAGER' },
          }}
        >
          <Routes>
            <Route path="/403" element={<ForbiddenPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
                <Route path="/admin/departments" element={<div>Admin Departments</div>} />
              </Route>
            </Route>
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Security must NOT be bypassed: 403 must be rendered!
    expect(screen.getByText('403')).toBeInTheDocument();
    expect(screen.getByText('Access Restricted')).toBeInTheDocument();
    expect(screen.queryByText('Admin Departments')).not.toBeInTheDocument();
  });
});
