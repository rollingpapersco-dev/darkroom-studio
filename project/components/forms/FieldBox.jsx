import React from 'react';
export function FieldBox({ label, type = 'text', multiline = false, value, onChange, required, style }) {
  const inputStyle = { width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 16, fontFamily: 'inherit', padding: 0, resize: 'vertical' };
  return (
    <label style={{ display: 'block', width: '100%', position: 'relative', background: 'var(--surface-glass)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem', fontFamily: 'var(--font-sans)', ...style }}>
      <span style={{ fontSize: 11, color: 'var(--text-label)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>{label}</span>
      {multiline ? <textarea value={value} onChange={onChange} required={required} style={inputStyle} /> : <input type={type} value={value} onChange={onChange} required={required} style={inputStyle} />}
    </label>
  );
}
