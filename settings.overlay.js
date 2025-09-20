// 浪人閱讀：浮動設定面板（r- 命名空間）
(function(){
  const getMode=()=>localStorage.getItem('readingMode')||'eyecare';
  const getFS=()=>parseInt(localStorage.getItem('readingFontSize')||'18',10);
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  function applyMode(m){ document.body.className=document.body.className.replace(/\b(dark|eyecare|lightgray|paper)\b/g,'').trim(); document.body.classList.add(m||getMode()); }
  function applyFS(px){ document.documentElement.style.setProperty('--fs',(px||getFS())+'px'); }

  function mount(){
    applyMode(); applyFS();

    const fab=document.createElement('button');
    fab.className='r-fab'; fab.id='rOpen'; fab.textContent='⚙️ 設定'; fab.type='button';
    document.body.appendChild(fab);

    const modal=document.createElement('div'); modal.className='r-modal'; modal.id='rModal'; modal.hidden=true;
    modal.innerHTML=`
      <div class="r-panel" role="dialog" aria-modal="true" aria-label="外觀設定">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.5rem">
          <strong>外觀設定</strong>
          <button class="r-btn" id="rClose">完成</button>
        </div>
        <div style="margin:.6rem 0">
          <div style="opacity:.8;margin-bottom:.4rem">主題</div>
          <div class="r-row">
            <button class="r-btn" data-mode="dark">純黑</button>
            <button class="r-btn" data-mode="eyecare">護眼</button>
            <button class="r-btn" data-mode="lightgray">淺灰</button>
            <button class="r-btn" data-mode="paper">紙質</button>
          </div>
        </div>
        <div style="margin:.6rem 0">
          <div style="opacity:.8;margin-bottom:.4rem">字級</div>
          <div class="r-row">
            <button class="r-btn" id="rFsMinus">A-</button>
            <span id="rFsVal" class="r-val"></span>
            <button class="r-btn" id="rFsPlus">A+</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);

    const fsVal=()=>{ const el=document.getElementById('rFsVal'); if(el) el.textContent=getFS()+'px'; };
    const open=()=>{ modal.hidden=false; fsVal(); };
    const close=()=>{ modal.hidden=true; };

    fab.addEventListener('click', open);
    modal.addEventListener('click', (e)=>{ if(e.target===modal) close(); });
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') close(); });
    modal.querySelector('#rClose').addEventListener('click', close);

    modal.querySelectorAll('[data-mode]').forEach(btn=>{
      btn.addEventListener('click', ()=>{ const m=btn.getAttribute('data-mode'); localStorage.setItem('readingMode', m); applyMode(m); });
    });
    document.getElementById('rFsMinus').addEventListener('click', ()=>{
      const v=clamp(getFS()-1,14,28); localStorage.setItem('readingFontSize', String(v)); applyFS(v); fsVal();
    });
    document.getElementById('rFsPlus').addEventListener('click', ()=>{
      const v=clamp(getFS()+1,14,28); localStorage.setItem('readingFontSize', String(v)); applyFS(v); fsVal();
    });
  }

  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', mount); } else { mount(); }
})();