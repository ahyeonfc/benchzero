/* 골고 - 오프라인 캐시 */
const VER='goalgo-v28';   // 하단 기록 칸 작은 글 '지난 경기'(2026-11-26)
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','checkin.html','member.html','qrcode.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VER).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VER).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  // Firestore 실시간 통신은 캐시하지 않음
  if(u.hostname.endsWith('googleapis.com')&&!u.hostname.startsWith('fonts.'))return;
  // 앱 화면: 인터넷 되면 최신, 안 되면 저장본
  // [수정] 2026-11-25 GitHub Pages 가 붙이는 max-age=600 때문에 올린 뒤 최대 10분 예전 화면이 보였다.
  //   매번 서버에 바뀌었는지 묻는다(cache:'no-cache', 안 바뀌었으면 304 로 빠르게 저장본 사용)
  if(r.mode==='navigate'||u.origin===location.origin){
    e.respondWith(fetch(new Request(r.url,{cache:'no-cache',credentials:'same-origin'})).then(res=>{const c=res.clone();caches.open(VER).then(x=>x.put(r,c));return res}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));
    return;
  }
  // 글꼴·Firebase 라이브러리: 저장본 먼저
  if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)||u.hostname==='www.gstatic.com'){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const c=res.clone();caches.open(VER).then(x=>x.put(r,c));return res})));
  }
});
