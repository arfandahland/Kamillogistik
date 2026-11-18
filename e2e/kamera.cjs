/**
 * Uji pemindai dengan KAMERA TIRUAN: Chromium diberi video berisi QR (file MJPEG), lalu halaman Pindai harus membacanya sendiri
 * dan membuka resi yang benar. Butuh data skenario (resi sudah ada) -> jalankan setelah e2e/flow atau skenario.
 */
const { chromium } = require("playwright");
const bwip = require("bwip-js/node");
const fs = require("fs");
const BASE = process.env.BASE || "http://localhost:3100";
const DIR = process.env.OUT || "/tmp/kamera";
fs.mkdirSync(DIR, { recursive: true });
const KODE = process.argv[2];
const EMAIL = process.argv[3] || "gudang@uji.id";
if (!KODE) { console.error("pakai: node kamera.cjs <kode> [email]"); process.exit(2); }
(async () => {
  // 1) gambar bingkai 640x480: QR besar di tengah (cukup besar untuk dibaca kamera tiruan)
  const png = await bwip.toBuffer({ bcid: "qrcode", text: KODE, scale: 9, paddingwidth: 12, paddingheight: 12, backgroundcolor: "FFFFFF" });
  const tmp = await chromium.launch(); const pg = await tmp.newPage({ viewport: { width: 640, height: 480 } });
  await pg.setContent(`<body style="margin:0;background:#fff;display:grid;place-items:center;height:480px"><img src="data:image/png;base64,${png.toString("base64")}" style="height:420px"></body>`);
  const jpg = await pg.screenshot({ type: "jpeg", quality: 92 }); await tmp.close();
  const frames = Buffer.concat(Array.from({ length: 40 }, () => jpg));
  fs.writeFileSync(`${DIR}/kamera.mjpeg`, frames);

  // 2) peramban dengan kamera tiruan yang memutar file itu
  const browser = await chromium.launch({ args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", `--use-file-for-fake-video-capture=${DIR}/kamera.mjpeg`] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, permissions: ["camera"] });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/masuk`); await p.fill("#email", EMAIL); await p.fill("#password", "Test1234"); await p.click("button.shine"); await p.waitForURL(/\/app/);
  await p.goto(`${BASE}/app/pindai`, { waitUntil: "networkidle" });
  await p.waitForSelector(".cam.siap", { timeout: 20000 }).catch(() => {});
  const siap = (await p.locator(".cam.siap").count()) === 1;
  await p.waitForSelector(".hasil", { timeout: 25000 }).catch(() => {});
  const teks = await p.locator(".hasil").first().innerText().catch(() => "");
  await p.screenshot({ path: `${DIR}/kamera-hasil.png` });
  await browser.close();
  const ok = /Buka resi/.test(teks) && teks.includes(KODE.replace(/-\d{2}$/, ""));
  console.log(ok ? "  OK   kamera tiruan: QR terbaca otomatis dan resi terbuka" : `  GAGAL kamera tiruan (kamera siap=${siap}) hasil: ${teks.slice(0, 200)}`);
  process.exit(ok ? 0 : 1);
})();
