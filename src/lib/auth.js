// Tiny HMAC-signed cookie session for the single-admin careers dashboard.
// Uses Web Crypto so the same helper works in Node and Edge runtimes.
//
// Cookie value format:   <expires-ms>.<hex-hmac>
// HMAC key:              process.env.ADMIN_SESSION_SECRET

const COOKIE_NAME = 'nh_admin_session';
const SESSION_MS = 12 * 60 * 60 * 1000; // 12 h

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || 'dev-only-change-me';
}

function toHex(buf) {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hmacHex(data) {
  const enc = new TextEncoder();
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    enc.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await globalThis.crypto.subtle.sign('HMAC', key, enc.encode(data));
  return toHex(sig);
}

function timingSafeEqStr(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionValue() {
  const expires = Date.now() + SESSION_MS;
  const data = String(expires);
  const sig = await hmacHex(data);
  return {
    value: `${data}.${sig}`,
    maxAge: Math.floor(SESSION_MS / 1000),
  };
}

export async function verifySessionValue(value) {
  if (!value || typeof value !== 'string') return false;
  const idx = value.indexOf('.');
  if (idx < 0) return false;
  const data = value.slice(0, idx);
  const sig = value.slice(idx + 1);
  const expires = Number(data);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;
  const expected = await hmacHex(data);
  return timingSafeEqStr(sig, expected);
}

export function checkPassword(input) {
  const expected = process.env.ADMIN_PASSWORD || '';
  if (!expected) return false;
  const a = String(input || '');
  const b = String(expected);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const SESSION_COOKIE = COOKIE_NAME;
