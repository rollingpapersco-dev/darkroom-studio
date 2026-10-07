import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { deckBySlug, deckHTML } from './decks.js';
import { createEditor } from './editor.js';

const W = 1920, H = 1080;
const brandKey = slug => 'dr-pitch-brand-' + slug;

// One slide per printed page at the design size (mirrors deck-stage.js's print rules).
const PRINT_CSS = `@page { size: ${W}px ${H}px; margin: 0; }
@media print {
  html, body, #root, .shell, .shell-main, .deck-page, .deck-list { height: auto !important; overflow: visible !important; background: #000 !important; }
  .shell { display: block !important; padding: 0 !important; }
  .shell-nav, .deck-toolbar, .slide-label, .ed-panel, .present, .deck-note { display: none !important; }
  .deck-page, .deck-list { display: block !important; padding: 0 !important; margin: 0 !important; }
  .slide-frame { width: ${W}px !important; height: ${H}px !important; margin: 0 !important; border: 0 !important; border-radius: 0 !important; box-shadow: none !important; break-after: page; page-break-after: always; break-inside: avoid; }
  .deck-list > .slide-block:last-child .slide-frame { break-after: auto; page-break-after: auto; }
  .slide { transform: none !important; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}`;

const waitImages = root => Promise.all([...root.querySelectorAll('img')].map(im => (im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r; }))));

export default function Deck({ slug, print }) {
  const deck = deckBySlug(slug);
  const [brand, setBrand] = useState(() => { try { return localStorage.getItem(brandKey(slug)) || deck?.defaultBrand || ''; } catch (e) { return deck?.defaultBrand || ''; } });
  const [frameW, setFrameW] = useState(0);
  const [editing, setEditing] = useState(false);
  const [selKey, setSelKey] = useState(null);
  const [view, setView] = useState(null);
  const [present, setPresent] = useState(null);
  const [status, setStatus] = useState('');
  const listRef = useRef(null), editorRef = useRef(null), fileRef = useRef(null);

  const html = useMemo(() => (deck ? deckHTML(deck, brand.trim() || deck.defaultBrand) : ''), [deck, brand]);
  const slides = useMemo(() => {
    const t = document.createElement('template'); t.innerHTML = html;
    return [...t.content.children].filter(n => n.tagName === 'SECTION').map((s, i) => ({ n: String(i + 1).padStart(2, '0'), label: s.dataset.label, html: s.outerHTML }));
  }, [html]);

  useEffect(() => { try { if (deck) localStorage.setItem(brandKey(slug), brand); } catch (e) {} }, [brand, slug, deck]);

  useLayoutEffect(() => {
    const el = listRef.current; if (!el) return;
    const fit = () => { const cs = getComputedStyle(el); setFrameW(Math.min(el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), 1440)); };
    fit(); const ro = new ResizeObserver(fit); ro.observe(el); return () => ro.disconnect();
  }, []);

  // print stylesheet while a deck is open
  useEffect(() => {
    const st = document.createElement('style'); st.textContent = PRINT_CSS; document.head.appendChild(st);
    return () => st.remove();
  }, []);

  // Red Bull: in-place editor over the rendered slides
  const ready = frameW > 0;
  useEffect(() => {
    if (!deck?.editable || !ready || !listRef.current) return;
    const ed = createEditor(listRef.current, { onSelect: k => { setSelKey(k); setView(k ? editorRef.current.view() : null); } });
    editorRef.current = ed;
    return () => { ed.destroy(); editorRef.current = null; };
  }, [deck, ready]);
  useEffect(() => { editorRef.current?.setEdit(editing); }, [editing]);

  const doPrint = useCallback(async () => {
    setEditing(false); setPresent(null);
    setStatus('Preparing PDF…');
    if (document.fonts?.ready) await document.fonts.ready;
    await waitImages(listRef.current);
    await new Promise(r => setTimeout(r, 400));
    setStatus('');
    window.print();
  }, []);

  // #pitch/<slug>/print: open straight into the print dialog, as the prototype's ?print=1 did
  useEffect(() => {
    if (!print) return;
    const t = setTimeout(() => { doPrint(); history.replaceState(null, '', '#pitch/' + slug); }, 1200);
    return () => clearTimeout(t);
  }, [print, slug, doPrint]);

  if (!deck) return (
    <div className="deck-page"><div className="deck-missing"><p>That pitch doesn’t exist.</p><a className="pill ghost" href="#pitches">All pitches</a></div></div>
  );

  const scale = frameW / W;
  const replace = async file => { if (!(await editorRef.current?.replace(file))) setStatus('Couldn’t read that image. Try JPG or PNG'); else setView(editorRef.current.view()); };
  const slide = (k, v) => { editorRef.current?.setView({ [k]: v }); setView(editorRef.current?.view() || null); };

  return (
    <div className="deck-page">
      <header className="deck-toolbar">
        <a className="pill ghost" href="#pitches">All pitches</a>
        <div className="deck-title">
          <span className="deck-cat" style={{ color: deck.featured ? '#C8362A' : undefined }}>{deck.category}</span>
          <span className="deck-name">Darkroom × {brand.trim() || deck.defaultBrand}</span>
        </div>
        <div className="deck-actions">
          {!deck.editable && (
            <label className="deck-brand"><span>Brand</span>
              <input type="text" value={brand} placeholder={deck.defaultBrand} onChange={e => setBrand(e.target.value)} />
            </label>
          )}
          {deck.editable && (
            <>
              <button className={'pill ' + (editing ? 'red' : 'ghost')} onClick={() => setEditing(e => !e)}>{editing ? 'Done editing' : 'Edit'}</button>
              <button className="pill ghost" onClick={() => { if (confirm('Reset all text and image edits on this pitch?')) { editorRef.current?.resetAll(); setTimeout(() => location.reload(), 150); } }}>Reset all</button>
            </>
          )}
          <button className="pill ghost" onClick={() => { setEditing(false); setPresent(0); }}>Present ▶</button>
          <button className="pill primary" onClick={doPrint}>Export PDF ↓</button>
        </div>
      </header>

      {editing && <p className="deck-note">Tap any text to edit it. Tap a photo or logo to replace or reframe it. Changes save on this device.</p>}

      <div className="deck-list" ref={listRef} style={{ '--s': scale || 1 }}>
        {frameW > 0 && slides.map(s => (
          <div className="slide-block" key={s.n}>
            <div className="slide-label">{s.n} · {s.label}</div>
            <div className="slide-frame" style={{ width: frameW, height: Math.round(frameW * H / W) }}>
              <div className="slide" style={{ transform: `scale(${scale})` }} dangerouslySetInnerHTML={{ __html: s.html }} />
            </div>
          </div>
        ))}
      </div>

      {status && <div className="toast deck-toast" role="status">{status}</div>}

      {editing && selKey && view && (
        <div className="ed-panel" role="dialog" aria-label="Image">
          <div className="ed-row">
            <button className="pill primary" onClick={() => fileRef.current?.click()}>Replace image</button>
            <button className="pill ghost" onClick={() => { editorRef.current?.resetImage(); setView(editorRef.current?.view() || null); }}>Reset</button>
            <button className="icon-btn" aria-label="Close" onClick={() => editorRef.current?.select(null)}>×</button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => { const f = e.target.files && e.target.files[0]; e.target.value = ''; replace(f); }} />
          </div>
          <div className="sliders">
            <span>Zoom</span><input type="range" min="100" max="300" value={view.z} onChange={e => slide('z', +e.target.value)} /><b>{view.z}%</b>
            <span>X</span><input type="range" min="0" max="100" value={view.x} onChange={e => slide('x', +e.target.value)} /><b>{view.x}%</b>
            <span>Y</span><input type="range" min="0" max="100" value={view.y} onChange={e => slide('y', +e.target.value)} /><b>{view.y}%</b>
          </div>
        </div>
      )}

      {present != null && <Present list={listRef} index={present} count={slides.length} onIndex={setPresent} />}
    </div>
  );
}

