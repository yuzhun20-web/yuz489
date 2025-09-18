// CSV endpoints
const CSV = {
  article: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRtFcnN6Sx_TfSZUOd-z4pJAsdUH9Iwif5O0g511UlRdSj-k3pVMoQJHtYLQhcxOJkpS-BZu0PrI755/pub?output=csv',
  file:    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTRLAWjFV-pv0-Ek3rsR6ITrYwLERjn6gDJES1VfevOZijiFkK4QOIw23gpm4gbJgLm1a6jfxpVFw2L/pub?gid=0&single=true&output=csv',
  daily:   'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5FAscCEiiTPtwoRATyaWkoibduHw-R46MQAemT32oYDB2tp9zzHh3-uErkSt62dqEEwYcFooC3oyg/pub?gid=0&single=true&output=csv'
};

let cache = {article:[], file:[], daily:[]};
let active = 'article';

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

$('#tabArticle').onclick = async ()=>{ setTab('article'); await loadList('article'); };
$('#tabFile').onclick    = async ()=>{ setTab('file'); await loadList('file'); };
$('#tabDaily').onclick   = async ()=>{ setTab('daily'); await loadList('daily'); };
$('#refresh').onclick    = async ()=>{ await loadList(active, true); };
$('#back').onclick       = ()=>{ $('#reader').classList.add('hidden'); };

$('#q').addEventListener('input', ()=> renderList(active, cache[active]));
$('#filterCat').addEventListener('change', ()=> renderList(active, cache[active]));

function setTab(kind){
  active = kind;
  for(const b of $$('nav button')) b.setAttribute('aria-pressed','false');
  (kind==='article'?$('#tabArticle'):kind==='file'?$('#tabFile'):$('#tabDaily')).setAttribute('aria-pressed','true');
}

async function fetchCSV(url){
  const r = await fetch(url, {cache:'no-store'});
  const text = await r.text();
  const rows = text.trim().split(/\r?\n/).map(line => line.split(','));
  const body = rows[0] && /日期|date|Date/.test(rows[0][0]) ? rows.slice(1) : rows;
  return body.map(cols => ({date: cols[0]||'', category: cols[1]||'', title: cols[2]||'(無標題)', content: (cols[3]||'')}));
}

async function loadList(kind, force){
  const url = kind==='article'?CSV.article:kind==='file'?CSV.file:CSV.daily;
  try{
    const data = await fetchCSV(url);
    cache[kind] = data;
    renderList(kind, data);
  }catch(e){
    console.error('載入 CSV 失敗', e);
    renderEmpty('讀取失敗');
  }
}

function renderEmpty(msg){
  const ul = $('#list');
  ul.innerHTML = `<li class="meta">${msg||'目前沒有內容或搜尋不到。'}</li>`;
}

function renderList(kind, arr){
  const ul = $('#list'); ul.innerHTML = '';
  const q = ($('#q').value||'').toLowerCase();
  const fc = ($('#filterCat').value||'').trim();
  let data = arr||[];
  if(fc) data = data.filter(x=>x.category===fc);
  if(q)  data = data.filter(x=>(x.title+x.category+x.content).toLowerCase().includes(q));
  if(data.length===0) return renderEmpty();
  for(const x of data){
    const li = document.createElement('li');
    li.className = 'card';
    li.innerHTML = `<h3>${escapeHTML(x.title)}</h3><div class="meta">${escapeHTML(x.category)} · ${escapeHTML(x.date)}</div>`;
    li.onclick = ()=> openReader(x);
    ul.appendChild(li);
  }
}

function openReader(item){
  $('#rTitle').textContent = item.title || '無標題';
  $('#rMeta').textContent  = `${item.category} · ${item.date}`;
  const el = $('#rContent');
  el.textContent = '';
  progressiveRender(item.content||'');
  $('#reader').classList.remove('hidden');
  window.scrollTo(0, document.body.scrollHeight/10);
}

async function progressiveRender(text){
  const el = $('#rContent');
  const bar = $('#progress');
  const fill = $('#progress span');
  bar.classList.remove('hidden');
  const chunkSize = 2000;
  const total = text.length;
  let shown = 0;
  while(shown < total){
    const next = text.slice(shown, shown+chunkSize);
    el.append(document.createTextNode(next));
    shown += next.length;
    const pct = Math.min(100, Math.round((shown/total)*100));
    fill.style.width = pct + '%';
    await new Promise(r => requestAnimationFrame(r));
  }
  bar.classList.add('hidden');
}

function escapeHTML(s){ return (s||'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]); }

setTab('article');
loadList('article');
