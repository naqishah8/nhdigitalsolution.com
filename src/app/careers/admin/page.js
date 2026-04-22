'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, LogOut, Save, X, Eye, EyeOff, ExternalLink } from 'lucide-react';

const EMPTY = {
  slug: '',
  title: '',
  description: '',
  location: 'Remote',
  employmentType: 'FULL_TIME',
  remote: true,
  salaryMin: '',
  salaryMax: '',
  salaryCurrency: 'USD',
  salaryUnit: 'YEAR',
  applyUrl: '',
  datePosted: new Date().toISOString().slice(0, 10),
  validThrough: '',
  published: true,
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // job object or EMPTY when creating, null when list view
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/jobs', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/careers/admin/login');
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Could not save');
        setSaving(false);
        return;
      }
      setEditing(null);
      await load();
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (slug) => {
    if (!confirm('Delete this job posting permanently?')) return;
    const res = await fetch(`/api/jobs?slug=${encodeURIComponent(slug)}`, { method: 'DELETE' });
    if (res.ok) load();
  };

  const togglePublish = async (job) => {
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...job, published: !job.published }),
    });
    if (res.ok) load();
  };

  return (
    <main className="legal-page">
      <div className="legal-inner" style={{ maxWidth: 960 }}>
        <div className="admin-header-row">
          <div>
            <span className="eyebrow">Admin</span>
            <h1>Careers dashboard</h1>
          </div>
          <div className="admin-header-actions">
            {!editing && (
              <button className="admin-primary-btn" onClick={() => setEditing(EMPTY)}>
                <Plus size={16} /> New job
              </button>
            )}
            <button className="admin-ghost-btn" onClick={handleLogout}>
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>

        {editing ? (
          <form className="admin-card" onSubmit={save}>
            <div className="admin-form-grid">
              <div className="admin-form">
                <label>Title</label>
                <input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form">
                <label>Slug (URL), leave blank to auto-generate</label>
                <input
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  placeholder="senior-frontend-engineer"
                />
              </div>

              <div className="admin-form admin-form-wide">
                <label>Description (supports line breaks)</label>
                <textarea
                  rows={10}
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form">
                <label>Employment type</label>
                <select
                  value={editing.employmentType}
                  onChange={(e) => setEditing({ ...editing, employmentType: e.target.value })}
                >
                  <option value="FULL_TIME">Full-time</option>
                  <option value="PART_TIME">Part-time</option>
                  <option value="CONTRACTOR">Contractor</option>
                  <option value="TEMPORARY">Temporary</option>
                  <option value="INTERN">Intern</option>
                </select>
              </div>

              <div className="admin-form">
                <label>
                  <input
                    type="checkbox"
                    checked={!!editing.remote}
                    onChange={(e) => setEditing({ ...editing, remote: e.target.checked })}
                  />{' '}
                  Remote-friendly
                </label>
              </div>

              <div className="admin-form">
                <label>Location (shown when not remote-only)</label>
                <input
                  value={editing.location}
                  onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                  placeholder="Austin, TX"
                />
              </div>

              <div className="admin-form">
                <label>Date posted</label>
                <input
                  type="date"
                  value={editing.datePosted}
                  onChange={(e) => setEditing({ ...editing, datePosted: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form">
                <label>Valid through (expiry)</label>
                <input
                  type="date"
                  value={editing.validThrough}
                  onChange={(e) => setEditing({ ...editing, validThrough: e.target.value })}
                />
              </div>

              <div className="admin-form">
                <label>Salary min</label>
                <input
                  type="number"
                  value={editing.salaryMin}
                  onChange={(e) => setEditing({ ...editing, salaryMin: e.target.value })}
                  placeholder="80000"
                />
              </div>

              <div className="admin-form">
                <label>Salary max</label>
                <input
                  type="number"
                  value={editing.salaryMax}
                  onChange={(e) => setEditing({ ...editing, salaryMax: e.target.value })}
                  placeholder="120000"
                />
              </div>

              <div className="admin-form">
                <label>Salary currency</label>
                <input
                  value={editing.salaryCurrency}
                  onChange={(e) => setEditing({ ...editing, salaryCurrency: e.target.value })}
                  placeholder="USD"
                />
              </div>

              <div className="admin-form">
                <label>Salary unit</label>
                <select
                  value={editing.salaryUnit}
                  onChange={(e) => setEditing({ ...editing, salaryUnit: e.target.value })}
                >
                  <option value="HOUR">Per hour</option>
                  <option value="DAY">Per day</option>
                  <option value="WEEK">Per week</option>
                  <option value="MONTH">Per month</option>
                  <option value="YEAR">Per year</option>
                </select>
              </div>

              <div className="admin-form admin-form-wide">
                <label>Apply URL (leave blank to default to email link)</label>
                <input
                  value={editing.applyUrl}
                  onChange={(e) => setEditing({ ...editing, applyUrl: e.target.value })}
                  placeholder="https://... or mailto:..."
                />
              </div>

              <div className="admin-form">
                <label>
                  <input
                    type="checkbox"
                    checked={!!editing.published}
                    onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                  />{' '}
                  Published (visible on /careers)
                </label>
              </div>
            </div>

            {error && (
              <div className="admin-error" style={{ marginTop: 12 }}>
                {error}
              </div>
            )}

            <div className="admin-form-actions">
              <button type="button" className="admin-ghost-btn" onClick={() => setEditing(null)}>
                <X size={16} /> Cancel
              </button>
              <button type="submit" className="admin-primary-btn" disabled={saving}>
                <Save size={16} /> {saving ? 'Saving...' : 'Save job'}
              </button>
            </div>
          </form>
        ) : loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
        ) : jobs.length === 0 ? (
          <div className="admin-card">
            <p style={{ color: 'var(--text-muted)' }}>
              No jobs yet. Click <strong>New job</strong> to add your first posting.
            </p>
          </div>
        ) : (
          <div className="admin-job-list">
            {jobs.map((job) => (
              <div key={job.slug} className="admin-job-row">
                <div className="admin-job-info">
                  <div className="admin-job-title">
                    {job.title}
                    {!job.published && <span className="admin-chip">Draft</span>}
                  </div>
                  <div className="admin-job-sub">
                    /careers/{job.slug} · {job.remote ? 'Remote' : job.location} · Posted {job.datePosted}
                  </div>
                </div>
                <div className="admin-job-actions">
                  <a
                    href={`/careers/${job.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-icon-btn"
                    title="View public page"
                  >
                    <ExternalLink size={16} />
                  </a>
                  <button
                    className="admin-icon-btn"
                    onClick={() => togglePublish(job)}
                    title={job.published ? 'Unpublish' : 'Publish'}
                  >
                    {job.published ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    className="admin-icon-btn"
                    onClick={() => setEditing({ ...EMPTY, ...job })}
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="admin-icon-btn admin-icon-danger"
                    onClick={() => remove(job.slug)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
