import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout
import AppLayout from '../layouts/AppLayout';

// Auth Protection & Redirection
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

// Auth & Public Pages
import LoginPage from '../pages/auth/LoginPage';
const LandingPage = React.lazy(() => import('../pages/public/LandingPage'));

// Employee Pages
import EmployeeDashboardPage from '../pages/employee/EmployeeDashboardPage';
import ApplyLeavePage from '../pages/employee/ApplyLeavePage';
import MyLeavesPage from '../pages/employee/MyLeavesPage';
import LeaveDetailsPage from '../pages/employee/LeaveDetailsPage';
import ProfilePage from '../pages/employee/ProfilePage';

// Manager Pages
import ManagerDashboardPage from '../pages/manager/ManagerDashboardPage';
import ApprovalQueuePage from '../pages/manager/ApprovalQueuePage';
import TeamCalendarPage from '../pages/manager/TeamCalendarPage';
import TeamHistoryPage from '../pages/manager/TeamHistoryPage';

// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import EmployeeManagementPage from '../pages/admin/EmployeeManagementPage';
import DepartmentManagementPage from '../pages/admin/DepartmentManagementPage';
import LeaveTypeManagementPage from '../pages/admin/LeaveTypeManagementPage';
import BalanceManagementPage from '../pages/admin/BalanceManagementPage';
import ReportsPage from '../pages/admin/ReportsPage';

// Common Pages
import ForbiddenPage from '../pages/common/ForbiddenPage';
import NotFoundPage from '../pages/common/NotFoundPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Landing & Login Routes */}
      <Route
        path="/"
        element={
          <React.Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
            <LandingPage />
          </React.Suspense>
        }
      />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes inside AppLayout Shell */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>

          {/* Employee Routes (accessible by EMPLOYEE, MANAGER, ADMIN) */}
          <Route element={<RoleRoute allowedRoles={['EMPLOYEE', 'MANAGER', 'ADMIN']} />}>
            <Route path="/employee/dashboard" element={<EmployeeDashboardPage />} />
            <Route path="/employee/apply-leave" element={<ApplyLeavePage />} />
            <Route path="/employee/my-leaves" element={<MyLeavesPage />} />
            <Route path="/employee/leave/:id" element={<LeaveDetailsPage />} />
            <Route path="/employee/profile" element={<ProfilePage />} />
          </Route>

          {/* Manager Routes (accessible by MANAGER, ADMIN) */}
          <Route element={<RoleRoute allowedRoles={['MANAGER', 'ADMIN']} />}>
            <Route path="/manager/dashboard" element={<ManagerDashboardPage />} />
            <Route path="/manager/approval-queue" element={<ApprovalQueuePage />} />
            <Route path="/manager/team-calendar" element={<TeamCalendarPage />} />
            <Route path="/manager/team-history" element={<TeamHistoryPage />} />
            <Route path="/manager/reports" element={<ReportsPage />} />
          </Route>

          {/* Admin Routes (accessible by ADMIN only) */}
          <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/employees" element={<EmployeeManagementPage />} />
            <Route path="/admin/departments" element={<DepartmentManagementPage />} />
            <Route path="/admin/leave-types" element={<LeaveTypeManagementPage />} />
            <Route path="/admin/leave-balances" element={<BalanceManagementPage />} />
            <Route path="/admin/reports" element={<ReportsPage />} />
          </Route>

          {/* Status & Error Pages */}
          <Route path="/403" element={<ForbiddenPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
