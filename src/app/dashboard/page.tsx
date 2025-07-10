'use client';

import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen text-blue-900">
      {/* Main */}
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl text-blue-700 font-semibold mb-6">Welcome to your dashboard 👋</h2>

        {/* Placeholder grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow border border-blue-200">
            <h3 className="text-lg font-semibold mb-2 text-blue-700">Quick Stats</h3>
            <p className="text-sm text-gray-600">Coming soon...</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border border-blue-200">
            <h3 className="text-lg font-semibold mb-2 text-blue-700">Recent Activity</h3>
            <p className="text-sm text-gray-600">Coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  );
}
