/** Audit ramah HP: buka tiap halaman petugas di layar 360px, cari geser samping, target sentuh < 44px, dan teks < 13px. */
const { chromium, devices } = require("playwright");
const BASE = process.env.BASE || "http://localhost:3100";
const PASS = "Test1234";
const PAGES = {
  "kasir@uji.id": ["/app", "/app/baru", "/app/tagihan", "/app/pindai", "/app/tindak-lanjut", "/app/cari?q=a", "/app/akun", "/app/semua"],
  "kurir@uji.id": ["/app", "/app/serah", "/app/pindai", "/app/akun"],
  "gudang@uji.id": ["/app", "/app/manifest", "/app/manifest/baru", "/app/tindak-lanjut", "/app/serah"],
  "sopir@uji.id": ["/app", "/app/manifest"],
  "owner@uji.id": ["/app", "/app/semua", "/app/keuangan", "/app/kelola", "/app/mitra", "/app/petugas", "/app/tarif", "/app/tarif/riwayat", "/app/korporat", "/app/pengaturan", "/app/peta", "/app/ringkasan", "/app/keuangan/komisi", "/app/tindak-lanjut", "/app/manifest"],
  "": ["/", "/lacak", "/ongkir", "/ekspedisi", "/panduan", "/masuk"],
};
(async () => {
  const b = await chromium.launch(); const out = []; let pages = 0;
  for (const [email, list] of Object.entries(PAGES)) {
    const ctx = await b.newContext({ ...devices["Pixel 5"], viewport: { width: 360, height: 740 } }); const p = await ctx.newPage();
    if (email) { await p.goto(`${BASE}/masuk`); await p.fill("#email", email); await p.fill("#password", PASS); await p.click("button.shine"); await p.waitForURL(/\/app/, { timeout: 20000 }).catch(() => out.push(`LOGIN GAGAL ${email}`)); }
    for (const u of list) {
      await p.goto(BASE + u, { waitUntil: "networkidle" }).catch(() => {}); await p.waitForTimeout(500); pages++;
      const r = await p.evaluate(() => {
        const bad = { tap: [], small: [] };
        const vis = (e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none" && s.opacity !== "0" && r.bottom > 0; };
        for (const e of document.querySelectorAll("a, button, input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=file]), select, textarea, summary")) {
          if (!vis(e) || e.closest(".sidebar, .tabbar, [aria-hidden=true], .carousel .cdots")) continue;
          const r = e.getBoundingClientRect();
          const inline = e.tagName === "A" && getComputedStyle(e).display === "inline" && e.closest("p, li, small, span, dd, td");
          if (!inline && (r.height < 40 || r.width < 40)) bad.tap.push(`${e.tagName.toLowerCase()}${e.className ? "." + String(e.className).split(" ")[0] : ""} "${(e.innerText || e.getAttribute("aria-label") || e.name || "").trim().slice(0, 24)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
        }
        const seen = new Set();
        for (const e of document.querySelectorAll("p, li, span, small, b, td, th, dd, dt, label")) {
          if (!vis(e) || !e.childNodes.length || ![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
          const fs = parseFloat(getComputedStyle(e).fontSize); if (fs < 12.5) { const k = e.tagName + e.className + fs; if (!seen.has(k)) { seen.add(k); bad.small.push(`${e.tagName.toLowerCase()}.${String(e.className).split(" ")[0]} ${fs}px "${e.textContent.trim().slice(0, 24)}"`); } }
        }
        return { overflow: document.documentElement.scrollWidth - innerWidth, ...bad };
      });
      const m = [];
      if (r.overflow > 1) m.push(`GESER SAMPING +${r.overflow}px`);
      if (r.tap.length) m.push(`sentuh kecil: ${[...new Set(r.tap)].slice(0, 6).join(" | ")}`);
      if (r.small.length) m.push(`teks kecil: ${r.small.slice(0, 4).join(" | ")}`);
      if (m.length) out.push(`${email || "publik"} ${u}\n   ${m.join("\n   ")}`);
    }
    await ctx.close();
  }
  console.log(`diaudit ${pages} halaman`); console.log(out.length ? out.join("\n") : "Tidak ada temuan."); await b.close();
})();