// Full-screen, one slide at a time. Shows a copy of the live slide, so Red Bull edits carry over.
function Present({ list, index, count, onIndex }) {
  const stageRef = useRef(null);
  const [vp, setVp] = useState({ w: innerWidth, h: innerHeight });
  useEffect(() => {
    const r = () => setVp({ w: innerWidth, h: innerHeight });
    addEventListener('resize', r);
    document.documentElement.requestFullscreen?.().catch(() => {});
    return () => { removeEventListener('resize', r); if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {}); };
  }, []);
  useEffect(() => {
    const k = e => {
      if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); onIndex(i => Math.min(count - 1, i + 1)); }
      else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); onIndex(i => Math.max(0, i - 1)); }
      else if (e.key === 'Escape') onIndex(null);
    };
    addEventListener('keydown', k); return () => removeEventListener('keydown', k);
  }, [count, onIndex]);
  useEffect(() => {
    const src = list.current?.querySelectorAll('.slide')[index];
    if (src && stageRef.current) stageRef.current.replaceChildren(src.cloneNode(true));
  }, [index, list]);
  const s = Math.min(vp.w / W, vp.h / H);
  return (
    <div className="present" onClick={e => { const x = e.clientX / innerWidth; onIndex(i => (x < 0.33 ? Math.max(0, i - 1) : Math.min(count - 1, i + 1))); }}>
      <div className="present-frame" style={{ width: W * s, height: H * s }}>
        <div ref={stageRef} className="present-stage" style={{ '--ps': s }} />
      </div>
      <div className="present-bar" onClick={e => e.stopPropagation()}>
        <span>{index + 1} / {count}</span>
        <button className="icon-btn" aria-label="Exit presentation" onClick={() => onIndex(null)}>×</button>
      </div>
    </div>
  );
}
