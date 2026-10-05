import React from 'react';
import { Button } from '../actions/Button.jsx';

const LINKS = ['Home', 'Episodes', 'Interviews', 'About', 'Pricing'];
export function NavBar({ active = 'Home', logoSrc = 'assets/logo.png', onNavigate, position = 'fixed', style }) {
  return (
    <nav style={{ position, top: 0, left: 0, right: 0, zIndex: 400, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem clamp(1.5rem, 5vw, 4rem)', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', borderBottom: '1px solid var(--border-main)', fontFamily: 'var(--font-sans)', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('Home'); }} style={{ display: 'flex' }}><img src={logoSrc} alt="DARKROOM" style={{ maxHeight: 24, height: 'auto', width: 'auto', display: 'block' }} /></a>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-label)', borderLeft: '1px solid var(--border-main)', paddingLeft: 14, textTransform: 'uppercase' }}>A ROLLINGPAPERSCO PRODUCTION</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {LINKS.map(l => (
          <a key={l} href="#" onClick={e => { e.preventDefault(); onNavigate?.(l); }} style={{ fontSize: 12, fontWeight: l === active ? 500 : 400, color: 'var(--text-main)', opacity: l === active ? 1 : 0.8, textDecoration: 'none', padding: '8px 0', transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = l === active ? 1 : 0.8}>{l}</a>
        ))}
        <Button variant="nav" onClick={() => onNavigate?.('Apply')}>Apply Now</Button>
      </div>
    </nav>
  );
}
