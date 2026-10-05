import React from 'react';
import { Button } from '../actions/Button.jsx';
import { Badge } from '../text/Badge.jsx';
export function PriceCard({ tier, description, rate, unit = '/ PER EPISODE', unitBlock = false, features = [], featured = false, cta = 'Apply to Record', href = '#', style }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ background: featured ? 'var(--dr-ink-900)' : 'var(--dr-ink-950)', border: '1px solid ' + (featured ? '#fff' : hover ? 'var(--dr-ink-700)' : 'var(--dr-ink-800)'), borderRadius: 20, padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', fontFamily: 'var(--font-sans)', transition: 'border-color 0.3s', ...style }}>
      {featured && <Badge variant="featured" style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}>Recommended</Badge>}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: featured ? '#fff' : 'var(--text-label)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>{tier}</div>
        <p style={{ fontSize: 14, color: 'var(--text-label)', lineHeight: 1.45, margin: '0 0 2rem' }}>{description}</p>
        <div style={{ fontSize: 42, fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', marginBottom: '2.5rem', display: unitBlock ? 'block' : 'flex', alignItems: 'baseline', gap: 6 }}>
          {rate} <span style={unitBlock ? { display: 'block', fontSize: 11, marginTop: 4, fontWeight: 600, letterSpacing: '0.05em', color: 'var(--text-label)' } : { fontSize: 12, fontWeight: 600, color: 'var(--text-label)', letterSpacing: '0.05em' }}>{unit}</span>
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.1rem', margin: '0 0 3.5rem', padding: '2rem 0 0', borderTop: '1px solid var(--dr-ink-800)' }}>
          {features.map(f => <li key={f} style={{ fontSize: 14, color: 'var(--text-list)', display: 'flex', alignItems: 'center', gap: 12, letterSpacing: '-0.01em' }}><span style={{ color: featured ? '#fff' : 'var(--text-label)', fontSize: 13, fontWeight: 700 }}>✓</span>{f}</li>)}
        </ul>
      </div>
      <Button variant={featured ? 'tier-featured' : 'tier'} href={href}>{cta}</Button>
    </div>
  );
}
