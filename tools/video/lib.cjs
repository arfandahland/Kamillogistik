/**
 * Mesin perekam video tutorial: merekam aplikasi asli lewat Playwright, menambahkan keterangan bahasa Indonesia,
 * penunjuk jari yang bergerak, sorotan elemen, kartu pembuka dan penutup, lalu mengubahnya menjadi MP4 ringan dengan ffmpeg.
 */
const { chromium, devices } = require("playwright");
const fs = require("fs"), path = require("path"), cp = require("child_process");

const OVERLAY = String.raw`
(() => {
  if (window.__tutReady) return; window.__tutReady = true;
  const css = document.createElement("style");
  css.textContent = ` + "`" + String.raw`
  #tut-cap{position:fixed;left:10px;right:10px;bottom:10px;z-index:2147483000;display:flex;gap:12px;align-items:center;padding:12px 14px;border-radius:20px;background:linear-gradient(135deg,#06322b,#0f6a5b);color:#fff;font:700 15px/1.35 Inter,system-ui,sans-serif;box-shadow:0 18px 40px rgba(0,0,0,.4);animation:tutin .35s cubic-bezier(.2,.8,.2,1);pointer-events:none}
  #tut-cap b{flex:none;min-width:40px;height:40px;border-radius:13px;display:grid;place-items:center;background:linear-gradient(180deg,#ffcf6b,#f28c28);color:#2b1600;font-size:17px}
  #tut-cap small{display:block;opacity:.75;font-weight:600;font-size:12px;margin-bottom:1px}
  #tut-ptr{position:fixed;z-index:2147483001;width:38px;height:38px;margin:-19px 0 0 -19px;border-radius:50%;border:3px solid #f28c28;background:rgba(242,140,40,.28);box-shadow:0 0 0 6px rgba(242,140,40,.22);pointer-events:none;transition:left .7s cubic-bezier(.4,0,.2,1),top .7s cubic-bezier(.4,0,.2,1),transform .15s;left:50%;top:60%}
  #tut-ptr.tap{transform:scale(.7)}
  #tut-hl{position:fixed;z-index:2147482999;border:3px solid #f28c28;border-radius:14px;box-shadow:0 0 0 6px rgba(242,140,40,.25);pointer-events:none;transition:all .35s;opacity:0}
  #tut-card{position:fixed;inset:0;z-index:2147483002;display:grid;place-content:center;gap:14px;text-align:center;padding:30px;color:#fff;background:radial-gradient(120% 90% at 80% 0%,rgba(255,179,71,.4),transparent 55%),linear-gradient(150deg,#06322b,#0b5a4c 60%,#0f6a5b);font-family:Inter,system-ui,sans-serif;animation:tutin .4s}
  #tut-card .t{font:800 30px/1.15 Inter,system-ui,sans-serif}
  #tut-card .s{font:600 17px/1.4 Inter,system-ui,sans-serif;opacity:.88}
  #tut-card .k{font:800 13px Inter,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#ffcf6b}
  #tut-card .b{width:74px;height:74px;margin:0 auto;border-radius:22px;display:grid;place-items:center;background:linear-gradient(180deg,#ffcf6b,#f28c28);color:#2b1600;font:900 34px Inter,system-ui,sans-serif;box-shadow:0 14px 34px rgba(242,140,40,.45);animation:tutfloat 2.4s ease-in-out infinite}
  @keyframes tutin{from{opacity:0;transform:translateY(14px)}}
  @keyframes tutfloat{50%{transform:translateY(-8px)}}` + "`" + String.raw`;
  const mount = () => { if (!document.documentElement) { new MutationObserver((r, o) => { if (document.documentElement) { o.disconnect(); mount(); } }).observe(document, { childList: true }); return; } document.documentElement.appendChild(css); const s = sessionStorage.getItem("tut"); if (s) { try { const o = JSON.parse(s); if (o.cap) cap(o.cap.n, o.cap.t, o.cap.x, true); if (o.card) card(o.card.k, o.card.t, o.card.s, o.card.b, true); if (o.p) ptr(o.p.x, o.p.y, true); } catch {} } };
  const z = () => parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
  function get(id, mk) { let e = document.getElementById(id); if (!e) { e = mk(); e.id = id; (document.body || document.documentElement).appendChild(e); } return e; }
  function cap(n, t, x, quiet) { const e = get("tut-cap", () => document.createElement("div")); e.innerHTML = '<b>' + n + '</b><div><small>Langkah ' + n + ' dari ' + t + '</small>' + x + '</div>'; if (quiet) e.style.animation = "none"; const st = JSON.parse(sessionStorage.getItem("tut") || "{}"); st.cap = { n, t, x }; sessionStorage.setItem("tut", JSON.stringify(st)); }
  function ptr(x, y, quiet) { const e = get("tut-ptr", () => document.createElement("div")); if (quiet) e.style.transition = "none"; e.style.left = x / z() + "px"; e.style.top = y / z() + "px"; if (quiet) requestAnimationFrame(() => (e.style.transition = "")); const st = JSON.parse(sessionStorage.getItem("tut") || "{}"); st.p = { x, y }; sessionStorage.setItem("tut", JSON.stringify(st)); }
  function tap() { const e = document.getElementById("tut-ptr"); if (!e) return; e.classList.add("tap"); setTimeout(() => e.classList.remove("tap"), 220); }
  function hl(r) { const e = get("tut-hl", () => document.createElement("div")); if (!r) { e.style.opacity = 0; return; } const k = z(); e.style.cssText += ";opacity:1;left:" + (r.x - 4) / k + "px;top:" + (r.y - 4) / k + "px;width:" + (r.w + 8) / k + "px;height:" + (r.h + 8) / k + "px"; }
  function card(k, t, s, b, quiet) { let e = document.getElementById("tut-card"); if (!e) { e = document.createElement("div"); e.id = "tut-card"; (document.body || document.documentElement).appendChild(e); } if (quiet) e.style.animation = "none"; e.innerHTML = '<div class="b">' + (b || "K") + '</div><div class="k">' + k + '</div><div class="t">' + t + '</div><div class="s">' + s + '</div>'; const st = JSON.parse(sessionStorage.getItem("tut") || "{}"); st.card = { k, t, s, b }; sessionStorage.setItem("tut", JSON.stringify(st)); }
  function uncard() { const e = document.getElementById("tut-card"); if (e) e.remove(); const st = JSON.parse(sessionStorage.getItem("tut") || "{}"); delete st.card; sessionStorage.setItem("tut", JSON.stringify(st)); }
  window.__tut = { cap, ptr, tap, hl, card, uncard };
  mount(); if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => { const e = document.getElementById("tut-card"); if (e && e.parentNode !== document.body && document.body) document.body.appendChild(e); });
})();`;

