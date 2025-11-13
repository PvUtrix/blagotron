'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { api } from '@/lib/api';
import { LIFE_DOMAIN_LABELS, LIFE_DOMAIN_COLORS, DEFAULT_LIFE_DOMAINS } from '@blagotron/shared';
import Link from 'next/link';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

export default function LifeBalancePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [showAssessment, setShowAssessment] = useState(false);
  const queryClient = useQueryClient();

  const { data: latestData } = useQuery({
    queryKey: ['lifeBalance', 'latest'],
    queryFn: () => api.getLatestLifeBalance(),
    enabled: isAuthenticated,
  });

  const { data: historyData } = useQuery({
    queryKey: ['lifeBalance', 'history'],
    queryFn: () => api.getLifeBalanceHistory(),
    enabled: isAuthenticated,
  });

  const latest = latestData?.data;
  const history = historyData?.data || [];

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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Life Balance Wheel</h1>
            <p className="text-gray-600 mt-1">
              Assess your satisfaction across different areas of life
            </p>
          </div>
          <button
            onClick={() => setShowAssessment(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {latest ? 'New Assessment' : 'Start Assessment'}
          </button>
        </div>

        {/* Assessment Form */}
        {showAssessment && (
          <AssessmentForm
            onClose={() => setShowAssessment(false)}
            onSuccess={() => {
              setShowAssessment(false);
              queryClient.invalidateQueries({ queryKey: ['lifeBalance'] });
            }}
          />
        )}

        {/* Latest Snapshot */}
        {latest ? (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Current Balance</h2>
            <p className="text-sm text-gray-600 mb-6">
              Last updated: {new Date(latest.timestamp).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Radar Chart */}
              <div>
                <LifeBalanceChart scores={latest.scores} />
              </div>

              {/* Scores List */}
              <div className="space-y-3">
                {Object.entries(latest.scores).map(([domain, score]) => (
                  <div key={domain}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">
                        {LIFE_DOMAIN_LABELS[domain as keyof typeof LIFE_DOMAIN_LABELS]}
                      </span>
                      <span className="text-gray-900 font-semibold">{score}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${(score as number) * 10}%`,
                          backgroundColor: LIFE_DOMAIN_COLORS[domain as keyof typeof LIFE_DOMAIN_COLORS],
                        }}
                      />
                    </div>
                  </div>
                ))}

                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm font-medium text-gray-700">
                    Average Score: {calculateAverage(latest.scores).toFixed(1)}/10
                  </div>
                </div>
              </div>
            </div>

            {latest.notes && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
                <p className="text-gray-900">{latest.notes}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center mb-6">
            <div className="text-gray-500 mb-4">
              No life balance assessment yet. Start by rating your satisfaction in different life areas.
            </div>
            <button
              onClick={() => setShowAssessment(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Start First Assessment
            </button>
          </div>
        )}

        {/* History */}
        {history.length > 1 && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Assessment History</h2>
            <div className="space-y-4">
              {history.slice(0, 5).map((snapshot: any, index: number) => (
                <div key={snapshot.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-gray-600">
                      {new Date(snapshot.timestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      Avg: {calculateAverage(snapshot.scores).toFixed(1)}/10
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.entries(snapshot.scores).map(([domain, score]) => (
                      <div key={domain} className="text-xs">
                        <span className="text-gray-600">
                          {LIFE_DOMAIN_LABELS[domain as keyof typeof LIFE_DOMAIN_LABELS]}:
                        </span>{' '}
                        <span className="font-medium">{score as number}/10</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function calculateAverage(scores: Record<string, number>): number {
  const values = Object.values(scores);
  return values.reduce((sum, score) => sum + score, 0) / values.length;
}

function LifeBalanceChart({ scores }: { scores: Record<string, number> }) {
  const data = Object.entries(scores).map(([domain, score]) => ({
    domain: LIFE_DOMAIN_LABELS[domain as keyof typeof LIFE_DOMAIN_LABELS],
    score: score,
    fullMark: 10,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="domain" tick={{ fontSize: 12 }} />
        <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fontSize: 12 }} />
        <Radar
          name="Score"
          dataKey="score"
          stroke="#3B82F6"
          fill="#3B82F6"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

function AssessmentForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    DEFAULT_LIFE_DOMAINS.forEach((domain) => {
      initial[domain] = 5;
    });
    return initial;
  });
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const createMutation = useMutation({
    mutationFn: (data: any) => api.createLifeBalanceSnapshot(data),
    onSuccess: () => {
      onSuccess();
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to save assessment');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    createMutation.mutate({
      scores,
      notes: notes || null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-3xl w-full p-6 my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Life Balance Assessment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">{error}</div>
          )}

          <div className="bg-primary-50 p-4 rounded-lg text-sm text-primary-900">
            <p className="font-medium mb-1">Instructions:</p>
            <p>
              Rate your current satisfaction in each life area from 0 (very dissatisfied) to 10
              (completely satisfied). Be honest - this is for your eyes only!
            </p>
          </div>

          <div className="space-y-4">
            {DEFAULT_LIFE_DOMAINS.map((domain) => (
              <div key={domain}>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    {LIFE_DOMAIN_LABELS[domain]}
                  </label>
                  <span className="text-sm font-semibold text-gray-900">
                    {scores[domain]}/10
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={scores[domain]}
                  onChange={(e) =>
                    setScores({ ...scores, [domain]: parseInt(e.target.value) })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Very dissatisfied</span>
                  <span>Completely satisfied</span>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Any thoughts on your current balance? Areas you want to focus on?"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {createMutation.isPending ? 'Saving...' : 'Save Assessment'}
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
