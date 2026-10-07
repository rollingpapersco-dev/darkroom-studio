import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { deckBySlug, deckHTML } from './decks.js';
import { createEditor } from './editor.js';
import { renderPng } from '../exporter.js';
import { jpegsToPdf } from './pdf.js';

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

// PDF pages: 1440×810pt (= 1920×1080px at 96dpi, 16:9), each slide rendered at 3840×2160.
const PDF_LONG = 3840;
const raf2 = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
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
  const [pdf, setPdf] = useState(null); // { i, n } while rendering, then { url, blob, name, n, size }
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

  const name = brand.trim() || deck?.defaultBrand || '';
  const exportPdf = useCallback(async () => {
    if (!listRef.current) return;
    setEditing(false); setPresent(null);
    await raf2();
    const els = [...listRef.current.querySelectorAll('.slide')];
    setPdf({ i: 0, n: els.length });
    try {
      if (document.fonts?.ready) await document.fonts.ready;
      await waitImages(listRef.current);
      const pages = [];
      for (let i = 0; i < els.length; i++) {
        setPdf({ i: i + 1, n: els.length });
        const out = await renderPng(els[i], { w: W, h: H }, { long: PDF_LONG, type: 'image/jpeg', quality: 0.9 });
        pages.push({ bytes: new Uint8Array(await out.blob.arrayBuffer()), w: out.w, h: out.h });
      }
      const title = 'Darkroom × ' + name;
      const blob = jpegsToPdf(pages, { width: 1440, height: 810, title });
      const file = ('Darkroom x ' + name + ' - partnership proposal').replace(/[^\w .×-]+/g, '').replace(/\s+/g, ' ').trim() + '.pdf';
      setPdf({ url: URL.createObjectURL(blob), blob, name: file, n: pages.length, size: blob.size });
    } catch (e) {
      console.error(e); setPdf(null); setStatus('PDF export failed. Try again');
    }
  }, [name]);
  useEffect(() => () => { if (pdf?.url) URL.revokeObjectURL(pdf.url); }, [pdf]);
  useEffect(() => { if (!status) return; const t = setTimeout(() => setStatus(''), 3000); return () => clearTimeout(t); }, [status]);

  // #pitch/<slug>/print (the index's Export PDF): open the deck and start the export straight away
  const ready0 = frameW > 0;
  useEffect(() => {
    if (!print || !ready0) return;
    history.replaceState(null, '', '#pitch/' + slug);
    const t = setTimeout(exportPdf, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [print, ready0]);

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
          <button className="pill primary" onClick={exportPdf} disabled={!!pdf && !pdf.url}>Export PDF ↓</button>
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

      {pdf && <PdfSheet pdf={pdf} onClose={() => { if (pdf.url) setPdf(null); }} />}

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

function PdfSheet({ pdf, onClose }) {
  const file = pdf.blob && new File([pdf.blob], pdf.name, { type: 'application/pdf' });
  const canShare = !!(file && navigator.canShare && navigator.canShare({ files: [file] }));
  const share = async () => { try { await navigator.share({ files: [file], title: pdf.name }); } catch (e) {} };
  return (
    <div className="sheet-wrap" onClick={onClose}>
      <div className="sheet" role="dialog" aria-label="Export PDF" onClick={e => e.stopPropagation()}>
        <div className="sheet-head"><span className="sheet-title">Export PDF</span>{pdf.url && <button className="icon-btn" aria-label="Close" onClick={onClose}>×</button>}</div>
        <div className="sheet-body">
          {!pdf.url ? (
            <div className="exp-busy"><div className="exp-bar"><i /></div><p>Rendering slide {pdf.i} of {pdf.n}…</p></div>
          ) : (
            <div className="exp-result">
              <div className="pdf-meta">
                <span className="pdf-name">{pdf.name}</span>
                <span>{pdf.n} pages · 16:9 · {(pdf.size / 1048576).toFixed(1)} MB</span>
                <span>Each page is 1920 × 1080 (1440 × 810 pt, 20 × 11.25 in), the same shape as a widescreen Keynote, PowerPoint or Google Slides deck.</span>
              </div>
              <div className="exp-actions">
                {canShare && <button className="pill primary big" onClick={share}>Save / Share</button>}
                <a className={'pill big ' + (canShare ? 'ghost' : 'primary')} href={pdf.url} download={pdf.name}>Download PDF</a>
              </div>
              <p className="note">On iPhone, Save / Share → Save to Files keeps the PDF exactly as exported.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
