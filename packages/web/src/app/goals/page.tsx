'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { api } from '@/lib/api';
import { LIFE_DOMAIN_LABELS, TIMELINE_LABELS } from '@blagotron/shared';
import Link from 'next/link';

export default function GoalsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [filter, setFilter] = useState({ status: 'active', domain: '' });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: goalsData, isLoading } = useQuery({
    queryKey: ['goals', filter],
    queryFn: () => api.getGoals(filter),
    enabled: isAuthenticated,
  });

  const goals = goalsData?.data || [];

  if (authLoading || (!authLoading && !isAuthenticated)) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container-custom">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="text-xl font-bold text-primary-600">
              Blagotron
            </Link>
            <Link href="/dashboard" className="text-sm text-gray-700 hover:text-primary-600">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="container-custom py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Goals</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            + New Goal
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="abandoned">Abandoned</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Domain
              </label>
              <select
                value={filter.domain}
                onChange={(e) => setFilter({ ...filter, domain: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Domains</option>
                {Object.entries(LIFE_DOMAIN_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <CreateGoalForm
            onClose={() => setShowCreateForm(false)}
            onSuccess={() => {
              setShowCreateForm(false);
              queryClient.invalidateQueries({ queryKey: ['goals'] });
            }}
          />
        )}

        {/* Goals List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading goals...</div>
          </div>
        ) : goals.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-500 mb-4">
              {filter.status || filter.domain
                ? 'No goals match your filters'
                : 'No goals yet. Create your first goal to get started!'}
            </div>
            {!filter.status && !filter.domain && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create First Goal
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal: any) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onUpdate={() => queryClient.invalidateQueries({ queryKey: ['goals'] })}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function CreateGoalForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    domain: 'career',
    timeline: 'medium',
    targetDate: '',
  });
  const [error, setError] = useState('');

  const createMutation = useMutation({
    mutationFn: (data: any) => api.createGoal(data),
    onSuccess: () => {
      onSuccess();
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to create goal');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    createMutation.mutate({
      ...formData,
      targetDate: formData.targetDate || null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create New Goal</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Run 3 times per week"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="What do you want to achieve and why?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Life Domain
              </label>
              <select
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {Object.entries(LIFE_DOMAIN_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timeline
              </label>
              <select
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {Object.entries(TIMELINE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Date (Optional)
            </label>
            <input
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Goal'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function GoalCard({ goal, onUpdate }: { goal: any; onUpdate: () => void }) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateGoal(id, data),
    onSuccess: () => {
      onUpdate();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteGoal(id),
    onSuccess: () => {
      onUpdate();
    },
  });

  const handleProgressUpdate = (newProgress: number) => {
    updateMutation.mutate({
      id: goal.id,
      data: { progressPercent: newProgress },
    });
  };

  const handleStatusChange = (newStatus: string) => {
    updateMutation.mutate({
      id: goal.id,
      data: { status: newStatus },
    });
  };

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
    abandoned: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{goal.title}</h3>
          <div className="flex gap-2 mb-2">
            <span className="text-xs px-2 py-1 bg-primary-100 text-primary-800 rounded">
              {LIFE_DOMAIN_LABELS[goal.domain]}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${statusColors[goal.status]}`}>
              {goal.status}
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setShowEdit(true)}
            className="text-gray-500 hover:text-primary-600 p-1"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="text-gray-500 hover:text-red-600 p-1"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      {goal.description && (
        <p className="text-sm text-gray-600 mb-4">{goal.description}</p>
      )}

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium text-gray-900">{goal.progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${goal.progressPercent}%` }}
          />
        </div>
        <div className="flex gap-1 mt-2">
          {[0, 25, 50, 75, 100].map((value) => (
            <button
              key={value}
              onClick={() => handleProgressUpdate(value)}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
              disabled={updateMutation.isPending}
            >
              {value}%
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        {goal.status === 'active' && (
          <button
            onClick={() => handleStatusChange('completed')}
            className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={updateMutation.isPending}
          >
            Mark Complete
          </button>
        )}
        {goal.status === 'active' && (
          <button
            onClick={() => handleStatusChange('paused')}
            className="text-xs px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            disabled={updateMutation.isPending}
          >
            Pause
          </button>
        )}
        {goal.status === 'paused' && (
          <button
            onClick={() => handleStatusChange('active')}
            className="text-xs px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700"
            disabled={updateMutation.isPending}
          >
            Resume
          </button>
        )}
      </div>

      {/* Delete Confirmation */}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-semibold mb-2">Delete Goal?</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{goal.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  deleteMutation.mutate(goal.id);
                  setShowDelete(false);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
