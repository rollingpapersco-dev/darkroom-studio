(function(){
  if (window.__drPitchEd) return; window.__drPitchEd = true;
  var printing = /[?&]print=1/.test(location.search);
  var KEY='dr-pitch-redbull-text', IKEY='dr-pitch-redbull-imgs', store={}, iview={};
  try{store=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
  try{iview=JSON.parse(localStorage.getItem(IKEY)||'{}')}catch(e){}
  var db=null;
  function openDB(){ return new Promise(function(res){ try{ var r=indexedDB.open('dr-pitch-redbull',1); r.onupgradeneeded=function(){ r.result.createObjectStore('imgs'); }; r.onsuccess=function(){ db=r.result; res(db); }; r.onerror=function(){ res(null); }; }catch(e){ res(null); } }); }
  function dbGet(k){ return new Promise(function(res){ if(!db) return res(null); var t=db.transaction('imgs').objectStore('imgs').get(k); t.onsuccess=function(){ res(t.result||null); }; t.onerror=function(){ res(null); }; }); }
  function dbPut(k,v){ if(!db) return; var tx=db.transaction('imgs','readwrite'); if(v==null) tx.objectStore('imgs').delete(k); else tx.objectStore('imgs').put(v,k); }
  function saveView(){ try{localStorage.setItem(IKEY,JSON.stringify(iview))}catch(e){} }
  function applyView(img){ var v=iview[img.dataset.img]||{}; var x=v.x==null?null:v.x, y=v.y==null?null:v.y; if(x!=null) { img.style.objectPosition=x+'% '+y+'%'; img.style.transformOrigin=x+'% '+y+'%'; } else { img.style.objectPosition=img.dataset.pos0||''; img.style.transformOrigin=''; } img.style.transform=(v.z&&v.z!==100)?'scale('+(v.z/100)+')':''; }
  var editing=false, nodes=[], imgs=[], sel=null;
  function leaves(){
    var out=[]; document.querySelectorAll('deck-stage > section').forEach(function(sec,si){
      var i=0; sec.querySelectorAll('div,span,p').forEach(function(el){
        var own=Array.prototype.some.call(el.childNodes,function(c){return c.nodeType===3&&c.textContent.trim()});
        if(!own) return; if(el.parentElement && el.parentElement.closest('[data-ed]')) return;
        el.setAttribute('data-ed', si+'-'+(i++)); out.push(el);
      });
    }); return out;
  }
  // panel
  var panel=document.createElement('div'); panel.setAttribute('data-noprint','');
  panel.style.cssText='position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:2147483001;display:none;align-items:center;gap:14px;background:rgba(10,10,12,0.94);border:1px solid #2c2c2e;border-radius:16px;padding:12px 16px;font:500 12px -apple-system,BlinkMacSystemFont,sans-serif;color:#f5f5f7;backdrop-filter:blur(10px)';
  function slider(label,min,max){ var w=document.createElement('label'); w.style.cssText='display:flex;align-items:center;gap:8px;color:#86868b'; w.textContent=label; var r=document.createElement('input'); r.type='range'; r.min=min; r.max=max; r.style.cssText='width:110px;accent-color:#C8362A'; w.appendChild(r); panel.appendChild(w); return r; }
  function pbtn(t,primary){ var b=document.createElement('button'); b.textContent=t; b.style.cssText='font:600 12px -apple-system,BlinkMacSystemFont,sans-serif;border-radius:14px;padding:7px 12px;cursor:pointer;border:1px solid '+(primary?'#fff':'#2c2c2e')+';background:'+(primary?'#fff':'transparent')+';color:'+(primary?'#000':'#f5f5f7'); panel.appendChild(b); return b; }
  var file=document.createElement('input'); file.type='file'; file.accept='image/*'; file.style.display='none';
  var bRep=pbtn('Replace image',true), rZ=slider('Zoom',100,300), rX=slider('X',0,100), rY=slider('Y',0,100), bReset=pbtn('Reset'), bClose=pbtn('×');
  panel.appendChild(file);
  function cur(){ return sel ? (iview[sel.dataset.img]=iview[sel.dataset.img]||{}) : {}; }
  function syncPanel(){ if(!sel) return; var v=iview[sel.dataset.img]||{}; rZ.value=v.z||100; rX.value=v.x==null?50:v.x; rY.value=v.y==null?(sel.dataset.pos0&&sel.dataset.pos0.split(' ')[1]?parseFloat(sel.dataset.pos0.split(' ')[1]):50):v.y; }
  function onSlide(){ if(!sel) return; var v=cur(); v.z=+rZ.value; v.x=+rX.value; v.y=+rY.value; applyView(sel); saveView(); }
  [rZ,rX,rY].forEach(function(r){ r.addEventListener('input',onSlide); });
  bRep.onclick=function(){ file.click(); };
  bClose.onclick=function(){ select(null); };
  bReset.onclick=function(){ if(!sel) return; var k=sel.dataset.img; delete iview[k]; saveView(); dbPut(k,null); sel.src=sel.dataset.src0; if(sel.dataset.empty) sel.style.outline=editing?'1px dashed rgba(200,54,42,0.8)':''; applyView(sel); syncPanel(); };
  function loadFile(f,img){ if(!f||!/^image\//.test(f.type)) return; var rd=new FileReader(); rd.onload=function(){ var im=new Image(); im.onload=function(){ var max=2400, k=Math.min(1,max/Math.max(im.width,im.height)); var c=document.createElement('canvas'); c.width=Math.round(im.width*k); c.height=Math.round(im.height*k); c.getContext('2d').drawImage(im,0,0,c.width,c.height); var url=/png|svg|gif|webp/.test(f.type)?c.toDataURL('image/png'):c.toDataURL('image/jpeg',0.9); img.src=url; dbPut(img.dataset.img,url); iview[img.dataset.img]={}; saveView(); applyView(img); syncPanel(); }; im.src=rd.result; }; rd.readAsDataURL(f); }
  file.onchange=function(){ if(sel) loadFile(file.files[0],sel); file.value=''; };
  function select(img){ if(sel) sel.style.boxShadow=''; sel=img; if(img){ img.style.boxShadow='0 0 0 4px #C8362A inset'; panel.style.display='flex'; syncPanel(); } else panel.style.display='none'; }
  function setEdit(on){
    editing=on;
    nodes.forEach(function(el){ if(on){ el.setAttribute('contenteditable','true'); el.style.outline='1px dashed rgba(200,54,42,0.6)'; el.style.outlineOffset='4px'; el.style.cursor='text'; } else { el.removeAttribute('contenteditable'); el.style.outline=''; el.style.outlineOffset=''; el.style.cursor=''; } });
    imgs.forEach(function(img){ img.style.cursor=on?'pointer':''; img.style.outline=on?'1px dashed rgba(200,54,42,0.8)':''; img.style.outlineOffset=on?'-6px':''; });
    if(!on) select(null);
    btn.textContent= on ? 'Done editing' : 'Edit';
    btn.style.background= on ? '#C8362A' : '#fff'; btn.style.color= on ? '#fff' : '#000';
  }
  var bar=document.createElement('div'), btn=document.createElement('button'), rst=document.createElement('button');
  bar.setAttribute('data-noprint','');
  bar.style.cssText='position:fixed;top:14px;right:14px;z-index:2147483000;display:flex;gap:8px';
  [btn,rst].forEach(function(b){ b.style.cssText='font:600 12px -apple-system,BlinkMacSystemFont,sans-serif;border-radius:16px;padding:8px 14px;cursor:pointer;border:1px solid #2c2c2e'; });
  btn.style.background='#fff'; btn.style.color='#000'; btn.textContent='Edit';
  rst.style.background='rgba(0,0,0,0.6)'; rst.style.color='#f5f5f7'; rst.textContent='Reset all';
  btn.onclick=function(){ setEdit(!editing); };
  rst.onclick=function(){ if(!confirm('Reset all text and image edits on this pitch?')) return; try{localStorage.removeItem(KEY);localStorage.removeItem(IKEY)}catch(e){} if(db){ db.transaction('imgs','readwrite').objectStore('imgs').clear(); } setTimeout(function(){location.reload()},200); };
  bar.appendChild(btn); bar.appendChild(rst);
  
  document.addEventListener('input',function(e){ var el=e.target.closest&&e.target.closest('[data-ed]'); if(!el) return; store[el.getAttribute('data-ed')]=el.innerHTML; try{localStorage.setItem(KEY,JSON.stringify(store))}catch(err){} },true);
  document.addEventListener('keydown',function(e){ if(e.target.isContentEditable||e.target.tagName==='INPUT'){ e.stopPropagation(); } },true);
  document.addEventListener('click',function(e){ if(!editing) return; var img=e.target.closest&&e.target.closest('img[data-img]'); if(!img){ var t=e.target.closest&&e.target.closest('section'); if(t){ var hit=Array.prototype.find.call(t.querySelectorAll('img[data-img]'),function(im){ var r=im.getBoundingClientRect(); return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom; }); if(hit && !(e.target.closest&&e.target.closest('[data-ed]'))) img=hit; } } if(img){ e.preventDefault(); e.stopPropagation(); select(img); } },true);
  document.addEventListener('dragover',function(e){ var img=e.target.closest&&e.target.closest('img[data-img]'); if(img||editing){ e.preventDefault(); } },true);
  document.addEventListener('drop',function(e){ var t=e.target.closest&&e.target.closest('section'); if(!t) return; var img=e.target.closest('img[data-img]')||Array.prototype.find.call(t.querySelectorAll('img[data-img]'),function(im){ var r=im.getBoundingClientRect(); return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom; }); if(!img) return; e.preventDefault(); e.stopPropagation(); loadFile(e.dataTransfer.files[0],img); select(img); },true);
  var tries=0;(function init(){ var secs=document.querySelectorAll('deck-stage > section'); if(secs.length<9 && tries++<60){ return setTimeout(init,150); }
    imgs=Array.prototype.slice.call(document.querySelectorAll('deck-stage img[data-img]'));
    imgs.forEach(function(img){ img.dataset.src0=img.getAttribute('src'); img.dataset.pos0=img.style.objectPosition||''; img.draggable=false; applyView(img); });
    openDB().then(function(){ imgs.forEach(function(img){ dbGet(img.dataset.img).then(function(u){ if(u) img.src=u; }); }); });
    nodes=leaves(); nodes.forEach(function(el){ var k=el.getAttribute('data-ed'); if(store[k]!=null) el.innerHTML=store[k]; });
    if(!printing){ document.body.appendChild(bar); document.body.appendChild(panel); }
  })();
})();
