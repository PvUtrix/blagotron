'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function ReflectionsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data: reflectionsData, isLoading } = useQuery({
    queryKey: ['reflections', page],
    queryFn: () => api.getReflections({ page, pageSize: 20 }),
    enabled: isAuthenticated,
  });

  const { data: promptData } = useQuery({
    queryKey: ['dailyPrompt'],
    queryFn: () => api.getDailyPrompt(),
    enabled: isAuthenticated,
  });

  const reflections = reflectionsData?.data || [];
  const meta = reflectionsData?.meta;
  const dailyPrompt = promptData?.data;

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
          <h1 className="text-3xl font-bold text-gray-900">Reflections</h1>
          <button
            onClick={() => setShowWriteForm(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            + Write Reflection
          </button>
        </div>

        {/* Daily Prompt */}
        {dailyPrompt && (
          <div className="bg-primary-50 border-l-4 border-primary-600 p-4 mb-6 rounded">
            <h3 className="font-semibold text-primary-900 mb-2">Today's Reflection Prompt</h3>
            <p className="text-primary-800">{dailyPrompt.promptText}</p>
            <button
              onClick={() => setShowWriteForm(true)}
              className="mt-3 text-sm text-primary-700 hover:text-primary-900 font-medium"
            >
              Reflect on this →
            </button>
          </div>
        )}

        {/* Write Form */}
        {showWriteForm && (
          <WriteReflectionForm
            prompt={dailyPrompt}
            onClose={() => setShowWriteForm(false)}
            onSuccess={() => {
              setShowWriteForm(false);
              queryClient.invalidateQueries({ queryKey: ['reflections'] });
            }}
          />
        )}

        {/* Reflections List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading reflections...</div>
          </div>
        ) : reflections.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-500 mb-4">
              No reflections yet. Start journaling to track your journey!
            </div>
            <button
              onClick={() => setShowWriteForm(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Write First Reflection
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {reflections.map((reflection: any) => (
                <ReflectionCard key={reflection.id} reflection={reflection} />
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

function WriteReflectionForm({
  prompt,
  onClose,
  onSuccess,
}: {
  prompt?: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    response: '',
    tags: '',
    mood: '',
  });
  const [error, setError] = useState('');

  const createMutation = useMutation({
    mutationFn: (data: any) => api.createReflection(data),
    onSuccess: () => {
      onSuccess();
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to create reflection');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.response.trim()) {
      setError('Response is required');
      return;
    }

    const tags = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    createMutation.mutate({
      promptId: prompt?.id || null,
      prompt: prompt?.promptText || null,
      response: formData.response,
      tags,
      mood: formData.mood || null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-3xl w-full p-6 my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Write Reflection</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">{error}</div>
          )}

          {prompt && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-1">Prompt:</div>
              <div className="text-gray-900">{prompt.promptText}</div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Reflection *
            </label>
            <textarea
              value={formData.response}
              onChange={(e) => setFormData({ ...formData, response: e.target.value })}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Write your thoughts, feelings, and insights..."
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.response.length} characters
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mood (Optional)
              </label>
              <select
                value={formData.mood}
                onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select mood...</option>
                <option value="great">😊 Great</option>
                <option value="good">🙂 Good</option>
                <option value="okay">😐 Okay</option>
                <option value="stressed">😰 Stressed</option>
                <option value="down">😔 Down</option>
              </select>
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
                placeholder="e.g., work, insight, gratitude"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {createMutation.isPending ? 'Saving...' : 'Save Reflection'}
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

function ReflectionCard({ reflection }: { reflection: any }) {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const moodEmojis: Record<string, string> = {
    great: '😊',
    good: '🙂',
    okay: '😐',
    stressed: '😰',
    down: '😔',
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="text-sm text-gray-600 mb-2">{formatDate(reflection.timestamp)}</div>
          {reflection.prompt && (
            <div className="text-sm font-medium text-gray-700 mb-2 italic">
              "{reflection.prompt}"
            </div>
          )}
        </div>
        {reflection.mood && (
          <div className="text-2xl ml-2">{moodEmojis[reflection.mood] || reflection.mood}</div>
        )}
      </div>

      <div className="text-gray-900 mb-3 whitespace-pre-wrap">
        {expanded ? reflection.response : truncateText(reflection.response, 300)}
      </div>

      {reflection.response.length > 300 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium mb-3"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}

      {reflection.tags && reflection.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {reflection.tags.map((tag: string, i: number) => (
            <span key={i} className="text-xs px-2 py-1 bg-primary-100 text-primary-800 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
