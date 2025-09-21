
(function(){
  const $=(s)=>document.querySelector(s);
  const key='ronin.pref';
  function load(){ try{return Object.assign({theme:'paper',fs:18}, JSON.parse(localStorage.getItem(key)||'{}'));}catch(e){return {theme:'paper',fs:18};} }
  function save(p){ localStorage.setItem(key, JSON.stringify(p)); }
  function applyTheme(t){ document.body.classList.remove('dark','eyecare','paper'); document.body.classList.add(t); }
  function applyFS(v){ v=Math.max(14,Math.min(36,Number(v)||18)); document.documentElement.style.setProperty('--fs', v+'px'); const lab=document.querySelector('#rnFsVal'); if(lab) lab.textContent=v+'px'; const p=load(); p.fs=v; save(p); }
  function open(){ document.querySelector('.rn-sheet')?.classList.add('show'); }
  function close(){ document.querySelector('.rn-sheet')?.classList.remove('show'); }

  function ensureUI(){
    if(!document.querySelector('.rn-gear')){
      const gear=document.createElement('button'); gear.className='rn-gear'; gear.id='rnGear'; gear.textContent='⚙︎ 設定';
      document.body.appendChild(gear);
    }
    if(!document.querySelector('.rn-sheet')){
      const s=document.createElement('section'); s.className='rn-sheet'; s.innerHTML=`
        <h2 style="margin:0 0 10px;font-weight:900">外觀設定</h2>
        <button class="rn-done" id="rnDone">完成</button>
        <div class="rn-row">
          <button class="rn-chip" id="rnDark">純黑</button>
          <button class="rn-chip" id="rnEye">護眼</button>
          <button class="rn-chip" id="rnPaper">紙質</button>
        </div>
        <div style="font-weight:800;margin-top:2px">字級</div>
        <div class="rn-row">
          <button class="rn-btn" id="rnMinus">A-</button>
          <span id="rnFsVal" style="align-self:center;min-width:52px;display:inline-block;text-align:center"></span>
          <button class="rn-btn" id="rnPlus">A+</button>
        </div>`;
      document.body.appendChild(s);
    }
  }

  function bind(){
    document.getElementById('rnGear')?.addEventListener('click', open);
    document.getElementById('rnDone')?.addEventListener('click', close);
    document.getElementById('rnDark')?.addEventListener('click', ()=>{const p=load(); p.theme='dark'; save(p); applyTheme(p.theme);});
    document.getElementById('rnEye') ?.addEventListener('click', ()=>{const p=load(); p.theme='eyecare'; save(p); applyTheme(p.theme);});
    document.getElementById('rnPaper')?.addEventListener('click', ()=>{const p=load(); p.theme='paper'; save(p); applyTheme(p.theme);});
    document.getElementById('rnMinus')?.addEventListener('click', ()=>applyFS(load().fs-1));
    document.getElementById('rnPlus') ?.addEventListener('click', ()=>applyFS(load().fs+1));
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') close(); });
  }

  // init
  const p=load(); applyTheme(p.theme); applyFS(p.fs);
  ensureUI(); bind();
  document.body.classList.add('tags-right');
})();
