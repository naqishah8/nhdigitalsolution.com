import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MapPin, Briefcase, Calendar, DollarSign } from 'lucide-react';
import { COMPANY } from '@/data/company';
import { getJobBySlug, getPublishedJobs } from '@/lib/jobs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const EMPLOYMENT_LABEL = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACTOR: 'Contract',
  TEMPORARY: 'Temporary',
  INTERN: 'Internship',
};

const SALARY_UNIT_LABEL = {
  HOUR: 'per hour',
  DAY: 'per day',
  WEEK: 'per week',
  MONTH: 'per month',
  YEAR: 'per year',
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job || job.published === false) return {};
  return {
    title: `${job.title} · Careers`,
    description: job.description.slice(0, 160),
    alternates: { canonical: `/careers/${job.slug}` },
  };
}

function formatSalary(job) {
  if (!job.salaryMin && !job.salaryMax) return null;
  const c = job.salaryCurrency || 'USD';
  const unit = SALARY_UNIT_LABEL[job.salaryUnit] || '';
  const fmt = (n) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: c,
      maximumFractionDigits: 0,
    }).format(n);
  if (job.salaryMin && job.salaryMax) return `${fmt(job.salaryMin)} to ${fmt(job.salaryMax)} ${unit}`.trim();
  if (job.salaryMin) return `${fmt(job.salaryMin)}+ ${unit}`.trim();
  return `Up to ${fmt(job.salaryMax)} ${unit}`.trim();
}

function buildJobPostingSchema(job) {
  const baseUrl = COMPANY.url.replace(/\/$/, '');
  const posted = job.datePosted || new Date().toISOString().slice(0, 10);

  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description: `<p>${job.description.replace(/\n/g, '</p><p>')}</p>`,
    identifier: {
      '@type': 'PropertyValue',
      name: COMPANY.brand,
      value: job.slug,
    },
    datePosted: posted,
    ...(job.validThrough && { validThrough: job.validThrough }),
    employmentType: job.employmentType || 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: COMPANY.legalName,
      sameAs: baseUrl,
      logo: `${baseUrl}${COMPANY.logo}`,
    },
    directApply: false,
    url: `${baseUrl}/careers/${job.slug}`,
  };

  if (job.remote) {
    schema.jobLocationType = 'TELECOMMUTE';
    schema.applicantLocationRequirements = {
      '@type': 'Country',
      name: COMPANY.address.addressCountry || 'US',
    };
  } else {
    schema.jobLocation = {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location || COMPANY.address.addressLocality,
        addressRegion: COMPANY.address.addressRegion,
        addressCountry: COMPANY.address.addressCountry,
      },
    };
  }

  if (job.salaryMin || job.salaryMax) {
    schema.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: job.salaryCurrency || 'USD',
      value: {
        '@type': 'QuantitativeValue',
        ...(job.salaryMin && { minValue: Number(job.salaryMin) }),
        ...(job.salaryMax && { maxValue: Number(job.salaryMax) }),
        unitText: job.salaryUnit || 'YEAR',
      },
    };
  }

  return schema;
}

export default async function JobDetailPage({ params }) {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job || job.published === false) notFound();

  const salary = formatSalary(job);
  const schema = buildJobPostingSchema(job);
  const applyHref =
    job.applyUrl ||
    `mailto:${COMPANY.email}?subject=${encodeURIComponent(`Application: ${job.title}`)}`;

  return (
    <main className="legal-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="legal-inner">
        <Link href="/careers" className="job-back-link">
          <ArrowLeft size={14} strokeWidth={2.25} /> <span>All careers</span>
        </Link>

        <header className="legal-head" style={{ marginTop: 18 }}>
          <span className="eyebrow">{EMPLOYMENT_LABEL[job.employmentType] || 'Open role'}</span>
          <h1>{job.title}</h1>
          <div className="job-meta-row">
            <span>
              <MapPin size={15} /> {job.remote ? 'Remote' : job.location}
            </span>
            <span>
              <Briefcase size={15} />{' '}
              {EMPLOYMENT_LABEL[job.employmentType] || 'Full-time'}
            </span>
            {salary && (
              <span>
                <DollarSign size={15} /> {salary}
              </span>
            )}
            <span>
              <Calendar size={15} /> Posted {job.datePosted}
            </span>
          </div>
        </header>

        <section>
          <h2>About this role</h2>
          {job.description.split(/\n\s*\n/).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>

        <section>
          <h2>Apply</h2>
          <p>
            To apply, email us with a short note about what you&rsquo;re working on now and
            your portfolio / résumé. We read every message.
          </p>
          <a href={applyHref} className="job-apply-btn">
            Apply for this role <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
          </a>
        </section>
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  return getPublishedJobs().map((j) => ({ slug: j.slug }));
}
