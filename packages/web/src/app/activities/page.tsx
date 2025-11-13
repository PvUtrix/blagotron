'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { api } from '@/lib/api';
import { ENERGY_LABELS } from '@blagotron/shared';
import Link from 'next/link';

export default function ActivitiesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [showLogForm, setShowLogForm] = useState(false);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data: activitiesData, isLoading } = useQuery({
    queryKey: ['activities', page],
    queryFn: () => api.getActivities({ page, pageSize: 20 }),
    enabled: isAuthenticated,
  });

  const activities = activitiesData?.data || [];
  const meta = activitiesData?.meta;

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
          <h1 className="text-3xl font-bold text-gray-900">Activities</h1>
          <button
            onClick={() => setShowLogForm(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            + Log Activity
          </button>
        </div>

        {/* Log Form */}
        {showLogForm && (
          <LogActivityForm
            onClose={() => setShowLogForm(false)}
            onSuccess={() => {
              setShowLogForm(false);
              queryClient.invalidateQueries({ queryKey: ['activities'] });
            }}
          />
        )}

        {/* Activities List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading activities...</div>
          </div>
        ) : activities.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-500 mb-4">
              No activities logged yet. Start tracking your day!
            </div>
            <button
              onClick={() => setShowLogForm(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Log First Activity
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {activities.map((activity: any) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {meta.totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(meta.totalPages, page + 1))}
                  disabled={page === meta.totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function LogActivityForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    activityType: '',
    duration: 30,
    energyDelta: 0,
    notes: '',
    tags: '',
  });
  const [error, setError] = useState('');

  const logMutation = useMutation({
    mutationFn: (data: any) => api.logActivity(data),
    onSuccess: () => {
      onSuccess();
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to log activity');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.activityType.trim()) {
      setError('Activity type is required');
      return;
    }

    const tags = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    logMutation.mutate({
      activityType: formData.activityType,
      duration: formData.duration,
      energyDelta: formData.energyDelta,
      notes: formData.notes || null,
      context: { tags },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Log Activity</h2>
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
              Activity Type *
            </label>
            <input
              type="text"
              value={formData.activityType}
              onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Morning run, Work meeting, Reading"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="1440"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Energy Impact
              </label>
              <select
                value={formData.energyDelta}
                onChange={(e) => setFormData({ ...formData, energyDelta: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {Object.entries(ENERGY_LABELS).map(([value, label]) => (
                  <option key={value} value={parseInt(value)}>
                    {label} ({value > 0 ? '+' : ''}{value})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., exercise, outdoor, social"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="How did it go? What did you learn?"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={logMutation.isPending}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {logMutation.isPending ? 'Logging...' : 'Log Activity'}
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

function ActivityCard({ activity }: { activity: any }) {
  const energyColor = (delta: number) => {
    if (delta >= 2) return 'text-green-600';
    if (delta >= 1) return 'text-green-500';
    if (delta <= -2) return 'text-red-600';
    if (delta <= -1) return 'text-red-500';
    return 'text-gray-600';
  };

  const energyBg = (delta: number) => {
    if (delta >= 2) return 'bg-green-100';
    if (delta >= 1) return 'bg-green-50';
    if (delta <= -2) return 'bg-red-100';
    if (delta <= -1) return 'bg-red-50';
    return 'bg-gray-100';
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{activity.activityType}</h3>
            <span className={`text-xs px-2 py-1 rounded ${energyBg(activity.energyDelta)} ${energyColor(activity.energyDelta)} font-medium`}>
              {activity.energyDelta > 0 ? '+' : ''}{activity.energyDelta} energy
            </span>
          </div>
          <div className="text-sm text-gray-600 mb-2">
            <span>{activity.duration} min</span>
            <span className="mx-2">•</span>
            <span>{formatTime(activity.timestamp)}</span>
          </div>
          {activity.notes && (
            <p className="text-sm text-gray-700 mb-2">{activity.notes}</p>
          )}
          {activity.context?.tags && activity.context.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {activity.context.tags.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
