import { cookies } from 'next/headers';
import { checkPassword, createSessionValue, SESSION_COOKIE } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const { password } = await req.json();
    if (!checkPassword(password)) {
      return Response.json({ error: 'Incorrect password' }, { status: 401 });
    }
    const { value, maxAge } = await createSessionValue();
    const store = await cookies();
    store.set(SESSION_COOKIE, value, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge,
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 });
  }
}
