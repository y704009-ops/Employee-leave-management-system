import React, { useState, useEffect, useCallback } from 'react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import StatusBadge from '../../components/common/StatusBadge';
import {
  Building2,
  Plus,
  Edit2,
  Users,
  UserCheck,
  RefreshCw,
  CheckCircle,
  X,
  Search,
} from 'lucide-react';
import { departmentService } from '../../services/departmentService';
import { employeeService } from '../../services/employeeService';

const DepartmentManagementPage = () => {
  const [departments, setDepartments] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewEmployeesOpen, setIsViewEmployeesOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  const [selectedDept, setSelectedDept] = useState(null);
  const [deptEmployees, setDeptEmployees] = useState([]);
  const [assignSelectedIds, setAssignSelectedIds] = useState([]);
  const [assignSearch, setAssignSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formErrors, setFormErrors] = useState({});

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [deptRes, empRes] = await Promise.all([
        departmentService.getAll(),
        employeeService.getAll(),
      ]);
      setDepartments(deptRes.data || []);
      setAllEmployees(empRes.data || []);
    } catch (err) {
      setError(err?.response?.data?.error?.message || err.message || 'Failed to load department data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenCreate = () => {
    setFormData({ name: '', description: '' });
    setFormErrors({});
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (dept) => {
    setSelectedDept(dept);
    setFormData({ name: dept.name, description: dept.description || '' });
    setFormErrors({});
    setIsEditOpen(true);
  };

  const handleOpenViewEmployees = async (dept) => {
    setSelectedDept(dept);
    try {
      setLoading(true);
      const res = await departmentService.getEmployees(dept.id);
      setDeptEmployees(res.data || []);
      setIsViewEmployeesOpen(true);
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Failed to load department members.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAssign = async (dept) => {
    setSelectedDept(dept);
    try {
      setLoading(true);
      const res = await departmentService.getEmployees(dept.id);
      const currentMemberIds = (res.data || []).map((e) => e.id);
      setAssignSelectedIds(currentMemberIds);
      setAssignSearch('');
      setIsAssignOpen(true);
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Failed to prepare employee assignment.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name?.trim()) errs.name = 'Department name is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setError(null);
      await departmentService.create({
        name: formData.name.trim(),
        description: formData.description.trim(),
      });
      setIsCreateOpen(false);
      setFeedback('Department created successfully.');
      fetchData();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Failed to create department.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setError(null);
      await departmentService.update(selectedDept.id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
      });
      setIsEditOpen(false);
      setFeedback('Department updated successfully.');
      fetchData();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Failed to update department.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleAssign = (empId) => {
    setAssignSelectedIds((prev) =>
      prev.includes(empId) ? prev.filter((id) => id !== empId) : [...prev, empId]
    );
  };

  const handleAssignSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      await departmentService.assignEmployees(selectedDept.id, assignSelectedIds);
      setIsAssignOpen(false);
      setFeedback(`Assigned ${assignSelectedIds.length} employee(s) to ${selectedDept.name}.`);
      fetchData();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Failed to assign employees.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAssignEmployees = allEmployees.filter(
    (e) =>
      e.name.toLowerCase().includes(assignSearch.toLowerCase()) ||
      e.email.toLowerCase().includes(assignSearch.toLowerCase())
  );

  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      render: (row) => <span className="font-semibold text-slate-400 font-mono text-xs">#{row.id}</span>,
    },
    {
      header: 'Department Name',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-brand-50 text-brand-600 rounded-lg">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-slate-900">{row.name}</span>
        </div>
      ),
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (row) => (
        <span className="text-xs text-slate-600">
          {row.description || <span className="text-slate-400 italic">No description provided</span>}
        </span>
      ),
    },
    {
      header: 'Employees',
      key: 'members',
      render: (row) => {
        const count = allEmployees.filter((e) => e.departmentId === row.id).length;
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
            <Users className="w-3 h-3 mr-1 text-slate-500" />
            {count} {count === 1 ? 'member' : 'members'}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handleOpenViewEmployees(row)}
            title="View Department Employees"
            className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleOpenAssign(row)}
            title="Assign Employees"
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            title="Edit Department"
            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
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
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Department Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Organize company business units, update departmental titles, and assign employee memberships.
          </p>
        </div>
        <div className="flex items-center space-x-2.5">
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={fetchData}>
            Refresh
          </Button>
          <Button size="sm" icon={Plus} onClick={handleOpenCreate}>
            Add Department
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

      {/* Departments Table */}
      <Card>
        {loading && departments.length === 0 ? (
          <div className="py-12 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <Table
            columns={columns}
            data={departments}
            emptyTitle="No departments found"
            emptyDescription="Create a new department to group employees by business unit."
          />
        )}
      </Card>

      {/* CREATE DEPARTMENT MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Department"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCreateOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleCreateSubmit} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Department'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Department Name"
            name="name"
            required
            placeholder="e.g. Finance & Accounting"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
          />

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="e.g. Responsible for budget planning and financial reporting"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-sm rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 placeholder:text-slate-400"
            />
          </div>
        </form>
      </Modal>

      {/* EDIT DEPARTMENT MODAL */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={`Edit Department: ${selectedDept?.name || ''}`}
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
            label="Department Name"
            name="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
          />

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-sm rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 placeholder:text-slate-400"
            />
          </div>
        </form>
      </Modal>

      {/* VIEW DEPARTMENT EMPLOYEES MODAL */}
      <Modal
        isOpen={isViewEmployeesOpen}
        onClose={() => setIsViewEmployeesOpen(false)}
        title={`Department Members: ${selectedDept?.name || ''}`}
        footer={
          <Button variant="secondary" onClick={() => setIsViewEmployeesOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="space-y-3">
          {deptEmployees.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">
              No employees are currently assigned to this department.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
              {deptEmployees.map((emp) => (
                <div key={emp.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-100/80 text-brand-700 font-bold text-xs flex items-center justify-center uppercase">
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{emp.name}</div>
                      <div className="text-xs text-slate-400 font-mono">{emp.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-slate-100 text-slate-700">
                      {emp.role}
                    </span>
                    <StatusBadge status={emp.active ? 'ACTIVE' : 'INACTIVE'} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* ASSIGN EMPLOYEES MODAL */}
      <Modal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        title={`Assign Employees to ${selectedDept?.name || ''}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAssignOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleAssignSubmit} disabled={submitting}>
              {submitting ? 'Assigning...' : `Confirm (${assignSelectedIds.length} Selected)`}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            placeholder="Search employees to assign..."
            icon={Search}
            value={assignSearch}
            onChange={(e) => setAssignSearch(e.target.value)}
          />

          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {filteredAssignEmployees.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No matching employees found.</p>
            ) : (
              filteredAssignEmployees.map((emp) => {
                const isChecked = assignSelectedIds.includes(emp.id);
                return (
                  <label
                    key={emp.id}
                    className="flex items-center justify-between p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleAssign(emp.id)}
                        className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4 border-slate-300"
                      />
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{emp.name}</div>
                        <div className="text-xs text-slate-400 font-mono">
                          {emp.email} • {emp.departmentName || 'No Dept'}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{emp.role}</span>
                  </label>
                );
              })
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DepartmentManagementPage;
