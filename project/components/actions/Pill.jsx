import React from 'react';

export function Pill({ active = false, children, onClick, style }) {
  const [hover, setHover] = React.useState(false);
  const s = {
    fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
    color: active || hover ? 'var(--text-pure)' : 'var(--text-label)',
    background: active ? 'var(--dr-red-tint)' : 'transparent',
    border: '1px solid ' + (active ? 'var(--accent)' : hover ? 'var(--border-pill-hover)' : 'var(--border-main)'),
    padding: '7px 14px', borderRadius: 18, cursor: 'pointer', flexShrink: 0,
    transition: 'color 0.2s, border-color 0.2s, background 0.2s', ...style,
  };
  return <button style={s} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>{children}</button>;
}
