/* 벤치제로 - 오프라인 캐시 */
const VER='benchzero-v3';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','checkin.html','member.html','qrcode.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VER).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VER).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  // Firestore 실시간 통신은 캐시하지 않음
  if(u.hostname.endsWith('googleapis.com')&&!u.hostname.startsWith('fonts.'))return;
  // 앱 화면: 인터넷 되면 최신, 안 되면 저장본
  if(r.mode==='navigate'||u.origin===location.origin){
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(VER).then(x=>x.put(r,c));return res}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));
    return;
  }
  // 글꼴·Firebase 라이브러리: 저장본 먼저
  if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)||u.hostname==='www.gstatic.com'){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const c=res.clone();caches.open(VER).then(x=>x.put(r,c));return res})));
  }
});
