// Renders the board markup from the Claude Design prototype (board.html) as React elements.
// Supports the subset of the prototype's template syntax the boards use:
// {{ path }} interpolation, <sc-if value="{{ x }}"> and <sc-for list="{{ xs }}" as="x">.
import { createElement, Fragment } from 'react';
import raw from './board.html?raw';

const EXPR = /{{\s*([\w.]+)\s*}}/g;
const get = (scope, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), scope);
const interp = (str, scope) => str.replace(EXPR, (_, p) => { const v = get(scope, p); return v == null ? '' : String(v); });
const exprOf = str => { const m = /^{{\s*([\w.]+)\s*}}$/.exec((str || '').trim()); return m && m[1]; };

const styleCache = new Map();
function parseStyle(css) {
  let out = styleCache.get(css);
  if (out) return out;
  out = {};
  let depth = 0, start = 0;
  const decls = [];
  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (c === '(') depth++;
    else if (c === ')') depth--;
    else if (c === ';' && depth === 0) { decls.push(css.slice(start, i)); start = i + 1; }
  }
  decls.push(css.slice(start));
  for (const d of decls) {
    const i = d.indexOf(':'); if (i < 0) continue;
    const prop = d.slice(0, i).trim(), val = d.slice(i + 1).trim();
    if (!prop) continue;
    const key = prop.startsWith('--') ? prop : prop.replace(/^-webkit-/, 'Webkit-').replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
    out[key] = val;
  }
  if (styleCache.size > 4000) styleCache.clear();
  styleCache.set(css, out);
  return out;
}

function compileNodes(nodes) {
  const fns = [];
  nodes.forEach(n => { const f = compile(n); if (f) fns.push(f); });
  return (scope, keyPrefix) => fns.map((f, i) => f(scope, keyPrefix + '.' + i));
}

function compile(node) {
  if (node.nodeType === 3) {
    const t = node.nodeValue;
    if (!t.trim() && t.includes('\n')) return null;
    if (!t.includes('{{')) return () => t;
    return scope => interp(t, scope);
  }
  if (node.nodeType !== 1) return null;
  const tag = node.tagName.toLowerCase();
  const kids = compileNodes([...node.childNodes]);
  if (tag === 'sc-if') {
    const p = exprOf(node.getAttribute('value'));
    return (scope, key) => (get(scope, p) ? createElement(Fragment, { key }, ...kids(scope, key)) : null);
  }
  if (tag === 'sc-for') {
    const p = exprOf(node.getAttribute('list')), as = node.getAttribute('as');
    return (scope, key) => createElement(Fragment, { key }, ...(get(scope, p) || []).map((item, i) => createElement(Fragment, { key: i }, ...kids({ ...scope, [as]: item }, key + ':' + i))));
  }
  const attrs = [...node.attributes].filter(a => !a.name.startsWith('hint-'));
  return (scope, key) => {
    const props = { key };
    for (const a of attrs) {
      const v = a.value.includes('{{') ? interp(a.value, scope) : a.value;
      if (a.name === 'style') props.style = parseStyle(v);
      else props[a.name] = v;
    }
    if (tag === 'img' && !props.src) return null;
    return createElement(tag, props, ...kids(scope, key));
  };
}

const tpl = document.createElement('template');
tpl.innerHTML = raw;
const root = compileNodes([...tpl.content.childNodes]);

export const renderBoard = scope => root(scope, 'b');
