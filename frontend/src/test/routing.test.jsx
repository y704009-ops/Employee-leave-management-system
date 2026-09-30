import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../routes/ProtectedRoute';
import RoleRoute from '../routes/RoleRoute';
import { AuthContext } from '../context/AuthContext';

describe('Route Protection and Role-Based Access Control Tests', () => {
  const renderWithAuth = (authValues, initialPath = '/protected') => {
    return render(
      <AuthContext.Provider value={authValues}>
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route path="/login" element={<div>Login Page Screen</div>} />
            <Route path="/403" element={<div>403 Forbidden Screen</div>} />
            
            {/* Protected Route test */}
            <Route element={<ProtectedRoute />}>
              <Route path="/protected" element={<div>Protected Secret Content</div>} />
            </Route>

            {/* Role-based Route tests */}
            <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin/settings" element={<div>Admin Only Panel</div>} />
            </Route>

            <Route element={<RoleRoute allowedRoles={['MANAGER', 'ADMIN']} />}>
              <Route path="/manager/queue" element={<div>Manager Approval Queue</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  it('renders loading state when authentication is being verified', () => {
    renderWithAuth({ isAuthenticated: false, isLoading: true, user: null }, '/protected');
    expect(screen.getByText('Authenticating session...')).toBeInTheDocument();
  });

  it('redirects unauthenticated user to /login', () => {
    renderWithAuth({ isAuthenticated: false, isLoading: false, user: null }, '/protected');
    expect(screen.getByText('Login Page Screen')).toBeInTheDocument();
    expect(screen.queryByText('Protected Secret Content')).not.toBeInTheDocument();
  });

  it('allows authenticated user into protected route', () => {
    renderWithAuth(
      { isAuthenticated: true, isLoading: false, user: { name: 'Bob', role: 'EMPLOYEE' } },
      '/protected'
    );
    expect(screen.getByText('Protected Secret Content')).toBeInTheDocument();
  });

  it('redirects non-admin role accessing admin route to /403', () => {
    renderWithAuth(
      { isAuthenticated: true, isLoading: false, user: { name: 'Alice', role: 'EMPLOYEE' } },
      '/admin/settings'
    );
    expect(screen.getByText('403 Forbidden Screen')).toBeInTheDocument();
    expect(screen.queryByText('Admin Only Panel')).not.toBeInTheDocument();
  });

  it('allows ADMIN role into /admin/settings', () => {
    renderWithAuth(
      { isAuthenticated: true, isLoading: false, user: { name: 'Super Admin', role: 'ADMIN' } },
      '/admin/settings'
    );
    expect(screen.getByText('Admin Only Panel')).toBeInTheDocument();
  });

  it('allows MANAGER and ADMIN roles into /manager/queue', () => {
    const { unmount } = renderWithAuth(
      { isAuthenticated: true, isLoading: false, user: { name: 'Lead Dev', role: 'MANAGER' } },
      '/manager/queue'
    );
    expect(screen.getByText('Manager Approval Queue')).toBeInTheDocument();
    unmount();

    renderWithAuth(
      { isAuthenticated: true, isLoading: false, user: { name: 'Admin Root', role: 'ADMIN' } },
      '/manager/queue'
    );
    expect(screen.getByText('Manager Approval Queue')).toBeInTheDocument();
  });
});
