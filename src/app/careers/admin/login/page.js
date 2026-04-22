'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, LogIn, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') || '/careers/admin';

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Incorrect password');
        setLoading(false);
        return;
      }
      router.replace(next);
    } catch {
      setError('Network error. Try again.');
      setLoading(false);
    }
  };

  return (
    <main className="legal-page">
      <div style={{ maxWidth: 420, margin: '0 auto' }}>
        <div className="admin-card">
          <div className="admin-card-head">
            <Lock size={22} />
            <h1>Admin login</h1>
            <p>Enter the admin password to manage careers.</p>
          </div>
          <form onSubmit={submit} className="admin-form">
            <label htmlFor="pw">Password</label>
            <input
              id="pw"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
            {error && (
              <div className="admin-error">
                <AlertCircle size={14} /> {error}
              </div>
            )}
            <button type="submit" className="admin-primary-btn" disabled={loading || !password}>
              {loading ? 'Signing in...' : (<><LogIn size={16} /> Sign in</>)}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
