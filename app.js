// API layer: talks to server/server.js when available; falls back to demo data (e.g. on GitHub Pages)
const API={async get(p){try{const r=await fetch('/api'+p);if(!r.ok)throw 0;return await r.json()}catch(e){return null}},
async post(p,b){try{await fetch('/api'+p,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)})}catch(e){}}};
const P={home:'M3 11l9-8 9 8M5 10v10h14V10',truck:'M1 6h14v11H1zM15 10h4l3 3v4h-7M6 20a2 2 0 100-4 2 2 0 000 4zM18 20a2 2 0 100-4 2 2 0 000 4z',scan:'M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M4 12h16',bell:'M6 8a6 6 0 1112 0c0 7 3 8 3 8H3s3-1 3-8M10 21h4',chart:'M4 20V10M10 20V4M16 20v-7M22 20H2',leaf:'M5 19c0-9 5-14 15-14 0 10-5 15-14 15M5 19l7-7',fac:'M3 21V9l6 4V9l6 4V4h6v17zM3 21h18',box:'M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8',file:'M6 3h8l5 5v13H6zM14 3v5h5M9 13h6M9 17h6',pin:'M12 22s7-6 7-12a7 7 0 10-14 0c0 6 7 12 7 12zM12 12a2 2 0 100-4 2 2 0 000 4z',rec:'M7 7l3-4 3 4M17 17l-3 4-3-4M4 13l-2-3 4-1M20 11l2 3-4 1'};
const ic=n=>`<svg class="i" viewBox="0 0 24 24"><path d="${P[n]}"/></svg>`;
const STEPS=['Collection','Transport','Facility Received','Treatment','Assessment','Recovery / Disposal'];
const PK=['Requested','Accepted','Collected','Transported','Facility Received','Processing','Completed'];
const B={
'SC-BATCH-0001':{src:'Greenfield College Hostel',kg:42.5,done:6,t:['02 Nov, 08:10','02 Nov, 09:40','02 Nov, 11:25','02 Nov, 13:00','03 Nov, 10:15','03 Nov, 15:30'],recv:41.8,suit:9.6,rec:8.9,cat:'Cellulose fibre and plastic fraction',res:32.9,dest:'Sunrise Co-processing Plant, Unit 2 (licensed)',proof:true},
'SC-BATCH-0002':{src:'City Care Hospital',kg:68.0,done:3,t:['04 Nov, 07:30','04 Nov, 09:05','04 Nov, 11:50'],recv:67.4,proof:false},
'SC-BATCH-0003':{src:'Maple Residency Households',kg:25.2,done:1,t:['05 Nov, 08:20'],proof:false}};
let S={role:'Waste Generator',screen:'splash',batch:'SC-BATCH-0001',src:'Household',tab:'home',sel:null,
act:[['Batch SC-BATCH-0003 collected','Today, 08:20'],['SC-BATCH-0002 received at facility','Yesterday, 11:50'],['SC-BATCH-0001 recovery recorded','03 Nov, 15:30']]};
const $=s=>document.getElementById(s);
function go(s,o={}){Object.assign(S,o);S.screen=s;if(['home','track','scan','impact','alerts'].includes(s))S.tab=s;draw()}
function toast(m){const t=document.createElement('div');t.className='toast';t.textContent=m;$('app').append(t);setTimeout(()=>t.remove(),2200)}
function qr(id){let h=0;for(const c of id)h=(h*31+c.charCodeAt(0))>>>0;const n=21;let r='';
const f=(x,y)=>{for(const[a,b]of[[0,0],[n-7,0],[0,n-7]])if(x>=a&&x<a+7&&y>=b&&y<b+7){const i=x-a,j=y-b;return i==0||j==0||i==6||j==6||(i>1&&i<5&&j>1&&j<5)}return null};
for(let y=0;y<n;y++)for(let x=0;x<n;x++){let v=f(x,y);if(v===null){h=(h*1103515245+12345)>>>0;v=(h>>16)&1}
if(v)r+=`<rect x="${x}" y="${y}" width="1" height="1"/>`}
return`<svg class="qr" viewBox="0 0 21 21" shape-rendering="crispEdges" fill="#0e3b27" role="img" aria-label="QR code for ${id}">${r}</svg>`}
function timeline(b){return`<div class="tl">`+STEPS.map((s,i)=>{const c=i<b.done?'done':i==b.done?'cur':'todo';
return`<div class="st ${c}"><span class="dot">${i<b.done?'✓':''}</span><b>${i==5&&b.done==6?(b.res?'Recovery + approved disposal':s):s}</b><p>${b.t[i]||(i==b.done?'In progress':'Pending')}</p></div>`}).join('')+`</div>`}
const hdr=(t,back)=>`${back?`<button class="back" onclick="go('${back}')">‹ Back</button>`:''}<h1>${t}</h1>`;
const bchip=b=>b.done==6?'<span class="chip">Completed</span>':'<span class="chip w">'+STEPS[b.done]+'</span>';

