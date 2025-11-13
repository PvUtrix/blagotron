'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import Link from 'next/link';

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user, clearAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    clearAuth();
    router.push('/');
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container-custom">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/dashboard" className="text-xl font-bold text-primary-600">
                Blagotron
              </Link>
              <div className="hidden md:flex space-x-4">
                <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link href="/goals" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                  Goals
                </Link>
                <Link href="/activities" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                  Activities
                </Link>
                <Link href="/reflections" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                  Reflections
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user?.profile?.displayName || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container-custom py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Welcome, {user?.profile?.displayName}!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Life Balance</h3>
            <p className="text-sm text-gray-600 mb-4">
              Track your satisfaction across different life domains
            </p>
            <Link
              href="/life-balance"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              View Balance Wheel →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Goals</h3>
            <p className="text-sm text-gray-600 mb-4">
              Set and track your meaningful goals
            </p>
            <Link
              href="/goals"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              Manage Goals →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activities</h3>
            <p className="text-sm text-gray-600 mb-4">
              Log activities and track energy patterns
            </p>
            <Link
              href="/activities"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              Log Activity →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reflections</h3>
            <p className="text-sm text-gray-600 mb-4">
              Journal and reflect on your experiences
            </p>
            <Link
              href="/reflections"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              Write Reflection →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights</h3>
            <p className="text-sm text-gray-600 mb-4">
              View patterns and gain insights
            </p>
            <Link
              href="/insights"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              View Insights →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Community</h3>
            <p className="text-sm text-gray-600 mb-4">
              Connect with peers and learn together
            </p>
            <Link
              href="/community"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              Explore Community →
            </Link>
          </div>
        </div>

        {/* Getting Started Section */}
        <div className="mt-8 bg-primary-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  <strong>Complete your Life Balance Wheel</strong> - Get a baseline of your current state
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  <strong>Set your first goal</strong> - Choose one area to focus on
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  <strong>Start tracking</strong> - Log activities and reflections to build your data
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
