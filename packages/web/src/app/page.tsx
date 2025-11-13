'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container-custom py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Blagotron
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Design a life full of meaning and fulfillment
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            A comprehensive platform to help you understand yourself better, set meaningful goals,
            and create a balanced, fulfilling life through evidence-based methodologies and adaptive life management tools.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/register"
              className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="font-semibold text-lg mb-2">Self-Discovery</h3>
              <p className="text-gray-600">
                Understand what gives you energy, identify patterns, and define meaningful goals across all life domains.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="font-semibold text-lg mb-2">Track & Analyze</h3>
              <p className="text-gray-600">
                Log activities, track progress, and gain insights from your personal data and patterns.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="text-3xl mb-4">🌱</div>
              <h3 className="font-semibold text-lg mb-2">Grow & Adapt</h3>
              <p className="text-gray-600">
                Build better habits, connect with peers, and continuously adapt your path to growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
