import React from 'react';
const SIZES = {
  hero: { fontSize: 'var(--type-hero)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.04em' },
  section: { fontSize: 'var(--type-post)', fontWeight: 800, letterSpacing: '-0.03em' },
  page: { fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em' },
  manifesto: { fontSize: 'var(--type-manifesto)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.03em' },
};
/** lines: array of strings or {em: string} for serif italic grey fragments */
export function Headline({ size = 'section', as: Tag = 'h2', children, style }) {
  return <Tag style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-pure)', margin: 0, textWrap: 'balance', ...SIZES[size], ...style }}>{children}</Tag>;
}
export function Em({ children }) {
  return <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--text-label)' }}>{children}</em>;
}
