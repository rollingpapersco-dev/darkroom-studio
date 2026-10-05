import React from 'react';
export function Eyebrow({ children, tone = 'label', size = 11, style }) {
  return <div style={{ fontFamily: 'var(--font-sans)', fontSize: size, fontWeight: tone === 'accent' ? 700 : 600, letterSpacing: tone === 'accent' ? '0.14em' : '0.12em', textTransform: 'uppercase', color: tone === 'accent' ? 'var(--accent)' : 'var(--text-label)', ...style }}>{children}</div>;
}
