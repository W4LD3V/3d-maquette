'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthForm() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const toggleMode = () => {
    setIsRegister((prev) => !prev);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    console.log('[AuthForm] submitting', { email, password, isRegister });

    const endpoint = isRegister ? '/api/register' : '/api/login';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log('[AuthForm] response:', data);

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      if (data.token) {
        console.log('[AuthForm] saving token to localStorage:', data.token);
        localStorage.setItem('token', data.token);

        // ⬇️ Option A: make useUser() react immediately in the same tab
        window.dispatchEvent(new StorageEvent('storage', { key: 'token', newValue: data.token }));

        // ⬇️ force client components (Header) to re-render with the new token
        router.refresh();
      }

      router.push('/dashboard');
    } catch (err) {
      console.error('[AuthForm] network error:', err);
      setError('Network error');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl shadow-xl border border-blue-100">
      <h2 className="text-2xl font-semibold text-blue-700 text-center mb-4">
        {isRegister ? 'Create an Account' : 'Login to Your Account'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4" data-testid="auth-form">
        <input
          data-testid="email"
          type="email"
          className="w-full p-3 text-blue-700 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          data-testid="password"
          type="password"
          className="w-full p-3 text-blue-700 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          data-testid="submit-auth"
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
        >
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          data-testid="toggle-auth"
          type="button"
          onClick={toggleMode}
          className="text-sm text-blue-600 hover:underline"
        >
          {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
}
