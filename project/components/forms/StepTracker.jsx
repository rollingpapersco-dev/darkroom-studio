import React from 'react';
export function StepTracker({ steps = 3, current = 1, style }) {
  return (
    <div style={{ display: 'flex', width: '100%', gap: 8, ...style }}>
      {Array.from({ length: steps }, (_, i) => <div key={i} style={{ flex: 1, height: 2, background: i < current ? '#fff' : 'var(--dr-ink-800)' }} />)}
    </div>
  );
}
