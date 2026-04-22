import nodemailer from 'nodemailer';
import { rateLimit, clientIp, tooManyRequests } from '@/lib/rate-limit';

export const runtime = 'nodejs';

// SMTP credentials live in env vars. The form submits through our own mail
// server (Postfix on mail.nhdigitalservices.com:587, SASL-authed as the
// `info` user). Replies go back to whoever filled the form, not to us.
const SMTP_HOST = process.env.SMTP_HOST || 'mail.nhdigitalservices.com';
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || 'info';
const SMTP_PASS = process.env.SMTP_PASS || '';
const CONTACT_TO = process.env.CONTACT_TO || 'info@nhdigitalservices.com';
const CONTACT_FROM = process.env.CONTACT_FROM || 'info@nhdigitalservices.com';

// Field caps — protects the mail server from giant payloads and obvious abuse.
const MAX_BODY_BYTES = 16 * 1024; // 16 KB is plenty for a contact form
const MAX_NAME = 120;
const MAX_EMAIL = 254; // RFC 5321
const MAX_SERVICE = 80;
const MAX_MESSAGE = 5000;

const transporter = SMTP_PASS
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      requireTLS: SMTP_PORT === 587,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
  : null;

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(req) {
  try {
    // Rate limit before we even parse the body — stops flood attempts cheaply.
    // 5 submissions per IP per 10 min covers a user re-submitting after a typo
    // but chokes spam bots that hammer the form.
    const ip = clientIp(req);
    const rl = rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
    if (!rl.ok) return tooManyRequests(rl);

    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return Response.json({ error: 'Payload too large' }, { status: 413 });
    }

    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return Response.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const { name, email, service, message, website } = body || {};

    // Honeypot — bots fill every field, so presence means drop silently.
    if (website) return Response.json({ ok: true });

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (
      name.length > MAX_NAME ||
      email.length > MAX_EMAIL ||
      (service && service.length > MAX_SERVICE) ||
      message.length > MAX_MESSAGE
    ) {
      return Response.json({ error: 'Field too long' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Invalid email' }, { status: 400 });
    }
    // Reject control chars / newlines sneaking into short fields (header injection).
    if (/[\r\n\t\x00-\x1f]/.test(name) || /[\r\n\t\x00-\x1f]/.test(email)) {
      return Response.json({ error: 'Invalid characters' }, { status: 400 });
    }

    if (!transporter) {
      console.error('[contact] SMTP_PASS not configured');
      return Response.json(
        { error: 'Mail service not configured' },
        { status: 500 }
      );
    }

    const subject = `New inquiry: ${service || 'General'} from ${name}`;
    const text = [
      `Name:    ${name}`,
      `Email:   ${email}`,
      `Service: ${service || 'Not specified'}`,
      '',
      'Message:',
      message,
    ].join('\n');

    const html = `
      <table cellpadding="0" cellspacing="0" border="0" style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; font-size:14px; line-height:1.6; color:#1f2937;">
        <tr><td style="padding-bottom:12px;"><strong>Name:</strong> ${escapeHtml(name)}</td></tr>
        <tr><td style="padding-bottom:12px;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding-bottom:12px;"><strong>Service:</strong> ${escapeHtml(service || 'Not specified')}</td></tr>
        <tr><td style="padding-top:8px; border-top:1px solid #e5e7eb;"><strong>Message</strong></td></tr>
        <tr><td style="padding-top:8px; white-space:pre-wrap;">${escapeHtml(message)}</td></tr>
      </table>
    `;

    await transporter.sendMail({
      from: `"NH Digital Services Website" <${CONTACT_FROM}>`,
      to: CONTACT_TO,
      replyTo: `"${name}" <${email}>`,
      subject,
      text,
      html,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error('[contact] send failed:', err);
    return Response.json(
      { error: 'Could not send message' },
      { status: 500 }
    );
  }
}