const tunggu = (ms) => new Promise((r) => setTimeout(r, ms));
const BASE = process.env.BASE || "http://localhost:3100";

/** Membuat satu video. skenario = { id, judul, peran, ringkas, langkah: async (t) => {...} } */
async function rekam(skenario, { keluar, mobile = true, masuk } = {}) {
  const tmp = path.join(keluar, ".tmp-" + skenario.id); fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp, { recursive: true });
  const vp = mobile ? { width: 390, height: 844 } : { width: 1280, height: 720 };
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...(mobile ? devices["Pixel 5"] : {}), viewport: vp, deviceScaleFactor: 1, recordVideo: { dir: tmp, size: mobile ? { width: 780, height: 1688 } : { width: 1280, height: 720 } } });
  await ctx.addInitScript(OVERLAY);
  const page = await ctx.newPage();
  if (masuk) { await page.goto(BASE + "/masuk"); await page.fill("#email", masuk[0]); await page.fill("#password", masuk[1]); await page.click("button.shine"); await page.waitForURL(/\/app/, { timeout: 25000 }); }
  let n = 0; const total = skenario.jumlahLangkah;
  const t = {
    page, BASE,
    async buka(url, awalan) { await page.goto(BASE + url, { waitUntil: "networkidle" }); await tunggu(awalan ?? 700); await page.evaluate(() => window.__tut && window.__tut.uncard()).catch(() => {}); await tunggu(300); },
    async kartu(k, judul, sub, ms = 2600, b) { await page.evaluate(([a, c, d, e]) => window.__tut.card(a, c, d, e), [k, judul, sub, b]); await tunggu(ms); },
    async kata(teks, ms = 1700) { n++; await page.evaluate(([a, b, c]) => window.__tut.cap(a, b, c), [n, total, teks]); await tunggu(ms); },
    async titik(loc) { await loc.evaluate((e) => e.scrollIntoView({ block: "center", behavior: "smooth" })).catch(() => {}); await tunggu(700); const b = await loc.boundingBox(); if (!b) return null; await page.evaluate(([x, y, r]) => { window.__tut.ptr(x, y); window.__tut.hl(r); }, [b.x + b.width / 2, b.y + b.height / 2, { x: b.x, y: b.y, w: b.width, h: b.height }]); await tunggu(900); return b; },
    async klik(loc, teks, opt = {}) { if (teks) await t.kata(teks, 900); await t.titik(loc); await page.evaluate(() => window.__tut.tap()).catch(() => {}); await tunggu(220); await loc.click(opt); await page.evaluate(() => window.__tut.hl(null)).catch(() => {}); await tunggu(opt.tungguSetelah ?? 1100); },
    async isi(loc, nilai, teks) { if (teks) await t.kata(teks, 700); await t.titik(loc); await loc.click(); await page.keyboard.type(nilai, { delay: 55 }); await page.evaluate(() => window.__tut.hl(null)); await tunggu(450); },
    async pilih(loc, nilai, teks) { if (teks) await t.kata(teks, 700); await t.titik(loc); await loc.selectOption(nilai); await page.evaluate(() => window.__tut.hl(null)); await tunggu(650); },
    async gulir(px, teks, ms = 1700) { if (teks) await t.kata(teks, 500); await page.evaluate((y) => window.scrollBy({ top: y, behavior: "smooth" }), px); await tunggu(ms); },
    async sorot(loc, teks, ms = 2200) { await t.kata(teks, 500); const b = await t.titik(loc); await tunggu(ms); await page.evaluate(() => window.__tut.hl(null)); return b; },
    tunggu,
  };
  await page.goto(BASE + "/video/mulai.html").catch(() => {});
  await skenario.langkah(t);
  await tunggu(400);
  const vid = page.video(); await ctx.close(); const sumber = await vid.path(); await browser.close();
  const mp4 = path.join(keluar, skenario.id + ".mp4"), jpg = path.join(keluar, skenario.id + ".jpg");
  cp.execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", sumber, "-vf", mobile ? "fps=20,scale=468:-2" : "fps=20,scale=960:-2", "-c:v", "libx264", "-preset", "slow", "-crf", "30", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", mp4]);
  cp.execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", "3", "-i", mp4, "-frames:v", "1", "-q:v", "5", jpg]);
  fs.rmSync(tmp, { recursive: true, force: true });
  const kb = Math.round(fs.statSync(mp4).size / 1024);
  return { id: skenario.id, kb };
}
module.exports = { rekam, tunggu, BASE };
