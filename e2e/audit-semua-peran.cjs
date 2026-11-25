/** Audit HP semua akun: tiap tautan menu dibuka di layar 390px, diukur (geser samping, target sentuh, teks kecil, tombol tanpa nama, gambar tanpa alt, tertutup menu bawah) dan difoto. */
const { chromium, devices } = require("playwright");
const fs = require("fs");
const BASE = process.env.BASE || "http://localhost:3100", OUT = process.env.OUT || "/tmp/audit-peran", PASS = "Test1234";
const AKUN = [["owner@uji.id", "Super Admin"], ["pemilik@uji.id", "Pemilik"], ["manajer@uji.id", "Kepala gudang"], ["kasir@uji.id", "Kasir"], ["depo@uji.id", "Admin depo"], ["gudang@uji.id", "Staf gudang"], ["kurir@uji.id", "Kurir"],
  ["finance@uji.id", "Finance"], ["cs@uji.id", "CS dan Sales"], ["hrd@uji.id", "HRD"], ["konten@uji.id", "Konten"], ["mv@uji.id", "MV cabang"], ["mvmaster@uji.id", "MV Master"], ["", "Pelanggan (publik)"]];
const PUBLIK = ["/", "/lacak", "/ongkir", "/ekspedisi", "/panduan", "/masuk", "/tentang", "/mitra", "/karir", "/jemput", "/offline"];
const slug = (s) => s.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 60) || "root";
(async () => {
  fs.mkdirSync(OUT, { recursive: true }); const b = await chromium.launch(); const hasil = [];
  for (const [email, nama] of AKUN) {
    const ctx = await b.newContext({ ...devices["Pixel 5"], viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); const p = await ctx.newPage();
    let daftar = PUBLIK;
    if (email) {
      await p.goto(`${BASE}/masuk`); await p.fill("#email", email); await p.fill("#password", PASS); await p.click("button.shine");
      await p.waitForURL(/\/app/, { timeout: 20000 }).catch(() => {});
      if (!/\/app/.test(p.url())) { hasil.push({ nama, url: "(masuk)", masalah: ["TIDAK BISA MASUK"] }); await ctx.close(); continue; }
      const set = new Set(["/app"]);
      for (const start of ["/app", "/app/pusat"]) { await p.goto(BASE + start, { waitUntil: "domcontentloaded" }); await p.waitForTimeout(500); (await p.$$eval("a[href^='/app']", (as) => as.map((a) => a.getAttribute("href")))).forEach((h) => set.add(h.split("#")[0])); }
      daftar = [...set].filter((h) => !/\/ekspor|\/unduh|\/keluar|\/cetak|\/foto\b/.test(h)).slice(0, 45);
    }
    for (const u of daftar) {
      await p.goto(BASE + u, { waitUntil: "networkidle" }).catch(() => {}); await p.waitForTimeout(450);
      const r = await p.evaluate(() => {
        const m = { tap: [], kecil: [], tanpaNama: [], tanpaAlt: 0, h1: document.querySelectorAll("h1").length, judul: document.title };
        const vis = (e) => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none" && +s.opacity > 0.05; };
        const nm = (e) => (e.innerText || e.getAttribute("aria-label") || e.getAttribute("title") || e.querySelector("img[alt]")?.getAttribute("alt") || "").trim();
        for (const e of document.querySelectorAll("a, button, input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=file]), select, textarea, summary")) {
          if (!vis(e) || e.closest("[aria-hidden=true], .carousel .cdots")) continue; const r = e.getBoundingClientRect();
          const inline = e.tagName === "A" && getComputedStyle(e).display === "inline" && e.closest("p, li, small, span, dd, td");
          if (!inline && (r.height < 40 || r.width < 40)) m.tap.push(`${e.tagName.toLowerCase()} "${nm(e).slice(0, 22)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
          if ((e.tagName === "A" || e.tagName === "BUTTON") && !nm(e)) m.tanpaNama.push(e.tagName.toLowerCase() + "." + String(e.className).split(" ")[0]);
        }
        const seen = new Set();
        for (const e of document.querySelectorAll("p, li, span, small, b, td, th, dd, dt, label")) {
          if (!vis(e) || ![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
          const fs = parseFloat(getComputedStyle(e).fontSize); if (fs < 12.5) { const k = e.tagName + e.className; if (!seen.has(k)) { seen.add(k); m.kecil.push(`${e.tagName.toLowerCase()}.${String(e.className).split(" ")[0]} ${fs}px "${e.innerText.trim().slice(0, 20)}"`); } }
        }
        m.tanpaAlt = [...document.querySelectorAll("img")].filter((i) => vis(i) && !i.hasAttribute("alt")).length;
        m.geser = document.documentElement.scrollWidth - innerWidth;
        const tb = document.querySelector(".tabbar"); const isi = document.querySelector("main") || document.body;
        m.tertutup = tb ? (parseFloat(getComputedStyle(document.body).paddingBottom) + parseFloat(getComputedStyle(isi).paddingBottom) < tb.getBoundingClientRect().height - 4) : false;
        m.teks = document.body.innerText.trim().length; m.galat = /Application error|Unhandled|500|tidak ditemukan halaman/i.test(document.body.innerText.slice(0, 400));
        return m;
      });
      const masalah = [];
      if (r.geser > 1) masalah.push(`geser samping +${r.geser}px`);
      if (r.tap.length) masalah.push(`sentuh kecil (${r.tap.length}): ${[...new Set(r.tap)].slice(0, 4).join(" | ")}`);
      if (r.kecil.length) masalah.push(`teks <12.5px: ${r.kecil.slice(0, 3).join(" | ")}`);
      if (r.tanpaNama.length) masalah.push(`tombol/tautan tanpa nama: ${[...new Set(r.tanpaNama)].slice(0, 3).join(", ")}`);
      if (r.tanpaAlt) masalah.push(`${r.tanpaAlt} gambar tanpa alt`);
      if (r.h1 !== 1) masalah.push(`h1 = ${r.h1}`);
      if (r.tertutup) masalah.push("isi bawah bisa tertutup menu bawah");
      if (r.teks < 40 || r.galat) masalah.push("halaman kosong atau galat");
      const file = `${OUT}/${slug(nama)}__${slug(u)}.png`; await p.screenshot({ path: file, fullPage: false }).catch(() => {});
      hasil.push({ nama, url: u, masalah, file, judul: r.judul });
    }
    await ctx.close();
  }
  fs.writeFileSync(`${OUT}/hasil.json`, JSON.stringify(hasil, null, 1));
  const bermasalah = hasil.filter((h) => h.masalah.length);
  console.log(`diaudit ${hasil.length} halaman, bermasalah ${bermasalah.length}`);
  for (const h of bermasalah) console.log(`${h.nama} ${h.url}\n   ${h.masalah.join("\n   ")}`);
  await b.close();
})();
