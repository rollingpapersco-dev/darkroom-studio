import { LOGO } from '../templates.js';
import { DECKS } from './decks.js';

// Ported from the handoff's pitches/Brand Pitches.dc.html.
const pill = { fontSize: 12, fontWeight: 600, borderRadius: 14, padding: '6px 12px', textDecoration: 'none' };

export default function Pitches() {
  return (
    <div style={{ minHeight: '100%', background: '#000', color: '#f5f5f7', fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif", padding: '48px clamp(16px,4vw,56px)', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <img src={LOGO} alt="DARKROOM" style={{ height: 22, width: 'auto', display: 'block', alignSelf: 'flex-start' }} />
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', color: '#86868b', textTransform: 'uppercase' }}>Partnership decks · Season Two</div>
          <h1 style={{ margin: '12px 0 0', fontSize: 'clamp(40px,6vw,72px)', fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 1, color: '#fff' }}>Brand pitches. <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontStyle: 'italic', fontWeight: 400, color: '#86868b' }}>Eleven rooms.</span></h1>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12 }}>
          {DECKS.map(d => (
            <div key={d.slug} style={{ display: 'flex', flexDirection: 'column', gap: 16, background: d.featured ? '#0c0c0e' : '#08080a', border: d.featured ? '2px solid #fff' : '1px solid #1c1c1e', borderRadius: 16, padding: 22 }}>
              <a href={'#pitch/' + d.slug} style={{ display: 'flex', flexDirection: 'column', gap: 6, textDecoration: 'none' }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: d.featured ? '#C8362A' : '#86868b' }}>{d.category}</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{d.card}</span>
              </a>
              <div style={{ display: 'flex', gap: 8 }}>
                <a href={'#pitch/' + d.slug} className="pitch-open" style={{ ...pill, color: '#f5f5f7', border: '1px solid #1c1c1e' }}>Open</a>
                <a href={'#pitch/' + d.slug + '/print'} style={{ ...pill, color: '#000', background: '#fff' }}>Export PDF ↓</a>
              </div>
            </div>
          ))}
        </div>
        <p style={{ margin: 0, fontSize: 13, color: '#86868b' }}>7 slides each. Same story, tailored "Why" and "Ways to partner" slides. Swap "[Your brand]" in the Drinks, Streetwear and Fintech decks; change "Shure" or "MTN" to pitch Sennheiser, JBL or Airtel.</p>
        <p style={{ margin: 0, fontSize: 13, color: '#86868b' }}>Export PDF opens the deck here with the print dialog (use your browser’s Back to return). Choose <span style={{ color: '#fff' }}>Save as PDF</span>, set margins to <span style={{ color: '#fff' }}>None</span> and turn on <span style={{ color: '#fff' }}>Background graphics</span>. One slide per page, 16:9.</p>
      </div>
    </div>
  );
}
