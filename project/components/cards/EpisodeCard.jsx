import React from 'react';
export function EpisodeCard({ img, num, artist, track, href = '#', style }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a href={href} target="_blank" rel="noopener" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ background: 'var(--surface-glass)', border: '1px solid ' + (hover ? 'var(--border-glass-hover)' : 'var(--border-glass)'), borderRadius: 16, padding: '1.5rem', display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit', fontFamily: 'var(--font-sans)', transform: hover ? 'translateY(-4px)' : 'none', transition: 'transform 0.3s ease, border-color 0.3s ease', ...style }}>
      <div style={{ width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', borderRadius: 10, marginBottom: '1.25rem', background: 'var(--dr-ink-950)', border: '1px solid rgba(255,255,255,0.02)' }}>
        <img src={img} alt={artist} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-label)', letterSpacing: '0.05em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{num}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.25, marginBottom: '0.5rem' }}>{artist}{track ? ' — ' + track : ''}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginTop: 'auto', display: 'flex', alignItems: 'center', gap: hover ? 8 : 4, transition: 'gap 0.2s' }}>Stream Episode ↗</div>
    </a>
  );
}
