import React from 'react';
export function InterviewCard({ meta, artist, quote, cta = 'Coming Soon →', style }) {
  return (
    <div style={{ background: 'var(--surface-glass-gradient)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 280, position: 'relative', overflow: 'hidden', fontFamily: 'var(--font-sans)', ...style }}>
      <span style={{ position: 'absolute', right: '2rem', top: '2rem', color: 'rgba(255,255,255,0.03)', fontSize: 32 }}>✦</span>
      <div style={{ fontSize: 12, color: 'var(--text-label)', fontWeight: 600, textTransform: 'uppercase' }}>{meta}</div>
      <div style={{ marginTop: 'auto' }}>
        <h3 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>{artist}</h3>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--text-label)', lineHeight: 1.5, fontStyle: 'italic' }}>{quote}</p>
        <a href="#" style={{ marginTop: '1.5rem', fontSize: 13, fontWeight: 600, color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>{cta}</a>
      </div>
    </div>
  );
}
