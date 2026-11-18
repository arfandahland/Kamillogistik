// Membuat laporan PDF dari hasil skenario: satu langkah = satu baris (keterangan + tangkapan layar HP).
const { chromium } = require("playwright");
const fs = require("fs");
const OUT = process.env.OUT || "/tmp/skenario";
const data = JSON.parse(fs.readFileSync(`${OUT}/hasil.json`, "utf8"));
const img = (f) => { const j = f.replace(".png", ".jpg"); return fs.existsSync(`${OUT}/${j}`) ? `data:image/jpeg;base64,${fs.readFileSync(`${OUT}/${j}`).toString("base64")}` : `data:image/png;base64,${fs.readFileSync(`${OUT}/${f}`).toString("base64")}`; };
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const sections = data.runs.map((r) => `
  <h2>${esc(r.title)} <small>resi ${esc(r.resiNo)}</small></h2>
  ${r.steps.map((s) => `<div class="step"><div class="t"><span class="n">${s.n}</span><div><b>${esc(s.title)}</b><div class="who">${esc(s.who)}</div><p>${esc(s.detail)}</p></div></div><img src="${img(s.file)}"></div>`).join("")}`).join("");
const html = `<!doctype html><meta charset="utf-8"><style>
body{font:13px/1.5 system-ui,sans-serif;color:#0d2b27;margin:0} h1{font-size:22px;margin:0 0 4px} h2{font-size:18px;margin:26px 0 10px;color:#0f6b5a;page-break-before:always} h2 small{font-weight:400;color:#557;margin-left:8px}
.step{display:flex;gap:16px;align-items:flex-start;border:1px solid #cfe5df;border-radius:12px;padding:12px;margin:0 0 12px;page-break-inside:avoid}
.t{flex:1;display:flex;gap:10px}.n{flex:none;width:26px;height:26px;border-radius:50%;background:#1d8a76;color:#fff;display:grid;place-items:center;font-weight:700}
.who{color:#667;font-size:12px}p{margin:6px 0 0}img{flex:none;width:200px;border:1px solid #cfe5df;border-radius:10px}
.cover{padding:6px 0 4px}</style>
<div class="cover"><h1>Laporan uji pengiriman Kamil Logistik Express</h1><div>Makassar → Jakarta dan Jakarta → Makassar, tiap langkah dijalankan oleh peran masing-masing di tampilan HP. Data uji, bukan data produksi.</div></div>${sections}`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.setContent(html, { waitUntil: "load" });
  await p.pdf({ path: `${OUT}/laporan-uji-pengiriman.pdf`, format: "A4", margin: { top: "14mm", bottom: "14mm", left: "12mm", right: "12mm" }, printBackground: true });
  await b.close(); console.log("laporan PDF dibuat");
})();
