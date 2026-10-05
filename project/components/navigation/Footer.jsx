import React from 'react';
export function Footer({ style }) {
  return (
    <footer style={{ padding: '3rem clamp(1.5rem, 5vw, 4rem)', borderTop: '1px solid var(--border-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-footer)', fontFamily: 'var(--font-sans)', ...style }}>
      <div style={{ fontSize: 12, color: 'var(--text-label)', textTransform: 'uppercase' }}>© 2026 <a href="https://rpco-site.vercel.app" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.28)' }}>ROLLINGPAPERSCO</a>. All Rights Reserved.</div>
    </footer>
  );
}
