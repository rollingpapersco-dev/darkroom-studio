// Minimal PDF writer: one full-bleed JPEG per page (DCTDecode, so the JPEG bytes embed as they are).
// Page size is in PDF points (1pt = 1/72in); decks use 1440×810pt, i.e. 1920×1080 at 96dpi, 16:9.
export function jpegsToPdf(pages, { width = 1440, height = 810, title = '' } = {}) {
  const enc = new TextEncoder();
  const chunks = [], offsets = [];
  let len = 0;
  const push = x => { const b = typeof x === 'string' ? enc.encode(x) : x; chunks.push(b); len += b.length; };
  const obj = (id, write) => { offsets[id] = len; push(id + ' 0 obj\n'); write(); push('\nendobj\n'); };
  // text strings as UTF-16BE hex with a BOM, so titles like "Darkroom × Red Bull" survive
  const pdfStr = s => '<FEFF' + [...s].map(ch => { const c = ch.codePointAt(0); return c > 0xffff ? '' : c.toString(16).padStart(4, '0'); }).join('').toUpperCase() + '>';

  push('%PDF-1.4\n');
  push(new Uint8Array([0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a])); // binary marker comment
  const n = pages.length, first = 4; // 1 catalog · 2 pages · 3 info · then 3 objects per page
  obj(1, () => push('<< /Type /Catalog /Pages 2 0 R >>'));
  obj(2, () => push(`<< /Type /Pages /Count ${n} /Kids [${pages.map((_, i) => `${first + 3 * i} 0 R`).join(' ')}] >>`));
  obj(3, () => push(`<< /Title ${pdfStr(title)} /Producer (Darkroom Studio) >>`));
  pages.forEach((pg, i) => {
    const id = first + 3 * i;
    obj(id, () => push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /XObject << /Im0 ${id + 2} 0 R >> >> /Contents ${id + 1} 0 R >>`));
    const draw = `q ${width} 0 0 ${height} 0 0 cm /Im0 Do Q`;
    obj(id + 1, () => push(`<< /Length ${draw.length} >>\nstream\n${draw}\nendstream`));
    obj(id + 2, () => {
      push(`<< /Type /XObject /Subtype /Image /Width ${pg.w} /Height ${pg.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${pg.bytes.length} >>\nstream\n`);
      push(pg.bytes); push('\nendstream');
    });
  });
  const total = first + 3 * n, xref = len;
  let table = `xref\n0 ${total}\n0000000000 65535 f \n`;
  for (let id = 1; id < total; id++) table += String(offsets[id]).padStart(10, '0') + ' 00000 n \n';
  push(table);
  push(`trailer\n<< /Size ${total} /Root 1 0 R /Info 3 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  return new Blob(chunks, { type: 'application/pdf' });
}
