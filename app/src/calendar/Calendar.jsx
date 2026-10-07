import { useEffect, useState } from 'react';
import { LOGO } from '../templates.js';
import CAL from './posting-calendar.json';

// Ported from the handoff's plans/Posting Calendar.dc.html; posts come from posting-calendar.json.
const SERIF = { fontFamily: "'Playfair Display',Georgia,serif", fontStyle: 'italic', fontWeight: 400, color: '#86868b' };
const PIL = {
  'The Take': ['#f5f5f7', '#f5f5f7'], 'The Room': ['transparent', '#86868b'],
  'The Words': ['#86868b', '#86868b'], 'The Call': ['#C8362A', '#C8362A'],
};
const WEEKS = [
  ['WEEK 1 · 6–12 OCT', 'The archive reopens', 'EP.01–04 · fix profiles on day 1', 0, 7],
  ['WEEK 2 · 13–19 OCT', 'Collab week', 'EP.05–08 · artists co-post · Boost A', 7, 14],
  ['WEEK 3 · 20–26 OCT', 'Your record. This room.', 'EP.09–12 · booking push · Boost B', 14, 21],
  ['WEEK 4 · 27 OCT – 2 NOV', 'The door closes', 'EP.13–15 · Season Two teaser · Boost C', 21, 28],
];
const DOW = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const DOWL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const clock = hhmm => { const [h, m] = hhmm.split(':').map(Number); return (h % 12 || 12) + ':' + String(m).padStart(2, '0') + (h < 12 ? 'am' : 'pm') + ' WAT'; };
const DAYS = CAL.posts.map((p, i) => {
  const [y, mo, d] = p.date.split('-').map(Number);
  const dt = new Date(y, mo - 1, d);
  const mon = MON[dt.getMonth()];
  const weekend = dt.getDay() === 0 || dt.getDay() === 6;
  return {
    ...p, id: i, dt, num: dt.getDate(),
    dow: DOW[dt.getDay()] + ' · ' + mon.toUpperCase(),
    long: DOWL[dt.getDay()] + ' ' + dt.getDate() + ' ' + mon + ' · Day ' + (i + 1),
    flag: p.flag || '', note: p.note || '',
    time: clock(weekend ? CAL.postTimeWAT.weekend : CAL.postTimeWAT.weekday),
  };
});
const KEY = 'dr-calendar-done';
const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const eyebrow = { fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', color: '#86868b', textTransform: 'uppercase' };

export default function Calendar() {
  const [done, setDone] = useState(() => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } });
  const [sel, setSel] = useState(null);
  const [copied, setCopied] = useState(false);
  const today = new Date();

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) {} }, [done]);
  useEffect(() => {
    if (sel == null) return;
    const k = e => e.key === 'Escape' && setSel(null);
    addEventListener('keydown', k); return () => removeEventListener('keydown', k);
  }, [sel]);

  const doneCount = Object.values(done).filter(Boolean).length;
  const s = sel != null ? DAYS[sel] : null;
  const sDone = s ? !!done[s.id] : false;

  const copy = () => {
    if (!s) return;
    const t = s.caption + '\n\n' + s.hashtags;
    const fallback = () => { const ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); };
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).catch(fallback);
    setCopied(true);
  };

  return (
    <div style={{ minHeight: '100%', background: '#000', color: '#f5f5f7', fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif", padding: '40px clamp(16px,4vw,56px) 80px', boxSizing: 'border-box' }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 1600, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <img src={LOGO} alt="DARKROOM" style={{ height: 22, width: 'auto', display: 'block' }} />
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', color: '#86868b', textTransform: 'uppercase' }}>The Archives · Season One</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32, flexWrap: 'wrap' }}>
          <div>
            <div style={eyebrow}>Posting calendar · Tue 6 Oct – Mon 2 Nov 2026</div>
            <h1 style={{ margin: '12px 0 0', fontSize: 'clamp(40px,6vw,76px)', fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 1, color: '#fff' }}>Twenty-eight days. <span style={SERIF}>Fifteen takes.</span></h1>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end', fontSize: 13, color: '#86868b' }}>
            <span><span style={{ color: '#fff', fontWeight: 700 }}>{doneCount}</span> of 28 posted</span>
            <div style={{ width: 200, height: 4, background: '#1c1c1e', borderRadius: 2, overflow: 'hidden' }}><div style={{ height: '100%', width: Math.round(doneCount / 28 * 100) + '%', background: '#C8362A' }} /></div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', padding: '16px 0', borderTop: '1px solid #1c1c1e', borderBottom: '1px solid #1c1c1e', fontSize: 13, color: '#86868b' }}>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {Object.entries(PIL).map(([name, [bg, bd]]) => (
              <span key={name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: 4, background: bg, border: bg === 'transparent' ? '1px solid ' + bd : undefined, boxSizing: 'border-box' }} />{name}
              </span>
            ))}
          </div>
          <span>Every day: Stories (out-now card, poll, link sticker) + one X clip · post 6–9pm WAT</span>
        </div>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: 48, maxWidth: 1600, margin: '40px auto 0' }}>
        {WEEKS.map(([label, theme, note, a, b]) => (
          <section key={label} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: '#86868b' }}>{label}</span>
              <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>{theme}</span>
              <span style={{ fontSize: 13, color: '#86868b' }}>{note}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: 10 }}>
              {DAYS.slice(a, b).map(x => {
                const isToday = sameDay(x.dt, today), isDone = !!done[x.id];
                const [dot, dotBorder] = PIL[x.pillar];
                return (
                  <button key={x.id} className="cal-card" onClick={() => { setSel(x.id); setCopied(false); }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left', background: isToday ? '#0c0c0e' : '#08080a', border: '1px solid ' + (sel === x.id ? '#fff' : isToday ? '#C8362A' : '#1c1c1e'), borderRadius: 16, padding: 16, color: '#f5f5f7', cursor: 'pointer', fontFamily: 'inherit', minHeight: 230, opacity: isDone ? 0.5 : 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#86868b' }}>{x.dow}</span>
                        <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.05 }}>{x.num}</span>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: isDone ? '#86868b' : isToday || x.flag.startsWith('BOOST') ? '#C8362A' : '#86868b' }}>{isDone ? 'POSTED ✓' : isToday ? 'TODAY' : x.flag}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', color: '#86868b' }}>
                      <span style={{ width: 8, height: 8, borderRadius: 4, flex: 'none', background: dot, border: '1px solid ' + dotBorder, boxSizing: 'border-box' }} />{x.format}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.25, color: '#fff' }}>{x.title}</div>
                    <div style={{ fontSize: 12, lineHeight: 1.5, color: '#86868b', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{x.caption}</div>
                    <div style={{ marginTop: 'auto', fontSize: 11, color: '#86868b', letterSpacing: '0.02em' }}>{x.platforms}</div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </main>

      {s && (
        <>
          <div onClick={() => setSel(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 10 }} />
          <aside role="dialog" aria-label={s.title} style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(460px,100%)', background: '#08080a', borderLeft: '1px solid #1c1c1e', zIndex: 11, overflowY: 'auto', padding: 32, paddingTop: 'calc(32px + env(safe-area-inset-top))', paddingBottom: 'calc(32px + env(safe-area-inset-bottom))', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: '#86868b' }}>{s.long}</div>
                <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', marginTop: 6, lineHeight: 1.15 }}>{s.title}</div>
              </div>
              <button onClick={() => setSel(null)} aria-label="Close" style={{ flex: 'none', width: 36, height: 36, borderRadius: 18, border: '1px solid #1c1c1e', background: 'transparent', color: '#f5f5f7', fontSize: 18, cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr)', gap: '10px 20px', fontSize: 13 }}>
              {[['Format', s.format], ['Pillar', s.pillar], ['Platforms', s.platforms], ['Post at', s.time], ['Asset', s.asset]].map(([k, v]) => (
                <span key={k} style={{ display: 'contents' }}><span style={{ color: '#86868b' }}>{k}</span><span style={{ color: '#fff' }}>{v}</span></span>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, background: '#000', border: '1px solid #1c1c1e', borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#86868b' }}>CAPTION</div>
              <div style={{ fontSize: 15, lineHeight: 1.6, color: '#f5f5f7', whiteSpace: 'pre-line', userSelect: 'text', WebkitUserSelect: 'text' }}>{s.caption}</div>
              <div style={{ fontSize: 13, lineHeight: 1.6, color: '#86868b' }}>{s.hashtags}</div>
              <button onClick={copy} style={{ alignSelf: 'flex-start', fontSize: 13, fontWeight: 600, color: '#000', background: '#fff', border: 'none', borderRadius: 18, padding: '9px 18px', cursor: 'pointer', fontFamily: 'inherit' }}>{copied ? 'Copied ✓' : 'Copy caption'}</button>
            </div>
            {s.note && (
              <div style={{ fontSize: 13, lineHeight: 1.55, color: '#86868b', borderTop: '1px solid #1c1c1e', paddingTop: 20 }}><span style={{ color: '#fff', fontWeight: 700 }}>Note · </span>{s.note}</div>
            )}
            <button onClick={() => setDone(d => ({ ...d, [s.id]: !d[s.id] }))} style={{ marginTop: 'auto', fontSize: 14, fontWeight: 600, color: sDone ? '#86868b' : '#fff', background: 'transparent', border: '1px solid ' + (sDone ? '#1c1c1e' : '#C8362A'), borderRadius: 22, padding: 12, cursor: 'pointer', fontFamily: 'inherit' }}>{sDone ? 'Posted ✓ · undo' : 'Mark as posted'}</button>
          </aside>
        </>
      )}
    </div>
  );
}
