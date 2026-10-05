// Loads the design-system component .jsx sources in-browser (strip ESM, transpile with Babel) and exposes them on window.DR.
// In consuming projects prefer the compiled _ds_bundle.js.
window.loadDR = async function (root, files) {
  const DR = (window.DR = window.DR || {});
  for (const f of files) {
    let src = await (await fetch(root + f)).text();
    src = src.replace(/^import .*$/gm, '').replace(/^export /gm, '');
    const names = [...src.matchAll(/^function ([A-Z]\w*)/gm)].map(m => m[1]);
    const code = Babel.transform(src, { presets: ['react'] }).code + '\nreturn {' + names.join(',') + '};';
    Object.assign(DR, new Function('React', ...Object.keys(DR), code)(React, ...Object.values(DR)));
  }
  return DR;
};
