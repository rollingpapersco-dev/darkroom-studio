import React from 'react';

const BASE = { fontFamily: 'var(--font-sans)', textDecoration: 'none', cursor: 'pointer', display: 'inline-block', textAlign: 'center', border: 'none', transition: 'transform 0.2s, border-color 0.2s, background 0.2s, opacity 0.2s' };
const VARIANTS = {
  primary: { fontSize: 15, fontWeight: 600, color: 'var(--text-inverse)', background: 'var(--text-pure)', padding: '16px 36px', borderRadius: 28 },
  ghost:   { fontSize: 15, fontWeight: 500, color: 'var(--text-pure)', background: 'transparent', border: '1px solid var(--border-main)', padding: '16px 36px', borderRadius: 28 },
  nav:     { fontSize: 12, fontWeight: 500, color: 'var(--text-inverse)', background: 'var(--text-pure)', padding: '8px 16px', borderRadius: 20 },
  tier:    { display: 'block', width: '100%', fontSize: 14, fontWeight: 600, color: 'var(--text-pure)', background: 'transparent', border: '1px solid var(--dr-ink-700)', padding: 14, borderRadius: 24 },
  'tier-featured': { display: 'block', width: '100%', fontSize: 14, fontWeight: 600, color: 'var(--text-inverse)', background: 'var(--text-pure)', padding: 14, borderRadius: 24 },
  outline: { display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 600, color: 'var(--text-pure)', background: 'transparent', border: '1px solid rgba(255,255,255,0.6)', padding: '8px 18px', borderRadius: 20 },
  dock:    { fontSize: 15, fontWeight: 500, color: 'var(--text-inverse)', background: 'var(--text-pure)', padding: '10px 24px', borderRadius: 22 },
  'dock-back': { fontSize: 15, color: 'var(--text-label)', background: 'transparent', padding: '10px 24px', borderRadius: 22 },
};
const HOVER = {
  primary: { transform: 'scale(1.03)' },
  ghost: { borderColor: 'rgba(255,255,255,0.4)' },
  tier: { background: 'var(--dr-ink-800)', borderColor: 'var(--dr-ink-600)' },
  'tier-featured': { transform: 'scale(1.02)', opacity: 0.95 },
};

export function Button({ variant = 'primary', href, children, disabled, style, onClick, type = 'button', ...rest }) {
  const [hover, setHover] = React.useState(false);
  const s = { ...BASE, ...VARIANTS[variant], ...(hover && !disabled ? HOVER[variant] : null), ...(disabled ? { opacity: 0.5, cursor: 'default' } : null), ...style };
  const h = { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), onClick };
  const content = <>{children}{variant === 'outline' && <span style={{ fontSize: 9 }}>▶</span>}</>;
  return href
    ? <a href={href} style={s} {...h} {...rest}>{content}</a>
    : <button type={type} disabled={disabled} style={s} {...h} {...rest}>{content}</button>;
}
