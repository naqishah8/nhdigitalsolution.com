'use client';
// Internal-SEO helper: gives any heading a stable id plus a visible "#" link
// on hover/focus so users can copy a deep link and search engines can treat
// the anchor as a discrete, linkable node.
//
// Usage:
//   <HeadingAnchor as="h2" id="pricing">Pricing</HeadingAnchor>
// If `id` is omitted, it slugifies the text content.

import { Link2 } from 'lucide-react';
import { Children } from 'react';

function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function textOf(node) {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (node.props?.children) return textOf(node.props.children);
  return '';
}

export default function HeadingAnchor({
  as: Tag = 'h2',
  id,
  children,
  className = '',
  style,
  ...rest
}) {
  const resolvedId = id || slugify(textOf(Children.toArray(children)));

  return (
    <Tag id={resolvedId} className={`heading-anchor ${className}`} style={style} {...rest}>
      {children}
      {resolvedId && (
        <a
          href={`#${resolvedId}`}
          className="heading-anchor-link"
          aria-label="Direct link to this section"
          tabIndex={-1}
        >
          <Link2 size={16} aria-hidden="true" />
        </a>
      )}

      <style jsx>{`
        .heading-anchor {
          scroll-margin-top: 100px;
          position: relative;
        }

        .heading-anchor-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.6em;
          height: 1em;
          margin-left: 6px;
          vertical-align: middle;
          color: var(--text-dim);
          opacity: 0;
          transform: translateY(1px);
          transition: opacity 0.15s ease, color 0.15s ease;
        }

        .heading-anchor:hover .heading-anchor-link,
        .heading-anchor:focus-within .heading-anchor-link,
        .heading-anchor-link:focus-visible {
          opacity: 0.7;
        }

        .heading-anchor-link:hover,
        .heading-anchor-link:focus-visible {
          opacity: 1 !important;
          color: var(--primary);
        }
      `}</style>
    </Tag>
  );
}
