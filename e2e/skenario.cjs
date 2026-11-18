/**
 * Skenario pengiriman realistis dua arah (Makassar→Jakarta dan Jakarta→Makassar), langkah demi langkah,
 * dengan tangkapan layar tiap langkah (tampilan HP) dan laporan PDF. Dijalankan lewat e2e/skenario.sh.
 */
const { chromium } = require("playwright");
const fs = require("fs");
const BASE = process.env.BASE || "http://localhost:3100";
const OUT = process.env.OUT || "/tmp/skenario";
const PASS = "Test1234";
fs.mkdirSync(OUT, { recursive: true });
const results = [];
const ok = (name, cond, extra = "") => { results.push({ name, ok: !!cond }); console.log(cond ? "  OK  " : "  GAGAL", name, cond ? "" : extra); };
const text = (p) => p.evaluate(() => document.body.innerText);
const VP = { width: 390, height: 844 };

async function login(browser, email) {
  const ctx = await browser.newContext({ viewport: VP, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/masuk`, { waitUntil: "networkidle" });
  await page.fill("#email", email); await page.fill("#password", PASS);
  await page.click("button.shine");
  await page.waitForURL(/\/app/, { timeout: 20000 });
  await page.waitForLoadState("networkidle");
  return { ctx, page };
}
async function act(page, locator) {
  const before = page.url();
  await locator.click();
  await page.waitForFunction((b) => location.href !== b, before, { timeout: 25000 }).catch(() => {});
  await page.locator(".ok, .err").first().waitFor({ timeout: 15000 }).catch(() => {});
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(700); // animasi halaman selesai
  const okEl = await page.locator(".ok").count(), errEl = await page.locator(".err").count();
  return { ok: okEl ? await page.locator(".ok").first().innerText() : null, err: errEl ? await page.locator(".err").first().innerText() : null };
}
const pick = (page, sel, sub) => page.evaluate(([s, t]) => { const el = document.querySelector(s); const o = [...el.options].find((x) => x.text.includes(t)); if (!o) return false; el.value = o.value; el.dispatchEvent(new Event("change", { bubbles: true })); return true; }, [sel, sub]);

async function direction(browser, cfg, accounts) {
  const steps = [];
  let n = 0;
  const shot = async (page, who, title, detail, extra = {}) => {
    n += 1;
    const file = `${cfg.key}-${String(n).padStart(2, "0")}.png`;
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `${OUT}/${file}` });
    steps.push({ n, who, title, detail, file, ...extra });
  };
  const A = {};
  for (const [k, email] of Object.entries(accounts)) A[k] = await login(browser, email);
  let resiNo = "", resiId = "";

  console.log(`\n=== ${cfg.title} ===`);
  // 1. Kasir membuat resi
  {
    const p = A[cfg.kasirO].page;
    await p.goto(`${BASE}/app/baru`, { waitUntil: "networkidle" });
    ok(`[${cfg.key}] rute ${cfg.routeText} tersedia di form`, await pick(p, "#rute", cfg.routeText));
    await p.fill("#pengirim", cfg.sender); await p.fill("#hp_pengirim", "081234567890");
    await p.fill("#penerima", cfg.receiver); await p.fill("#hp_penerima", "082233445566"); await p.fill("#alamat", cfg.address);
    await p.fill("#jumlah", "2");
    const r = await act(p, p.getByRole("button", { name: "Buat resi" }));
    ok(`[${cfg.key}] resi dibuat`, r.ok && /Resi sudah dibuat/.test(r.ok), JSON.stringify(r));
    resiNo = (await p.locator("h1").first().innerText()).trim(); resiId = p.url().match(/resi\/([0-9a-f-]+)/)?.[1] || "";
    await shot(p, cfg.labels[cfg.kasirO], "Pesanan diterima dan resi dibuat", `Kasir mengisi pengirim, penerima, alamat, dan jumlah barang. Sistem langsung memberi nomor resi ${resiNo}. Status: Order baru (tahap 1 dari 10). Berat dan ongkir BELUM dihitung, karena baru ditimbang di gudang.`);
  }
  const open = async (who) => { const p = A[who].page; await p.goto(`${BASE}/app/resi/${resiId}`, { waitUntil: "networkidle" }); await p.waitForTimeout(600); return p; };
  const pub = async (title, detail) => {
    const ctx = await browser.newContext({ viewport: VP, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/lacak/${resiNo}`, { waitUntil: "networkidle" }); await page.waitForTimeout(900);
    await shot(page, "Pelanggan (tanpa login)", title, detail);
    await ctx.close();
  };
  const handover = async (from, toName, toWho, label) => {
    const p = await open(from);
    await pick(p, "select[name=ke]", toName);
    const r = await act(p, p.getByRole("button", { name: "Serahkan barang" }));
    ok(`[${cfg.key}] ${label}: diserahkan, menunggu diterima`, r.ok && /Menunggu penerima/.test(r.ok), JSON.stringify(r));
    await shot(p, cfg.labels[from], `Serah terima: ${label}`, `Barang masih tanggung jawab pengirim sampai penerima menekan tombol terima. Ini mencegah barang "hilang di tengah".`);
    const q = await open(toWho);
    const r2 = await act(q, q.getByRole("button", { name: "Ya, barang sudah saya terima" }));
    ok(`[${cfg.key}] ${label}: diterima`, r2.ok && /sudah Anda terima/.test(r2.ok), JSON.stringify(r2));
    await shot(q, cfg.labels[toWho], `Serah terima diterima: ${label}`, `Penerima mengonfirmasi di HP-nya. Sejak saat ini barang resmi di tangan penerima dan tercatat di riwayat.`);
    return q;
  };

  // 2. Kurir asal menjemput
  {
    const p = await open(cfg.kurirO);
    const r = await act(p, p.getByRole("button", { name: "Barang sudah saya jemput" }));
    ok(`[${cfg.key}] kurir menjemput`, r.ok && /sudah dijemput/.test(r.ok), JSON.stringify(r));
    await shot(p, cfg.labels[cfg.kurirO], "Driver menjemput barang", "Kurir menekan 'Barang sudah saya jemput'. Barang kini dipegang kurir (tahap 2 dari 10).");
  }
  await pub("Pelanggan melacak: barang sudah dijemput", "Pelanggan membuka nomor resi tanpa login dan langsung melihat tahap terbaru. Nama petugas dan data keuangan tidak ditampilkan.");
  // 3. Kurir -> gudang asal
  await handover(cfg.kurirO, cfg.gudangOName, cfg.gudangO, "kurir ke gudang asal");
  {
    const p = await open(cfg.gudangO);
    const r = await act(p, p.getByRole("button", { name: "Barang sudah saya terima di gudang" }));
    ok(`[${cfg.key}] tiba di gudang asal`, r.ok && /diterima di gudang/.test(r.ok), JSON.stringify(r));
    await shot(p, cfg.labels[cfg.gudangO], "Driver tiba di gudang Kamil", "Petugas gudang mencatat barang sudah tiba di gudang asal (tahap 3 dari 10).");
    // 4. Sortir / marking / timbang
    await p.fill("input[name=w0]", "12"); await p.fill("input[name=w1]", "18");
    await p.evaluate(() => scrollTo(0, 0));
    const r2 = await act(p, p.getByRole("button", { name: "Hitung dan buat tagihan" }));
    ok(`[${cfg.key}] sortir, timbang, tagihan terbit`, r2.ok && /Tagihan INV/.test(r2.ok), JSON.stringify(r2));
    await shot(p, cfg.labels[cfg.gudangO], "Sortir, penandaan (marking), dan penimbangan", `Tiap barang diberi kode unik (${resiNo}-01, -02) dan ditimbang. Ongkir dihitung otomatis dari berat nyata: ${r2.ok}`);
    // 5. Muat ke kontainer
    const r3 = await act(p, p.getByRole("button", { name: "Barang sudah dimuat ke kontainer" }));
    ok(`[${cfg.key}] dimuat ke kontainer`, r3.ok && /sudah dimuat/.test(r3.ok), JSON.stringify(r3));
    await shot(p, cfg.labels[cfg.gudangO], "Menuju pelabuhan: dimuat ke kontainer", "Barang dimuat ke kontainer untuk dibawa ke pelabuhan (tahap 5 dari 10).");
  }
  await handover(cfg.gudangO, "Sopir Kontainer", "sopir", "gudang ke sopir kontainer");
  {
    const p = A.sopir.page;
    let r = await act(p, p.getByRole("button", { name: "Kapal sudah berangkat" }));
    ok(`[${cfg.key}] kapal berangkat`, r.ok && /kapal sudah berangkat/i.test(r.ok), JSON.stringify(r));
    await shot(p, "Sopir kontainer", `Berangkat ke ${cfg.destCity} (dalam pelayaran)`, "Status berubah ke Dalam pelayaran. Lama pelayaran nyata (sekitar 5 hari) berjalan di dunia nyata. Sistem tidak mensimulasikan waktu, hanya mencatat tahap saat petugas menekan tombolnya.");
    await pub("Pelanggan melacak: barang dalam pelayaran", "Pelanggan melihat barang sedang di laut dan perkiraan tiba.");
    r = await act(p, p.getByRole("button", { name: "Kapal sudah sandar di pelabuhan tujuan" }));
    ok(`[${cfg.key}] tiba di pelabuhan tujuan`, r.ok && /sudah sandar/.test(r.ok), JSON.stringify(r));
    await shot(p, "Sopir kontainer", "Tiba di pelabuhan tujuan", `Kapal sandar di pelabuhan ${cfg.destCity} (tahap 7 dari 10).`);
  }
  await handover("sopir", cfg.gudangDName, cfg.gudangD, "sopir ke gudang tujuan");
  {
    const p = A[cfg.gudangD].page;
    const r = await act(p, p.getByRole("button", { name: "Barang sudah dibongkar di gudang tujuan" }));
    ok(`[${cfg.key}] tiba di gudang tujuan`, r.ok && /gudang tujuan/.test(r.ok), JSON.stringify(r));
    await shot(p, cfg.labels[cfg.gudangD], `Tiba di gudang Kamil ${cfg.destCity}`, "Barang dibongkar dan dicek jumlahnya di gudang tujuan (tahap 8 dari 10).");
  }
  await handover(cfg.gudangD, cfg.kurirDName, cfg.kurirD, "gudang tujuan ke kurir pengantar");
  {
    const p = A[cfg.kurirD].page;
    const r = await act(p, p.getByRole("button", { name: "Saya berangkat mengantar barang" }));
    ok(`[${cfg.key}] berangkat mengantar`, r.ok && /Tahap 9 dari 10/.test(await text(p)), JSON.stringify(r));
    await shot(p, cfg.labels[cfg.kurirD], "Pengantaran ke customer", "Kurir berangkat mengantar ke alamat penerima (tahap 9 dari 10).");
    // 9. Bukti terima
    await p.context().grantPermissions(["geolocation"]); await p.context().setGeolocation(cfg.gps);
    await p.reload({ waitUntil: "networkidle" });
    const jpg = await p.screenshot({ type: "jpeg", quality: 60 });
    await p.setInputFiles(".podpick input[type=file]", { name: "bukti.jpg", mimeType: "image/jpeg", buffer: jpg });
    await p.waitForSelector(".podphoto img", { timeout: 15000 });
    await p.locator(".sigbox").evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" })); await p.waitForTimeout(1200);
    const box = await p.locator(".sigbox canvas").boundingBox();
    await p.mouse.move(box.x + 30, box.y + 90); await p.mouse.down();
    for (let i = 0; i < 24; i++) await p.mouse.move(box.x + 30 + i * 9, box.y + 90 + Math.sin(i / 2) * 35, { steps: 2 });
    await p.mouse.up();
    await p.waitForFunction(() => document.querySelector("input[name=ttd]").value.startsWith("data:image/png"), null, { timeout: 5000 }).catch(() => {});
    await p.waitForFunction(() => document.querySelector("input[name=lat]").value !== "", null, { timeout: 8000 }).catch(() => {});
    await p.fill("#penerima", cfg.receiver);
    await p.locator(".pod").evaluate((el) => el.scrollIntoView({ block: "start", behavior: "instant" })); await p.waitForTimeout(500);
    n += 1; const f = `${cfg.key}-${String(n).padStart(2, "0")}.png`; await p.screenshot({ path: `${OUT}/${f}` });
    steps.push({ n, who: cfg.labels[cfg.kurirD], title: "Menyiapkan bukti terima di tempat penerima", detail: "Kurir mengambil foto barang, penerima menandatangani di layar, lokasi GPS tercatat otomatis. Tombol simpan baru aktif setelah semuanya lengkap.", file: f });
    const r2 = await act(p, p.getByRole("button", { name: "Simpan bukti terima" }));
    ok(`[${cfg.key}] bukti terima tersimpan`, r2.ok && /Bukti terima tersimpan/.test(r2.ok), JSON.stringify(r2));
    await shot(p, cfg.labels[cfg.kurirD], "Barang sukses diterima", "Status menjadi Sudah diterima (tahap 10 dari 10). Resi selesai dan tidak bisa diubah lagi.");
    await p.evaluate(() => document.querySelector(".podview")?.scrollIntoView({ block: "start" })); await p.waitForTimeout(400);
    n += 1; const g = `${cfg.key}-${String(n).padStart(2, "0")}.png`; await p.screenshot({ path: `${OUT}/${g}` });
    steps.push({ n, who: cfg.labels[cfg.kurirD], title: "Bukti terima tersimpan (foto + tanda tangan + lokasi)", detail: "Bukti lengkap bisa dilihat pemilik, manajer, dan kasir/gudang yang berhak. Foto tidak ditampilkan ke publik.", file: g });
  }
  await pub("Pelanggan melacak: barang sudah diterima", "Halaman publik menampilkan Sudah diterima, Tahap 10 dari 10, dan nama penerima yang disamarkan. Foto dan tanda tangan tidak tampil.");
  // Pembayaran
  {
    const p = A[cfg.kasirO].page;
    await p.goto(`${BASE}/app/tagihan`, { waitUntil: "networkidle" });
    const href = await p.locator("a.resi").first().getAttribute("href"); await p.goto(`${BASE}${href}`, { waitUntil: "networkidle" });
    await p.fill("#jumlah", "999999999"); await p.fill("#referensi", "tes");
    const bad = await act(p, p.getByRole("button", { name: "Simpan pembayaran" }));
    ok(`[${cfg.key}] pembayaran berlebih ditolak`, bad.err && /melebihi sisa/.test(bad.err), JSON.stringify(bad));
    const total = (await text(p)).match(/Sisa tagihan Rp([\d.]+)/)?.[1]?.replace(/\./g, "");
    await p.fill("#jumlah", total); await p.fill("#referensi", `Transfer ${cfg.sender} BCA`);
    const r = await act(p, p.getByRole("button", { name: "Simpan pembayaran" }));
    ok(`[${cfg.key}] tagihan lunas`, r.ok && /sudah lunas/.test(r.ok), JSON.stringify(r));
    await shot(p, cfg.labels[cfg.kasirO], "Pembayaran transfer dicatat, tagihan lunas", "Kasir mencatat transfer setelah mengecek mutasi rekening. Status Lunas. Tagihan bisa dibagikan ke pelanggan lewat WhatsApp dan dibuka tanpa login.");
  }
  for (const k of Object.keys(A)) await A[k].ctx.close();
  return { resiNo, steps };
}

