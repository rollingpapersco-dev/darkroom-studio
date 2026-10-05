// Edits live in localStorage; imported images (large data URLs) live in IndexedDB.
export const LS = 'dr-social-studio-v1';

export function loadSaved() {
  try { return JSON.parse(localStorage.getItem(LS) || '{}'); } catch (e) { return {}; }
}
export function save(obj) {
  try { localStorage.setItem(LS, JSON.stringify(obj)); } catch (e) {}
}

function idb() {
  return new Promise((res, rej) => {
    const r = indexedDB.open('dr-social-studio', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('imgs');
    r.onsuccess = () => res(r.result);
    r.onerror = e => { e.preventDefault && e.preventDefault(); rej(r.error); };
  });
}
async function idbOp(mode, fn) {
  const db = await idb();
  return new Promise((res, rej) => {
    const tx = db.transaction('imgs', mode);
    const out = fn(tx.objectStore('imgs'));
    tx.oncomplete = () => res(out && out.result);
    tx.onerror = () => rej(tx.error);
  });
}

// Returns { [tpl]: { [field]: dataURL } }
export async function loadImages() {
  const keys = await idbOp('readonly', s => s.getAllKeys());
  const vals = await idbOp('readonly', s => s.getAll());
  const imgs = {};
  (keys || []).forEach((k, i) => { const [t, f] = k.split(':'); (imgs[t] = imgs[t] || {})[f] = vals[i]; });
  return imgs;
}
export const putImage = (tpl, key, url) => idbOp('readwrite', s => s.put(url, tpl + ':' + key));
export const deleteImage = (tpl, key) => idbOp('readwrite', s => s.delete(tpl + ':' + key));

// Decodes any browser-readable image, caps the long edge at 4096px and re-encodes as JPEG.
export async function fileToDataURL(file) {
  const blobUrl = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = blobUrl;
    await (img.decode ? img.decode() : new Promise((res, rej) => { img.onload = res; img.onerror = rej; }));
    if (!img.naturalWidth) throw new Error('empty');
    const k = Math.min(1, 4096 / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas');
    c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', 0.92);
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}
