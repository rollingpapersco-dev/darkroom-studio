import React from 'react';
export function RuleCard({ num, title, children, style }) {
  return (
    <div style={{ padding: '2.5rem', background: 'var(--surface-glass)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-sans)', ...style }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-label)', marginBottom: '0.75rem' }}>{num}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>{title}</div>
      <div style={{ fontSize: 14, color: 'var(--text-label)', lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}