const V={
splash:()=>`<div class="splash" onclick="go('login')"><svg class="loop" width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 01-15.5 6.2M3 12A9 9 0 018.5 5.8M3 4v4h4M21 20v-4h-4"/><path d="M12 8c-3 1-4 3-4 5 3 0 5-2 4-5zM12 13v3"/></svg><h1>SANICYCLE</h1><p>Track it. Treat it responsibly. Give suitable materials a second life.</p><p style="opacity:.7;font-size:12px;margin-top:24px">Tap to continue</p></div>`,
login:()=>`<main><div style="padding-top:30px"><h1>Welcome to SANICYCLE</h1><p>Sign in to follow every batch from collection to verified destination.</p></div>
<label>Email or phone</label><input value="demo@sanicycle.in" aria-label="Email or phone"><label>Password</label><input type="password" value="password123">
<label>I am a</label><div class="seg">${['Waste Generator','Collection Team','Processing Facility'].map(r=>`<button class="${S.role==r?'on':''}" onclick="S.role='${r}';draw()">${r}</button>`).join('')}</div>
<button class="btn" style="margin-top:24px" onclick="go(S.role=='Processing Facility'?'facility':'home')">Log in</button><button class="btn alt" onclick="go('home')">Create account</button></main>`,
home:()=>{const g=S.role=='Waste Generator',c=S.role=='Collection Team';
return`<main><div class="row sp"><div><p>Good morning</p><h1>${S.role=='Processing Facility'?'EcoTreat Facility':'Greenfield College'}</h1></div><span class="chip">${S.role}</span></div>
<div class="grid" style="margin-top:14px">
<button class="tile pri" onclick="go('${c?'status':'request'}')"><span class="ico">${ic('truck')}</span>${c?'Pickup Queue':'Request Pickup'}</button>
<button class="tile" onclick="go('track')"><span class="ico">${ic('box')}</span>Track Batch</button>
<button class="tile" onclick="go('scan')"><span class="ico">${ic('scan')}</span>Scan QR</button>
<button class="tile" onclick="go('${S.role=='Waste Generator'?'impact':'facility'}')"><span class="ico">${ic(S.role=='Waste Generator'?'chart':'fac')}</span>${S.role=='Waste Generator'?'Impact Dashboard':'Facility Dashboard'}</button></div>
${c?`<h2>Open pickup requests</h2>`+[['Maple Residency','25 kg','Today 10:00'],['St. Mary School','38 kg','Today 14:00']].map(r=>`<div class="card row sp"><div><h3>${r[0]}</h3><p>${r[1]} · ${r[2]}</p></div><button class="chip" onclick="go('status');toast('Accepted ${r[0]}')">Accept</button></div>`).join(''):''}
<div class="card" style="background:var(--gd);color:#fff;margin-top:14px"><div class="row sp"><h3>Environmental impact</h3><a class="l" style="color:#9fe3b9" onclick="go('impact')">Details</a></div><div class="row" style="margin-top:10px;gap:20px"><div><div class="big" style="color:#9fe3b9">135.7</div><p style="color:#c5e6d2">kg tracked</p></div><div><div class="big" style="color:#9fe3b9">8.9</div><p style="color:#c5e6d2">kg recovered</p></div><div><div class="big" style="color:#9fe3b9">3</div><p style="color:#c5e6d2">batches</p></div></div></div>
<h2>Recent activity</h2>${S.act.map(a=>`<div class="card row"><span class="ico">${ic('leaf')}</span><div><h3 style="font-weight:500">${a[0]}</h3><p>${a[1]}</p></div></div>`).join('')}</main>`},
request:()=>`<main>${hdr('Request pickup','home')}<p>Used napkins, diapers and similar sanitary waste. Keep it bagged and sealed.</p>
<label>Waste source</label><div class="seg">${['Household','School/College','Hospital','Institution'].map(s=>`<button class="${S.src==s?'on':''}" onclick="S.src='${s}';draw()">${s}</button>`).join('')}</div>
<label>Approximate quantity (kg)</label><input id="q" type="number" value="25" inputmode="decimal"><label>Pickup location</label><input id="loc" value="Block C, Greenfield College, Pune">
<div class="grid"><div><label>Preferred date</label><input type="date" value="2026-11-06"></div><div><label>Preferred time</label><input type="time" value="10:00"></div></div>
<label>Instructions</label><textarea rows="3">Collect from the service gate. Double-bagged.</textarea>
<button class="btn" style="margin-top:20px" onclick="API.post('/pickups',{source:S.src,kg:+$('q').value,location:$('loc').value});S.act.unshift(['Pickup PK-2041 requested','Just now']);go('status');toast('Pickup requested')">Request Pickup</button></main>`,
status:()=>{const cur=3;return`<main>${hdr('Pickup status','home')}<div class="card"><div class="row sp"><div><h3>PK-2041</h3><p>${S.src} · 25 kg · 06 Nov, 10:00</p></div><span class="chip w">${PK[cur]}</span></div></div>
<div class="card"><div class="tl">${PK.map((s,i)=>`<div class="st ${i<=cur?'done':'todo'} ${i==cur?'cur':''}"><span class="dot">${i<=cur?'✓':''}</span><b>${s}</b><p>${i<=cur?['05 Nov, 08:00','05 Nov, 08:25','05 Nov, 09:10','05 Nov, 09:40'][i]:'Pending'}</p></div>`).join('')}</div></div>
${S.role=='Collection Team'?`<button class="btn" onclick="toast('Batch SC-BATCH-0004 created')">Mark collected and create batch</button><button class="btn alt" onclick="toast('Status set to Transported')">Update transport status</button>`:''}
<button class="btn alt" onclick="go('batch',{batch:'SC-BATCH-0003'})">View batch journey</button></main>`},
track:()=>`<main>${hdr('Track batch')}<p>Every collected batch gets a unique ID and QR code.</p><div style="margin-top:12px">${Object.entries(B).map(([k,b])=>`<button class="card" style="width:100%;text-align:left;color:var(--ink)" onclick="go('batch',{batch:'${k}'})"><div class="row sp"><h3>${k}</h3>${bchip(b)}</div><p>${b.src} · ${b.kg} kg</p><div class="bar" style="margin-top:10px"><i style="width:${b.done/6*100}%;background:var(--g)"></i></div></button>`).join('')}</div></main>`,
batch:()=>{const b=B[S.batch];return`<main>${hdr(S.batch,'track')}<p>${b.src} · ${b.kg} kg collected</p><div class="card" style="margin-top:12px"><h3 style="margin-bottom:14px">Traceability timeline</h3>${timeline(b)}</div>
<button class="btn" onclick="go('qr')">Show batch QR code</button>${b.done==6?`<button class="btn alt" onclick="go('recovery')">View recovery record</button>`:''}</main>`},
qr:()=>`<main>${hdr('Batch QR code','batch')}<div class="card" style="text-align:center">${qr(S.batch)}<h3 style="margin-top:8px">${S.batch}</h3><p>Scan to view the full journey: collection, transport, treatment, assessment and final destination.</p></div>
<button class="btn alt" onclick="toast('QR saved for printing')">Save label for printing</button></main>`,
scan:()=>`<main>${hdr('Scan QR')}<div style="height:260px;border-radius:24px;background:#0e3b27;display:grid;place-items:center;margin:12px 0"><div style="width:170px;height:170px;border:3px solid #6fe39b;border-radius:20px;display:grid;place-items:center;color:#9fe3b9;font-size:13px">Point at batch QR</div></div>
<button class="btn" onclick="go('batch',{batch:'SC-BATCH-0002'})">Simulate scan: SC-BATCH-0002</button><p style="text-align:center;margin-top:10px">Facility staff: scanning also starts the receiving step.</p></main>`,
facility:()=>{const s=S.sel;const list=Object.entries(B).filter(([k,b])=>b.done<6);
return`<main>${hdr('Facility dashboard')}<p>EcoTreat Authorized Facility · Licence EC-2291</p>
<div class="grid" style="margin-top:12px"><div class="card"><div class="big">${list.length}</div><p>Open batches</p></div><div class="card"><div class="big">93.2</div><p>kg incoming</p></div></div>
<h2>Incoming batches</h2>${list.map(([k,b])=>`<button class="card" style="width:100%;text-align:left;color:var(--ink)" onclick="S.sel='${k}';draw()"><div class="row sp"><h3>${k}</h3>${bchip(b)}</div><p>${b.src} · ${b.kg} kg expected</p></button>`).join('')}
${s?`<div class="card"><h3>Process ${s}</h3><label>Quantity received (kg)</label><input type="number" value="${B[s].recv||B[s].kg}"><label>Treatment status</label><select><option>Awaiting treatment</option><option selected>Sterilisation in progress</option><option>Treatment complete</option></select>
<label>Assessment: material suitable for recovery?</label><select id="suit"><option>Yes, fraction confirmed safe and suitable</option><option>No, all residue to approved disposal</option></select><label>Processing notes</label><textarea rows="2">Moisture 18%. Fibre fraction visually clean.</textarea>
<button class="btn" onclick="B[S.sel].done=Math.max(B[S.sel].done,5);B[S.sel].recv=B[S.sel].recv||B[S.sel].kg;API.post('/batches/'+S.sel+'/assess',{});S.act.unshift(['Assessment completed for '+S.sel,'Just now']);toast('Assessment saved');go('batch',{batch:S.sel})">Receive and complete assessment</button></div>`:''}</main>`},
recovery:()=>{const b=B['SC-BATCH-0001'];return`<main>${hdr('Recovery record','batch')}<p>SC-BATCH-0001 · verified by EcoTreat</p>
<div class="note"><b>Recovery is not guaranteed.</b> Only material confirmed safe and technically suitable by the authorized facility is recovered. Everything else goes to an approved disposal route.</div>
<div class="card"><div class="row sp"><h3>Total received</h3><div class="big">${b.recv} kg</div></div><div class="bar" style="margin:10px 0"><i style="width:${b.rec/b.recv*100}%;background:var(--g)"></i><i style="width:${(b.suit-b.rec)/b.recv*100}%;background:#8fd1a8"></i><i style="width:${b.res/b.recv*100}%;background:#b9c4bd"></i></div>
<p>Recovered ${b.rec} kg · Lost in processing ${(b.suit-b.rec).toFixed(1)} kg · Residue ${b.res} kg</p></div>
${[['Suitable for recovery',b.suit+' kg'],['Recovered material',b.rec+' kg'],['Recovery category',b.cat],['Remaining residue',b.res+' kg'],['Residue route','Approved disposal: licensed co-processing']].map(r=>`<div class="card row sp"><p>${r[0]}</p><h3 style="text-align:right;max-width:55%">${r[1]}</h3></div>`).join('')}
<div class="card" style="background:var(--gl)"><div class="row">${'<span class="ico" style="background:var(--g);color:#fff">'+ic('pin')+'</span>'}<div><p>Final verified destination</p><h3>${b.dest}</h3></div></div></div></main>`},
impact:()=>{const k=[['Total kg collected','135.7'],['Batches tracked','3'],['kg treated','110.2'],['kg recovered','8.9']];
return`<main>${hdr('Impact dashboard')}<p>Updated 05 Nov 2026</p><div class="grid" style="margin-top:12px">${k.map(x=>`<div class="card"><div class="big">${x[1]}</div><p>${x[0]}</p></div>`).join('')}</div>
${[['Batches with treatment proof',67],['Batches with verified final destination',33]].map(x=>`<div class="card"><div class="row sp"><h3 style="font-weight:500">${x[0]}</h3><b style="color:var(--g)">${x[1]}%</b></div><div class="bar" style="margin-top:10px"><i style="width:${x[1]}%;background:var(--g)"></i></div></div>`).join('')}
<p>Recovery rate is reported honestly: only facility-approved material is counted.</p></main>`},
alerts:()=>{const a=[['b','Missed hand-off','SC-BATCH-0003 not handed over at 10:00. Contact driver.'],['w','Pickup reminder','Pickup PK-2041 tomorrow, 10:00 at Block C.'],['','Processing update','SC-BATCH-0002 sterilisation started.']];
return`<main>${hdr('Alerts and reports')}<div style="margin-top:12px">${a.map(x=>`<div class="card"><span class="chip ${x[0]}">${x[1]}</span><p style="margin-top:8px;color:var(--ink)">${x[2]}</p></div>`).join('')}</div>
<h2>Monthly traceability reports</h2>${['October 2026','September 2026'].map(m=>`<div class="card row sp"><div class="row"><span class="ico">${ic('file')}</span><div><h3>${m}</h3><p>Batch journeys and destinations</p></div></div><a class="l" onclick="toast('Report downloaded')">Get</a></div>`).join('')}</main>`}
};
function draw(){const s=S.screen,full=['splash','login'].includes(s);
const tabs=[['home','Home','home'],['track','Track','box'],['scan','Scan','scan'],['impact','Impact','chart'],['alerts','Alerts','bell']];
$('app').innerHTML=V[s]()+(full?'':`<nav>${tabs.map(t=>`<button class="${S.tab==t[0]?'on':''}" onclick="go('${t[0]}')">${ic(t[2])}${t[1]}</button>`).join('')}</nav>`)}
draw();
API.get('/batches').then(d=>{if(d){Object.assign(B,d);draw()}});
