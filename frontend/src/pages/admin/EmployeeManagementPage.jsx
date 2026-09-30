import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import {
  UserPlus,
  Search,
  Edit2,
  Eye,
  Power,
  RefreshCw,
  CheckCircle,
  X,
  Shield,
  Briefcase,
  User,
} from 'lucide-react';
import { employeeService } from '../../services/employeeService';
import { departmentService } from '../../services/departmentService';
import { ROLES } from '../../utils/constants';

const roleBadgeColor = {
  ADMIN: 'bg-purple-50 text-purple-700 border-purple-200/80',
  MANAGER: 'bg-blue-50 text-blue-700 border-blue-200/80',
  EMPLOYEE: 'bg-slate-100 text-slate-700 border-slate-200/80',
};

const EmployeeManagementPage = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ROLES.EMPLOYEE,
    departmentId: '',
    managerId: '',
    active: true,
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [empRes, deptRes] = await Promise.all([
        employeeService.getAll({
          query: searchQuery || undefined,
          departmentId: selectedDept || undefined,
          role: selectedRole || undefined,
          active: selectedStatus !== '' ? selectedStatus === 'true' : undefined,
        }),
        departmentService.getAll(),
      ]);
      setEmployees(empRes.data || []);
      setDepartments(deptRes.data || []);
    } catch (err) {
      setError(err?.response?.data?.error?.message || err.message || 'Failed to load employee data.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedDept, selectedRole, selectedStatus]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Potential managers for dropdown
  const potentialManagers = useMemo(() => {
    return employees.filter(
      (e) => (e.role === ROLES.MANAGER || e.role === ROLES.ADMIN) && e.active
    );
  }, [employees]);

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: ROLES.EMPLOYEE,
      departmentId: '',
      managerId: '',
      active: true,
    });
    setFormErrors({});
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (emp) => {
    setSelectedEmployee(emp);
    setFormData({
      name: emp.name || '',
      email: emp.email || '',
      password: '',
      role: emp.role || ROLES.EMPLOYEE,
      departmentId: emp.departmentId ? String(emp.departmentId) : '',
      managerId: emp.managerId ? String(emp.managerId) : '',
      active: emp.active,
    });
    setFormErrors({});
    setIsEditOpen(true);
  };

  const handleOpenView = (emp) => {
    setSelectedEmployee(emp);
    setIsViewOpen(true);
  };

  const validateForm = (isCreate = true) => {
    const errs = {};
    if (!formData.name?.trim()) errs.name = 'Full name is required';
    if (!formData.email?.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Valid email address is required';
    }
    if (isCreate) {
      if (!formData.password) {
        errs.password = 'Password is required';
      } else if (formData.password.length < 6) {
        errs.password = 'Password must be at least 6 characters';
      }
    }
    if (!formData.role) errs.role = 'Role selection is required';

    if (!isCreate && selectedEmployee && formData.managerId && String(selectedEmployee.id) === String(formData.managerId)) {
      errs.managerId = 'An employee cannot be their own manager';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(true)) return;

    try {
      setSubmitting(true);
      setError(null);
      await employeeService.create({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        departmentId: formData.departmentId ? Number(formData.departmentId) : null,
        managerId: formData.managerId ? Number(formData.managerId) : null,
      });
      setIsCreateOpen(false);
      setFeedback('Employee created successfully with initialized leave quotas.');
      fetchData();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Failed to create employee.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(false)) return;

    try {
      setSubmitting(true);
      setError(null);
      await employeeService.update(selectedEmployee.id, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        departmentId: formData.departmentId ? Number(formData.departmentId) : null,
        managerId: formData.managerId ? Number(formData.managerId) : null,
        active: formData.active,
      });
      setIsEditOpen(false);
      setFeedback('Employee record updated successfully.');
      fetchData();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Failed to update employee.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenToggleStatus = (emp) => {
    setStatusTarget(emp);
  };

  const handleConfirmToggleStatus = async () => {
    if (!statusTarget) return;
    const nextStatus = !statusTarget.active;
    try {
      setStatusUpdating(true);
      setError(null);
      await employeeService.updateStatus(statusTarget.id, nextStatus);
      setFeedback(`Employee ${statusTarget.name} is now ${nextStatus ? 'ACTIVE' : 'INACTIVE'}.`);
      setStatusTarget(null);
      fetchData();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Failed to update employee status.');
    } finally {
      setStatusUpdating(false);
    }
  };

  const columns = [
    {
      header: 'Employee',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-brand-100/80 text-brand-700 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
            {row.name ? row.name.charAt(0) : 'U'}
          </div>
          <div>
            <div className="font-semibold text-slate-900">{row.name}</div>
            <div className="text-xs text-slate-400 font-mono">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessor: 'role',
      render: (row) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${
            roleBadgeColor[row.role] || 'bg-slate-100 text-slate-800'
          }`}
        >
          {row.role === 'ADMIN' && <Shield className="w-3 h-3 mr-1" />}
          {row.role === 'MANAGER' && <Briefcase className="w-3 h-3 mr-1" />}
          {row.role === 'EMPLOYEE' && <User className="w-3 h-3 mr-1" />}
          {row.role}
        </span>
      ),
    },
    {
      header: 'Department',
      accessor: 'departmentName',
      render: (row) => (
        <span className="text-xs text-slate-700 font-medium">
          {row.departmentName || <span className="text-slate-400 italic">Unassigned</span>}
        </span>
      ),
    },
    {
      header: 'Reports To',
      accessor: 'managerName',
      render: (row) => (
        <span className="text-xs text-slate-600">
          {row.managerName || <span className="text-slate-400 italic">None</span>}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'active',
      render: (row) => (
        <StatusBadge status={row.active ? 'ACTIVE' : 'INACTIVE'} />
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handleOpenView(row)}
            title="View Details"
            className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            title="Edit Employee"
            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleOpenToggleStatus(row)}
            title={row.active ? 'Deactivate Employee' : 'Reactivate Employee'}
            className={`p-1.5 rounded-lg transition-colors ${
              row.active
                ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Employee Directory & Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Create employees, assign departments and reporting managers, and regulate access roles.
          </p>
        </div>
        <div className="flex items-center space-x-2.5">
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={fetchData}>
            Refresh
          </Button>
          <Button size="sm" icon={UserPlus} onClick={handleOpenCreate}>
            Add Employee
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-emerald-600 hover:text-emerald-800 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {/* Search & Filters */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Search by name or email..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Select
            placeholder="All Departments"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            options={[
              { value: '', label: 'All Departments' },
              ...departments.map((d) => ({ value: String(d.id), label: d.name })),
            ]}
          />

          <Select
            placeholder="All Roles"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            options={[
              { value: '', label: 'All Roles' },
              { value: ROLES.ADMIN, label: 'Admin' },
              { value: ROLES.MANAGER, label: 'Manager' },
              { value: ROLES.EMPLOYEE, label: 'Employee' },
            ]}
          />

          <Select
            placeholder="All Statuses"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'true', label: 'Active Only' },
              { value: 'false', label: 'Inactive Only' },
            ]}
          />
        </div>
      </Card>

      {/* Employees Table */}
      <Card>
        {loading ? (
          <div className="py-12 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <Table
            columns={columns}
            data={employees}
            emptyTitle="No employees found"
            emptyDescription="Try adjusting your filters or click 'Add Employee' to register a new team member."
          />
        )}
      </Card>

      {/* CREATE EMPLOYEE MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Employee"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCreateOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleCreateSubmit} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Employee'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            required
            placeholder="e.g. Sarah Connor"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            required
            placeholder="e.g. sarah.c@company.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={formErrors.email}
          />

          <Input
            label="Initial Password"
            name="password"
            type="password"
            required
            placeholder="Minimum 6 characters"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={formErrors.password}
            helperText="The employee can use this credential to log in initially."
          />

          <Select
            label="Role"
            name="role"
            required
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            options={[
              { value: ROLES.EMPLOYEE, label: 'Employee' },
              { value: ROLES.MANAGER, label: 'Manager' },
              { value: ROLES.ADMIN, label: 'System Admin' },
            ]}
            error={formErrors.role}
          />

          <Select
            label="Department"
            name="departmentId"
            value={formData.departmentId}
            onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
            placeholder="Assign Department (Optional)"
            options={[
              { value: '', label: 'None' },
              ...departments.map((d) => ({ value: String(d.id), label: d.name })),
            ]}
          />

          <Select
            label="Reporting Manager"
            name="managerId"
            value={formData.managerId}
            onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
            placeholder="Assign Manager (Optional)"
            options={[
              { value: '', label: 'None' },
              ...potentialManagers.map((m) => ({
                value: String(m.id),
                label: `${m.name} (${m.role})`,
              })),
            ]}
          />
        </form>
      </Modal>

      {/* EDIT EMPLOYEE MODAL */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={`Edit Employee: ${selectedEmployee?.name || ''}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsEditOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} disabled={submitting}>
              {submitting ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={formErrors.email}
          />

          <Select
            label="Role"
            name="role"
            required
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            options={[
              { value: ROLES.EMPLOYEE, label: 'Employee' },
              { value: ROLES.MANAGER, label: 'Manager' },
              { value: ROLES.ADMIN, label: 'System Admin' },
            ]}
            error={formErrors.role}
          />

          <Select
            label="Department"
            name="departmentId"
            value={formData.departmentId}
            onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
            placeholder="Assign Department (Optional)"
            options={[
              { value: '', label: 'None' },
              ...departments.map((d) => ({ value: String(d.id), label: d.name })),
            ]}
          />

          <Select
            label="Reporting Manager"
            name="managerId"
            value={formData.managerId}
            onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
            placeholder="Assign Manager (Optional)"
            options={[
              { value: '', label: 'None' },
              ...potentialManagers
                .filter((m) => String(m.id) !== String(selectedEmployee?.id))
                .map((m) => ({
                  value: String(m.id),
                  label: `${m.name} (${m.role})`,
                })),
            ]}
            error={formErrors.managerId}
          />

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="activeStatus"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4 border-slate-300"
            />
            <label htmlFor="activeStatus" className="text-sm font-medium text-slate-700">
              Account Active (enabled for login)
            </label>
          </div>
        </form>
      </Modal>

      {/* VIEW EMPLOYEE MODAL */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Employee Details"
        footer={
          <Button variant="secondary" onClick={() => setIsViewOpen(false)}>
            Close
          </Button>
        }
      >
        {selectedEmployee && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-lg uppercase shadow-xs flex-shrink-0">
                {selectedEmployee.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">{selectedEmployee.name}</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedEmployee.email}</p>
                <div className="mt-1.5 flex items-center space-x-2">
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${roleBadgeColor[selectedEmployee.role] || ''}`}>
                    {selectedEmployee.role}
                  </span>
                  <StatusBadge status={selectedEmployee.active ? 'ACTIVE' : 'INACTIVE'} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 block font-medium uppercase tracking-wider">Department</span>
                <span className="text-slate-800 font-semibold text-xs mt-0.5 block">{selectedEmployee.departmentName || 'Unassigned'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 block font-medium uppercase tracking-wider">Reports To</span>
                <span className="text-slate-800 font-semibold text-xs mt-0.5 block">{selectedEmployee.managerName || 'None'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 block font-medium uppercase tracking-wider">Employee ID</span>
                <span className="text-slate-800 font-semibold text-xs font-mono mt-0.5 block">EMP-{selectedEmployee.id}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 block font-medium uppercase tracking-wider">Member Since</span>
                <span className="text-slate-800 font-semibold text-xs font-mono mt-0.5 block">
                  {selectedEmployee.createdAt ? new Date(selectedEmployee.createdAt).toLocaleDateString() : 'Active'}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Status Change Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!statusTarget}
        onClose={() => setStatusTarget(null)}
        onConfirm={handleConfirmToggleStatus}
        loading={statusUpdating}
        title={statusTarget?.active ? 'Deactivate Employee Account' : 'Reactivate Employee Account'}
        message={
          statusTarget?.active
            ? `Are you sure you want to deactivate ${statusTarget.name}? Deactivated users will not be able to log in or apply for leaves.`
            : `Are you sure you want to reactivate ${statusTarget?.name}? The employee will regain account access immediately.`
        }
        confirmText={statusTarget?.active ? 'Deactivate Account' : 'Reactivate Account'}
        variant={statusTarget?.active ? 'danger' : 'primary'}
      />
    </div>
  );
};

export default EmployeeManagementPage;
