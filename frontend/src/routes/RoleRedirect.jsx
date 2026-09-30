import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, getDashboardForRole } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const RoleRedirect = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner text="Redirecting..." size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getDashboardForRole(user?.role)} replace />;
};

export default RoleRedirect;
