import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const getDashboardForRole = (role) => {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'MANAGER':
      return '/manager/dashboard';
    case 'EMPLOYEE':
    default:
      return '/employee/dashboard';
  }
};

/**
 * Validates whether a requested destination path is authorized for the specified role.
 * Prevents unauthorized or stale routes from being restored post-login.
 */
export const isRouteAllowedForRole = (pathname, role) => {
  if (!pathname || typeof pathname !== 'string') return false;
  if (!role || typeof role !== 'string') return false;

  // Clean pathname: strip query parameters and hash fragments
  const path = pathname.split('?')[0].split('#')[0];

  // Auth, public, and error routes cannot be post-login redirect destinations
  if (['/', '/login', '/403', '/404'].includes(path)) {
    return false;
  }

  // Admin routes: strictly ADMIN only
  if (path === '/admin' || path.startsWith('/admin/')) {
    return role === 'ADMIN';
  }

  // Manager routes: MANAGER and ADMIN only
  if (path === '/manager' || path.startsWith('/manager/')) {
    return role === 'MANAGER' || role === 'ADMIN';
  }

  // Employee routes: EMPLOYEE, MANAGER, and ADMIN
  if (path === '/employee' || path.startsWith('/employee/')) {
    return role === 'EMPLOYEE' || role === 'MANAGER' || role === 'ADMIN';
  }

  return false;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('elms_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('elms_auth_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('elms_auth_token'));
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      if (token) {
        await authService.logout().catch(() => {});
      }
    } finally {
      localStorage.removeItem('elms_auth_token');
      localStorage.removeItem('elms_auth_user');
      try {
        sessionStorage.clear();
      } catch {
        // Handle environments where sessionStorage may be restricted
      }
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [token]);

  // Central listener for session expiry dispatched by Axios interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('elms:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('elms:unauthorized', handleUnauthorized);
  }, [logout]);

  // Initial authentication verification on app load
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem('elms_auth_token');
      if (storedToken) {
        try {
          const res = await authService.getCurrentUser();
          if (res?.data) {
            setUser(res.data);
            setIsAuthenticated(true);
            localStorage.setItem('elms_auth_user', JSON.stringify(res.data));
          } else {
            await logout();
          }
        } catch (err) {
          console.warn('Session verification failed:', err.message);
          await logout();
        }
      }
      setIsLoading(false);
    };

    verifySession();
  }, [logout]);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res?.data?.token) {
      const authToken = res.data.token;
      const authUser = res.data.user;

      localStorage.setItem('elms_auth_token', authToken);
      localStorage.setItem('elms_auth_user', JSON.stringify(authUser));

      setToken(authToken);
      setUser(authUser);
      setIsAuthenticated(true);

      return authUser;
    } else {
      throw new Error('Invalid response from server');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
        getDashboardForRole,
        isRouteAllowedForRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
