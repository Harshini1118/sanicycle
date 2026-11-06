// SANICYCLE backend: zero-dependency Node.js server (Node 18+). Serves ./public and a small JSON API.
const http=require('http'),fs=require('fs'),path=require('path');
const PORT=process.env.PORT||3000,PUB=path.join(__dirname,'..','public'),DB=path.join(__dirname,'db.json');
const SEED={pickups:[],activity:[],batches:{
'SC-BATCH-0001':{src:'Greenfield College Hostel',kg:42.5,done:6,t:['02 Nov, 08:10','02 Nov, 09:40','02 Nov, 11:25','02 Nov, 13:00','03 Nov, 10:15','03 Nov, 15:30'],recv:41.8,suit:9.6,rec:8.9,cat:'Cellulose fibre and plastic fraction',res:32.9,dest:'Sunrise Co-processing Plant, Unit 2 (licensed)',proof:true},
'SC-BATCH-0002':{src:'City Care Hospital',kg:68.0,done:3,t:['04 Nov, 07:30','04 Nov, 09:05','04 Nov, 11:50'],recv:67.4,proof:false},
'SC-BATCH-0003':{src:'Maple Residency Households',kg:25.2,done:1,t:['05 Nov, 08:20'],proof:false}}};
let db=fs.existsSync(DB)?JSON.parse(fs.readFileSync(DB,'utf8')):SEED;
const save=()=>fs.writeFileSync(DB,JSON.stringify(db,null,2));
const send=(res,code,obj)=>{res.writeHead(code,{'Content-Type':'application/json'});res.end(JSON.stringify(obj))};
const body=req=>new Promise(r=>{let d='';req.on('data',c=>d+=c);req.on('end',()=>{try{r(JSON.parse(d||'{}'))}catch{r({})}})});
const MIME={'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.svg':'image/svg+xml'};
http.createServer(async(req,res)=>{
 const u=new URL(req.url,'http://x'),p=u.pathname;
 if(p=='/api/batches'&&req.method=='GET')return send(res,200,db.batches);
 if(p=='/api/activity'&&req.method=='GET')return send(res,200,db.activity);
 if(p=='/api/stats'&&req.method=='GET'){const b=Object.values(db.batches);const sum=k=>+b.reduce((a,x)=>a+(x[k]||0),0).toFixed(1);
  return send(res,200,{batches:b.length,kgCollected:sum('kg'),kgRecovered:sum('rec'),withProof:Math.round(100*b.filter(x=>x.proof||x.done>=3).length/b.length),withDestination:Math.round(100*b.filter(x=>x.dest).length/b.length)})}
 if(p=='/api/pickups'&&req.method=='POST'){const d=await body(req);const rec={id:'PK-'+(2041+db.pickups.length),status:'Requested',...d,at:new Date().toISOString()};
  db.pickups.push(rec);db.activity.unshift('Pickup '+rec.id+' requested');save();return send(res,201,rec)}
 let m=p.match(/^\/api\/batches\/(SC-BATCH-\d+)\/assess$/);
 if(m&&req.method=='POST'){const b=db.batches[m[1]];if(!b)return send(res,404,{error:'Batch not found'});const d=await body(req);
  Object.assign(b,d);b.done=Math.max(b.done,5);b.recv=b.recv||b.kg;db.activity.unshift('Assessment completed for '+m[1]);save();return send(res,200,b)}
 if(p.startsWith('/api/'))return send(res,404,{error:'Not found'});
 const f=path.join(PUB,p=='/'?'index.html':p);
 if(!f.startsWith(PUB)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('Not found')}
 res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res);
}).listen(PORT,()=>console.log('SANICYCLE running at http://localhost:'+PORT));
