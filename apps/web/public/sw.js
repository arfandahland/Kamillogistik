/* Service worker Kamil Logistik. Hanya menyimpan berkas statis dan halaman publik.
   Halaman petugas (/app), data pribadi, dan semua permintaan tulis TIDAK pernah disimpan. */
const VERSI = "kamil-v4";
const STATIS = `${VERSI}-statis`, HALAMAN = `${VERSI}-halaman`, GAMBAR = `${VERSI}-gambar`;
const PRACACHE = ["/icon-192.png", "/icon-512.png", "/logo-sm.png"];
// Halaman cadangan berdiri sendiri (tanpa skrip) supaya selalu tampil walau sinyal mati dan berkas aplikasi belum tersimpan.
const OFFLINE_HTML = `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#072f29"><title>Tidak ada sambungan internet</title>
<style>*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:20px;background:#05261f;color:#e8f8f4;font:17px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
.k{max-width:420px;width:100%;background:#0b2e28;border:1px solid #1b4a41;border-radius:22px;padding:26px;text-align:center}h1{font-size:22px;margin:0 0 10px}p{margin:0 0 14px;color:#95bbb3}
a,button{display:block;width:100%;min-height:52px;line-height:52px;border:0;border-radius:16px;font:700 17px system-ui;text-decoration:none;cursor:pointer;margin-top:10px}
.u{background:#f28c28;color:#2b1700}.s{background:transparent;color:#c8f8f0;border:1px solid #1b4a41}</style></head>
<body><main class="k"><h1>Tidak ada sambungan internet</h1><p>Aplikasi belum bisa memuat halaman ini. Periksa sinyal atau paket data, lalu coba lagi. Data yang sudah terkirim tidak hilang.</p>
<button class="u" onclick="location.reload()">Coba lagi</button><a class="s" href="/">Ke beranda</a></main></body></html>`;
const halamanOffline = () => new Response(OFFLINE_HTML, { status: 503, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
const TERLARANG = [/^\/app(\/|$)/, /^\/api\//, /^\/auth\//, /^\/masuk/, /^\/portal/, /^\/invoice/, /^\/vendor\//, /^\/absen/, /^\/dev/];

self.addEventListener("install", (e) => { e.waitUntil(caches.open(STATIS).then((c) => c.addAll(PRACACHE))); });
self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (!k.startsWith(VERSI)) await caches.delete(k);
    if (self.registration.navigationPreload) await self.registration.navigationPreload.enable().catch(() => {});
    await self.clients.claim();
  })());
});
self.addEventListener("message", (e) => { if (e.data === "SKIP_WAITING") self.skipWaiting(); });

const terlarang = (u) => TERLARANG.some((r) => r.test(u.pathname));
async function cobaJaringan(req, simpanKe) {
  const res = await fetch(req);
  if (res.ok && simpanKe) { const c = await caches.open(simpanKe); c.put(req, res.clone()); }
  return res;
}
async function staleWhileRevalidate(req, nama) {
  const c = await caches.open(nama); const ada = await c.match(req);
  const baru = fetch(req).then((res) => { if (res.ok) c.put(req, res.clone()); return res; }).catch(() => ada);
  return ada || baru;
}

self.addEventListener("fetch", (e) => {
  const req = e.request; const u = new URL(req.url);
  if (req.method !== "GET" || u.origin !== self.location.origin) return;
  if (req.headers.get("RSC") || u.searchParams.has("_rsc")) return; // navigasi dalam aplikasi: biarkan ke jaringan
  // Berkas statis berversi: simpan permanen
  if (u.pathname.startsWith("/_next/static/")) {
    e.respondWith(caches.open(STATIS).then(async (c) => (await c.match(req)) || cobaJaringan(req, STATIS))); return;
  }
  if (/\.(png|jpe?g|webp|svg|ico|woff2?)$/i.test(u.pathname) && !terlarang(u)) { e.respondWith(staleWhileRevalidate(req, GAMBAR)); return; }
  // Perpindahan halaman
  if (req.mode === "navigate") {
    if (terlarang(u)) {
      e.respondWith((async () => { try { return (await e.preloadResponse) || (await fetch(req)); } catch { return halamanOffline(); } })());
      return;
    }
    e.respondWith((async () => {
      try { const res = (await e.preloadResponse) || (await fetch(req)); if (res.ok) { const c = await caches.open(HALAMAN); c.put(req, res.clone()); } return res; }
      catch { return (await caches.match(req)) || halamanOffline(); }
    })());
  }
});