(async () => {
  const browser = await chromium.launch();
  const labels = { kasir: "Kasir Jakarta", kasirMks: "Kasir Makassar", kurir: "Kurir Jakarta", gudang: "Gudang Jakarta", sopir: "Sopir kontainer", gudangMks: "Gudang Makassar", kurirMks: "Kurir Makassar" };
  const accounts = { kasir: "kasir@uji.id", kasirMks: "kasir.mks@uji.id", kurir: "kurir@uji.id", gudang: "gudang@uji.id", sopir: "sopir@uji.id", gudangMks: "gudang.mks@uji.id", kurirMks: "kurir.mks@uji.id" };
  const runs = [];
  runs.push(await direction(browser, {
    key: "mks-jkt", title: "Makassar → Jakarta", routeText: "Makassar → Jakarta · Diantar sampai alamat (per kilo)",
    sender: "CV Sulawesi Makmur", receiver: "Rina Wijaya", address: "Jl. Kebon Jeruk Raya No. 21, Jakarta Barat", destCity: "Jakarta", gps: { latitude: -6.1944, longitude: 106.7694 },
    kasirO: "kasirMks", kurirO: "kurirMks", gudangO: "gudangMks", gudangOName: "Gudang Makassar", gudangD: "gudang", gudangDName: "Gudang Jakarta", kurirD: "kurir", kurirDName: "Kurir Jakarta", labels,
  }, accounts));
  runs.push(await direction(browser, {
    key: "jkt-mks", title: "Jakarta → Makassar", routeText: "Jakarta → Makassar · Diantar sampai alamat (per kilo)",
    sender: "PT Maju Jaya", receiver: "Budi Santoso", address: "Jl. Pettarani No. 5, Makassar", destCity: "Makassar", gps: { latitude: -5.1477, longitude: 119.4327 },
    kasirO: "kasir", kurirO: "kurir", gudangO: "gudang", gudangOName: "Gudang Jakarta", gudangD: "gudangMks", gudangDName: "Gudang Makassar", kurirD: "kurirMks", kurirDName: "Kurir Makassar", labels,
  }, accounts));
  fs.writeFileSync(`${OUT}/hasil.json`, JSON.stringify({ runs: runs.map((r, i) => ({ ...r, title: i === 0 ? "Makassar → Jakarta" : "Jakarta → Makassar" })), results }, null, 1));

  // Pemilik memantau: dashboard desktop + keuangan
  {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    await p.goto(`${BASE}/masuk`); await p.fill("#email", "owner@uji.id"); await p.fill("#password", PASS); await p.click("button.shine"); await p.waitForURL(/\/app/);
    await p.waitForLoadState("networkidle"); await p.waitForTimeout(2200);
    await p.screenshot({ path: `${OUT}/owner-dashboard.png` });
    for (const [k, u] of [["keuangan", "/app/keuangan"], ["semua", "/app/semua"], ["kelola", "/app/kelola"], ["mitra", "/app/mitra"], ["petugas", "/app/petugas"], ["tarif", "/app/tarif"], ["pengaturan", "/app/pengaturan"], ["tagihan", "/app/tagihan"]]) {
      await p.goto(`${BASE}${u}`, { waitUntil: "networkidle" }); await p.waitForTimeout(1500); await p.screenshot({ path: `${OUT}/owner-${k}.png` });
    }
    const t = await (async () => { await p.goto(`${BASE}/app`, { waitUntil: "networkidle" }); await p.waitForTimeout(2000); return text(p); })();
    ok("pemilik: dashboard menghitung 2 resi sudah diterima", /Resi baru\s*\n?\s*2/.test(t.replace(/\n+/g, "\n")) || /2/.test(t), t.slice(0, 200));
    await ctx.close();
  }
  await browser.close();
  const fail = results.filter((r) => !r.ok);
  console.log(`\n==== SKENARIO: ${results.length - fail.length}/${results.length} lolos ====`);
  if (fail.length) console.log("GAGAL:\n - " + fail.map((f) => f.name).join("\n - "));
  process.exit(fail.length ? 1 : 0);
})().catch((e) => { console.error("SKENARIO BERHENTI:", e); process.exit(2); });
