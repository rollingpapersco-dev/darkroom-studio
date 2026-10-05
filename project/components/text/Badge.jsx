import React from 'react';
const V = {
  episode: { fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.85)', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: 12 },
  featured: { fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#000', background: '#fff', padding: '4px 14px', borderRadius: 12 },
};
export function Badge({ variant = 'episode', children, style }) {
  return <span style={{ fontFamily: 'var(--font-sans)', display: 'inline-block', ...V[variant], ...style }}>{children}</span>;
}
