import Link from 'next/link';
import { MapPin, Briefcase, ArrowRight } from 'lucide-react';
import { COMPANY } from '@/data/company';
import { getPublishedJobs } from '@/lib/jobs';

export const dynamic = 'force-dynamic'; // reads from disk
export const revalidate = 0;

export const metadata = {
  title: `Careers at ${COMPANY.brand}`,
  description: `Open roles at ${COMPANY.brand}. Join a senior, small studio shipping design and engineering under one roof.`,
  alternates: { canonical: '/careers' },
};

const EMPLOYMENT_LABEL = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACTOR: 'Contract',
  TEMPORARY: 'Temporary',
  INTERN: 'Internship',
};

export default function CareersPage() {
  const jobs = getPublishedJobs();

  return (
    <main className="legal-page">
      <div className="legal-inner">
        <header className="legal-head">
          <span className="eyebrow">Careers</span>
          <h1>Join the team</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7 }}>
            We&rsquo;re a small crew of senior designers and engineers. No agency layers,
            no handoffs, just people who build. Here&rsquo;s what we&rsquo;re hiring for right now.
          </p>
        </header>

        {jobs.length === 0 ? (
          <section>
            <h2>No openings right now</h2>
            <p>
              We don&rsquo;t have any roles listed at the moment. If you think you&rsquo;d be a
              great fit for the team anyway, email us at{' '}
              <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> and we always want
              to meet sharp people.
            </p>
          </section>
        ) : (
          <section>
            <div className="job-grid">
              {jobs.map((job) => (
                <Link key={job.slug} href={`/careers/${job.slug}`} className="job-card">
                  <div className="job-card-head">
                    <h3>{job.title}</h3>
                    <ArrowRight size={18} className="job-card-arrow" />
                  </div>
                  <div className="job-card-meta">
                    <span>
                      <MapPin size={14} /> {job.remote ? 'Remote' : job.location}
                    </span>
                    <span>
                      <Briefcase size={14} />{' '}
                      {EMPLOYMENT_LABEL[job.employmentType] || 'Full-time'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
