import React, { useState, useEffect, useCallback } from 'react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import StatusBadge from '../../components/common/StatusBadge';
import {
  Sliders,
  Plus,
  Edit2,
  Power,
  RefreshCw,
  CheckCircle,
  X,
  FileCheck,
  Calendar,
} from 'lucide-react';
import { leaveTypeService } from '../../services/leaveTypeService';

const LeaveTypeManagementPage = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    annualAllocation: 14,
    requiresAttachment: false,
    active: true,
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await leaveTypeService.getAll();
      setLeaveTypes(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.error?.message || err.message || 'Failed to load leave types.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      description: '',
      annualAllocation: 14,
      requiresAttachment: false,
      active: true,
    });
    setFormErrors({});
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (type) => {
    setSelectedType(type);
    setFormData({
      name: type.name,
      description: type.description || '',
      annualAllocation: type.annualAllocation,
      requiresAttachment: type.requiresAttachment,
      active: type.active,
    });
    setFormErrors({});
    setIsEditOpen(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name?.trim()) errs.name = 'Leave type name is required';
    if (!formData.annualAllocation || Number(formData.annualAllocation) < 1) {
      errs.annualAllocation = 'Annual allocation must be at least 1 day';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setError(null);
      await leaveTypeService.create({
        name: formData.name.trim(),
        description: formData.description.trim(),
        annualAllocation: Number(formData.annualAllocation),
        requiresAttachment: formData.requiresAttachment,
        active: formData.active,
      });
      setIsCreateOpen(false);
      setFeedback('Leave type policy created successfully.');
      fetchData();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Failed to create leave type.');
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
      await leaveTypeService.update(selectedType.id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        annualAllocation: Number(formData.annualAllocation),
        requiresAttachment: formData.requiresAttachment,
        active: formData.active,
      });
      setIsEditOpen(false);
      setFeedback('Leave type policy updated successfully.');
      fetchData();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Failed to update leave type.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenToggleStatus = (type) => {
    setStatusTarget(type);
  };

  const handleConfirmToggleStatus = async () => {
    if (!statusTarget) return;
    const nextStatus = !statusTarget.active;
    try {
      setStatusUpdating(true);
      setError(null);
      await leaveTypeService.updateStatus(statusTarget.id, nextStatus);
      setFeedback(`Leave type ${statusTarget.name} is now ${nextStatus ? 'ACTIVE' : 'INACTIVE'}.`);
      setStatusTarget(null);
      fetchData();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Failed to update leave type status.');
    } finally {
      setStatusUpdating(false);
    }
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      render: (row) => <span className="font-semibold text-slate-400 font-mono text-xs">#{row.id}</span>,
    },
    {
      header: 'Leave Type Name',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-brand-50 text-brand-600 rounded-lg">
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-slate-900">{row.name}</span>
        </div>
      ),
    },
    {
      header: 'Annual Allocation',
      accessor: 'annualAllocation',
      render: (row) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-brand-50 text-brand-800 border border-brand-200/60 font-mono">
          <Calendar className="w-3 h-3 mr-1 text-brand-600" />
          {row.annualAllocation} Days / Year
        </span>
      ),
    },
    {
      header: 'Attachment Required',
      accessor: 'requiresAttachment',
      render: (row) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${
            row.requiresAttachment
              ? 'bg-amber-50 text-amber-800 border-amber-200/80'
              : 'bg-slate-100 text-slate-600 border-slate-200/80'
          }`}
        >
          {row.requiresAttachment && <FileCheck className="w-3 h-3 mr-1 text-amber-600" />}
          {row.requiresAttachment ? 'Required' : 'Optional'}
        </span>
      ),
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (row) => (
        <span className="text-xs text-slate-600 max-w-xs block truncate">
          {row.description || <span className="text-slate-400 italic">No description</span>}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'active',
      render: (row) => <StatusBadge status={row.active ? 'ACTIVE' : 'INACTIVE'} />,
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handleOpenEdit(row)}
            title="Edit Leave Policy"
            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleOpenToggleStatus(row)}
            title={row.active ? 'Deactivate Policy' : 'Activate Policy'}
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
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Leave Type Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Define leave categories, configure yearly day allowances, and enforce supporting document requirements.
          </p>
        </div>
        <div className="flex items-center space-x-2.5">
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={fetchData}>
            Refresh
          </Button>
          <Button size="sm" icon={Plus} onClick={handleOpenCreate}>
            Create Leave Type
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

      {/* Leave Types Table */}
      <Card>
        {loading && leaveTypes.length === 0 ? (
          <div className="py-12 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <Table
            columns={columns}
            data={leaveTypes}
            emptyTitle="No leave types found"
            emptyDescription="Configure your first leave category to establish organizational leave policies."
          />
        )}
      </Card>

      {/* CREATE LEAVE TYPE MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Leave Policy"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCreateOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleCreateSubmit} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Policy'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Leave Type Name"
            name="name"
            required
            placeholder="e.g. Parental Leave, Sabbatical"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
          />

          <Input
            label="Annual Allocation (Days)"
            name="annualAllocation"
            type="number"
            min="1"
            required
            value={formData.annualAllocation}
            onChange={(e) => setFormData({ ...formData, annualAllocation: e.target.value })}
            error={formErrors.annualAllocation}
            helperText="Standard annual quota allocated to each employee."
          />

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Explain policy guidelines, eligibility, and notice conditions"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-sm rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.requiresAttachment}
                onChange={(e) => setFormData({ ...formData, requiresAttachment: e.target.checked })}
                className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4 border-slate-300"
              />
              <span className="text-sm font-medium text-slate-700">
                Requires Supporting Attachment (e.g. Medical Certificate)
              </span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4 border-slate-300"
              />
              <span className="text-sm font-medium text-slate-700">
                Active Policy (Available for employee applications)
              </span>
            </label>
          </div>
        </form>
      </Modal>

      {/* EDIT LEAVE TYPE MODAL */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={`Edit Leave Policy: ${selectedType?.name || ''}`}
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
            label="Leave Type Name"
            name="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
          />

          <Input
            label="Annual Allocation (Days)"
            name="annualAllocation"
            type="number"
            min="1"
            required
            value={formData.annualAllocation}
            onChange={(e) => setFormData({ ...formData, annualAllocation: e.target.value })}
            error={formErrors.annualAllocation}
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

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.requiresAttachment}
                onChange={(e) => setFormData({ ...formData, requiresAttachment: e.target.checked })}
                className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4 border-slate-300"
              />
              <span className="text-sm font-medium text-slate-700">
                Requires Supporting Attachment
              </span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4 border-slate-300"
              />
              <span className="text-sm font-medium text-slate-700">
                Active Policy
              </span>
            </label>
          </div>
        </form>
      </Modal>

      {/* Leave Type Status Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!statusTarget}
        onClose={() => setStatusTarget(null)}
        onConfirm={handleConfirmToggleStatus}
        loading={statusUpdating}
        title={statusTarget?.active ? 'Deactivate Leave Policy' : 'Activate Leave Policy'}
        message={
          statusTarget?.active
            ? `Are you sure you want to deactivate ${statusTarget.name}? Employees will no longer be able to select this leave category when submitting new applications.`
            : `Are you sure you want to activate ${statusTarget?.name}? Employees will be able to apply for this leave category immediately.`
        }
        confirmText={statusTarget?.active ? 'Deactivate Policy' : 'Activate Policy'}
        variant={statusTarget?.active ? 'danger' : 'primary'}
      />
    </div>
  );
};

export default LeaveTypeManagementPage;
