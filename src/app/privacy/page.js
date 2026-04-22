import { COMPANY } from '@/data/company';

export const metadata = {
  title: 'Privacy Policy',
  description: `How ${COMPANY.brand} collects, uses, and protects personal information submitted through the website.`,
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPolicyPage() {
  const updated = 'April 21, 2026';
  return (
    <main className="legal-page">
      <div className="legal-inner">
        <header className="legal-head">
          <span className="eyebrow">Legal</span>
          <h1>Privacy Policy</h1>
          <p className="updated">Last updated: {updated}</p>
        </header>

        <section>
          <h2>Who we are</h2>
          <p>
            This website is operated by <strong>{COMPANY.legalName}</strong> (&ldquo;{COMPANY.shortName}&rdquo;,
            &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), reachable at <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
            This policy explains what data we collect, why, and what you can do about it.
          </p>
        </section>

        <section>
          <h2>What we collect</h2>
          <ul>
            <li>
              <strong>Contact form submissions:</strong> when you fill in the contact form we receive the
              name, email address, selected service, and message you provide.
            </li>
            <li>
              <strong>AI chat conversations:</strong> messages you send to our AI assistant (Nova) are processed
              by our model provider (Google Gemini) in order to generate a reply. Transcripts may be retained
              in your own browser (local storage) and on our servers for quality review and product improvement.
            </li>
            <li>
              <strong>Technical logs:</strong> our servers record standard request information (IP address,
              user agent, timestamp, URL) needed to operate the site securely and to detect abuse.
            </li>
            <li>
              <strong>Cookies:</strong> we use a minimal set of first-party cookies required for the site to
              function (e.g. to remember that you dismissed a notice). We do not use third-party advertising
              cookies.
            </li>
          </ul>
        </section>

        <section>
          <h2>Why we use it</h2>
          <ul>
            <li>To reply to your inquiry and deliver the services you request.</li>
            <li>To operate, secure, and improve the website and the AI assistant.</li>
            <li>To comply with applicable law.</li>
          </ul>
          <p>
            We do <strong>not</strong> sell personal information and we do not share it with third parties for
            their own marketing.
          </p>
        </section>

        <section>
          <h2>Service providers</h2>
          <p>We use a small number of vetted processors to run this website:</p>
          <ul>
            <li><strong>Hostinger</strong> (hosting infrastructure)</li>
            <li><strong>Cloudflare</strong> (DNS, caching, security)</li>
            <li><strong>Google Gemini API</strong> (AI assistant responses)</li>
            <li><strong>Self-hosted Postfix / Dovecot</strong> (mail delivery for the contact form)</li>
          </ul>
          <p>These providers process data on our behalf under their own security terms.</p>
        </section>

        <section>
          <h2>Retention</h2>
          <p>
            Contact form messages are retained as long as needed to support the client relationship, then
            archived or deleted. AI chat transcripts stored in your browser can be removed anytime via the
            &ldquo;End chat&rdquo; option in the chat menu. Server-side chat logs are rotated regularly and not retained
            beyond what&rsquo;s needed for quality and security review.
          </p>
        </section>

        <section>
          <h2>Your rights</h2>
          <p>
            Depending on where you live, you may have the right to access, correct, delete, or export the
            personal data we hold about you, and to object to certain processing. To exercise any of these
            rights, email us at <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> and we&rsquo;ll respond within
            30 days.
          </p>
        </section>

        <section>
          <h2>Children</h2>
          <p>
            This site isn&rsquo;t directed at children under 13, and we don&rsquo;t knowingly collect personal information
            from them. If you believe a child has provided us data, contact us and we will delete it.
          </p>
        </section>

        <section>
          <h2>Changes</h2>
          <p>
            We may update this policy occasionally. Material changes will be posted on this page and the
            &ldquo;Last updated&rdquo; date at the top will change.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Questions about privacy? Email <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
