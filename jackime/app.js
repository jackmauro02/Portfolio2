'use strict';

const grid = document.getElementById('grid');
const empty = document.getElementById('empty');
const q = document.getElementById('q');
const sortBy = document.getElementById('sortBy');
const sortDirBtn = document.getElementById('sortDir');
const tip = document.getElementById('tip');

let rows = [];
let sortAsc = true;

// ------------- CSV helpers -------------
function headerIndex(headers, name){
  return headers.findIndex(h => h && h.toString().trim().toLowerCase() === name);
}
function findAny(headers, names){
  for(const n of names){
    const i = headerIndex(headers, n.toLowerCase());
    if(i >= 0) return i;
  }
  return -1;
}

function normalizeRow(arr, map){
  const get = key => {
    const i = map[key];
    return i >= 0 ? (arr[i] ?? '').toString().trim() : '';
  };
  return {
    name: get('name'),
    episodes: Number(get('episodes')) || 0,
    apiRating: Number(get('rating')) || 0,
    desc: get('description'),
    image: get('image'),
    link: get('link'),
    finished: get('finished'),
    myRating: get('myrating'), // keep as text to allow blanks/decimals
    notes: get('notes')
  };
}

function buildFromParsed(data){
  if(!data || !data.length){ alert('Empty CSV'); return; }
  const headers = data[0].map(v => (v||'').toString().trim().toLowerCase());

  const map = {
    name: findAny(headers, ['name']),
    episodes: findAny(headers, ['episodes','tot episodes','total episodes']),
    rating: findAny(headers, ['rating','api rating']),
    description: findAny(headers, ['description','synopsis']),
    image: findAny(headers, ['image','imageurl','image url']),
    link: findAny(headers, ['link','siteurl','url']),
    finished: findAny(headers, ['finished?','finished','status']),
    myrating: findAny(headers, ['my rating','myrating','score']),
    notes: findAny(headers, ['notes','jack’s views','jacks views','my notes'])
  };

  const missing = ['name','episodes','rating','description','image','link']
    .filter(k => map[k] < 0);
  if(missing.length){
    alert('Missing required header(s): '+ missing.join(', '));
    return;
  }

  rows = data.slice(1).map(r => normalizeRow(r, map)).filter(r=>r.name);
  tip.style.display = 'none';
  render();
}

// ------------- Sorting UI -------------
function setSortDirLabel(){
  if (sortBy.value === 'name') {
    sortDirBtn.textContent = sortAsc ? 'A → Z' : 'Z → A';
  } else {
    sortDirBtn.textContent = sortAsc ? 'Low → High' : 'High → Low';
  }
}

function render(list = rows){
  const key = sortBy.value;
  const getVal = (r) => {
    if (key === 'name') return r.name.toLowerCase();
    if (key === 'episodes') return r.episodes;
    if (key === 'apiRating') return r.apiRating;
    if (key === 'myRating') {
      const n = parseFloat((r.myRating || '').replace(',', '.'));
      return isNaN(n) ? -Infinity : n;
    }
    return 0;
  };

  const sorted = [...list].sort((a,b)=>{
    const va = getVal(a), vb = getVal(b);
    if(va < vb) return sortAsc ? -1 : 1;
    if(va > vb) return sortAsc ? 1 : -1;
    return 0;
  });

  grid.innerHTML = '';
  if(!sorted.length){ empty.style.display='block'; return; }
  empty.style.display='none';

  sorted.forEach(r=>{
    const card = document.createElement('div');
    card.className = 'card';

    const t = document.createElement('div');
    t.className = 'thumb';
    const img = document.createElement('img');
    img.loading='lazy'; img.alt = r.name; img.src = r.image || '';
    t.appendChild(img);

    // Episodes pill (left)
    const pill = document.createElement('span');
    pill.className='pill';
    pill.textContent = (r.episodes||'-') + ' eps';
    t.appendChild(pill);

    // Finished/progress pill (right)
    const fv = (r.finished || '').trim();
    if (fv) {
      const p2 = document.createElement('span');
      p2.className = 'pill right';
      p2.textContent = (/^yes$/i.test(fv)) ? 'watched' : fv;
      t.appendChild(p2);
    }

    const c = document.createElement('div');
    c.className='content';
    const title = document.createElement('div');
    title.className='title'; title.textContent = r.name;
    const meta = document.createElement('div');
    meta.className='meta'; meta.textContent = 'API rating: ' + (r.apiRating || '—');
    const desc = document.createElement('div');
    desc.className='desc'; desc.textContent = r.desc || '';

    const actions = document.createElement('div');
    actions.className='actions';
    const link = document.createElement('a');
    link.className='link'; link.href = r.link || '#'; link.target='_blank'; link.textContent='MAL';

    const myrate = document.createElement('div');
    myrate.className='myrate';
    myrate.textContent = 'My rating: ' + ((r.myRating || '').trim() || '—');

    actions.appendChild(link);
    actions.appendChild(myrate);

    c.appendChild(title); c.appendChild(meta); c.appendChild(desc); c.appendChild(actions);
    card.appendChild(t); card.appendChild(c);
    card.addEventListener('click', ()=>openDetail(r));
    grid.appendChild(card);
  });
}

function filterRows(term){
  term = (term||'').toString().toLowerCase().trim();
  if(!term) return rows;
  return rows.filter(r => (r.name + ' ' + r.desc + ' ' + (r.notes||'')).toLowerCase().includes(term));
}

function openDetail(r){
  const dlg = document.getElementById('detail');
  document.getElementById('dimg').src = r.image || '';
  document.getElementById('dtitle').textContent = r.name;
  document.getElementById('deps').textContent = 'Eps: ' + (r.episodes || '—');
  document.getElementById('dscore').textContent = 'API Rating: ' + (r.apiRating || '—');
  document.getElementById('dlink').href = r.link || '#';
  document.getElementById('ddesc').textContent = r.desc || '';

  // Finished/progress chip
  const fchip = document.getElementById('dfinished');
  const fv = (r.finished || '').trim();
  let ftext = '';
  if (fv) ftext = /^yes$/i.test(fv) ? 'watched: yes' : 'watched: ' + fv;
  if (ftext) { fchip.textContent = ftext; fchip.style.display = 'inline-flex'; }
  else { fchip.style.display = 'none'; }

  // My rating + Jack's views
  document.getElementById('dmyrating').textContent = ((r.myRating || '').trim() || '—');
  document.getElementById('jviews').textContent = (r.notes && r.notes.trim() ? r.notes : '—');

  dlg.showModal();
}

// Search & sorting
q.addEventListener('input', ()=>render(filterRows(q.value)));
sortBy.addEventListener('change', ()=>{ setSortDirLabel(); render(filterRows(q.value)); });
sortDirBtn.addEventListener('click', ()=>{
  sortAsc = !sortAsc;
  sortDirBtn.setAttribute('aria-pressed', String(!sortAsc));
  setSortDirLabel();
  render(filterRows(q.value));
});

// Auto-load anime.csv if present
(async ()=>{
  try{
    const res = await fetch('anime.csv',{cache:'no-store'});
    if(res.ok){
      const text = await res.text();
      const parsed = Papa.parse(text,{skipEmptyLines:true});
      buildFromParsed(parsed.data);
    }
  }catch(e){
    console.log('No anime.csv found (that’s fine)', e);
  } finally {
    setSortDirLabel();
  }
})();
