import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { TEMPLATES, ORDER, GROUPS, TYPE_OPTS, LOGO, CREDIT, dimsOf, typeVars } from './templates.js';
import { renderBoard } from './boardTemplate.js';
import { loadSaved, save, loadImages, putImage, deleteImage, fileToDataURL } from './storage.js';
import { renderPng, warmFonts } from './exporter.js';

const BOARD_FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif";
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const pad = n => String(n).padStart(2, '0');
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const sizeLabel = T => (T.sizes ? T.sizes.map(z => z[0]).join(' · ') : T.w + '×' + T.h);
const k4 = T => [Math.round(T.w * 3840 / Math.max(T.w, T.h)), Math.round(T.h * 3840 / Math.max(T.w, T.h))];

function useWide() {
  const q = '(min-width: 960px)';
  const [wide, setWide] = useState(() => matchMedia(q).matches);
  useEffect(() => { const m = matchMedia(q); const f = () => setWide(m.matches); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, []);
  return wide;
}

export default function App() {
  const wide = useWide();
  const [st, setSt] = useState(() => {
    const saved = loadSaved();
    const h = (location.hash || '').slice(1);
    const tpl = TEMPLATES[h] ? h : TEMPLATES[saved.tpl] ? saved.tpl : 'announceA';
    return { tpl, data: saved.data || {}, guides: saved.guides ?? true };
  });
  const [imgs, setImgs] = useState({});
  const [status, setStatus] = useState('');
  const [typeOpen, setTypeOpen] = useState(null);
  const [tab, setTab] = useState('text');
  const [panelOpen, setPanelOpen] = useState(true);
  const [sheet, setSheet] = useState(null); // 'templates' | 'export'
  const [exporting, setExporting] = useState(false);
  const [result, setResult] = useState(null);
  const boardRef = useRef(null);

  const { tpl, data, guides } = st;
  const T = dimsOf(tpl, data);
  const dt = data[tpl] || {};

  useEffect(() => { save(st); }, [st]);
  useEffect(() => {
    warmFonts();
    loadImages().then(found => setImgs(cur => {
      const m = { ...found };
      Object.keys(cur).forEach(t => { m[t] = { ...(m[t] || {}), ...cur[t] }; });
      return m;
    })).catch(() => {});
  }, []);
  useEffect(() => { if (!status) return; const t = setTimeout(() => setStatus(''), 2800); return () => clearTimeout(t); }, [status]);
  useEffect(() => () => result && URL.revokeObjectURL(result.url), [result]);

  const setTpl = k => { setSt(s => ({ ...s, tpl: k })); setTypeOpen(null); setSheet(null); history.replaceState(null, '', '#' + k); };
  const setField = useCallback((key, val) => setSt(s => ({ ...s, data: { ...s.data, [s.tpl]: { ...(s.data[s.tpl] || {}), [key]: val } } })), []);
  const setFields = useCallback(patch => setSt(s => ({ ...s, data: { ...s.data, [s.tpl]: { ...(s.data[s.tpl] || {}), ...patch } } })), []);
  const setType = (key, patch) => setSt(s => {
    const cur = { ...(s.data[s.tpl] || {}) };
    if (patch === null) delete cur['_t_' + key]; else cur['_t_' + key] = { ...(cur['_t_' + key] || {}), ...patch };
    return { ...s, data: { ...s.data, [s.tpl]: cur } };
  });

  async function setImage(key, file) {
    if (!file) return;
    const okType = (file.type && file.type.startsWith('image/')) || /\.(jpe?g|png|webp|gif|avif|heic|heif|bmp)$/i.test(file.name || '');
    if (!okType) { setStatus('That file isn’t an image'); return; }
    const t = tpl;
    setStatus('Processing image…');
    try {
      const out = await fileToDataURL(file);
      setImgs(s => ({ ...s, [t]: { ...(s[t] || {}), [key]: out } }));
      setSt(s => ({ ...s, data: { ...s.data, [t]: { ...(s.data[t] || {}), [key + 'Z']: 100 } } }));
      setStatus('Image added');
      putImage(t, key, out).catch(() => setStatus('Image shown but not saved (storage full)'));
    } catch (e) {
      setStatus(/heic|heif/i.test(file.type + file.name) ? 'HEIC isn’t supported here. Export as JPG/PNG first' : 'Couldn’t read that image. Try JPG or PNG');
    }
  }
  async function setImageFromDrop(key, dtr) {
    if (!dtr) return;
    const f = (dtr.files && dtr.files[0]) || [...(dtr.items || [])].map(i => i.kind === 'file' && i.getAsFile()).find(Boolean);
    if (f) return setImage(key, f);
    const url = dtr.getData('text/uri-list') || dtr.getData('text/plain');
    if (url && /^https?:|^data:image/.test(url)) {
      try { const b = await (await fetch(url)).blob(); return setImage(key, new File([b], 'drop.' + (b.type.split('/')[1] || 'jpg'), { type: b.type })); }
      catch (e) { setStatus('Couldn’t load that image. Save it and drop the file instead'); }
    }
  }
  function resetImage(key) {
    setField(key + 'Z', 100);
    setImgs(s => { const m = { ...(s[tpl] || {}) }; delete m[key]; return { ...s, [tpl]: m }; });
    deleteImage(tpl, key).catch(() => {});
  }
  function resetTemplate() {
    if (!confirm('Reset “' + T.name + '” to its default copy, images and styling?')) return;
    Object.keys(imgs[tpl] || {}).forEach(k => deleteImage(tpl, k).catch(() => {}));
    setImgs(s => ({ ...s, [tpl]: {} }));
    setSt(s => { const nd = { ...s.data }; delete nd[s.tpl]; return { ...s, data: nd }; });
    setStatus('Template reset');
  }

  async function doExport(long) {
    if (exporting) return;
    setSheet('export'); setResult(null); setExporting(true);
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    try {
      const out = await renderPng(boardRef.current, T, { long, mono: (dt.mono ?? true) ? 1 : 0, tint: (dt.tint ?? 20) / 100, onStatus: setStatus });
      const name = 'darkroom-' + tpl + '-' + out.w + 'x' + out.h + '.png';
      setResult({ ...out, name, url: URL.createObjectURL(out.blob) });
      setStatus('Exported ' + out.w + '×' + out.h);
    } catch (e) {
      console.error(e); setStatus('Export failed'); setSheet(null);
    }
    setExporting(false);
  }

  // ---- board scope (mirrors renderVals in the prototype) ----
  const scope = useMemo(() => {
    const d = { ...T.d, ...dt, ...(imgs[tpl] || {}) };
    d.creditText = d.showCredit ? CREDIT : '';
    const posOf = k => (d[k + 'X'] ?? 50) + '% ' + (d[k + 'Y'] ?? 50) + '%';
    ['img'].concat(Array.from({ length: 15 }, (_, i) => 'img' + (i + 1))).forEach(k => { d[k + 'Pos'] = posOf(k); d[k + 'Zoom'] = (d[k + 'Z'] ?? 100) / 100; });
    const is = {}; ORDER.forEach(k => { is[k] = k === tpl; });
    return {
      d, is, logo: LOGO,
      pills: Array.from({ length: d.totalEps || 0 }, (_, i) => ({ num: 'EP.' + pad(i + 1), active: i + 1 === Number(d.activeEp), inactive: i + 1 !== Number(d.activeEp) })),
      segs: Array.from({ length: d.total || 0 }, (_, i) => ({ on: i < d.filled, off: i >= d.filled })),
      tiles: Array.from({ length: 15 }, (_, i) => i + 1).map(n => ({ num: 'EP.' + pad(n), img: d['img' + n] || BLANK, pos: d['img' + n + 'Pos'], zoom: d['img' + n + 'Zoom'] })),
      arch: Object.assign(T.w > T.h ? { dir: 'row', align: 'flex-start', textAlign: 'left', logoJustify: 'flex-start', textFlex: '1 1 0' } : { dir: 'column', align: 'center', textAlign: 'center', logoJustify: 'center', textFlex: '0 0 auto' }, T.h === 1920 ? { top: 270, bottom: 360 } : { top: 72, bottom: 72 }),
    };
  }, [T, dt, imgs, tpl]);

  const vars = useMemo(() => {
    const v = { '--logo': String((dt.logoScale ?? 100) / 100), '--tint': String((dt.tint ?? 20) / 100), '--mono': (dt.mono ?? true) ? '1' : '0' };
    Object.keys(dt).filter(k => k.startsWith('_t_')).forEach(k => Object.assign(v, typeVars(k.slice(3), dt[k])));
    return v;
  }, [dt]);

  const imageFields = T.fields.filter(f => f[2] === 'image');
  const textFields = T.fields.filter(f => f[2] !== 'image');
  const dragKey = imageFields.length === 1 ? imageFields[0][0] : null;
  const activeTab = tab === 'images' && !imageFields.length ? 'text' : tab;
  const d = scope.d;

  const fieldProps = { d, dt, typeOpen, setTypeOpen, setField, setType };
  const textSection = textFields.map(f => <Field key={tpl + f[0]} f={f} {...fieldProps} />);
  const imageEl = ([key, label]) => (
    <ImageField key={tpl + key} label={label} value={d[key]} x={d[key + 'X'] ?? 50} y={d[key + 'Y'] ?? 50} z={d[key + 'Z'] ?? 100} pos={d[key + 'Pos']} mono={(dt.mono ?? true) ? 1 : 0}
      onFile={file => setImage(key, file)} onDrop={e => setImageFromDrop(key, e.dataTransfer)} onReset={() => resetImage(key)}
      onX={v => setField(key + 'X', v)} onY={v => setField(key + 'Y', v)} onZ={v => setField(key + 'Z', v)} />
  );
  const imageSection = imageFields.map(imageEl);
  const allFields = T.fields.map(f => (f[2] === 'image' ? imageEl(f) : <Field key={tpl + f[0]} f={f} {...fieldProps} />));
  const lookSection = (
    <>
      {T.sizes && (
        <div className="size-grid">
          {T.sizes.map((z, i) => (
            <button key={z[0]} className={'size-opt' + ((dt.size ?? 0) === i ? ' on' : '')} onClick={() => setField('size', i)}>
              <span className="size-l">{z[0]}</span><span className="size-d">{z[1]}×{z[2]}</span>
            </button>
          ))}
        </div>
      )}
      <div className="box sliders">
        <span>Logo size</span><input type="range" min="40" max="300" step="5" value={dt.logoScale ?? 100} onChange={e => setField('logoScale', Number(e.target.value))} /><b>{dt.logoScale ?? 100}%</b>
        <span>Black tint</span><input type="range" min="0" max="60" step="1" value={dt.tint ?? 20} onChange={e => setField('tint', Number(e.target.value))} /><b>{dt.tint ?? 20}%</b>
        <span>B&amp;W</span><Seg value={dt.mono ?? true} opts={[['On', true], ['Off', false]]} onChange={v => setField('mono', v)} /><b />
      </div>
      {T.safe && (
        <button className="box row-btn" onClick={() => setSt(s => ({ ...s, guides: !s.guides }))}>
          <span className="lbl">Safe-area guides</span><Toggle on={guides} />
        </button>
      )}
      <button className="ghost-btn" onClick={resetTemplate}>Reset template</button>
      <p className="note">Edits and images are saved on this device. Export 4K scales the long edge to 3840px.</p>
    </>
  );

  const [w4, h4] = k4(T);
  const templateList = <TemplateList tpl={tpl} onPick={setTpl} />;

  return (
    <div className={'app' + (wide ? ' wide' : '') + (panelOpen || wide ? '' : ' collapsed')}>
      <header className="topbar">
        <div className="brand">
          <img src={LOGO} alt="DARKROOM" />
          {wide && <span>Social Studio</span>}
        </div>
        {!wide && (
          <button className="tplbar" onClick={() => setSheet('templates')} aria-label={'Template: ' + T.name + '. Change template'}>
            <span className="tpl-glyph">☰</span>
            <span className="tpl-text"><span className="tpl-name">{T.name}</span><span className="tpl-dims">{T.w}×{T.h}</span></span>
          </button>
        )}
        <div className="top-actions">
          {wide && <span className="status-inline">{status}</span>}
          {wide && <button className="pill ghost" onClick={() => doExport(0)}>PNG · {T.w}×{T.h}</button>}
          <button className="pill primary" onClick={() => (wide ? doExport(3840) : setSheet('export'))}>{wide ? `Export 4K · ${w4}×${h4}` : 'Export'}</button>
        </div>
      </header>

      {wide && <aside className="side">{templateList}</aside>}

      <Stage T={T} dragKey={dragKey} d={d} setFields={setFields}>
        <div ref={boardRef} className="board" style={{ position: 'relative', overflow: 'hidden', background: '#000', width: T.w, height: T.h, fontFamily: BOARD_FONT, color: '#f5f5f7', ...vars }}>
          {renderBoard(scope)}
          {guides && !exporting && T.safe && T.safe.map((b, i) => (
            <div key={i} style={{ position: 'absolute', left: b.x, top: b.y, width: b.w, height: b.h, border: '3px dashed rgba(200,54,42,0.75)', pointerEvents: 'none' }} />
          ))}
        </div>
      </Stage>

      {wide ? (
        <aside className="panel">
          <div className="panel-head"><div className="panel-title">{T.name}</div><div className="panel-dims">{T.w}×{T.h}</div></div>
          {lookSection}
          {allFields}
        </aside>
      ) : (
        <>
          <nav className="tabs" role="tablist">
            {[['text', 'Text'], ...(imageFields.length ? [['images', imageFields.length > 1 ? `Images · ${imageFields.length}` : 'Image']] : []), ['look', 'Look']].map(([k, l]) => (
              <button key={k} role="tab" aria-selected={activeTab === k} className={'tab' + (activeTab === k ? ' on' : '')}
                onClick={() => { if (activeTab === k) setPanelOpen(o => !o); else { setTab(k); setPanelOpen(true); } }}>{l}</button>
            ))}
            <button className="tab collapse" aria-label={panelOpen ? 'Hide panel' : 'Show panel'} onClick={() => setPanelOpen(o => !o)}>{panelOpen ? '×' : '☰'}</button>
          </nav>
          {panelOpen && (
            <div className="panel" key={tpl + activeTab}>
              {activeTab === 'text' && textSection}
              {activeTab === 'images' && <>{dragKey && <p className="hint">Drag the preview to reframe. Pinch to scale.</p>}{imageSection}</>}
              {activeTab === 'look' && lookSection}
            </div>
          )}
        </>
      )}

      {status && !wide && <div className="toast" role="status">{status}</div>}

      {sheet === 'templates' && (
        <Sheet title="Templates" onClose={() => setSheet(null)}>{templateList}</Sheet>
      )}
      {sheet === 'export' && (
        <Sheet title="Export" onClose={() => { if (!exporting) { setSheet(null); setResult(null); } }}>
          <ExportPanel T={T} w4={w4} h4={h4} exporting={exporting} result={result} status={status}
            onPick={doExport} onAgain={() => setResult(null)} />
        </Sheet>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

function Stage({ T, dragKey, d, setFields, children }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(0.3);
  const gesture = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const fit = () => {
      const padX = el.clientWidth < 600 ? 32 : 64, padY = el.clientWidth < 600 ? 24 : 64;
      const s = Math.min((el.clientWidth - padX) / T.w, (el.clientHeight - padY) / T.h);
      if (s > 0) setScale(s);
    };
    fit();
    const ro = new ResizeObserver(fit); ro.observe(el);
    return () => ro.disconnect();
  }, [T.w, T.h]);

  const pts = useRef(new Map());
  const onDown = e => {
    if (!dragKey) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const p = [...pts.current.values()];
    gesture.current = {
      x0: d[dragKey + 'X'] ?? 50, y0: d[dragKey + 'Y'] ?? 50, z0: d[dragKey + 'Z'] ?? 100,
      start: p.map(q => ({ ...q })), dist: p.length > 1 ? Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) : 0,
    };
  };
  const onMove = e => {
    const g = gesture.current; if (!g || !pts.current.has(e.pointerId)) return;
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const p = [...pts.current.values()];
    const bw = T.w * scale, bh = T.h * scale;
    if (p.length > 1 && g.dist) {
      const dist = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
      setFields({ [dragKey + 'Z']: Math.round(clamp(g.z0 * dist / g.dist, 50, 300)) });
    } else if (p.length === 1 && g.start.length === 1) {
      const dx = (p[0].x - g.start[0].x) / bw * 100, dy = (p[0].y - g.start[0].y) / bh * 100;
      setFields({ [dragKey + 'X']: Math.round(clamp(g.x0 - dx, 0, 100)), [dragKey + 'Y']: Math.round(clamp(g.y0 - dy, 0, 100)) });
    }
  };
  const onUp = e => {
    pts.current.delete(e.pointerId);
    if (pts.current.size) onDown({ currentTarget: e.currentTarget, pointerId: [...pts.current.keys()][0], clientX: [...pts.current.values()][0].x, clientY: [...pts.current.values()][0].y });
    else gesture.current = null;
  };

  return (
    <main className="stage" ref={ref}>
      <div className={'frame' + (dragKey ? ' draggable' : '')} style={{ width: Math.round(T.w * scale), height: Math.round(T.h * scale) }}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        <div style={{ position: 'absolute', top: 0, left: 0, transform: `scale(${scale})`, transformOrigin: '0 0' }}>{children}</div>
      </div>
    </main>
  );
}

function TemplateList({ tpl, onPick }) {
  return GROUPS.map(g => (
    <div className="tgroup" key={g}>
      <div className="eyebrow">{g}</div>
      {ORDER.filter(k => TEMPLATES[k].group === g).map(k => (
        <button key={k} className={'titem' + (k === tpl ? ' on' : '')} onClick={() => onPick(k)}>
          <span className="tname">{TEMPLATES[k].name}</span><span className="tsize">{sizeLabel(TEMPLATES[k])}</span>
        </button>
      ))}
    </div>
  ));
}

function Sheet({ title, onClose, children }) {
  useEffect(() => {
    const k = e => e.key === 'Escape' && onClose();
    addEventListener('keydown', k); return () => removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <div className="sheet-wrap" onClick={onClose}>
      <div className="sheet" role="dialog" aria-label={title} onClick={e => e.stopPropagation()}>
        <div className="sheet-head"><span className="sheet-title">{title}</span><button className="icon-btn" aria-label="Close" onClick={onClose}>×</button></div>
        <div className="sheet-body">{children}</div>
      </div>
    </div>
  );
}

function ExportPanel({ T, w4, h4, exporting, result, status, onPick, onAgain }) {
  const file = result && new File([result.blob], result.name, { type: 'image/png' });
  const canShare = !!(file && navigator.canShare && navigator.canShare({ files: [file] }));
  const share = async () => { try { await navigator.share({ files: [file], title: result.name }); } catch (e) {} };
  if (exporting) return <div className="exp-busy"><div className="exp-bar"><i /></div><p>{status || 'Rendering…'}</p></div>;
  if (result) return (
    <div className="exp-result">
      <img src={result.url} alt="Exported post" />
      <div className="exp-meta">{result.w}×{result.h} · PNG</div>
      <div className="exp-actions">
        {canShare && <button className="pill primary big" onClick={share}>Save / Share</button>}
        <a className={'pill big ' + (canShare ? 'ghost' : 'primary')} href={result.url} download={result.name}>Download PNG</a>
      </div>
      <p className="note">On iPhone you can also press and hold the image and choose Save to Photos.</p>
      <button className="ghost-btn" onClick={onAgain}>Export another size</button>
    </div>
  );
  return (
    <div className="exp-opts">
      <button className="exp-opt" onClick={() => onPick(0)}><span className="eo-t">Standard PNG</span><span className="eo-d">{T.w}×{T.h} · native platform size</span><span className="eo-a">→</span></button>
      <button className="exp-opt" onClick={() => onPick(3840)}><span className="eo-t">4K PNG</span><span className="eo-d">{w4}×{h4} · long edge 3840px</span><span className="eo-a">→</span></button>
      <p className="note">Safe-area guides are never included in exports.</p>
    </div>
  );
}

function Seg({ value, opts, onChange }) {
  return (
    <div className="seg">
      {opts.map(([l, v, sw]) => (
        <button key={l} className={'chip' + (value === v ? ' on' : '')} onClick={() => onChange(v)}>
          {sw ? <span className="sw" style={{ background: sw }} /> : null}{l}
        </button>
      ))}
    </div>
  );
}
const Toggle = ({ on }) => <span className={'toggle' + (on ? ' on' : '')}>{on ? 'ON' : 'OFF'}</span>;

function Field({ f: [key, label, type = 'text'], d, dt, typeOpen, setTypeOpen, setField, setType }) {
  if (type === 'toggle') return (
    <button className="box row-btn" onClick={() => setField(key, !d[key])}><span className="lbl">{label}</span><Toggle on={!!d[key]} /></button>
  );
  if (type === 'number') return (
    <label className="box row-btn">
      <span className="lbl">{label}</span>
      <span className="stepper">
        <button type="button" aria-label="Decrease" onClick={() => setField(key, clamp((Number(d[key]) || 0) - 1, 0, 30))}>−</button>
        <input type="number" inputMode="numeric" min="0" max="30" value={d[key] ?? 0} onChange={e => setField(key, clamp(parseInt(e.target.value || '0', 10) || 0, 0, 30))} />
        <button type="button" aria-label="Increase" onClick={() => setField(key, clamp((Number(d[key]) || 0) + 1, 0, 30))}>+</button>
      </span>
    </label>
  );
  const t = dt['_t_' + key] || {};
  const open = typeOpen === key;
  const customized = Object.keys(t).length > 0;
  return (
    <div className="box">
      <div className="field-head">
        <span className="lbl">{label}</span>
        <button className={'aa' + (open ? ' open' : customized ? ' custom' : '')} title="Font controls" aria-expanded={open} onClick={() => setTypeOpen(open ? null : key)}>Aa</button>
      </div>
      {type === 'area'
        ? <textarea rows="3" value={d[key] ?? ''} onChange={e => setField(key, e.target.value)} />
        : <input type="text" value={d[key] ?? ''} onChange={e => setField(key, e.target.value)} />}
      {open && (
        <div className="type-ctl">
          <div className="trow"><span>Size</span><input type="range" min="40" max="250" step="5" value={t.s ?? 100} onChange={e => setType(key, { s: Number(e.target.value) })} /><b>{t.s ?? 100}%</b></div>
          <div className="trow"><span>Tracking</span><input type="range" min="-10" max="40" step="1" value={t.ls ?? 0} onChange={e => setType(key, { ls: Number(e.target.value) })} /><b>{t.ls == null ? 'Auto' : (t.ls / 100).toFixed(2)}</b></div>
          {[['Font', 'font', TYPE_OPTS.font], ['Weight', 'w', TYPE_OPTS.weight], ['Color', 'c', TYPE_OPTS.color], ['Case', 'tt', TYPE_OPTS.case]].map(([l, prop, list]) => (
            <div className="trow opts" key={prop}><span>{l}</span><Seg value={t[prop] ?? null} opts={list} onChange={v => setType(key, { [prop]: v })} /></div>
          ))}
          <button className="link-btn" onClick={() => setType(key, null)}>Reset type</button>
        </div>
      )}
    </div>
  );
}

function ImageField({ label, value, x, y, z, pos, mono, onFile, onDrop, onReset, onX, onY, onZ }) {
  return (
    <div className="box img-field">
      <div className="field-head"><span className="lbl">{label}</span><button className="link-btn" onClick={onReset}>Reset</button></div>
      <label className="drop" onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }} onDrop={e => { e.preventDefault(); e.stopPropagation(); onDrop(e); }}>
        {value ? <img src={value} alt="" style={{ objectPosition: pos, filter: `grayscale(${mono})` }} /> : null}
        <span className="drop-cta">{value ? 'Tap to replace' : 'Tap to add a still'}</span>
        <input type="file" accept="image/*,.heic,.heif,.webp,.avif" onChange={e => { const f = e.target.files && e.target.files[0]; e.target.value = ''; onFile(f); }} />
      </label>
      <div className="sliders">
        <span>Focus X</span><input type="range" min="0" max="100" value={x} onChange={e => onX(Number(e.target.value))} /><b>{x}%</b>
        <span>Focus Y</span><input type="range" min="0" max="100" value={y} onChange={e => onY(Number(e.target.value))} /><b>{y}%</b>
        <span>Scale</span><input type="range" min="50" max="300" step="5" value={z} onChange={e => onZ(Number(e.target.value))} /><b>{z}%</b>
      </div>
    </div>
  );
}
