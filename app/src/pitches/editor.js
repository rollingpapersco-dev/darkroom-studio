// In-place editing for the Red Bull deck, ported from the handoff's pitches/pitch-editor.js.
// Every element with its own text becomes contenteditable; every img[data-img] can be replaced and reframed.
// Text and image framing persist in localStorage, replaced images in IndexedDB (same keys as the prototype).
const KEY = 'dr-pitch-redbull-text', IKEY = 'dr-pitch-redbull-imgs', DB = 'dr-pitch-redbull';

const readJSON = k => { try { return JSON.parse(localStorage.getItem(k) || '{}'); } catch (e) { return {}; } };
const writeJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

function openDB() {
  return new Promise(res => {
    try {
      const r = indexedDB.open(DB, 1);
      r.onupgradeneeded = () => r.result.createObjectStore('imgs');
      r.onsuccess = () => res(r.result);
      r.onerror = () => res(null);
    } catch (e) { res(null); }
  });
}
const dbGet = (db, k) => new Promise(res => {
  if (!db) return res(null);
  const t = db.transaction('imgs').objectStore('imgs').get(k);
  t.onsuccess = () => res(t.result || null); t.onerror = () => res(null);
});
const dbPut = (db, k, v) => {
  if (!db) return;
  const os = db.transaction('imgs', 'readwrite').objectStore('imgs');
  if (v == null) os.delete(k); else os.put(v, k);
};

const fileToURL = file => new Promise((res, rej) => {
  if (!file || !/^image\//.test(file.type)) return rej(new Error('not an image'));
  const url = URL.createObjectURL(file);
  const im = new Image();
  im.onload = () => {
    const k = Math.min(1, 2400 / Math.max(im.width, im.height));
    const c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
    c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
    URL.revokeObjectURL(url);
    res(/png|svg|gif|webp/.test(file.type) ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', 0.9));
  };
  im.onerror = () => { URL.revokeObjectURL(url); rej(new Error('decode failed')); };
  im.src = url;
});

export function createEditor(root, { onSelect = () => {} } = {}) {
  const store = readJSON(KEY), iview = readJSON(IKEY);
  let db = null, editing = false, sel = null, alive = true;

  const imgs = [...root.querySelectorAll('img[data-img]')];
  const applyView = img => {
    const v = iview[img.dataset.img] || {};
    if (v.x != null) { img.style.objectPosition = v.x + '% ' + v.y + '%'; img.style.transformOrigin = v.x + '% ' + v.y + '%'; }
    else { img.style.objectPosition = img.dataset.pos0 || ''; img.style.transformOrigin = ''; }
    img.style.transform = v.z && v.z !== 100 ? 'scale(' + v.z / 100 + ')' : '';
  };
  imgs.forEach(img => { img.dataset.src0 = img.getAttribute('src'); img.dataset.pos0 = img.style.objectPosition || ''; img.draggable = false; applyView(img); });
  openDB().then(d => { db = d; if (!alive) return; imgs.forEach(img => dbGet(db, img.dataset.img).then(u => { if (u && alive) img.src = u; })); });

  // Text leaves: elements that own a non-empty text node and aren't inside another leaf (prototype's leaves()).
  const nodes = [];
  root.querySelectorAll('section').forEach((sec, si) => {
    let i = 0;
    sec.querySelectorAll('div,span,p').forEach(el => {
      const own = [...el.childNodes].some(c => c.nodeType === 3 && c.textContent.trim());
      if (!own) return;
      if (el.parentElement && el.parentElement.closest('[data-ed]')) return;
      el.setAttribute('data-ed', si + '-' + i++); nodes.push(el);
    });
  });
  nodes.forEach(el => { const k = el.getAttribute('data-ed'); if (store[k] != null) el.innerHTML = store[k]; });

  const select = img => {
    if (sel) sel.classList.remove('ed-sel');
    sel = img || null;
    if (sel) sel.classList.add('ed-sel');
    onSelect(sel ? sel.dataset.img : null);
  };
  const imgAt = (sec, x, y) => [...sec.querySelectorAll('img[data-img]')].find(im => { const r = im.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; });

  const onInput = e => {
    const el = e.target.closest && e.target.closest('[data-ed]'); if (!el || !root.contains(el)) return;
    store[el.getAttribute('data-ed')] = el.innerHTML; writeJSON(KEY, store);
  };
  const onClick = e => {
    if (!editing) return;
    let img = e.target.closest && e.target.closest('img[data-img]');
    if (!img && !(e.target.closest && e.target.closest('[data-ed]'))) {
      const sec = e.target.closest && e.target.closest('section');
      if (sec) img = imgAt(sec, e.clientX, e.clientY);
    }
    if (img) { e.preventDefault(); e.stopPropagation(); select(img); }
  };
  const onDragOver = e => { if (editing) e.preventDefault(); };
  const onDrop = e => {
    const sec = e.target.closest && e.target.closest('section'); if (!sec) return;
    const img = e.target.closest('img[data-img]') || imgAt(sec, e.clientX, e.clientY); if (!img) return;
    e.preventDefault(); e.stopPropagation();
    select(img); api.replace(e.dataTransfer.files[0]);
  };
  root.addEventListener('input', onInput, true);
  root.addEventListener('click', onClick, true);
  root.addEventListener('dragover', onDragOver, true);
  root.addEventListener('drop', onDrop, true);

  const api = {
    setEdit(on) {
      editing = on;
      root.classList.toggle('editing', on);
      nodes.forEach(el => { if (on) el.setAttribute('contenteditable', 'true'); else el.removeAttribute('contenteditable'); });
      if (!on) select(null);
    },
    select,
    view() {
      if (!sel) return null;
      const v = iview[sel.dataset.img] || {};
      const y0 = sel.dataset.pos0 && sel.dataset.pos0.split(' ')[1] ? parseFloat(sel.dataset.pos0.split(' ')[1]) : 50;
      return { z: v.z || 100, x: v.x == null ? 50 : v.x, y: v.y == null ? y0 : v.y };
    },
    setView(patch) {
      if (!sel) return;
      iview[sel.dataset.img] = { ...api.view(), ...patch };
      applyView(sel); writeJSON(IKEY, iview);
    },
    async replace(file) {
      if (!sel) return false;
      const img = sel;
      try {
        const url = await fileToURL(file);
        img.src = url; dbPut(db, img.dataset.img, url);
        iview[img.dataset.img] = {}; writeJSON(IKEY, iview); applyView(img);
        return true;
      } catch (e) { return false; }
    },
    resetImage() {
      if (!sel) return;
      const k = sel.dataset.img;
      delete iview[k]; writeJSON(IKEY, iview); dbPut(db, k, null);
      sel.src = sel.dataset.src0; applyView(sel);
    },
    resetAll() {
      try { localStorage.removeItem(KEY); localStorage.removeItem(IKEY); } catch (e) {}
      if (db) db.transaction('imgs', 'readwrite').objectStore('imgs').clear();
    },
    destroy() {
      alive = false;
      root.removeEventListener('input', onInput, true);
      root.removeEventListener('click', onClick, true);
      root.removeEventListener('dragover', onDragOver, true);
      root.removeEventListener('drop', onDrop, true);
    },
  };
  return api;
}
