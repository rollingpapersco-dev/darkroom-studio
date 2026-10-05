import React from 'react';
import { Badge } from '../text/Badge.jsx';
import { Button } from '../actions/Button.jsx';
export function CarouselCard({ img, num, center = true, href = '#', style }) {
  return (
    <a href={href} target="_blank" rel="noopener" style={{ position: 'relative', display: 'block', width: 'clamp(300px, 46vw, 580px)', aspectRatio: '16 / 9', borderRadius: 18, overflow: 'hidden', background: 'var(--dr-ink-900)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'var(--shadow-float)', textDecoration: 'none', ...style }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${img}')`, backgroundSize: 'cover', backgroundPosition: 'center top', filter: 'saturate(0.85) brightness(0.9)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'var(--overlay-card)' }} />
      <Badge style={{ position: 'absolute', top: 14, left: 14 }}>{num}</Badge>
      <div style={{ position: 'absolute', left: 16, right: 16, bottom: 16 }}>
        <span style={{ display: 'inline-block', marginTop: 12, opacity: center ? 1 : 0, transform: center ? 'none' : 'translateY(6px)', transition: 'opacity 0.35s ease, transform 0.35s ease' }}>
          <Button variant="outline">Watch</Button>
        </span>
      </div>
    </a>
  );
}
