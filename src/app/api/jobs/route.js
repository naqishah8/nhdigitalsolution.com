import { cookies } from 'next/headers';
import { verifySessionValue, SESSION_COOKIE } from '@/lib/auth';
import { loadJobs, upsertJob, deleteJob } from '@/lib/jobs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function requireAdmin() {
  const store = await cookies();
  const val = store.get(SESSION_COOKIE)?.value;
  const ok = await verifySessionValue(val);
  return ok;
}

export async function GET() {
  if (!(await requireAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  return Response.json({ jobs: loadJobs() });
}

export async function POST(req) {
  if (!(await requireAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const saved = upsertJob(body);
    return Response.json({ ok: true, job: saved });
  } catch (err) {
    return Response.json({ error: err.message || 'Save failed' }, { status: 400 });
  }
}

export async function DELETE(req) {
  if (!(await requireAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const url = new URL(req.url);
  const slug = url.searchParams.get('slug');
  if (!slug) return Response.json({ error: 'Missing slug' }, { status: 400 });
  const removed = deleteJob(slug);
  return Response.json({ ok: removed });
}
