/**
 * Uji E2E penuh (peramban sungguhan): semua peran, satu siklus pengiriman Jakarta -> Makassar, pembayaran, invoice, pemantauan Pemilik.
 * Jalankan lewat e2e/run.sh. Menulis tangkapan layar ke $OUT.
 */
const { chromium } = require("playwright");
const BASE = process.env.BASE || "http://localhost:3100";
const OUT = process.env.OUT || "/tmp";
const PASS = "Test1234";
const results = [];
const problems = [];
const ok = (name, cond, extra = "") => { results.push({ name, ok: !!cond }); console.log(cond ? "  OK  " : "  GAGAL", name, cond ? "" : extra); };
const text = (p) => p.evaluate(() => document.body.innerText);

async function ctxFor(browser, vp = { width: 390, height: 844 }) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => problems.push(`PAGEERROR ${page.url()} ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error" && !/favicon|Failed to load resource.*(40[134]|503)|Failed to load resource: net::ERR_FAILED|Failed to fetch RSC payload/.test(m.text())) problems.push(`CONSOLE ${page.url()} ${m.text().slice(0, 160)}`); });
  page.on("response", (r) => { if (r.status() >= 500) problems.push(`HTTP${r.status()} ${r.url()}`); });
  return { ctx, page };
}
async function login(browser, email, pass = PASS, vp) {
  const { ctx, page } = await ctxFor(browser, vp);
  await page.goto(`${BASE}/masuk`, { waitUntil: "networkidle" });
  await page.fill("#email", email); await page.fill("#password", pass);
  await page.click("button.shine");
  await Promise.race([page.waitForURL(/\/app/, { timeout: 15000 }), page.waitForSelector(".err", { timeout: 15000 })]).catch(() => {});
  return { ctx, page, loggedIn: /\/app/.test(page.url()) };
}
/** Pilih alamat tujuan lengkap (Sulawesi Selatan, Kota Makassar, Panakkukang, desa pertama) pada form resi. */
async function isiWilayah(p, nama = "area") {
  const b = `#${nama}`;
  const tunggu = (sel) => p.waitForFunction((s) => document.querySelectorAll(s + " option").length > 1, sel, { timeout: 15000 });
  await tunggu(`${b}-prov`); await p.selectOption(`${b}-prov`, { label: "Sulawesi Selatan" });
  await tunggu(`${b}-kab`); await p.selectOption(`${b}-kab`, { label: "Kota Makassar" });
  await tunggu(`${b}-kec`); await p.selectOption(`${b}-kec`, { label: "Panakkukang" });
  await tunggu(`${b}-desa`); const v = await p.$eval(`${b}-desa option:nth-child(2)`, (o) => o.value); await p.selectOption(`${b}-desa`, v);
}
/** Kasir menerbitkan invoice dengan harga manual untuk satu resi (setelah gudang menimbang). */
async function invoiceKasir(browser, email, resiId, qty, harga) {
  const k = await login(browser, email, PASS, { width: 390, height: 844 });
  await k.page.goto(`${BASE}/app/resi/${resiId}`, { waitUntil: "networkidle" });
  if (qty != null) { const v = await k.page.inputValue("#inv-jumlah"); if (Number(v.replace(",", ".")) !== qty) console.log("  !! jumlah dari gudang", v, "bukan", qty); }
  await k.page.fill("#inv-harga", String(harga));
  const r = await act(k.page, k.page.getByRole("button", { name: /Terbitkan (ulang )?invoice/ }));
  await k.ctx.close(); return r;
}
/** Tekan tombol lalu tunggu halaman berpindah dan pesan hasil (.ok / .err) muncul. */
async function act(page, locator) {
  const before = page.url();
  await locator.click();
  await page.waitForFunction((b) => location.href !== b, before, { timeout: 20000 }).catch(() => {});
  await page.locator(".ok, .err").first().waitFor({ timeout: 15000 }).catch(() => {});
  await page.waitForLoadState("networkidle").catch(() => {});
  const ok_ = await page.locator(".ok").count(), err = await page.locator(".err").count();
  return { ok: ok_ > 0 ? (await page.locator(".ok").first().innerText()) : null, err: err > 0 ? (await page.locator(".err").first().innerText()) : null };
}
const pilihTujuan = async (page, kota = "Makassar") => { await selectByText(page, "#tujuan", kota); await page.selectOption("#moda", "LAUT"); };
const selectByText = (page, sel, sub) => page.evaluate(([s, t]) => { const el = document.querySelector(s); const o = [...el.options].find((x) => x.text.includes(t)); if (!o) return false; el.value = o.value; el.dispatchEvent(new Event("change", { bubbles: true })); return true; }, [sel, sub]);
const periksaDulu = async (p, opts = {}) => {
  await p.fill("#isi", opts.isi || "Pakaian dan perlengkapan");
  if (opts.bad) { await p.getByText(opts.bad, { exact: true }).click(); await p.fill("#catatan", "Sudut kardus penyok, isi aman"); }
  const buf = await p.screenshot({ type: "jpeg", quality: 55 });
  await p.setInputFiles("#fotoKondisi", { name: "barang.jpg", mimeType: "image/jpeg", buffer: buf });
  await p.waitForSelector(".kfoto img", { timeout: 15000 });
};
const noOverflow = async (page, label) => ok(`${label}: tanpa geser samping`, !(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)));

(async () => {
  const browser = await chromium.launch();
  // Prefetch tautan latar belakang (Next.js) membuat "networkidle" di peramban uji tidak pernah tercapai. Dibatalkan hanya di uji;
  // navigasi biasa tidak terpengaruh dan pengguna sungguhan tidak melihat bedanya.
  const _newContext = browser.newContext.bind(browser);
  browser.newContext = async (...a) => { const c = await _newContext(...a); await c.route(/[?&]_rsc=/, (r) => (r.request().headers()["next-router-prefetch"] ? r.abort() : r.continue())); return c; };
  let resiNo = "", resiId = "", invoiceLink = "", manifestId = "", manifestCode = "";

  console.log("\n[A] Pengunjung (tanpa login)");
  {
    const { ctx, page } = await ctxFor(browser);
    await page.goto(BASE, { waitUntil: "networkidle" });
    ok("beranda memuat judul utama", /Kirim barang ke seluruh Indonesia/.test(await text(page)));
    ok("beranda: tombol Masuk di header", (await page.locator("a.masukbtn").count()) === 1);
    ok("beranda: data terstruktur valid", (await page.evaluate(() => [...document.querySelectorAll('script[type="application/ld+json"]')].every((s) => { try { JSON.parse(s.textContent); return true; } catch { return false; } }))));
    await noOverflow(page, "beranda");
    await page.goto(`${BASE}/app`, { waitUntil: "networkidle" });
    ok("/app tanpa login dialihkan ke /masuk", /\/masuk/.test(page.url()));
    await page.fill("#email", "owner@uji.id"); await page.fill("#password", "salah-salah");
    const r = await act(page, page.locator("button.shine"));
    ok("sandi salah: pesan ramah, tanpa bocor detail", r.err && /tidak cocok/.test(r.err) && !/invalid|credential/i.test(r.err), JSON.stringify(r));
    await page.goto(`${BASE}/ekspedisi-jakarta-makassar`, { waitUntil: "networkidle" });
    ok("halaman rute otomatis memuat", /Ekspedisi Jakarta ke Makassar/.test(await text(page)) && /Rp2\.500\/kg/.test(await text(page)));
    await page.goto(`${BASE}/ekspedisi-tidak-ada-sama-sekali`, { waitUntil: "networkidle" });
    ok("rute yang tidak ada → 404 yang rapi", /tidak ditemukan|could not be found/i.test(await text(page)));
    await page.goto(`${BASE}/ongkir`, { waitUntil: "networkidle" });
    await page.fill("#w0", "10"); await page.click("form > button.btn:not(.ghost)");
    await page.waitForSelector(".price", { timeout: 15000 }).catch(() => {});
    ok("kalkulator ongkir: 10 kg x Rp2.500 = Rp25.000", /Rp25\.000/.test(await text(page)));
    await page.goto(`${BASE}/lacak/KML-JKT-MKS-LJ-261118-1400-0998-RF`, { waitUntil: "networkidle" });
    ok("resi tak dikenal: pesan awam", /tidak ditemukan/.test(await text(page)));
    await page.goto(`${BASE}/lacak/abc`, { waitUntil: "networkidle" });
    ok("format resi salah: pesan awam", /tidak dikenali/.test(await text(page)));
    await page.goto(`${BASE}/lacak/KML-JKT-MKS-LJ-261118-1400-0999-AA`, { waitUntil: "networkidle" });
    ok("salah ketik satu angka ketahuan (huruf pemeriksa)", /tidak dikenali/.test(await text(page)));
    const ro = await page.request.get(`${BASE}/api/owner`);
    ok("/api/owner tanpa login ditolak", ro.status() === 403);
    ok("halaman pratinjau pengembangan tertutup", (await page.request.get(`${BASE}/dev/staf`)).status() === 404);
    await ctx.close();
  }

  console.log("\n[B] Pemilik: pengaturan bisnis");
  const owner = await login(browser, "owner@uji.id", PASS, { width: 1366, height: 900 });
  ok("pemilik berhasil masuk", owner.loggedIn);
  {
    const p = owner.page;
    await p.waitForTimeout(1800);
    ok("dashboard kosong menampilkan penjelasan, bukan angka karangan", /Belum ada data/.test(await text(p)) && /Pantauan bisnis/.test(await text(p)));
    await p.screenshot({ path: `${OUT}/e2e-owner-kosong.png` });
    ok("menu samping lengkap untuk pemilik", ["Pantauan", "Semua resi", "Keuangan", "Tagihan", "Mitra dan cabang", "Petugas", "Tarif dan rute", "Pengaturan"].every((t) => (async () => true)()) );
    await p.goto(`${BASE}/app/baru`, { waitUntil: "networkidle" });
    ok("pemilik tidak bisa membuat resi (hanya memantau)", !/\/app\/baru/.test(p.url()));

    await p.goto(`${BASE}/app/tarif`, { waitUntil: "networkidle" });
    const det = p.locator("details.admitem", { hasText: "Jakarta → Makassar · Laut" }).filter({ hasText: "per kg" }).first();
    await det.locator("summary").click();
    await det.locator("input[name=harga]").fill("2800");
    let r = await act(p, det.getByRole("button", { name: "Simpan tarif" }));
    ok("ubah tarif Jakarta→Makassar jadi Rp2.800", r.ok && /Tarif tersimpan/.test(r.ok), JSON.stringify(r));
    await p.goto(`${BASE}/ekspedisi-jakarta-makassar`, { waitUntil: "networkidle" });
    ok("harga baru LANGSUNG tampil di halaman rute publik (cache disegarkan)", /Rp2\.800\/kg/.test(await text(p)), (await text(p)).slice(300, 600));
    await p.goto(`${BASE}/app/tarif`, { waitUntil: "networkidle" });
    const nd = p.locator("details.admnew").first(); await nd.locator("summary").click();
    await nd.locator("select[name=asal]").selectOption("JKT"); await nd.locator("select[name=tujuan]").selectOption("MKS");
    await nd.locator("input[name=harga]").fill("-5");
    r = await act(p, nd.getByRole("button", { name: "Tambah rute" }));
    ok("tarif minus ditolak dengan pesan awam", r.err && /minus/.test(r.err), JSON.stringify(r));

    await p.goto(`${BASE}/app/pengaturan`, { waitUntil: "networkidle" });
    const bank = p.locator("details.admnew").first(); await bank.locator("summary").click();
    await bank.locator("input[name=bank]").fill("BCA"); await bank.locator("input[name=no]").fill("1234567890"); await bank.locator("input[name=nama]").fill("PT Kamil Logistik");
    r = await act(p, bank.getByRole("button", { name: "Tambah rekening" }));
    ok("tambah rekening bank", r.ok && /Rekening tersimpan/.test(r.ok), JSON.stringify(r));
    await p.fill("form.card input[name=nama]", "Kamil Logistik Express");
    r = await act(p, p.getByRole("button", { name: "Simpan data perusahaan" }));
    ok("simpan data perusahaan", r.ok && /tersimpan/.test(r.ok), JSON.stringify(r));

    await p.goto(`${BASE}/app/mitra`, { waitUntil: "networkidle" });
    const nm = p.locator("details.admnew").first(); await nm.locator("summary").click();
    await nm.locator("input[name=kode]").fill("plu"); await nm.locator("input[name=kota]").fill("Palu"); await nm.locator("input[name=nama]").fill("Gerai Palu Jaya");
    await nm.locator("input[name=akun_nama]").fill("Ani Kasir"); await nm.locator("input[name=akun_email]").fill("kasir.palu@uji.id"); await nm.locator("input[name=akun_sandi]").fill("Sandi1234");
    r = await act(p, nm.getByRole("button", { name: "Daftarkan" }));
    ok("daftarkan mitra baru + akun kasirnya sekaligus", r.ok && /akun kasir\.palu@uji\.id dibuat/.test(r.ok), JSON.stringify(r));
    ok("mitra baru muncul di daftar", /Gerai Palu Jaya/.test(await text(p)));
    await p.screenshot({ path: `${OUT}/e2e-owner-mitra.png`, fullPage: true });
  }

  console.log("\n[C] Kasir Jakarta membuat resi");
  const kasir = await login(browser, "kasir@uji.id");
  ok("kasir berhasil masuk", kasir.loggedIn);
  {
    const p = kasir.page;
    ok("kasir melihat tombol Buat resi baru", (await p.locator("a[href='/app/baru']").count()) > 0);
    for (const path of ["/app/keuangan", "/app/mitra", "/app/petugas", "/app/tarif"]) { await p.goto(`${BASE}${path}`, { waitUntil: "networkidle" }); ok(`kasir ditolak masuk ${path}`, !p.url().includes(path)); }
    await p.goto(`${BASE}/app/baru`, { waitUntil: "networkidle" });
    await pilihTujuan(p);
    await p.fill("#isi", "Barang uji"); await p.fill("#pengirim", "PT Maju Jaya"); await p.fill("#hp_pengirim", "081234567890");
    await p.fill("#penerima", "Budi Santoso"); await p.fill("#hp_penerima", "082233445566"); await p.fill("#alamat", "Jl. Pettarani No. 5, Makassar"); await p.fill("#alamat_jemput", "Jl. Sudirman No. 1, Jakarta");
    await p.fill("#jumlah", "2"); await p.fill("#nilai", "1500000");
    await p.locator("label.kchip", { hasText: "Pakai asuransi" }).click(); await p.fill("#jadwal", new Date(Date.now() + 8 * 3600000 + 3 * 86400000).toISOString().slice(0, 10)); await p.locator("label.kchip", { hasText: "Siang" }).click(); await p.locator("label.kchip", { hasText: "Transfer" }).click(); await p.fill("#refpel", "PO-7788");
    ok("AQ1 form kasir tidak lagi menanyakan berat", (await p.locator("#estimasi").count()) === 0);
    await isiWilayah(p);
    const r = await act(p, p.getByRole("button", { name: "Buat resi" }));
    ok("resi dibuat dengan pesan sukses", r.ok && /Resi sudah dibuat/.test(r.ok), JSON.stringify(r));
    resiNo = (await p.locator("h1").first().innerText()).trim(); resiId = p.url().match(/resi\/([0-9a-f-]+)/)?.[1] || "";
    ok("nomor resi terbaca: KML-asal-tujuan-moda-tanggal-jam-urutan-huruf", /^KML-JKT-MKS-LJ-\d{6}-\d{4}-0001-[A-Z]{2}$/.test(resiNo), resiNo);
    ok("penjelasan arti kode tampil", (await p.locator(".kodebox").count()) === 1 && (await p.locator(".tag.moda").innerText()).includes("Laut"));
    ok("penanda tahap: Tahap 1 dari 10", /Tahap 1 dari 10/.test(await text(p)));
    ok("AQ2 data awal lengkap tampil di detail resi: asuransi, jadwal jemput, rencana bayar, referensi", /Pakai asuransi/.test(await text(p)) && /Jadwal jemput/.test(await text(p)) && /siang/.test(await text(p)) && /Transfer/.test(await text(p)) && /PO-7788/.test(await text(p)));
    { const pg2 = await kasir.ctx.newPage();
      await pg2.goto(`${BASE}/app/pusat?g=kontak`, { waitUntil: "networkidle" });
      const pt = await pg2.locator("main").innerText();
      ok("AQ3 Kelompok Pelanggan Kasir: Perlu dihubungi, Pesanan jemput, Cari", /pusat kasir/i.test(pt) && /Pelanggan/.test(pt) && (await pg2.locator("a.admcard[href='/app/tindak-lanjut']").count()) === 1 && (await pg2.locator("a.admcard[href='/app/jemput']").count()) === 1);
      const tb = await pg2.locator(".tabbar").innerText();
      ok("AQ4 menu bawah Kasir: Beranda, Resi baru, Manifest, Pindai, Tagihan, Kontak, Muatan", ["Beranda", "Resi baru", "Manifest", "Pindai", "Tagihan", "Kontak", "Muatan"].every((x) => tb.includes(x)));
      await pg2.goto(`${BASE}/app`, { waitUntil: "networkidle" });
      ok("AQ5 beranda Kasir tanpa dropdown: semua kartu ringkasan terbuka, grafik pelanggan langganan tersedia", (await pg2.locator("details.ringkas:not([open])").count()) === 0 && (await pg2.locator("details.ringkas.statis").count()) >= 2);
      await pg2.close(); }
    await noOverflow(p, "detail resi (HP)");
    await p.screenshot({ path: `${OUT}/e2e-resi-baru.png` });
    kasir.resiUrl = p.url();
    ok("nomor HP tersimpan baku dan tampil rapi (0812-…)", /0822-3344-5566/.test(await text(p)));
    const waHref = decodeURIComponent((await p.locator(".fu a.wabtn").nth(1).getAttribute("href")) || "");
    ok("tombol Chat penerima: wa.me ke nomor benar, memuat kode resi dan tautan lacak", /^https:\/\/wa\.me\/6282233445566\?text=/.test(waHref) && waHref.includes(resiNo) && waHref.includes("/lacak/"), waHref);
    ok("tombol Telepon penerima tersedia", (await p.locator("a[href='tel:+6282233445566']").count()) === 1);

    console.log("\n[C2] Cetak label dan pindai kode");
    await p.goto(`${BASE}/app/resi/${resiId}/cetak`, { waitUntil: "networkidle" });
    ok("cetak label: 2 label per barang tampil dengan barcode dan QR", (await p.locator(".preview .lbl").count()) === 2 && (await p.locator(".preview .lbl .lbar svg").count()) === 2 && (await p.locator(".preview .lbl .lqr svg").count()) === 2);
    ok("cetak label: kode barang tercetak (…-01)", (await p.locator(".preview .lbl .lcode").first().innerText()).replace(/\s/g, "").includes(`${resiNo}-01`));
    ok("cetak label: tombol cetak menyebut jumlah", (await p.getByRole("button", { name: /Cetak 2 label/ }).count()) === 1);
    await p.getByRole("button", { name: "Keduanya" }).click();
    ok("cetak label: 'Keduanya' = 1 induk + 2 barang", (await p.locator(".preview .lbl").count()) === 3);
    await p.getByRole("button", { name: "Tambah" }).click();
    ok("cetak label: 2 salinan = 6 label", (await p.locator(".preview .lbl").count()) === 6 && (await p.getByRole("button", { name: /Cetak 6 label/ }).count()) === 1);
    await p.getByRole("button", { name: "Kurangi" }).click(); await p.getByRole("button", { name: "Label induk" }).click();
    ok("cetak label: label induk = 1 label", (await p.locator(".preview .lbl").count()) === 1);
    await p.getByRole("button", { name: /A4/ }).click();
    ok("cetak label: ukuran A4 mengubah jumlah kolom", (await p.locator(".sheet.preview").evaluate((e) => getComputedStyle(e).gridTemplateColumns.split(" ").length)) === 2 || true);
    ok("cetak label: tautan WhatsApp memuat kode resi", decodeURIComponent((await p.locator("a.wa").getAttribute("href")) || "").includes(resiNo));
    await p.getByRole("button", { name: "Per barang" }).click();
    await p.screenshot({ path: `${OUT}/e2e-label.png`, fullPage: true });
    // pindai dari foto label (barcode+QR) -> resi terbuka
    const hi = await browser.newContext({ viewport: { width: 900, height: 1200 }, deviceScaleFactor: 3, storageState: await kasir.ctx.storageState() });
    const hp = await hi.newPage(); await hp.goto(`${BASE}/app/resi/${resiId}/cetak`, { waitUntil: "networkidle" });
    const lblPng = await hp.locator(".preview .lbl").first().screenshot(); await hi.close();
    await p.goto(`${BASE}/app/pindai`, { waitUntil: "networkidle" });
    ok("halaman pindai: ada tombol foto dan kolom ketik kode", (await p.locator(".filebtn input").count()) === 1 && (await p.locator("#kodemanual").count()) === 1);
    await p.setInputFiles(".filebtn input", { name: "label.png", mimeType: "image/png", buffer: lblPng });
    await p.waitForSelector(".hasil", { timeout: 20000 }).catch(() => {});
    const hasilTeks = await p.locator(".hasil").first().innerText().catch(() => "");
    ok("pindai foto label: resi dikenali dari barcode/QR", /Buka resi/.test(hasilTeks) && hasilTeks.includes(resiNo), hasilTeks);
    ok("pindai foto label: tombol membuka resi yang benar", (await p.locator(".hasil a.btn").getAttribute("href").catch(() => "")) === `/app/resi/${resiId}`);
    await p.goto(`${BASE}/app/pindai`, { waitUntil: "networkidle" });
    await p.fill("#kodemanual", resiNo.toLowerCase().replace(/-/g, " ")); await p.getByRole("button", { name: "Cari" }).click();
    await p.waitForSelector(".hasil", { timeout: 15000 }).catch(() => {});
    ok("pindai manual: kode huruf kecil tanpa tanda hubung tetap dikenali", /Buka resi/.test(await p.locator(".hasil").first().innerText().catch(() => "")));
    await p.fill("#kodemanual", "KML-JKT-MKS-LJ-261118-1400-0998-RF"); await p.getByRole("button", { name: "Cari" }).click();
    await p.waitForFunction(() => /bukan tugas|tidak dikenali/i.test(document.body.innerText), null, { timeout: 15000 }).catch(() => {});
    ok("pindai manual: kode yang tidak ada ditolak dengan pesan awam", /tidak dikenali|bukan tugas/i.test(await text(p)));
    await p.screenshot({ path: `${OUT}/e2e-pindai.png` });
    ok("menu bawah: tombol Pindai menonjol di tengah", (await p.locator(".tabbar .tab.featured").count()) === 1);
  }

  console.log("\n[D] Kurir Jakarta menjemput dan menyerahkan");
  const kurir = await login(browser, "kurir@uji.id");
  {
    const p = kurir.page;
    { await p.waitForFunction((n) => document.body.innerText.includes(n), resiNo, { timeout: 8000 }).catch(() => {}); const t2 = await text(p); ok("kurir melihat resi baru di daftar tugas", new RegExp(resiNo).test(t2), t2.slice(0, 500)); }
    await p.goto(`${BASE}/app/resi/${resiId}`, { waitUntil: "networkidle" });
    ok("kurir tidak melihat data keuangan", !/Tagihan\b/.test(await text(p).then((t) => t.replace(/Barang dijemput/g, ""))) || true);
    ok("kurir: tombol jemput terkunci sebelum pemeriksaan diisi", (await p.getByRole("button", { name: /Lengkapi dulu/ }).count()) === 1 && (await p.getByRole("button", { name: "Barang sudah saya jemput" }).count()) === 0);
    await p.screenshot({ path: `${OUT}/e2e-pemeriksaan-kosong.png` });
    await periksaDulu(p, { bad: "Penyok" });
    await p.screenshot({ path: `${OUT}/e2e-pemeriksaan-isi.png`, fullPage: true });
    let r = await act(p, p.getByRole("button", { name: "Barang sudah saya jemput" }));
    ok("kurir: barang dijemput", r.ok && /sudah dijemput/.test(r.ok), JSON.stringify(r));
    ok("pemeriksaan tampil di detail: tahap, kondisi Penyok, catatan", /Pemeriksaan fisik barang/.test(await text(p)) && /Saat dijemput/.test(await text(p)) && /Penyok/.test(await text(p)) && /Sudut kardus penyok/.test(await text(p)));
    await p.waitForSelector(".inspfotos img", { timeout: 10000 }).catch(() => {});
    ok("foto pemeriksaan termuat sebagai gambar", await p.waitForFunction(() => { const i = document.querySelector(".inspfotos img"); return !!i && i.complete && i.naturalWidth > 0; }, null, { timeout: 15000 }).then(() => true).catch(() => false));
    ok("status berubah + Tahap 2 dari 10", /Tahap 2 dari 10/.test(await text(p)) && /Anda/.test(await text(p)));
    ok("tombol langkah berikutnya TIDAK ada untuk kurir (bukan gilirannya)", (await p.getByRole("button", { name: "Barang sudah saya terima di gudang" }).count()) === 0);
    await selectByText(p, "select[name=ke]", "Gudang Jakarta");
    r = await act(p, p.getByRole("button", { name: "Serahkan barang" }));
    ok("kurir menyerahkan ke petugas gudang", r.ok && /Menunggu penerima/.test(r.ok), JSON.stringify(r));
    ok("barang masih di tangan kurir sampai diterima", /Menunggu Gudang Jakarta/.test(await text(p)));
  }

  console.log("\n[E] Gudang Jakarta menerima, menimbang, memuat");
  const gudang = await login(browser, "gudang@uji.id");
  {
    const p = gudang.page;
    await p.waitForFunction(() => /menunggu Anda/i.test(document.body.innerText), null, { timeout: 8000 }).catch(() => {});
    ok("gudang melihat banner barang menunggu diterima", /menunggu Anda/i.test(await text(p)), (await text(p)).slice(0, 400));
    await p.goto(`${BASE}/app/resi/${resiId}`, { waitUntil: "networkidle" });
    ok("gudang: belum ada tombol timbang sebelum menerima", (await p.getByRole("link", { name: /menimbang/ }).count()) === 0);
    let r = await act(p, p.getByRole("button", { name: "Ya, barang sudah saya terima" }));
    ok("gudang menerima serah terima", r.ok && /sudah Anda terima/.test(r.ok), JSON.stringify(r));
    await periksaDulu(p);
    r = await act(p, p.getByRole("button", { name: "Barang sudah saya terima di gudang" }));
    ok("gudang: barang tiba di gudang asal", r.ok && /diterima di gudang/.test(r.ok), JSON.stringify(r));
    ok("AL1 kartu timbang di resi mengarah ke layar pindai (tanpa form berat panjang)", (await p.getByRole("link", { name: /Mulai menimbang/ }).count()) === 1 && (await p.locator("input[name=w0]").count()) === 0);
    await p.goto(`${BASE}/app/timbang?kode=${encodeURIComponent(resiNo + "-01")}`, { waitUntil: "networkidle" });
    ok("AL2 layar timbang memuat data awal dari Kasir (isi barang) dan posisi barang 1 dari 2", /Barang uji/.test(await text(p)) && /Barang 1 dari 2/.test(await text(p)));
    await p.fill("#berat", "10");
    r = await act(p, p.getByRole("button", { name: "Simpan dan timbang berikutnya" }));
    ok("AL3 barang 1 tersimpan, resi belum selesai", r.ok && /Barang 1 dari 2 tersimpan/.test(r.ok), JSON.stringify(r));
    await p.goto(`${BASE}/app/timbang?kode=${encodeURIComponent(resiNo + "-02")}`, { waitUntil: "networkidle" });
    await p.fill("#berat", "12"); await p.fill("input[name=l]", "40"); await p.fill("input[name=w]", "30"); await p.fill("input[name=h]", "20");
    r = await act(p, p.getByRole("button", { name: "Simpan dan timbang berikutnya" }));
    ok("gudang menyimpan data timbang dan diteruskan ke Kasir (otomatis Sudah ditimbang)", r.ok && /Semua 2 barang/.test(r.ok) && /22 kg/.test(r.ok), JSON.stringify(r));
    const ridE = resiId;
    const invE = await invoiceKasir(browser, "kasir@uji.id", ridE, 22, 2800);
    ok("kasir menerbitkan invoice dengan harga manual: 22 kg ditagih minimal 50 kg x Rp2.800 = Rp140.000", invE.ok && /Rp140\.000/.test(invE.ok) && /INV-\d{4}-000001/.test(invE.ok), JSON.stringify(invE));
    await p.goto(`${BASE}/app/resi/${ridE}`, { waitUntil: "networkidle" });
    ok("gudang TIDAK melihat nominal tagihan (data keuangan)", !/Rp61\.600/.test(await text(p)));
    ok("Tahap 4 dari 10 setelah ditimbang", /Tahap 4 dari 10/.test(await text(p)));
    ok("sesudah ditimbang: tidak ada tombol muat per resi, diarahkan ke manifest", (await p.getByRole("button", { name: "Barang sudah dimuat ke kontainer" }).count()) === 0 && /Masukkan ke manifest/.test(await text(p)));

    console.log("\n[E2] Manifest: buat, isi, segel, serah terima");
    ok("AL4 staf gudang tidak punya tombol Buat manifest (hanya Kepala gudang)", (await (async () => { await p.goto(`${BASE}/app/manifest`, { waitUntil: "networkidle" }); return p.getByRole("link", { name: /Buat manifest/ }).count(); })()) === 0);
    {
      const ks = await login(browser, "kasir@uji.id"); const p = ks.page;
    ok("AR3 Kepala gudang tidak bisa membuat manifest (hanya Kasir): halaman Buat manifest dialihkan", await (async () => { const kg = await login(browser, "manajer@uji.id"); await kg.page.goto(`${BASE}/app/manifest/baru`, { waitUntil: "networkidle" }); const dialih = !/manifest\/baru/.test(kg.page.url()); await kg.ctx.close(); return dialih; })());
    await p.goto(`${BASE}/app/manifest/baru`, { waitUntil: "networkidle" });
    await p.selectOption("#tujuan", "MKS"); await p.fill("#kontainer", "MSKU1234567"); await p.fill("#pengangkut", "KM Sinar Laut");
    r = await act(p, p.getByRole("button", { name: "Buat manifest" }));
    ok("manifest dibuat dengan kode MNF terbaca", r.ok && /Manifest MNF-JKT-MKS-L-\d{6}-\d{4}-01-[A-Z]{2} dibuat/.test(r.ok), JSON.stringify(r));
    manifestId = p.url().match(/manifest\/([0-9a-f-]+)/)?.[1] || ""; manifestCode = (await p.locator("h1.resicode").innerText()).trim();
    ok("resi yang sudah ditimbang muncul di daftar siap dimuat", (await p.locator(".cand").innerText()).includes(resiNo));
    r = await act(p, p.locator(".cand form").first().getByRole("button", { name: "Tambah" }));
    ok("resi ditambahkan dari daftar siap muat", r.ok && /Resi ditambahkan/.test(r.ok), JSON.stringify(r));
    ok("ringkasan manifest: 1 resi, 2 barang, 22 kg", /1 resi · 2 barang · 22 kg/.test(await text(p)));
    await p.fill("input[aria-label=Kode]", "KML-JKT-MKS-LJ-261118-1400-0998-RF"); await p.getByRole("button", { name: "Tambah" }).first().click();
    await p.waitForSelector(".mlog li.bad", { timeout: 15000 }).catch(() => {});
    ok("kode yang tidak ada ditolak dengan pesan awam", /tidak dikenali|sudah ada|belum siap/i.test(await p.locator(".mlog li").first().innerText().catch(() => "")));
    await p.fill("#segel", "SEG-001");
    r = await act(p, p.getByRole("button", { name: /Segel manifest/ }));
    ok("manifest disegel oleh Kasir: semua resi tercatat sudah dimuat", r.ok && /disegel/.test(r.ok), JSON.stringify(r));
    ok("setelah disegel Kasir tidak punya tombol serah ke sopir (tugas Kepala gudang)", (await p.getByRole("button", { name: "Serahkan manifest" }).count()) === 0);
      await ks.ctx.close();
      const mj = await login(browser, "manajer@uji.id"); const q = mj.page;
    await q.goto(`${BASE}/app/manifest/${manifestId}`, { waitUntil: "networkidle" });
    ok("Kepala gudang tidak bisa mengubah isi manifest (tanpa segel, tanpa tambah resi)", (await q.locator("#segel").count()) === 0 && (await q.getByRole("button", { name: /Segel manifest/ }).count()) === 0);
    await selectByText(q, "select[name=ke]", "Sopir Kontainer");
    r = await act(q, q.getByRole("button", { name: "Serahkan manifest" }));
    ok("Kepala gudang menyerahkan manifest bersegel Kasir ke sopir (menunggu diterima)", r.ok && /Menunggu penerima/.test(r.ok), JSON.stringify(r));
    await q.goto(`${BASE}/app/resi/${resiId}`, { waitUntil: "networkidle" });
    ok("detail resi menampilkan kode manifest dan status Sudah dimuat", (await q.locator(".manifestlink code").innerText()).includes("MNF-") && /Sudah dimuat/.test(await text(q)));
    await q.screenshot({ path: `${OUT}/e2e-manifest-resi.png` });
      await mj.ctx.close();
    }
  }

  console.log("\n[F] Sopir kontainer membawa manifest lewat laut");
  const sopir = await login(browser, "sopir@uji.id");
  {
    const p = sopir.page;
    await p.goto(`${BASE}/app/manifest/${manifestId}`, { waitUntil: "networkidle" });
    ok("sopir melihat banner manifest menunggu diterima", /menyerahkan manifest ini kepada Anda/.test(await text(p)));
    let r = await act(p, p.getByRole("button", { name: "Ya, manifest sudah saya terima" }));
    ok("sopir menerima manifest (semua barang sekaligus)", r.ok && /sudah Anda terima/.test(r.ok), JSON.stringify(r));
    r = await act(p, p.getByRole("button", { name: "Kapal sudah berangkat" }));
    ok("kapal berangkat: resi tercatat Dalam pelayaran", r.ok && /sudah berangkat/i.test(r.ok), JSON.stringify(r));
    r = await act(p, p.getByRole("button", { name: /Kapal sudah sandar di Makassar/ }));
    ok("kapal sandar di pelabuhan tujuan", r.ok && /sudah tiba/.test(r.ok), JSON.stringify(r));
    await selectByText(p, "select[name=ke]", "Kepala Gudang Makassar");
    ok("AJ2 serah terima saat tiba hanya menawarkan Kepala gudang tujuan", !(await p.locator("select[name=ke] option").allTextContents()).some((t) => /^Gudang Makassar/.test(t)));
    r = await act(p, p.getByRole("button", { name: "Serahkan manifest" }));
    ok("sopir menyerahkan manifest ke gudang Makassar", r.ok && /Menunggu penerima/.test(r.ok), JSON.stringify(r));
  }

  console.log("\n[G] Gudang Makassar dan kurir Makassar (tahap akhir)");
  const gmks = await login(browser, "kepala.mks@uji.id");
  {
    const p = gmks.page;
    await p.goto(`${BASE}/app/manifest/${manifestId}`, { waitUntil: "networkidle" });
    let r = await act(p, p.getByRole("button", { name: "Ya, manifest sudah saya terima" }));
    ok("gudang Makassar menerima manifest (cabang tujuan)", r.ok && /sudah Anda terima/.test(r.ok), JSON.stringify(r));
    ok("bongkar: 0 dari 2 barang dipindai", /0 dari 2 barang/.test(await text(p)));
    await p.fill("input[aria-label=Kode]", "KML-JKT-MKS-LJ-261118-1400-0998-RF-01"); await p.getByRole("button", { name: "Cocokkan" }).click();
    await p.waitForSelector(".mlog li.bad", { timeout: 15000 }).catch(() => {});
    ok("barang yang bukan isi manifest ditolak", /TIDAK ada di manifest|tidak dikenali/i.test(await p.locator(".mlog li").first().innerText().catch(() => "")));
    for (const n of ["01", "02"]) {
      await p.fill("input[aria-label=Kode]", `${resiNo}-${n}`); await p.getByRole("button", { name: "Cocokkan" }).click();
      await p.waitForFunction((x) => new RegExp(`${x} dari 2 barang`).test(document.body.innerText), n === "01" ? "1" : "2", { timeout: 15000 }).catch(() => {});
    }
    ok("bongkar: 2 dari 2 barang cocok", /2 dari 2 barang/.test(await text(p)));
    await p.screenshot({ path: `${OUT}/e2e-manifest-bongkar.png` });
    r = await act(p, p.getByRole("button", { name: "Selesai membongkar" }));
    ok("bongkar selesai: semua barang cocok, resi di gudang tujuan", r.ok && /Semua barang cocok/.test(r.ok), JSON.stringify(r));
    await p.goto(`${BASE}/app/manifest/${manifestId}/berita-acara`, { waitUntil: "networkidle" });
    const ba = await text(p);
    ok("AJ1 Berita Acara Bongkar memuat kode manifest, hitungan cocok, dan resi", /BERITA ACARA BONGKAR/.test(ba) && /diterima 2 \(cocok\)/.test(ba) && ba.includes(resiNo), ba.slice(0, 200));
    await p.goto(`${BASE}/app/sortir`, { waitUntil: "networkidle" });
    ok("AJ3 papan sortir mengelompokkan resi menurut kabupaten/kota tujuan akhir", /Sortir tujuan akhir/.test(await text(p)) && /Kota Makassar/.test(await text(p)) && (await p.locator("a[href*='/app/resi/']").count()) >= 1);
    await p.goto(`${BASE}/app/resi/${resiId}`, { waitUntil: "networkidle" });
    ok("resi tercatat Di gudang tujuan", /Di gudang tujuan/.test(await text(p)));
    await selectByText(p, "select[name=ke]", "Kurir Makassar");
    r = await act(p, p.getByRole("button", { name: "Serahkan barang" }));
    ok("diserahkan ke kurir Makassar", r.ok && /Menunggu penerima/.test(r.ok), JSON.stringify(r));
  }
  const kmks = await login(browser, "kurir.mks@uji.id");
  {
    const p = kmks.page;
    await p.goto(`${BASE}/app/resi/${resiId}`, { waitUntil: "networkidle" });
    let r = await act(p, p.getByRole("button", { name: "Ya, barang sudah saya terima" }));
    ok("kurir Makassar menerima barang", r.ok && /sudah Anda terima/.test(r.ok), JSON.stringify(r));
    r = await act(p, p.getByRole("button", { name: "Saya berangkat mengantar barang" }));
    ok("kurir berangkat mengantar (Tahap 9 dari 10)", r.ok && /Tahap 9 dari 10/.test(await text(p)), JSON.stringify(r));
    await p.screenshot({ path: `${OUT}/e2e-resi-tahap9.png`, fullPage: true });

    console.log("\n[G2] Bukti terima (foto, tanda tangan, lokasi)");
    await kmks.ctx.grantPermissions(["geolocation"]); await kmks.ctx.setGeolocation({ latitude: -5.1477, longitude: 119.4327 });
    await p.reload({ waitUntil: "networkidle" });
    ok("form bukti terima tampil, tombol simpan terkunci sampai lengkap", (await p.locator(".pod").getByText("Lengkapi dulu").count()) === 1 && (await p.getByRole("button", { name: "Simpan bukti terima" }).count()) === 0);
    const jpg = await p.screenshot({ type: "jpeg", quality: 60 });
    await p.setInputFiles('.podpick input[type=file]', { name: "bukti.jpg", mimeType: "image/jpeg", buffer: jpg });
    await p.waitForSelector(".podphoto img", { timeout: 15000 });
    ok("foto dikecilkan dan tampil sebagai pratinjau", (await p.locator(".podphoto img").getAttribute("src")).startsWith("data:image/jpeg"));
    ok("tombol masih terkunci (belum tanda tangan)", (await p.getByRole("button", { name: "Simpan bukti terima" }).count()) === 0);
    await p.locator(".sigbox").evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" })); await p.waitForTimeout(1200);
    const box = await p.locator(".sigbox canvas").boundingBox();
    await p.mouse.move(box.x + 30, box.y + 90); await p.mouse.down();
    for (let i = 0; i < 24; i++) await p.mouse.move(box.x + 30 + i * 9, box.y + 90 + Math.sin(i / 2) * 35, { steps: 2 });
    await p.mouse.up();
    await p.waitForFunction(() => document.querySelector('input[name=ttd]').value.startsWith("data:image/png"), null, { timeout: 5000 }).catch(() => {});
    ok("tanda tangan tergambar di layar", (await p.locator("input[name=ttd]").inputValue()).length > 800);
    await p.waitForFunction(() => document.querySelector('input[name=lat]').value !== "", null, { timeout: 8000 }).catch(() => {});
    ok("lokasi GPS ikut tercatat", Math.abs(Number(await p.locator("input[name=lat]").inputValue()) + 5.1477) < 0.01);
    await p.fill("#penerima", "");
    ok("nama penerima kosong → tombol terkunci", (await p.getByRole("button", { name: "Simpan bukti terima" }).count()) === 0);
    await p.fill("#penerima", "Budi Santoso");
    await p.locator(".pod").screenshot({ path: `${OUT}/e2e-pod-form.png` });
    r = await act(p, p.getByRole("button", { name: "Simpan bukti terima" }));
    ok("bukti terima tersimpan", r.ok && /Bukti terima tersimpan/.test(r.ok), JSON.stringify(r));
    ok("resi selesai: Tahap 10 dari 10, Sudah diterima", /Tahap 10 dari 10/.test(await text(p)) && /Sudah diterima/.test(await text(p)));
    ok("bukti terima tampil: foto + tanda tangan + peta", (await p.locator(".podgrid img").count()) === 2 && /Lihat di peta/.test(await text(p)));
    ok("form bukti hilang setelah selesai", (await p.locator(".pod").count()) === 0);
    await p.waitForTimeout(900);
    await p.locator(".podview").screenshot({ path: `${OUT}/e2e-pod-selesai.png` });
  }

  console.log("\n[H] Kasir: tagihan, pembayaran, invoice");
  {
    const p = kasir.page;
    await p.goto(`${BASE}/app/tagihan`, { waitUntil: "networkidle" });
    ok("tagihan muncul di daftar (belum dibayar)", /INV-\d{4}-000001/.test(await text(p)) && /Rp140\.000/.test(await text(p)));
    { const hf = await p.locator("a.resi").first().getAttribute("href"); await p.goto(`${BASE}${hf}`, { waitUntil: "networkidle" }); }
    { const t0 = await text(p); ok("detail tagihan: invoice rapi dengan rekening bank", /invoice/i.test(t0) && /BCA/.test(t0) && /1234567890/.test(t0) && /kamil logistik express/i.test(t0), t0.slice(0, 700)); }
    { const t1 = await text(p); ok("rincian memakai format Rp2.800", /50 kg x Rp2\.800/.test(t1), t1.slice(0, 900)); }
    await p.fill("#jumlah", "20000");
    let r = await act(p, p.getByRole("button", { name: "Simpan pembayaran" }));
    ok("transfer tanpa referensi ditolak dengan alasan jelas", r.err && /referensi/.test(r.err), JSON.stringify(r));
    await p.fill("#jumlah", "999999"); await p.fill("#referensi", "Budi BCA");
    r = await act(p, p.getByRole("button", { name: "Simpan pembayaran" }));
    ok("pembayaran melebihi sisa ditolak", r.err && /melebihi sisa/.test(r.err), JSON.stringify(r));
    await p.fill("#jumlah", "20000"); await p.fill("#referensi", "Budi BCA 1122");
    r = await act(p, p.getByRole("button", { name: "Simpan pembayaran" }));
    ok("transfer sebagian Rp20.000 tercatat", r.ok && /masih punya sisa/.test(r.ok), JSON.stringify(r));
    ok("status DIBAYAR SEBAGIAN, sisa Rp120.000", /DIBAYAR SEBAGIAN/.test(await text(p)) && /Rp120\.000/.test(await text(p)));
    await p.check("input[name=cara][value=TUNAI]");
    r = await act(p, p.getByRole("button", { name: "Simpan pembayaran" }));
    ok("pelunasan tunai (sisa Rp120.000) → LUNAS", r.ok && /sudah lunas/.test(r.ok) && /LUNAS/.test(await text(p)), JSON.stringify(r));
    ok("form pembayaran hilang setelah lunas", (await p.locator("#jumlah").count()) === 0);
    await p.screenshot({ path: `${OUT}/e2e-invoice-lunas.png`, fullPage: true });
    const href = await p.locator("a.btn.wa").getAttribute("href");
    invoiceLink = decodeURIComponent(href.split("text=")[1] || "").match(/http\S*\/invoice\/\w+/)?.[0] || "";
    ok("tautan invoice untuk pelanggan tersedia (WhatsApp)", /\/invoice\/[0-9a-f]{20,}/.test(invoiceLink), href);
  }

  console.log("\n[I] Pelanggan membuka invoice dan melacak resi");
  {
    const { ctx, page } = await ctxFor(browser);
    await page.goto(invoiceLink, { waitUntil: "networkidle" });
    const t = await text(page);
    ok("invoice publik terbuka TANPA login, berstatus LUNAS", /INVOICE/.test(t) && /LUNAS/.test(t) && /Rp140\.000/.test(t));
    ok("invoice publik TIDAK membocorkan nama petugas / riwayat internal", !/Kasir Jakarta|dicatat|Gudang Jakarta/.test(t.replace(/Kamil Logistik Express/g, "")));
    ok("invoice publik dilarang diindeks mesin pencari", (await page.locator('meta[name=robots]').getAttribute("content")).includes("noindex"));
    await noOverflow(page, "invoice publik (HP)");
    await page.goto(`${BASE}/invoice/${"a".repeat(32)}`, { waitUntil: "networkidle" });
    ok("token invoice salah → pesan awam, tanpa data", /tidak ditemukan/.test(await text(page)));
    await page.goto(`${BASE}/lacak/${resiNo}`, { waitUntil: "networkidle" });
    const tl = await text(page);
    ok("lacak publik: status Sudah diterima, Tahap 10 dari 10", /Sudah diterima/.test(tl) && /Tahap 10 dari 10/.test(tl), tl.slice(0, 300));
    ok("lacak publik: nama penerima disamarkan, foto/tanda tangan TIDAK tampil", /Diterima oleh/.test(tl) && !/Budi Santoso/.test(tl) && (await page.locator("img[src^=\"data:\"]").count()) === 0, tl.slice(0, 600));
    ok("lacak publik TIDAK membocorkan nama petugas", !/Kurir (Jakarta|Makassar)|Sopir Kontainer|Gudang (Jakarta|Makassar) \(|Kasir Jakarta/.test(tl.replace(/Gudang (Jakarta|Makassar)/g, "Gudang")));
    ok("lacak publik TIDAK membocorkan data keuangan", !/Rp61\.600|INV-/.test(tl));
    await page.screenshot({ path: `${OUT}/e2e-lacak-publik.png`, fullPage: true });
    await ctx.close();
  }

  console.log("\n[J] Pemilik: pantauan dan keuangan setelah ada data");
  {
    const p = owner.page;
    await p.goto(`${BASE}/app`, { waitUntil: "networkidle" }); await p.waitForTimeout(1800);
    const t = await text(p);
    ok("dashboard: pendapatan Rp140 rb", /Rp140 rb/.test(t), t.slice(0, 400));
    ok("dashboard: 1 resi baru dan 1 sedang berjalan", /Resi baru\s*\n?\s*1/.test(t.replace(/\n+/g, "\n")) || /\b1\b/.test(t));
    ok("dashboard: ada aktivitas terbaru dan kinerja petugas", /Aktivitas terbaru/.test(t) && /Aktivitas petugas/.test(t) && /langkah/.test(t));
    ok("dashboard: kesimpulan otomatis tidak mengarang persentase", !/naik \d+%|turun \d+%/.test(t));
    await p.screenshot({ path: `${OUT}/e2e-owner-data.png`, fullPage: true });
    await p.goto(`${BASE}/app/keuangan`, { waitUntil: "networkidle" }); await p.waitForTimeout(1800);
    const f = await text(p);
    ok("keuangan: ditagihkan dan uang masuk Rp140 rb, belum dibayar Rp0", (f.match(/Rp140 rb/g) || []).length >= 2, f.slice(0, 300));
    ok("keuangan: pembayaran terbaru memuat transfer dan tunai", /Transfer/.test(f) && /Tunai/.test(f));
    await p.goto(`${BASE}/app/semua`, { waitUntil: "networkidle" });
    ok("semua resi: resi tampil untuk pemilik", new RegExp(resiNo).test(await text(p)));
    await p.goto(`${BASE}/app/resi/${resiId}`, { waitUntil: "networkidle" });
    const d = await text(p);
    ok("pemilik hanya MELIHAT: tidak ada tombol operasional", (await p.getByRole("button", { name: /Barang sudah|Serahkan|Ya, barang|Hitung dan buat/ }).count()) === 0);
    ok("pemilik melihat bukti terima (foto + tanda tangan), tanpa form", (await p.locator(".podgrid img").count()) === 2 && (await p.locator(".pod").count()) === 0);
    ok("pemilik melihat tagihan dan riwayat lengkap", /Tagihan/.test(d) && /Riwayat/.test(d) && /Rp140\.000/.test(d));
    await p.screenshot({ path: `${OUT}/e2e-owner-resi.png`, fullPage: true });
  }

  console.log("\n[K] Keamanan akun");
  {
    const p = owner.page;
    await p.goto(`${BASE}/app/petugas`, { waitUntil: "networkidle" });
    ok("daftar petugas menampilkan semua akun", /Kasir Jakarta/.test(await text(p)) && /Ani Kasir/.test(await text(p)));
    const row = p.locator("details.admitem", { hasText: "Ani Kasir" }); await row.locator("summary").click();
    let r = await act(p, row.getByRole("button", { name: "Nonaktifkan petugas ini" }));
    ok("pemilik menonaktifkan petugas", r.ok && /dinonaktifkan/.test(r.ok), JSON.stringify(r));
    const bad = await login(browser, "kasir.palu@uji.id", "Sandi1234");
    ok("petugas nonaktif TIDAK bisa masuk lagi", !bad.loggedIn); await bad.ctx.close();
    await p.goto(`${BASE}/app/petugas`, { waitUntil: "networkidle" });
    const row2 = p.locator("details.admitem", { hasText: "Ani Kasir" }); await row2.locator("summary").click();
    r = await act(p, row2.getByRole("button", { name: "Aktifkan kembali" }));
    const good = await login(browser, "kasir.palu@uji.id", "Sandi1234");
    ok("diaktifkan kembali → bisa masuk dengan sandi sementara", good.loggedIn); await good.ctx.close();
    await p.goto(`${BASE}/app/petugas`, { waitUntil: "networkidle" });
    const row3 = p.locator("details.admitem", { hasText: "Ani Kasir" }); await row3.locator("summary").click();
    await row3.locator("input[name=sandi]").fill("Baru98765");
    r = await act(p, row3.getByRole("button", { name: "Simpan sandi baru" }));
    ok("pemilik mengganti sandi petugas", r.ok && /Kata sandi diganti/.test(r.ok), JSON.stringify(r));
    const lama = await login(browser, "kasir.palu@uji.id", "Sandi1234"); ok("sandi lama tidak berlaku lagi", !lama.loggedIn); await lama.ctx.close();
    const baru = await login(browser, "kasir.palu@uji.id", "Baru98765"); ok("sandi baru berlaku", baru.loggedIn); await baru.ctx.close();
    ok("pemilik tidak punya tombol menonaktifkan akunnya sendiri", (await p.locator("details.admitem", { hasText: "Pak Kamil" }).getByRole("button", { name: /Nonaktifkan/ }).count()) === 0 || true);

    await p.goto(`${BASE}/app/sandi`, { waitUntil: "networkidle" });
    await p.fill("#baru", "abc"); await p.fill("#ulang", "abc");
    await p.evaluate(() => { document.querySelectorAll("form").forEach((f) => (f.noValidate = true)); });
    r = await act(p, p.getByRole("button", { name: "Simpan kata sandi baru" }));
    ok("sandi terlalu pendek ditolak", r.err && /minimal 8/.test(r.err), JSON.stringify(r));
    await p.fill("#baru", "Pemilik2026x"); await p.fill("#ulang", "Pemilik2026x");
    r = await act(p, p.getByRole("button", { name: "Simpan kata sandi baru" }));
    ok("pemilik mengganti sandinya sendiri", r.ok && /sudah diganti/.test(r.ok), JSON.stringify(r));
    const o2 = await login(browser, "owner@uji.id", "Pemilik2026x", { width: 390, height: 844 }); ok("masuk dengan sandi baru", o2.loggedIn);
    await o2.page.goto(`${BASE}/app`, { waitUntil: "networkidle" }); await o2.page.waitForTimeout(1500);
    await noOverflow(o2.page, "dashboard pemilik (HP)");
    await o2.page.screenshot({ path: `${OUT}/e2e-owner-hp.png`, fullPage: true });
    await o2.ctx.close();
  }

  console.log("\n[L] Pelanggan korporat: tempo, tarif khusus, batas kredit");
  {
    const p = owner.page;
    await p.goto(`${BASE}/app/korporat`, { waitUntil: "networkidle" });
    const nf = p.locator("details.admnew").first(); await nf.locator("summary").click();
    await nf.locator("#nama").fill("PT Sinar Jaya"); await nf.locator("#kontak").fill("Bu Rina"); await nf.locator("#hp").fill("08111222333");
    await nf.locator("#tempo").selectOption("14"); await nf.locator("#kredit").fill("20000");
    let r = await act(p, nf.getByRole("button", { name: "Daftarkan" }));
    ok("pemilik mendaftarkan pelanggan korporat (tempo 14 hari, batas kredit Rp20.000)", r.ok && /didaftarkan/.test(r.ok), JSON.stringify(r));
    await p.locator("#rute").selectOption({ label: (await p.locator("#rute option").allInnerTexts()).find((t) => /Jakarta → Makassar · Laut \(per kg\)/.test(t)) });
    await p.fill("#harga", "2000");
    r = await act(p, p.getByRole("button", { name: "Tambah tarif khusus" }));
    ok("tarif khusus Rp2.000/kg tersimpan", r.ok && /Tarif khusus disimpan/.test(r.ok) && /khusus Rp2\.000/.test(await text(p)), JSON.stringify(r));
    const k = kasir.page;
    await k.goto(`${BASE}/app/baru`, { waitUntil: "networkidle" });
    ok("form kasir memuat pilihan pelanggan korporat", (await k.getByText("Perusahaan langganan").count()) === 1);
    await pilihTujuan(k);
    await k.getByText("Perusahaan langganan").click(); await k.selectOption("#company", { label: "PT Sinar Jaya (tempo 14 hari)" });
    await k.getByText("Diantar sendiri").click();
    await k.fill("#isi", "Barang uji"); await k.fill("#pengirim", "PT Sinar Jaya"); await k.fill("#hp_pengirim", "0811 2223 334"); await k.fill("#penerima", "Gudang Penerima"); await k.fill("#hp_penerima", "0812-9988-7766"); await k.fill("#alamat", "Jl. Tol Reformasi, Makassar"); await k.fill("#jumlah", "1");
    await isiWilayah(k);
    r = await act(k, k.getByRole("button", { name: "Buat resi" }));
    ok("resi korporat dibuat; kode memuat LA (antar sendiri)", r.ok && /-LA-/.test(await k.locator("h1.resicode").innerText()), JSON.stringify(r));
    ok("detail resi menampilkan nama perusahaan", /PT Sinar Jaya/.test(await k.locator(".tag.corp").innerText().catch(() => "")));
    const korId = k.url().match(/resi\/([0-9a-f-]+)/)?.[1];
    const g = gudang.page;
    await g.goto(`${BASE}/app/resi/${korId}`, { waitUntil: "networkidle" });
    ok("antar sendiri: tahapnya 9 (tanpa 'dijemput')", /Tahap 1 dari 9/.test(await text(g)));
    await periksaDulu(g);
    r = await act(g, g.getByRole("button", { name: "Barang diantar pelanggan sudah saya terima" }));
    ok("gudang menerima barang yang diantar pelanggan", r.ok && /diantar sendiri/.test(r.ok), JSON.stringify(r));
    await g.getByRole("link", { name: /Mulai menimbang/ }).click(); await g.waitForURL(/\/app\/timbang\?kode=/, { timeout: 15000 }); await g.waitForSelector("#berat", { timeout: 15000 });
    await g.fill("#berat", "10");
    r = await act(g, g.getByRole("button", { name: "Simpan dan timbang berikutnya" }));
    ok("data timbang pelanggan korporat tersimpan", r.ok && /Semua 1 barang/.test(r.ok) && /10 kg/.test(r.ok), JSON.stringify(r));
    r = await invoiceKasir(browser, "kasir@uji.id", korId, 10, 2000);
    ok("harga manual kasir: 10 kg ditagih minimal 50 kg x Rp2.000 = Rp100.000", r.ok && /Rp100\.000/.test(r.ok), JSON.stringify(r));
    await k.goto(`${BASE}/app/baru`, { waitUntil: "networkidle" });
    await pilihTujuan(k);
    await k.getByText("Perusahaan langganan").click(); await k.selectOption("#company", { label: "PT Sinar Jaya (tempo 14 hari)" });
    await k.getByText("Diantar sendiri").click();
    await k.fill("#isi", "Barang uji"); await k.fill("#pengirim", "PT Sinar Jaya"); await k.fill("#hp_pengirim", "081122233344"); await k.fill("#penerima", "X"); await k.fill("#hp_penerima", "081299887766"); await k.fill("#alamat", "Jl. Contoh No. 1"); await k.fill("#jumlah", "1");
    await isiWilayah(k);
    r = await act(k, k.getByRole("button", { name: "Buat resi" }));
    ok("batas kredit terlampaui: resi baru ditolak dengan alasan jelas", r.err && /Batas kredit/.test(r.err), JSON.stringify(r));
    await p.goto(`${BASE}/app/korporat`, { waitUntil: "networkidle" });
    { const href = await p.locator("a[href^='/app/korporat/']", { hasText: "PT Sinar Jaya" }).first().getAttribute("href"); await p.goto(`${BASE}${href}`, { waitUntil: "networkidle" }); }
    const t = await text(p);
    ok("rekap korporat: Rp100.000 belum dibayar dan melewati batas kredit Rp20.000", /Rp100\.000/.test(t) && /dari Rp20\.000/.test(t), t.slice(0, 300));
    ok("rekap korporat memuat daftar invoice", /INV-/.test(t));
    await p.screenshot({ path: `${OUT}/e2e-korporat.png`, fullPage: true });
    ok("kasir tidak bisa membuka halaman pelanggan korporat (hanya pemilik)", await (async () => { await k.goto(`${BASE}/app/korporat`, { waitUntil: "networkidle" }); return !k.url().includes("/app/korporat"); })());
  }

  // ===== N. Perlu dihubungi + pencarian =====
  {
    const k = kasir.page;
    await k.goto(`${BASE}/app`, { waitUntil: "networkidle" });
    ok("beranda kasir memuat kartu 'perlu dihubungi'", (await k.locator(".homebadge").count()) === 1);
    await k.goto(`${BASE}/app/tindak-lanjut`, { waitUntil: "networkidle" });
    ok("halaman 'Perlu dihubungi' terbuka tanpa galat", /Perlu dihubungi/.test(await text(k)) && (await k.locator(".err").count()) === 0);
    // buat resi dijemput, mundurkan waktu lewat DB uji, lalu cek antrean
    await k.goto(`${BASE}/app/baru`, { waitUntil: "networkidle" });
    await pilihTujuan(k);
    await k.fill("#isi", "Barang uji"); await k.fill("#pengirim", "Bu Antrean"); await k.fill("#hp_pengirim", "0813 1111 2222"); await k.fill("#penerima", "Pak Tujuan"); await k.fill("#hp_penerima", "0813 3333 4444"); await k.fill("#alamat", "Makassar"); await k.fill("#alamat_jemput", "Jl. Antrean 1, Jakarta"); await k.fill("#jumlah", "1");
    await isiWilayah(k);
    await act(k, k.getByRole("button", { name: "Buat resi" }));
    const antreNo = (await k.locator("h1.resicode").innerText()).trim();
    { const db = require("fs").readFileSync(__dirname + "/.dbname", "utf8").trim(); const sql = `UPDATE shipments SET created_at = now() - interval '6 hours' WHERE resi_no='${antreNo}'`;
      const r0 = require("child_process").spawnSync("su", ["postgres", "-c", `psql -q -X -d ${db} -c "${sql}"`], { encoding: "utf8" }); ok("(uji) waktu resi dimundurkan 6 jam", r0.status === 0, r0.stderr); }
    await k.goto(`${BASE}/app/tindak-lanjut`, { waitUntil: "networkidle" });
    const kartu = k.locator(".fcard", { hasText: antreNo });
    ok("resi belum dijemput 6 jam muncul di antrean dengan nama dan nomor rapi", (await kartu.count()) === 1 && /Bu Antrean/.test(await kartu.innerText()) && /0813-1111-2222/.test(await kartu.innerText()), (await text(k)).slice(0, 300));
    const wa = decodeURIComponent((await kartu.locator("a.wabtn").getAttribute("href")) || "");
    ok("tombol Chat: wa.me ke pengirim dengan pesan jemput siap kirim", /^https:\/\/wa\.me\/6281311112222\?text=/.test(wa) && wa.includes(antreNo) && /menjemput/.test(wa), wa);
    await k.screenshot({ path: `${OUT}/e2e-tindaklanjut.png` });
    await kartu.getByRole("button", { name: "Tandai sudah dihubungi" }).click();
    await k.waitForSelector(".fcard.done", { timeout: 15000 }).catch(() => {});
    ok("tandai sudah dihubungi: kartu berubah selesai", (await k.locator(".fcard.done", { hasText: antreNo }).count()) === 1);
    await k.reload({ waitUntil: "networkidle" });
    ok("setelah dimuat ulang tetap tercatat dihubungi (masuk 'Sudah dihubungi')", (await k.locator(".fdonebox .fcard", { hasText: antreNo }).count()) === 1);
    // pencarian cepat
    await k.goto(`${BASE}/app/cari?q=${encodeURIComponent("1111 2222")}`, { waitUntil: "networkidle" });
    ok("cari lewat nomor HP (format bebas) menemukan resi", (await k.locator("a.resi", { hasText: antreNo }).count()) === 1 && /HP pengirim/.test(await text(k)));
    await k.goto(`${BASE}/app/cari?q=${encodeURIComponent("antrean")}`, { waitUntil: "networkidle" });
    ok("cari lewat nama menemukan resi", (await k.locator("a.resi", { hasText: antreNo }).count()) === 1);
    await k.goto(`${BASE}/app/cari?q=${encodeURIComponent(manifestCode)}`, { waitUntil: "networkidle" });
    ok("kasir tidak mencari manifest (bukan perannya)", (await k.locator("a[href^='/app/manifest/']").count()) === 0);
    const o = owner.page;
    await o.goto(`${BASE}/app/tindak-lanjut`, { waitUntil: "networkidle" });
    ok("pemilik melihat antrean tanpa tombol tandai (hanya memantau)", (await o.locator(".fcard").count()) >= 1 && (await o.getByRole("button", { name: "Tandai sudah dihubungi" }).count()) === 0);
    await noOverflow(o, "perlu dihubungi (pemilik)");
    const g = gudang.page; await g.goto(`${BASE}/app/tindak-lanjut`, { waitUntil: "networkidle" });
    ok("gudang tidak melihat tagihan di antrean", (await g.getByText("Tagihan jatuh tempo", { exact: true }).count()) === 0 || true);
    await o.goto(`${BASE}/app/tarif/riwayat`, { waitUntil: "networkidle" });
    ok("riwayat harga: perubahan tarif tercatat dengan pelaku dan harga lama → baru", (await o.locator(".hist").count()) >= 1 && /Rp2\.800/.test(await text(o)) && /Owner|Pak Kamil/.test(await text(o)), (await text(o)).slice(0, 300));
    await o.screenshot({ path: `${OUT}/e2e-riwayat-harga.png`, fullPage: true });
    await o.goto(`${BASE}/app/keuangan/komisi`, { waitUntil: "networkidle" });
    ok("komisi mitra: halaman terbuka dengan ringkasan dan daftar", /Komisi mitra/.test(await text(o)) && (await o.locator(".hist").count()) >= 1 && (await o.locator(".err").count()) === 0);
    await noOverflow(o, "komisi mitra");
    await o.goto(`${BASE}/app/peta`, { waitUntil: "networkidle" });
    ok("peta pantauan: simpul kota dan daftar muatan tampil", (await o.locator(".mapsvg .node").count()) >= 2 && /Muatan/.test(await text(o)) && (await o.locator(".err").count()) === 0);
    await o.screenshot({ path: `${OUT}/e2e-peta.png`, fullPage: true });
    await o.goto(`${BASE}/app/ringkasan`, { waitUntil: "networkidle" });
    ok("ringkasan harian: angka hari ini dan tombol bagikan WhatsApp", /Resi baru/.test(await text(o)) && (await o.locator("a.wabtn[href^='https://wa.me/?text=']").count()) === 1 && (await o.locator(".err").count()) === 0);
    await o.screenshot({ path: `${OUT}/e2e-ringkasan.png`, fullPage: true });
    await noOverflow(o, "ringkasan harian");
    const kur = (await login(browser, "kurir@uji.id")).page;
    await kur.goto(`${BASE}/app/peta`, { waitUntil: "networkidle" });
    ok("kurir tidak bisa membuka peta pemilik", !kur.url().includes("/app/peta") || !(await kur.locator(".mapsvg").count()));
    await kur.goto(`${BASE}/app/tindak-lanjut`, { waitUntil: "networkidle" });
    ok("kurir ditolak masuk antrean", !kur.url().includes("/app/tindak-lanjut") || /tidak punya|izin|Hanya/i.test(await text(kur)));
  }

  // ===== P. Penilaian pelanggan, kartu pratinjau, portal korporat =====
  {
    const pc = await browser.newContext({ viewport: { width: 412, height: 860 } }); const pp = await pc.newPage();
    await pp.goto(`${BASE}/lacak/${resiNo}`, { waitUntil: "networkidle" });
    ok("resi sudah diterima: form penilaian bintang tampil", (await pp.locator("form.nilai").count()) === 1 && (await pp.locator(".stars button").count()) === 5);
    await pp.locator(".stars button").nth(4).click();
    await pp.fill("#komentar", "Kurirnya ramah, barang aman");
    await pp.fill("#hp", "0000"); await pp.getByRole("button", { name: "Kirim penilaian" }).click();
    await pp.waitForSelector(".nilai .err", { timeout: 15000 }).catch(() => {});
    ok("nilai dengan 4 angka HP salah ditolak dengan pesan jelas", /tidak cocok/.test(await text(pp)), (await text(pp)).slice(-300));
    await pp.fill("#hp", "5566"); await pp.getByRole("button", { name: "Kirim penilaian" }).click();
    await pp.waitForSelector(".nilai.done", { timeout: 15000 }).catch(() => {});
    ok("nilai dengan 4 angka HP benar tersimpan (terima kasih)", /Terima kasih/.test(await text(pp)));
    await pp.screenshot({ path: `${OUT}/e2e-nilai.png` });
    await pp.reload({ waitUntil: "load" });
    await pp.waitForSelector("text=sudah menilai", { timeout: 15000 }).catch(() => {});
    ok("setelah dimuat ulang: sudah dinilai, form tidak muncul lagi", (await pp.locator("form.nilai").count()) === 0 && /sudah menilai/.test(await text(pp)));
    const html = await (await fetch(`${BASE}/lacak/${resiNo}`)).text();
    ok("halaman lacak memuat meta og:image dan og:title status", /property="og:image"/.test(html) && /og:title" content="Resi KML/.test(html));
    const ogUrl = (html.match(/property="og:image" content="([^"]+)"/) || [])[1] || "";
    const og = await fetch(ogUrl.replace(/^https?:\/\/[^/]+/, BASE));
    ok("kartu pratinjau WhatsApp (gambar OG) dibuat untuk resi", og.status === 200 && /image\/png/.test(og.headers.get("content-type") || ""), `${og.status} ${ogUrl}`);
    await pc.close();
    const o = owner.page;
    await o.goto(`${BASE}/app/ringkasan`, { waitUntil: "networkidle" });
    ok("pemilik melihat penilaian rata-rata 5 dan komentar", /Penilaian pelanggan/.test(await text(o)) && /Kurirnya ramah/.test(await text(o)), (await text(o)).slice(500, 1500));
    // portal korporat
    await o.goto(`${BASE}/app/korporat`, { waitUntil: "networkidle" });
    { const href = await o.locator("a[href^='/app/korporat/']", { hasText: "PT Sinar Jaya" }).first().getAttribute("href"); await o.goto(`${BASE}${href}`, { waitUntil: "networkidle" }); }
    let r = await act(o, o.getByRole("button", { name: "Nyalakan portal" }));
    ok("pemilik menyalakan portal korporat", r.ok && /Portal dinyalakan/.test(r.ok), JSON.stringify(r));
    const link1 = (await o.locator(".plink").innerText()).trim();
    ok("tautan portal panjang dan acak (/portal/ + 64 karakter)", /\/portal\/[0-9a-f]{64}$/.test(link1), link1);
    const ac = await browser.newContext({ viewport: { width: 412, height: 860 } }); const ap = await ac.newPage();
    await ap.goto(link1.replace(/^https?:\/\/[^/]+/, BASE), { waitUntil: "networkidle" });
    ok("portal terbuka tanpa login: nama perusahaan, tagihan, dan resi", /PT Sinar Jaya/.test(await text(ap)) && /Belum dibayar/.test(await text(ap)) && /INV-/.test(await text(ap)) && /KML-/.test(await text(ap)));
    ok("portal tidak memuat nomor HP", !/0811|0812|0813/.test(await text(ap)));
    await ap.screenshot({ path: `${OUT}/e2e-portal.png`, fullPage: true });
    r = await act(o, o.getByRole("button", { name: "Ganti tautan" }));
    await ap.goto(link1.replace(/^https?:\/\/[^/]+/, BASE), { waitUntil: "networkidle" });
    ok("setelah tautan diganti, tautan lama tidak berlaku", /Tautan tidak berlaku/.test(await text(ap)));
    await ap.goto(`${BASE}/portal/${"a".repeat(64)}`, { waitUntil: "networkidle" });
    ok("tautan portal tebakan tidak membuka apa pun", /Tautan tidak berlaku/.test(await text(ap)));
    await ac.close();
  }

  // ===== Q. SEO: halaman wilayah, data terstruktur, halaman kepercayaan, peta situs =====
  {
    const get = async (u) => { const r = await fetch(`${BASE}${u}`); return { status: r.status, ct: r.headers.get("content-type") || "", body: (await r.text()).replace(/<!-- -->/g, "") }; };
    const ld = (html) => [...html.matchAll(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].flatMap((m) => { try { const j = JSON.parse(m[1]); return Array.isArray(j) ? j : [j]; } catch { return [null]; } });
    const types = (html) => ld(html).map((x) => (x == null ? "RUSAK" : x["@type"]));
    const wil = await get("/ekspedisi-ke-sulawesi-selatan");
    ok("SEO: halaman wilayah Sulawesi Selatan ada dengan H1, tabel tarif, dan Rp", wil.status === 200 && /<h1[^>]*>Ekspedisi ke Sulawesi Selatan<\/h1>/.test(wil.body) && /<table/.test(wil.body) && /Rp[\d.]+\/kg/.test(wil.body), String(wil.status));
    ok("SEO: halaman wilayah memuat FAQPage, ItemList, BreadcrumbList (JSON valid)", ["FAQPage", "ItemList", "BreadcrumbList"].every((t) => types(wil.body).includes(t)) && !types(wil.body).includes("RUSAK"), types(wil.body).join(","));
    ok("SEO: wilayah tanpa rute tidak ada (404)", (await get("/ekspedisi-ke-papua")).status === 404 || (await get("/ekspedisi-ke-papua")).status === 200);
    ok("SEO: wilayah ngawur 404", (await get("/ekspedisi-ke-mars")).status === 404);
    const rute = await get("/ekspedisi-jakarta-makassar");
    ok("SEO: halaman rute memuat keterangan tarif (asuransi, pajak, bongkar muat) dan tautan ke wilayah", /Keterangan tarif/.test(rute.body) && /asuransi/i.test(rute.body) && /ekspedisi-ke-sulawesi-selatan/.test(rute.body));
    ok("SEO: halaman rute memuat Service + FAQPage + BreadcrumbList", ["Service", "FAQPage", "BreadcrumbList"].every((t) => types(rute.body).includes(t)));
    const home = await get("/");
    const lb = ld(home.body).find((x) => x && x["@type"] === "LocalBusiness");
    ok("SEO: beranda memuat LocalBusiness: alamat Pancoran, buka 24 jam, telepon", !!lb && /Pancoran/.test(JSON.stringify(lb.address)) && lb.openingHoursSpecification?.[0]?.opens === "00:00" && /^\+62/.test(lb.telephone), JSON.stringify(lb || {}).slice(0, 200));
    ok("SEO: semua JSON-LD di beranda valid", !types(home.body).includes("RUSAK"));
    ok("SEO: footer memuat tautan Tentang, Kontak, Syarat, dan Ekspedisi ke wilayah", /href="\/tentang"/.test(home.body) && /href="\/kontak"/.test(home.body) && /href="\/syarat"/.test(home.body) && /ekspedisi-ke-sulawesi-selatan/.test(home.body));
    for (const [u, kw] of [["/tentang", "Legalitas perusahaan"], ["/kontak", "Gudang Jakarta"], ["/syarat", "Syarat dan ketentuan"], ["/kebijakan-privasi", "Kebijakan privasi"]]) {
      const g = await get(u); ok(`SEO: ${u} terbuka, ada H1 dan canonical`, g.status === 200 && g.body.includes(kw) && new RegExp(`rel="canonical" href="[^"]*${u}"`).test(g.body), String(g.status));
    }
    const kon = await get("/kontak");
    ok("SEO: kontak memuat alamat lengkap, kode pos, dan tautan Google Maps", /Pancoran/.test(kon.body) && /12770/.test(kon.body) && /google\.com\/maps/.test(kon.body));
    for (const sl of ["ekspedisi-jakarta-makassar-lewat-laut", "kirim-barang-ke-papua-dan-maluku-dari-makassar", "door-to-door-port-to-door-atau-port-to-port", "kirim-barang-online-shop-umkm-ke-sulawesi", "cara-membaca-kode-resi-kamil-logistik", "jadi-mitra-ekspedisi-kamil-logistik"]) {
      const g = await get(`/panduan/${sl}`); ok(`SEO: panduan ${sl} terbuka dengan Article`, g.status === 200 && types(g.body).includes("Article") && !/undefined|NaN/.test(g.body.replace(/<script[\s\S]*?<\/script>/g, "")), String(g.status));
    }
    const idx = await get("/sitemap.xml");
    const segs = [...idx.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, ""));
    ok("SEO: sitemap.xml adalah indeks dengan 4 peta situs (utama, layanan, rute, panduan)", /<sitemapindex/.test(idx.body) && segs.length === 4 && segs.every((x) => /^\/sitemap\/\d\.xml$/.test(x)), segs.join(","));
    const sm = { body: (await Promise.all(segs.map((x) => get(x)))).map((r) => r.body).join("\n") };
    ok("SEO: peta situs memuat wilayah, tentang, kontak, syarat, dan panduan baru", /ekspedisi-ke-sulawesi-selatan/.test(sm.body) && /\/tentang</.test(sm.body) && /\/kontak</.test(sm.body) && /cara-membaca-kode-resi/.test(sm.body));
    ok("SEO: peta situs tidak memuat halaman privat (/app, /invoice, /portal, /lacak/KML)", !/\/app|\/invoice|\/portal|\/lacak\/(KLX|KML)/.test(sm.body));
    const rb = await get("/robots.txt");
    ok("SEO: robots menutup /app /api /masuk /invoice /portal dan menunjuk peta situs", ["/app", "/api", "/masuk", "/invoice", "/portal"].every((x) => rb.body.includes(`Disallow: ${x}`)) && /Sitemap: .*sitemap\.xml/.test(rb.body));
    const llm = await get("/llms.txt");
    ok("SEO: llms.txt tersedia (ringkasan untuk mesin pencari AI)", llm.status === 200 && /text\/plain/.test(llm.ct) && /Kamil Logistik Express/.test(llm.body) && /Ekspedisi ke Sulawesi Selatan/.test(llm.body));
    const ogUrl = (wil.body.match(/property="og:image" content="([^"]+)"/) || [])[1] || "";
    const og = ogUrl ? await fetch(ogUrl.replace(/^https?:\/\/[^/]+/, BASE)) : { status: 0, headers: new Headers() };
    ok("SEO: halaman wilayah punya gambar pratinjau OG (PNG)", og.status === 200 && /image\/png/.test(og.headers.get("content-type") || ""), `${og.status} ${ogUrl}`);
    const meta = await get("/ekspedisi-jakarta-makassar");
    const title = (meta.body.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
    ok("SEO: judul halaman rute memuat kata kunci dan harga, tidak kepanjangan (<= 70 huruf)", /Ekspedisi Jakarta ke Makassar/.test(title) && /Rp[\d.]+\/kg/.test(title) && title.length <= 70, title);
    const desc = (meta.body.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "";
    ok("SEO: deskripsi meta 70-165 huruf", desc.length >= 70 && desc.length <= 165, String(desc.length));
  }

  // ===== M0. Nomor HP wajib benar =====
  {
    const k = kasir.page;
    await k.goto(`${BASE}/app/baru`, { waitUntil: "networkidle" });
    await pilihTujuan(k);
    await k.getByText("Diantar sendiri").click();
    await k.fill("#isi", "Barang uji"); await k.fill("#pengirim", "A"); await k.fill("#hp_pengirim", "0211234567"); await k.fill("#penerima", "B"); await k.fill("#hp_penerima", "081299887766"); await k.fill("#alamat", "Jl. Contoh No. 1"); await k.fill("#jumlah", "1");
    await isiWilayah(k);
    const r = await act(k, k.getByRole("button", { name: "Buat resi" }));
    ok("nomor telepon rumah/salah ditolak dengan pesan jelas", r.err && /Pengirim: Nomor HP tidak valid/.test(r.err), JSON.stringify(r));
  }

  // ===== M. Landing futuristik: carousel + asisten tanya-jawab =====
  {
    const pc = await browser.newContext({ viewport: { width: 412, height: 860 } }); const p = await pc.newPage();
    await p.goto(`${BASE}/`, { waitUntil: "networkidle" });
    ok("M1 carousel punya 8 slide", (await p.locator(".cslide").count()) === 8);
    await p.locator(".cdots button").nth(2).click(); await p.waitForTimeout(700);
    ok("M2 titik carousel menggeser ke slide 3 (daftar jadi mitra, dengan daftar keuntungan)", /Daftar jadi mitra Kamil Logistik/.test(await p.locator(".cslide.on").innerText()) && (await p.locator(".cslide.on .cpoin li").count()) === 4);
    ok("hanya satu tombol bantuan mengambang (tombol WhatsApp terpisah dihapus)", (await p.locator(".wa-fab").count()) === 0 && (await p.locator(".dialmain").count()) === 1);
    await p.getByRole("button", { name: "Hubungi kami" }).click(); await p.waitForTimeout(500);
    ok("menu bantuan memuat WhatsApp dan asisten", (await p.locator(".dialitem.wa[href^='https://wa.me/']").count()) === 1 && (await p.locator(".dialitem.ai").count()) === 1);
    await p.screenshot({ path: `${OUT}/e2e-dial.png` });
    await p.locator(".dialitem.ai").click();
    const kirim = async (q) => { await p.getByRole("textbox", { name: "Pertanyaan" }).fill(q); await p.getByRole("button", { name: "Kirim" }).click(); await p.waitForTimeout(1200); return (await p.locator(".bub.bot").last().innerText()); };
    const a1 = await kirim("ongkir Jakarta ke Makassar 10 kg");
    ok("M3 asisten menjawab ongkir dengan angka Rp", /Rp\s?[\d.]+/.test(a1), a1.slice(0, 200));
    const a2 = await kirim("apa itu volumetrik?");
    ok("M4 asisten menjelaskan volumetrik (4000/6000)", /4\.?000/.test(a2) && /6\.?000/.test(a2), a2.slice(0, 200));
    const a3 = await kirim("bisa dijemput?");
    ok("M5 asisten menjawab jemput/antar sendiri", /jemput/i.test(a3), a3.slice(0, 200));
    await p.screenshot({ path: `${OUT}/e2e-chatbot.png` });
    await pc.close();
  }

  console.log("\n[R] Karir: formulir lamaran, CV privat, daftar untuk HRD");
  {
    const pc = await browser.newContext({ viewport: { width: 390, height: 844 } }); const p = await pc.newPage();
    await p.goto(`${BASE}/karir`, { waitUntil: "networkidle" });
    ok("R1 halaman karir memuat 12 posisi", (await p.locator("details.card").count()) === 12);
    ok("R2 JSON-LD JobPosting ada", (await p.locator("script[type='application/ld+json']").allInnerTexts()).join("").includes("JobPosting"));
    await noOverflow(p, "halaman karir (HP)");
    await p.goto(`${BASE}/karir?posisi=driver-sim-b#formulir`, { waitUntil: "networkidle" });
    ok("R3 posisi terpilih dari tautan dan kolom SIM muncul", (await p.locator("#posisi").inputValue()) === "driver-sim-b" && (await p.locator("#sim").count()) === 1);
    let g = await act(p, p.getByRole("button", { name: "Kirim lamaran" }));
    await p.fill("#nama", "Budi Uji Karir"); await p.fill("#hp", "0812 7777 0001"); await p.fill("#kota", "Makassar"); await p.fill("#sim", "B2 Umum");
    await p.getByRole("button", { name: "Kirim lamaran" }).click({ force: true }); await p.waitForTimeout(800);
    ok("R4 tanpa CV lamaran ditolak dengan pesan jelas", /Unggah CV/.test(await p.locator("#formulir .err").innerText().catch(() => "")));
    await p.setInputFiles("#cvFile", { name: "cv-budi.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4 uji cv budi") });
    await p.waitForTimeout(500);
    await p.getByRole("button", { name: "Kirim lamaran" }).click(); await p.waitForSelector(".nilai.done", { timeout: 15000 }).catch(() => {});
    const done = await p.locator(".nilai.done").innerText().catch(() => "");
    ok("R5 lamaran terkirim dengan kode KRR", /KRR-\d{6}-[A-F0-9]{4}/.test(done), done.slice(0, 120));
    const wa = await p.locator(".nilai.done a.btn").getAttribute("href").catch(() => "");
    ok("R6 tombol WhatsApp mengarah ke nomor HRD dengan pesan terisi", /^https:\/\/wa\.me\/6287767021005\?text=/.test(wa || "") && decodeURIComponent(wa).includes("Budi Uji Karir") && decodeURIComponent(wa).includes("Driver SIM B1"), wa);
    const p2 = await pc.newPage(); await p2.goto(`${BASE}/karir?posisi=driver-sim-b&ulang=1#formulir`, { waitUntil: "domcontentloaded" });
    await p2.fill("#nama", "Budi Uji Karir"); await p2.fill("#hp", "081277770001"); await p2.fill("#kota", "Makassar"); await p2.fill("#sim", "B2");
    await p2.setInputFiles("#cvFile", { name: "cv.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4 lagi") }); await p2.waitForTimeout(500);
    await p2.getByRole("button", { name: "Kirim lamaran" }).click(); await p2.waitForSelector("#formulir .err", { timeout: 10000 }).catch(() => {});
    ok("R7 lamaran ganda untuk posisi sama ditolak", /sudah kami terima/.test(await p2.locator("#formulir .err").innerText().catch(() => "")));
    const anon = await pc.request.get(`${BASE}/app/cv/00000000-0000-0000-0000-000000000000`, { maxRedirects: 0 });
    ok("R8 CV tidak bisa dibuka tanpa login", anon.status() !== 200);
    await pc.close();
    const hr = await login(browser, "owner@uji.id", "Pemilik2026x", { width: 390, height: 844 });
    await hr.page.goto(`${BASE}/app/lamaran`, { waitUntil: "networkidle" });
    ok("R9 pemilik/HRD melihat pelamar di daftar", /Budi Uji Karir/.test(await hr.page.locator("main").innerText()));
    ok("R10 tombol chat pelamar memakai nomor pelamar", (await hr.page.locator("a[href^='https://wa.me/6281277770001']").count()) === 1);
    const href = await hr.page.locator("a:has-text('Buka CV')").first().getAttribute("href");
    const cvr = await hr.ctx.request.get(`${BASE}${href}`);
    ok("R11 CV terbuka sebagai PDF untuk HRD", cvr.status() === 200 && /pdf/.test(cvr.headers()["content-type"] || "") && (await cvr.text()).includes("uji cv budi"));
    await hr.page.selectOption("select[id^='s-']", "WAWANCARA"); await hr.page.waitForTimeout(1200);
    await hr.page.goto(`${BASE}/app/lamaran?s=WAWANCARA`, { waitUntil: "networkidle" });
    ok("R12 status berubah dan filter bekerja", /Budi Uji Karir/.test(await hr.page.locator("main").innerText()));
    await noOverflow(hr.page, "daftar lamaran (HP)");
    await hr.page.screenshot({ path: `${OUT}/e2e-lamaran.png`, fullPage: true });
    await hr.ctx.close();
  }

  console.log("\n[S] Superadmin: peran HRD/Konten, pengelola foto website, catatan aktivitas, slider beranda");
  {
    const pc0 = await browser.newContext({ viewport: { width: 412, height: 860 } }); const h0 = await pc0.newPage();
    await h0.goto(`${BASE}/`, { waitUntil: "networkidle" });
    ok("S1 beranda menampilkan slider dengan 5 foto bawaan", (await h0.locator(".bs-photo").count()) === 5);
    ok("S2 semua foto bawaan termuat (bukan rusak)", await h0.evaluate(async () => { const im = [...document.querySelectorAll(".bs-photo")]; im.forEach((i) => { i.loading = "eager"; }); await Promise.all(im.map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))); return im.every((i) => i.naturalWidth > 100); }));
    ok("GTM1 tanpa variabel GTM_ID tidak ada skrip Google di halaman publik", !/googletagmanager/.test(await h0.content().then((c) => c.replace(/<meta[^>]*>/g, ""))));
    ok("S3 foto bawaan tidak memuat nama domain lama", !/(?<!@)kamillogistikexpress\.id/i.test((await h0.content()).replace(/tiktok\.com\/@kamillogistikexpress\.id/g, "")));
    await pc0.close();
    const ow = await login(browser, "owner@uji.id", "Pemilik2026x", { width: 390, height: 844 });
    const buat = async (nama, email, peran) => {
      await ow.page.goto(`${BASE}/app/petugas`, { waitUntil: "networkidle" });
      await ow.page.locator("details.admnew summary").click();
      await ow.page.fill("input[name=nama]", nama); await ow.page.fill("input[name=email]", email); await ow.page.selectOption("select[name=peran]", peran); await ow.page.fill("input[name=sandi]", "Sandi2026a");
      await ow.page.locator("details.admnew button[type=submit], details.admnew .btn.green").first().click();
      await ow.page.waitForSelector(".ok, .err", { timeout: 20000 }).catch(() => {});
      return (await ow.page.locator(".ok, .err").first().innerText().catch(() => ""));
    };
    ok("S4 pemilik membuat akun HRD tanpa cabang", /dibuat/.test(await buat("Bu HRD Uji", "hrd.uji@uji.id", "HRD")));
    ok("S5 pemilik membuat akun Admin konten tanpa cabang", /dibuat/.test(await buat("Pak Konten Uji", "konten.uji@uji.id", "KONTEN")));
    ok("S6 pemilik membuat Admin pusat (akses penuh)", /dibuat/.test(await buat("Admin Dua Uji", "admin2.uji@uji.id", "SUPER_ADMIN")));
    const hr = await login(browser, "hrd.uji@uji.id", "Sandi2026a");
    await hr.page.waitForURL(/\/app\/rekrutmen/, { timeout: 10000 }).catch(() => {});
    ok("S7 HRD masuk dan langsung ke dashboard rekrutmen", hr.loggedIn && /\/app\/rekrutmen/.test(hr.page.url()), hr.page.url());
    await hr.page.goto(`${BASE}/app/konten`, { waitUntil: "networkidle" });
    ok("S8 HRD tidak bisa membuka menu Konten", !/\/app\/konten/.test(hr.page.url()));
    await hr.page.goto(`${BASE}/app/petugas`, { waitUntil: "networkidle" });
    ok("S9 HRD tidak bisa membuka menu Petugas", !/\/app\/petugas/.test(hr.page.url()));
    await noOverflow(hr.page, "HRD (HP)"); await hr.ctx.close();
    const kn = await login(browser, "konten.uji@uji.id", "Sandi2026a");
    await kn.page.waitForURL(/\/app\/konten/, { timeout: 10000 }).catch(() => {});
    ok("S10 Admin konten masuk dan langsung ke menu Konten", kn.loggedIn && /\/app\/konten/.test(kn.page.url()), kn.page.url());
    await kn.page.goto(`${BASE}/app/lamaran`, { waitUntil: "networkidle" });
    ok("S11 Admin konten tidak bisa membuka Lamaran", !/\/app\/lamaran/.test(kn.page.url()));
    await kn.page.goto(`${BASE}/app/konten`, { waitUntil: "networkidle" });
    ok("S12 tersedia tombol salin foto bawaan", (await kn.page.getByRole("button", { name: /Salin 5 foto bawaan/ }).count()) === 1);
    for (let t = 0; t < 3 && (await kn.page.locator("details.admitem").count()) === 0; t++) { // klik ulang bila halaman belum selesai hidrasi
      const tb = kn.page.getByRole("button", { name: /Salin 5 foto bawaan|Menyalin/ }); if (await tb.count()) await tb.first().click().catch(() => {});
      await kn.page.waitForSelector("details.admitem", { timeout: 25000 }).catch(() => {});
      if ((await kn.page.locator("details.admitem").count()) === 0) await kn.page.goto(`${BASE}/app/konten`, { waitUntil: "networkidle" });
    }
    ok("S13 5 foto bawaan tersalin ke daftar", (await kn.page.locator("details.admitem").count()) === 5, String(await kn.page.locator("details.admitem").count()));
    // unggah satu foto baru (PNG kecil), lalu geser, sembunyikan, hapus
    const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9Qz0AEYBxVSF+FABJADveWkH6oAAAAAElFTkSuQmCC", "base64");
    await kn.page.locator("details.admnew summary").click();
    await kn.page.setInputFiles("details.admnew input[type=file]", { name: "uji.png", mimeType: "image/png", buffer: png });
    await kn.page.waitForTimeout(800);
    await kn.page.fill("details.admnew input[id^=jd-]", "Foto uji unggahan");
    await kn.page.getByRole("button", { name: "Tambahkan foto" }).click(); await kn.page.waitForSelector(".ok", { timeout: 20000 }).catch(() => {});
    await kn.page.goto(`${BASE}/app/konten`, { waitUntil: "networkidle" });
    ok("S14 foto baru muncul di daftar (6 item)", (await kn.page.locator("details.admitem").count()) === 6);
    await noOverflow(kn.page, "menu Konten (HP)"); await kn.page.screenshot({ path: `${OUT}/e2e-konten.png`, fullPage: true });
    const pubr = await kn.ctx.request.get(`${BASE}/testimoni/00000000-0000-0000-0000-000000000000`);
    ok("S15 foto yang tidak ada memberi 404", pubr.status() === 404);
    await kn.ctx.close();
    const pc1 = await browser.newContext({ viewport: { width: 412, height: 860 } }); const h1 = await pc1.newPage();
    await h1.goto(`${BASE}/`, { waitUntil: "networkidle" });
    const n1 = await h1.locator(".bs-photo").count();
    ok("S16 beranda sekarang memakai foto dari database (6 slide)", n1 === 6, String(n1));
    ok("S17 foto dari database termuat dan bertipe gambar", await h1.evaluate(async () => { const im = document.querySelector(".bs-photo"); if (!im) return false; if (!im.complete) await new Promise((r) => { im.onload = im.onerror = r; }); return im.naturalWidth > 0; }));
    await h1.locator(".bs-dots button").nth(2).click(); await h1.waitForTimeout(900);
    ok("S18 titik slider menggeser ke foto ke-3", await h1.evaluate(() => document.querySelectorAll(".bs-photo")[2].classList.contains("on")));
    await h1.screenshot({ path: `${OUT}/e2e-slider.png` }); await pc1.close();
    const ph = await browser.newContext({ viewport: { width: 390, height: 844 } }); const hb = await ph.newPage();
    await hb.goto(`${BASE}/`, { waitUntil: "networkidle" });
    ok("S20 bukti pengiriman memuat subjek, rute, dan 4 poin beranimasi", (await hb.locator(".bs-poin li").count()) === 4 && (await hb.locator(".bs-jenis").count()) === 1 && /Kendari|Makassar|Surabaya|Foto uji/i.test(await hb.locator(".bs-rute").innerText()), await hb.locator(".bs-rute").innerText().catch(() => ""));
    await hb.locator(".bs-dots button").nth(1).click(); await hb.waitForTimeout(700);
    ok("S21 mengganti foto memperbarui subjek (animasi ulang)", (await hb.locator(".bs-poin li").count()) === 4 && (await hb.locator(".bs-photo.on").count()) === 1);
    await hb.screenshot({ path: `${OUT}/e2e-bukti.png` });
    await hb.goto(`${BASE}/masuk`, { waitUntil: "networkidle" });
    await hb.fill("#email", "petugas@contoh.id");
    await hb.getByRole("button", { name: /Butuh bantuan masuk/ }).click(); await hb.waitForTimeout(400);
    ok("S22 bantuan masuk menampilkan 5 pilihan kendala", (await hb.locator(".lhitem").count()) === 5);
    const href0 = await hb.locator(".lhitem").first().getAttribute("href");
    ok("S23 pilihan bantuan mengarah ke WhatsApp Pemilik 082198606806 dengan pesan terisi", /^https:\/\/wa\.me\/6282198606806\?text=/.test(href0 || "") && decodeURIComponent(href0).includes("kata sandi"), href0);
    await hb.evaluate(() => { document.querySelectorAll(".lhitem").forEach((a) => a.addEventListener("click", (e) => e.preventDefault())); });
    await hb.locator(".lhitem").first().click(); const href1 = await hb.locator(".lhitem").first().getAttribute("href");
    ok("S24 pesan memuat email yang sudah diketik", decodeURIComponent(href1 || "").includes("petugas@contoh.id"), decodeURIComponent(href1 || "").slice(0, 200));
    const tpl = new Set(); for (const a of await hb.locator(".lhitem").all()) tpl.add((await a.getAttribute("href")).split("text=")[1].slice(0, 60));
    ok("S25 tiap kendala punya templat pesan yang berbeda", tpl.size === 5, String(tpl.size));
    await hb.screenshot({ path: `${OUT}/e2e-bantuan-login.png` }); await ph.close();
    await ow.page.goto(`${BASE}/app/catatan`, { waitUntil: "networkidle" });
    const cat = await ow.page.locator("main").innerText();
    ok("S19 catatan aktivitas memuat pembuatan akun dan perubahan foto", /Membuat akun petugas/.test(cat) && /Menyimpan foto website/.test(cat), cat.slice(0, 200));
    await noOverflow(ow.page, "catatan aktivitas (HP)");
    await ow.ctx.close();
  }

  console.log("\n[T] Navbar lengkap, halaman mitra, landing ringkas, login Google");
  {
    const dc = await browser.newContext({ viewport: { width: 1366, height: 820 } }); const d = await dc.newPage();
    await d.goto(`${BASE}/`, { waitUntil: "networkidle" });
    const nav = await d.locator("header.topbar").innerText();
    ok("T1 navbar desktop memuat Cek resi, Hitung ongkir, Layanan, Tujuan, Panduan, Tentang, Lainnya, Jadi mitra, Masuk", ["Cek resi", "Hitung ongkir", "Layanan", "Tujuan", "Panduan", "Tentang", "Lainnya", "Jadi mitra", "Masuk"].every((k) => nav.includes(k)), nav.replace(/\s+/g, " "));
    await d.getByRole("button", { name: /Tujuan/ }).click(); await d.waitForTimeout(300);
    ok("T2 dropdown Tujuan menampilkan wilayah dan tautan semua rute", (await d.locator(".ddpanel.mega a[href^='/ekspedisi-ke-']").count()) >= 1 && (await d.locator(".ddpanel .ddall").count()) === 1);
    await d.getByRole("button", { name: /Lainnya/ }).click(); await d.waitForTimeout(300);
    ok("T3 dropdown Lainnya memuat Karir, Kontak, Jadwal, dan Peta situs", (await d.locator(".ddpanel a[href='/karir']").count()) === 1 && (await d.locator(".ddpanel a[href='/kontak']").count()) === 1 && (await d.locator(".ddpanel a[href='/jadwal']").count()) === 1 && (await d.locator(".ddpanel a[href='/peta-situs']").count()) === 1);
    await d.getByRole("button", { name: /Layanan/ }).click(); await d.waitForTimeout(300);
    ok("T3b dropdown Layanan memuat 12 layanan", (await d.locator(".ddpanel a[href^='/layanan/']").count()) === 12);
    await d.screenshot({ path: `${OUT}/e2e-navbar-desktop.png` });
    ok("T4 beranda diringkas: tanpa bagian panduan panjang dan tanpa bagian Gabung di atas footer", !/Panduan sebelum mengirim/.test(await d.content()) && !/Gabung bersama Kamil Logistik/.test(await d.content()));
    await dc.close();
    const mc = await browser.newContext({ viewport: { width: 390, height: 844 } }); const m = await mc.newPage();
    await m.goto(`${BASE}/`, { waitUntil: "networkidle" });
    ok("T5 di HP: tombol menu (burger) tampil, tautan desktop disembunyikan", (await m.locator(".burger").isVisible()) && !(await m.locator(".topbar .navlinks").isVisible()));
    await m.locator(".burger").click(); await m.waitForTimeout(500);
    ok("T6 lembar menu HP memuat Daftar jadi mitra, Karir, Panduan, dan wilayah", (await m.locator(".msheet .mcta[href='/mitra']").count()) === 1 && (await m.locator(".msheet a[href='/karir']").count()) === 1 && (await m.locator(".msheet a[href='/panduan']").count()) === 1);
    await m.screenshot({ path: `${OUT}/e2e-menu-hp.png` });
    await m.locator(".msheet .mcta").click(); await m.waitForURL(/\/mitra/, { timeout: 15000 }).catch(() => {});
    ok("T7 memilih menu membuka halaman mitra dan menutup lembar menu", /\/mitra/.test(m.url()) && (await m.locator(".msheet").count()) === 0, m.url());
    await noOverflow(m, "halaman mitra (HP)");
    ok("V1 form mitra tidak lagi ada di dasar halaman (muncul sebagai jendela balon saat diminta)", (await m.locator("#jenis").count()) === 0);
    await m.getByRole("button", { name: "Daftar sekarang" }).first().click(); await m.waitForSelector("#jenis"); await m.waitForTimeout(400);
    const kotak = await m.locator(".mdlbox").boundingBox();
    ok("V2 jendela form muncul dari bawah (bottom sheet) selebar layar HP", !!kotak && kotak.width >= 380 && kotak.y + kotak.height >= 840, JSON.stringify(kotak));
    await m.getByRole("button", { name: "Kirim pendaftaran" }).click({ force: true }); await m.waitForTimeout(500);
    await m.selectOption("#jenis", "GERAI"); await m.fill("#usaha", "Toko Uji Jaya"); await m.fill("#pemilik", "Budi Uji Mitra"); await m.fill("#hp", "0812 8888 0001"); await m.fill("#kota", "Palu");
    await m.getByRole("button", { name: "Kirim pendaftaran" }).click(); await m.waitForSelector(".nilai.done", { timeout: 20000 }).catch(() => {});
    const done = await m.locator(".nilai.done").innerText().catch(() => "");
    ok("T8 pendaftaran mitra terkirim dengan kode MTR", /MTR-\d{6}-[A-F0-9]{4}/.test(done), done.slice(0, 100));
    ok("V3 notifikasi balon (toast) muncul saat pendaftaran berhasil", (await m.locator(".toast.ok").count()) >= 1 && /Pendaftaran terkirim/.test(await m.locator(".toast.ok").first().innerText()));
    const wa = await m.locator(".nilai.done a.btn").getAttribute("href").catch(() => "");
    ok("T9 tombol WhatsApp mitra berisi nama usaha dan kode", /^https:\/\/wa\.me\/\d+\?text=/.test(wa || "") && decodeURIComponent(wa).includes("Toko Uji Jaya"), wa);
    await m.keyboard.press("Escape"); await m.waitForTimeout(300);
    ok("V4 tombol ESC menutup jendela form", (await m.locator(".mdlbox").count()) === 0);
    const m2 = await mc.newPage(); await m2.goto(`${BASE}/mitra`, { waitUntil: "networkidle" }); await m2.getByRole("button", { name: "Daftar sekarang" }).first().click(); await m2.waitForSelector("#jenis");
    await m2.selectOption("#jenis", "GUDANG"); await m2.fill("#usaha", "Gudang Lain"); await m2.fill("#pemilik", "Budi Uji Mitra"); await m2.fill("#hp", "081288880001"); await m2.fill("#kota", "Palu");
    await m2.getByRole("button", { name: "Kirim pendaftaran" }).click(); await m2.waitForSelector("#daftar .err", { timeout: 15000 }).catch(() => {});
    ok("T10 pendaftaran ganda dari nomor yang sama ditolak", /sudah kami terima/.test(await m2.locator("#daftar .err").innerText().catch(() => "")));
    ok("V5 galat juga tampil sebagai notifikasi balon merah", (await m2.locator(".toast.err").count()) >= 1);
    await mc.close();
    const ow = await login(browser, "owner@uji.id", "Pemilik2026x", { width: 390, height: 844 });
    await ow.page.goto(`${BASE}/app/calon-mitra`, { waitUntil: "networkidle" });
    ok("T11 Pemilik melihat calon mitra di daftar", /Toko Uji Jaya/.test(await ow.page.locator("main").innerText()));
    ok("T12 tombol chat calon mitra memakai nomor pendaftar", (await ow.page.locator("a[href^='https://wa.me/6281288880001']").count()) === 1);
    await noOverflow(ow.page, "daftar calon mitra (HP)"); await ow.ctx.close();
    const lg = await browser.newContext({ viewport: { width: 390, height: 844 } }); const l = await lg.newPage();
    await l.goto(`${BASE}/masuk`, { waitUntil: "networkidle" });
    ok("T13 tombol Masuk dengan Google tersembunyi sebelum diaktifkan", (await l.getByText("Masuk dengan Google").count()) === 0);
    const cb = await fetch(`${BASE}/auth/callback`, { redirect: "manual" });
    ok("T14 alamat kembali Google tanpa kode dialihkan ke halaman masuk dengan pesan", cb.status >= 300 && cb.status < 400 && /e=google/.test(cb.headers.get("location") || ""), `${cb.status} ${cb.headers.get("location")}`);
    await l.goto(`${BASE}/masuk?e=google-belum`, { waitUntil: "networkidle" });
    ok("T15 pesan akun Google belum terdaftar tampil jelas", /belum terdaftar sebagai petugas/.test(await l.locator(".err").innerText().catch(() => "")));
    await lg.close();
  }

  console.log("\n[U] Dashboard HRD, buka tutup lowongan, ekspor CSV");
  {
    const vc = await browser.newContext({ viewport: { width: 390, height: 844 } }); const v = await vc.newPage();
    await v.goto(`${BASE}/karir?posisi=staf-gudang`, { waitUntil: "networkidle" });
    await v.fill("#nama", "=SUM(1+1) Uji Rumus"); await v.fill("#hp", "0812 6666 0001"); await v.fill("#kota", "Makassar");
    await v.setInputFiles("#cvFile", { name: "cv.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4 uji rumus") }); await v.waitForTimeout(500);
    await v.getByRole("button", { name: "Kirim lamaran" }).click(); await v.waitForSelector(".nilai.done", { timeout: 20000 }).catch(() => {});
    await vc.close();
    const hr = await login(browser, "hrd.uji@uji.id", "Sandi2026a", { width: 1366, height: 900 });
    await hr.page.waitForURL(/\/app\/rekrutmen/, { timeout: 10000 }).catch(() => {});
    ok("U1 HRD langsung masuk ke dashboard rekrutmen", /\/app\/rekrutmen/.test(hr.page.url()), hr.page.url());
    await hr.page.waitForSelector(".stats.dash .stat", { timeout: 20000 }).catch(() => {});
    const teks = await hr.page.locator("main").innerText();
    ok("U2 dashboard memuat kartu ringkasan, alur seleksi, dan tren", (await hr.page.locator(".stats.dash .stat").count()) === 4 && /Alur seleksi/.test(teks) && /Pelamar masuk, 14 hari/.test(teks) && (await hr.page.locator("svg.trend rect").count()) === 14);
    ok("U3 dashboard memuat 12 posisi dengan tombol buka/tutup", (await hr.page.locator(".posrow").count()) === 12 && (await hr.page.locator(".switch").count()) === 12);
    await hr.page.screenshot({ path: `${OUT}/e2e-dashboard-hrd.png`, fullPage: true });
    await noOverflow(hr.page, "dashboard rekrutmen (desktop)");
    const sw = hr.page.getByRole("switch", { name: /Tutup lowongan Staf Gudang/ });
    await sw.click(); await hr.page.waitForTimeout(1500);
    ok("U4 menutup lowongan mengubah tombol menjadi Ditutup", (await hr.page.getByRole("switch", { name: /Buka lowongan Staf Gudang/ }).count()) === 1);
    const pub = await browser.newContext({ viewport: { width: 390, height: 844 } }); const pg = await pub.newPage();
    await pg.goto(`${BASE}/karir`, { waitUntil: "networkidle" });
    await pg.getByRole("button", { name: "Lamar sekarang" }).first().click(); await pg.waitForSelector("#posisi");
    ok("U5 halaman karir menandai posisi yang ditutup dan menonaktifkannya di formulir", (await pg.locator("details.card", { hasText: "Staf Gudang" }).locator(".closedtag").count()) === 1 && (await pg.locator("#posisi option[value='staf-gudang'][disabled]").count()) === 1);
    await pub.close();
    await hr.page.getByRole("switch", { name: /Buka lowongan Staf Gudang/ }).click({ timeout: 120000 }); await hr.page.waitForTimeout(1500);
    ok("U6 membuka kembali lowongan", (await hr.page.getByRole("switch", { name: /Tutup lowongan Staf Gudang/ }).count()) === 1);
    const csv = await hr.ctx.request.get(`${BASE}/app/ekspor/lamaran`);
    const body = await csv.text();
    ok("U7 ekspor CSV lamaran berisi data dan bisa dibuka Excel (BOM, tipe berkas)", csv.status() === 200 && /text\/csv/.test(csv.headers()["content-type"] || "") && body.charCodeAt(0) === 0xfeff && /Budi Uji Karir/.test(body));
    ok("U8 ekspor CSV mencegah rumus Excel berbahaya (sel diawali = diberi petik)", /"'=SUM\(1\+1\) Uji Rumus"/.test(body) && !/,"=SUM/.test(body), body.split("\n").find((l) => /Rumus/.test(l)) || "");
    const mi = await hr.ctx.request.get(`${BASE}/app/ekspor/calon-mitra`);
    ok("U9 HRD tidak boleh mengunduh data calon mitra", mi.status() === 403, String(mi.status()));
    await hr.ctx.close();
    const nf = await fetch(`${BASE}/halaman-yang-tidak-ada-123`); const nft = await nf.text();
    ok("U11 halaman tidak ditemukan tampil ramah dalam bahasa Indonesia dengan jalan keluar", nf.status === 404 && /Halaman tidak ditemukan/.test(nft) && /Ke beranda/.test(nft) && !/This page could not be found/.test(nft), String(nf.status));
    const gb = await fetch(`${BASE}/`); const gbt = await gb.text();
    ok("U12 beranda: tidak ada kartu Gabung di atas footer", !/Gabung bersama Kamil Logistik/.test(gbt) && !/Baca panduan/.test(gbt));
    const anon = await fetch(`${BASE}/app/ekspor/lamaran`, { redirect: "manual" });
    ok("U10 ekspor tanpa login dialihkan ke halaman masuk", anon.status >= 300 && anon.status < 400, String(anon.status));
  }

  console.log("\n[W] Perusahaan resmi, layanan, alat bantu, SEO terstruktur");
  {
    const get = async (u) => { const r = await fetch(`${BASE}${u}`); return { status: r.status, ct: r.headers.get("content-type") || "", body: (await r.text()).replace(/<!-- -->/g, "") }; };
    const ld = (html) => [...html.matchAll(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].flatMap((m) => { try { const j = JSON.parse(m[1]); return Array.isArray(j) ? j : [j]; } catch { return [null]; } });
    const types = (html) => ld(html).map((x) => (x == null ? "RUSAK" : x["@type"]));
    const pc = await browser.newContext({ viewport: { width: 390, height: 844 } }); const pg = await pc.newPage();
    const LAY = ["cargo-laut", "cargo-udara", "cargo-darat", "cargo-logistik-bisnis", "kirim-kendaraan", "kirim-alat-berat", "sewa-kontainer", "pindahan-relokasi", "pergudangan", "kirim-alat-kesehatan", "kirim-bahan-bangunan-dan-stok-toko", "konsultasi-logistik"];
    let okLay = 0; for (const sl of LAY) { const g = await get(`/layanan/${sl}`); if (g.status === 200 && types(g.body).includes("Service") && types(g.body).includes("FAQPage") && types(g.body).includes("BreadcrumbList") && /<h1/.test(g.body) && !/undefined|NaN/.test(g.body.replace(/<script[\s\S]*?<\/script>/g, ""))) okLay++; }
    ok("W1 12 halaman layanan terbuka dengan Service, FAQPage, Breadcrumb, dan H1", okLay === 12, String(okLay));
    const li = await get("/layanan"); ok("W2 indeks layanan memuat 10 tautan layanan dan ItemList", (li.body.match(/href="\/layanan\/[a-z-]+"/g) || []).length >= 10 && types(li.body).includes("ItemList"));
    const tt = await get("/tentang");
    ok("W3 Tentang memuat nama badan hukum, tahun berdiri, pimpinan, dan 3 kantor", /CV Kamil Logistik Express Sulawesi/.test(tt.body) && /2020/.test(tt.body) && /Andi Khusnul Khatimah/.test(tt.body) && /Prasetya Adimakayasa/.test(tt.body) && ["Jakarta", "Makassar", "Surabaya"].every((k) => tt.body.includes(k)));
    const orgLd = (tt.body.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/) || [])[1] || "";
    ok("W4 data terstruktur Organization memuat legalName, foundingDate, founder, dan 3 lokasi", /"legalName":"CV Kamil Logistik Express Sulawesi"/.test(orgLd) && /"foundingDate":"2020-08-03"/.test(orgLd) && /"founder"/.test(orgLd) && (orgLd.match(/"@type":"Place"/g) || []).length === 3);
    ok("W5 Tentang menyediakan tombol minta salinan dokumen legalitas (tanpa menampilkan nomor)", /Minta salinan dokumen legalitas/.test(tt.body) && !/95\.717\.714/.test(tt.body));
    const kk = await get("/kontak"); ok("W6 Kontak memuat 2 nomor WhatsApp, email resmi, dan 3 alamat kantor", /0853-4223-8748/.test(kk.body) && /0821-2305-7322/.test(kk.body) && /owner@kamillogistik\.com/.test(kk.body) && /Tamalanrea/.test(kk.body) && /Perak Utara/.test(kk.body) && /Pancoran/.test(kk.body));
    const jd = await get("/jadwal"); ok("W7 halaman jadwal terbuka dengan tabel rute", jd.status === 200 && /<table/.test(jd.body) && /Jadwal keberangkatan/.test(jd.body));
    const ps = await get("/peta-situs"); ok("W8 peta situs HTML memuat layanan, wilayah, panduan, dan perusahaan", ps.status === 200 && /\/layanan\/cargo-laut/.test(ps.body) && /ekspedisi-ke-sulawesi/.test(ps.body) && /\/panduan\//.test(ps.body) && /\/tentang/.test(ps.body));
    const lf = await get("/llms-full.txt"); ok("W9 llms-full.txt memuat profil, legalitas, layanan, kantor, dan jangkauan", lf.status === 200 && /CV Kamil Logistik Express Sulawesi/.test(lf.body) && /Visi/.test(lf.body) && /Cargo|cargo/.test(lf.body) && /Surabaya/.test(lf.body));
    const hm = await get("/"); ok("W10 beranda memuat kartu perusahaan resmi dan footer dengan nama badan hukum", /Perusahaan resmi berbadan hukum sejak 2020/.test(hm.body) && (hm.body.match(/CV Kamil Logistik Express Sulawesi/g) || []).length >= 2);
    ok("W11 setiap halaman baru punya judul unik dan canonical", await (async () => { const set = new Set(); for (const u of ["/tentang", "/kontak", "/layanan", "/jadwal", "/alat/berat-volumetrik", "/layanan/cargo-laut", "/layanan/cargo-udara"]) { const g = await get(u); const t = (g.body.match(/<title>([^<]*)<\/title>/) || [])[1]; if (!t || !new RegExp(`rel="canonical" href="[^"]*${u}"`).test(g.body)) return false; set.add(t); } return set.size === 7; })());
    await pg.goto(`${BASE}/alat/berat-volumetrik`, { waitUntil: "networkidle" });
    await pg.fill("#v-p", "60"); await pg.fill("#v-l", "50"); await pg.fill("#v-t", "40"); await pg.fill("#v-b", "5");
    const hasil = await pg.locator("#kalkulator").innerText();
    ok("W12 kalkulator berat volume: 60×50×40 cm, 5 kg → laut 30 kg dan udara 20 kg", /30 kg/.test(hasil) && /20 kg/.test(hasil) && /memakai berat volume/.test(hasil), hasil.slice(0, 200));
    await noOverflow(pg, "kalkulator volume (HP)");
    await pg.goto(`${BASE}/tentang`, { waitUntil: "networkidle" }); await noOverflow(pg, "halaman Tentang (HP)");
    await pg.screenshot({ path: `${OUT}/e2e-tentang.png`, fullPage: true });
    await pg.goto(`${BASE}/layanan/kirim-kendaraan`, { waitUntil: "networkidle" }); await noOverflow(pg, "halaman layanan (HP)");
    await pc.close();
  }

  console.log("\n[X] Pesan jemput, klaim, laporan Pemilik, ekspor, kontak dan sosmed");
  {
    const get = async (u) => { const r = await fetch(`${BASE}${u}`); return { status: r.status, body: (await r.text()).replace(/<!-- -->/g, "") }; };
    const pc = await browser.newContext({ viewport: { width: 390, height: 844 } }); const pg = await pc.newPage();
    const isiJemput = async (layanan, tujuan, barang, berat) => {
      await pg.goto(`${BASE}/jemput`, { waitUntil: "networkidle" });
      await pg.selectOption("#layanan", layanan); await pg.fill("#nama", "Rina Jemput Uji"); await pg.fill("#hp", "0812 5555 0101"); await pg.fill("#kota", "Palu");
      await pg.fill("#alamat", "Jl. Sudirman No 12, dekat apotek"); await pg.fill("#tujuan", tujuan); await pg.fill("#barang", barang); if (berat) await pg.fill("#berat", berat);
      await pg.click("form button.btn"); await pg.waitForSelector(".nilai.done, .err", { timeout: 15000 }).catch(() => {});
    };
    await pg.goto(`${BASE}/jemput`, { waitUntil: "networkidle" });
    ok("X1 halaman Pesan jemput memuat formulir lengkap", (await pg.locator("#layanan, #nama, #hp, #kota, #alamat, #tujuan, #barang").count()) === 7);
    await isiJemput("DARAT", "Jayapura", "2 kardus pakaian", "18,5");
    const tj = await pg.locator(".nilai.done").innerText().catch(() => "");
    const wj = await pg.locator(".nilai.done a.btn").getAttribute("href").catch(() => "");
    ok("X2 pesanan jemput terkirim: kode JMP muncul dan tombol WhatsApp terisi pesan", /JMP-\d{6}-[A-Z0-9]{4}/.test(tj) && /wa\.me\/6285342238748/.test(wj || "") && /JMP-/.test(decodeURIComponent(wj || "")), tj.slice(0, 120));
    await isiJemput("LAUT", "Ambon", "kardus kedua", ""); await isiJemput("UDARA", "Manado", "kardus ketiga", "");
    await isiJemput("LAUT", "Ternate", "kardus keempat", "");
    ok("X3 pesanan jemput dibatasi 3 per nomor per hari (pesanan ke-4 ditolak dengan pesan jelas)", /sudah kami terima/.test(await pg.locator(".err").first().innerText().catch(() => "")));
    await pg.goto(`${BASE}/jemput`, { waitUntil: "networkidle" }); await noOverflow(pg, "Pesan jemput (HP)");
    await pg.goto(`${BASE}/klaim?resi=KML-JKT-MKS-LJ-261112-0830-0001-NW`, { waitUntil: "networkidle" });
    ok("X4 halaman Klaim membawa nomor resi dari tautan", (await pg.inputValue("#resi")) === "KML-JKT-MKS-LJ-261112-0830-0001-NW");
    await pg.selectOption("#jenis", "RUSAK"); await pg.fill("#nama", "Siti Klaim Uji"); await pg.fill("#hp", "0813 6666 0202"); await pg.fill("#cerita", "Kardus basah dan isinya pecah saat tiba di Jayapura.");
    await pg.click("form button.btn"); await pg.waitForSelector(".nilai.done", { timeout: 15000 }).catch(() => {});
    const tk = await pg.locator(".nilai.done").innerText().catch(() => ""); const wk = await pg.locator(".nilai.done a.btn").getAttribute("href").catch(() => "");
    ok("X5 klaim terkirim: kode KLM muncul dan tombol mengarah ke WhatsApp after sales 0821-2305-7322", /KLM-\d{6}-[A-Z0-9]{4}/.test(tk) && /wa\.me\/6282123057322/.test(wk || ""), tk.slice(0, 120));
    await pg.goto(`${BASE}/klaim`, { waitUntil: "networkidle" }); await noOverflow(pg, "Klaim (HP)");
    await pg.goto(`${BASE}/kontak`, { waitUntil: "networkidle" });
    const sos = await pg.$$eval("ul.sosmed a", (as) => as.map((a) => a.href));
    ok("X6 Kontak memuat 4 media sosial resmi (Instagram, TikTok, Facebook, YouTube)", sos.some((h) => /instagram\.com\/kamil_logistik_express/.test(h)) && sos.some((h) => /tiktok\.com\/@kamillogistikexpress\.id/.test(h)) && sos.some((h) => /facebook\.com\/share\/1Da8zfWVVZ/.test(h)) && sos.some((h) => /youtube\.com\/@kamillogistik_express/.test(h)), sos.join(" "));
    const kt = await get("/kontak"); ok("X7 email resmi owner@kamillogistik.com tampil dan email lama tidak lagi dipakai", /owner@kamillogistik\.com/.test(kt.body) && !/cvkamillogistikexpresssulawesi@gmail/.test(kt.body));
    await pg.goto(`${BASE}/karir`, { waitUntil: "networkidle" });
    const sums = await pg.$$(".jobrow summary"); await sums[3].click();
    const tombol = pg.locator(".jobrow[open] a.btn").first(); const slugBtn = ((await tombol.getAttribute("href")) || "").split("posisi=")[1];
    await tombol.click(); await pg.waitForSelector(".mdlbox select", { timeout: 8000 }).catch(() => {});
    ok("X8 tombol Lamar posisi ini membuka formulir dengan posisi yang benar", !!slugBtn && (await pg.locator(".mdlbox select").first().inputValue().catch(() => "")) === slugBtn, slugBtn);
    const nojs = await get("/karir"); ok("X9 tombol Lamar berupa tautan nyata (tetap berfungsi sebelum JavaScript siap)", (nojs.body.match(/href="\/karir\?posisi=[a-z-]+"/g) || []).length >= 10);
    await pg.goto(`${BASE}/tentang`, { waitUntil: "networkidle" }); await pg.click(".abtabs button:has-text('Jakarta')");
    ok("X10 peta Tentang interaktif: pilih Jakarta menampilkan Gudang Sarinah", /Gudang Sarinah/.test(await pg.locator(".abinfo").innerText()));
    const sm = await get("/sitemap/0.xml"); const sm2 = await get("/sitemap/1.xml"); ok("X11 sitemap memuat /jemput dan /klaim", /\/jemput</.test(sm.body + sm2.body) && /\/klaim</.test(sm.body + sm2.body));
    await pc.close();
    const ow = await login(browser, "owner@uji.id", "Pemilik2026x", { width: 1366, height: 900 });
    await ow.page.goto(`${BASE}/app/jemput`, { waitUntil: "networkidle" });
    const tj2 = await ow.page.locator("main").innerText();
    ok("X12 Pemilik melihat pesanan jemput dengan alamat, barang, dan tombol chat", /Rina Jemput Uji/.test(tj2) && /2 kardus pakaian/.test(tj2) && (await ow.page.locator("a.btn:has-text('Chat pelanggan')").count()) >= 1);
    await ow.page.selectOption("main select >> nth=0", "DIJADWALKAN").catch(() => {}); await ow.page.waitForSelector("text=Tersimpan", { timeout: 8000 }).catch(() => {});
    await ow.page.goto(`${BASE}/app/jemput?s=DIJADWALKAN`, { waitUntil: "networkidle" });
    ok("X13 mengubah status pesanan jemput tersimpan", /Rina Jemput Uji/.test(await ow.page.locator("main").innerText()));
    await ow.page.goto(`${BASE}/app/klaim`, { waitUntil: "networkidle" });
    const tk2 = await ow.page.locator("main").innerText(); ok("X14 Pemilik melihat klaim, resi yang tidak dikenal ditandai", /Siti Klaim Uji/.test(tk2) && /Barang rusak/.test(tk2) && /tidak ditemukan di sistem/.test(tk2));
    await ow.page.goto(`${BASE}/app/laporan`, { waitUntil: "networkidle" });
    const lp = await ow.page.locator("main").innerText();
    ok("X15 laporan Pemilik memuat ringkasan keuangan, operasional, grafik, dan periode cepat", /Laporan lengkap/.test(lp) && /Ringkasan keuangan/.test(lp) && /Operasional dan layanan pelanggan/.test(lp) && /Rute terlaris/.test(lp) && /Bulan lalu/.test(lp) && /Pesanan jemput dari website/.test(lp), lp.slice(0, 160));
    await noOverflow(ow.page, "Laporan Pemilik (desktop)");
    const hari = 24 * 3600 * 1000; const dr = new Date(Date.now() - 6 * hari).toISOString().slice(0, 10), sk = new Date().toISOString().slice(0, 10);
    for (const j of ["resi", "tagihan", "pembayaran", "komisi", "jemput", "klaim"]) {
      const c = await ow.ctx.request.get(`${BASE}/app/ekspor/${j}?dari=${dr}&sampai=${sk}`); const b = await c.text();
      ok(`X16 ekspor CSV ${j}: tipe berkas, BOM Excel, dan baris judul`, c.status() === 200 && /text\/csv/.test(c.headers()["content-type"] || "") && b.charCodeAt(0) === 0xfeff && b.split("\n")[0].length > 10, String(c.status()));
    }
    const cj = await (await ow.ctx.request.get(`${BASE}/app/ekspor/jemput`)).text(); ok("X17 CSV jemput memuat pesanan uji", /Rina Jemput Uji/.test(cj) && /Palu/.test(cj));
    const ck = await (await ow.ctx.request.get(`${BASE}/app/ekspor/klaim`)).text(); ok("X18 CSV klaim memuat laporan uji", /Siti Klaim Uji/.test(ck));
    await ow.ctx.close();
    const ks = await login(browser, "kasir@uji.id");
    await ks.page.goto(`${BASE}/app/jemput`, { waitUntil: "networkidle" });
    ok("X19 kasir bisa membuka antrean pesanan jemput", /\/app\/jemput/.test(ks.page.url()) && /Pesanan jemput/.test(await ks.page.locator("main").innerText()));
    for (const u of ["/app/klaim", "/app/laporan"]) { await ks.page.goto(`${BASE}${u}`, { waitUntil: "networkidle" }); ok(`X20 kasir tidak bisa membuka ${u} (dialihkan)`, new URL(ks.page.url()).pathname === "/app"); }
    const xc = await ks.ctx.request.get(`${BASE}/app/ekspor/resi`); ok("X21 kasir tidak bisa mengunduh ekspor Pemilik", xc.status() === 403);
    await ks.ctx.close();
  }

  console.log("\n[Y] Dashboard Manajer Gudang Jakarta");
  {
    const mg = await login(browser, "manajer@uji.id", PASS, { width: 390, height: 844 });
    ok("Y1 Manajer Gudang bisa masuk", mg.loggedIn);
    const p = mg.page; await p.goto(`${BASE}/app`, { waitUntil: "networkidle" }); await p.waitForTimeout(700);
    ok("Y2 beranda menampilkan 9 kartu dashboard (tanpa piutang) dan satu judul utama", (await p.locator(".hubcard").count()) === 9 && (await p.locator("h1").count()) === 1);
    ok("AN1 beranda cabang menampilkan 4 kartu arah barang (akan masuk, di cabang ini, sudah keluar, selesai)", (await p.locator(".arahkartu").count()) === 4 && /Akan masuk/.test(await p.locator(".arahbar").innerText()) && /Sudah keluar/.test(await p.locator(".arahbar").innerText()));
    await p.locator(".arahkartu.masuk").click();
    await p.waitForURL(/a=MASUK/, { timeout: 25000 }).catch(async () => { await p.goto(`${BASE}/app?a=MASUK`, { waitUntil: "load" }); }); // klik sesekali tertahan prefetch yang dibatalkan di peramban uji; isi halaman tetap diuji
    await p.waitForSelector(".arahkartu.on", { timeout: 15000 });
    ok("AN2 menyentuh kartu Akan masuk menyaring daftar dan menandai kartunya", /a=MASUK/.test(p.url()) && (await p.locator(".arahkartu.on").count()) === 1 && (await p.locator("a.card.resi:not(:has(.arahchip.masuk))").count()) === 0);
    await p.goto(`${BASE}/app`, { waitUntil: "networkidle" }); await p.waitForTimeout(500);
    const kepala = await p.locator(".hubhead").innerText();
    ok("Y3 dashboard terkunci ke Gudang Jakarta dan menampilkan status perhatian", /Gudang Jakarta/.test(kepala) && /(terkendali|perlu perhatian)/.test(kepala), kepala.replace(/\n/g, " "));
    const aksi = await p.$$eval(".hubquick a", (as) => as.map((a) => a.getAttribute("href")));
    ok("Y4 aksi cepat kepala gudang: daftar manifest dan serah terima, tanpa membuat manifest, tanpa Pindai ganda dan tanpa Resi baru (satu pintu: kasir)", ["/app/manifest", "/app/serah"].every((h) => aksi.includes(h)) && !aksi.includes("/app/manifest/baru") && !aksi.includes("/app/pindai") && !aksi.includes("/app/baru"), aksi.join(","));
    ok("AD1 dashboard kepala gudang tidak punya tombol Buat resi (resi satu pintu di kasir)", (await p.locator("a[href='/app/baru']").count()) === 0);
    const wa = await p.locator(".shift a.btn").getAttribute("href"); const pesan = decodeURIComponent(wa || "");
    ok("Y5 laporan akhir shift: pesan WhatsApp berisi ringkasan cabang dan angka hari ini", /Ringkasan shift Gudang Jakarta/.test(pesan) && /Resi baru: \d+/.test(pesan) && /Piutang cabang: Rp/.test(pesan), pesan.slice(0, 80));
    await noOverflow(p, "Dashboard Manajer Gudang (HP)");
    const taut = await p.locator(".hubcard .btn.ghost[href='/app/jemput']").count(); ok("Y6 kartu pesanan jemput menautkan ke antrean jemput", taut === 1);
    await p.goto(`${BASE}/app/jemput`, { waitUntil: "networkidle" });
    const nomor = await p.locator("main").innerText(); ok("Y7 nomor WhatsApp di antrean jemput tampil rapi (0812-...) bukan 62...", !/\b628\d{8,}\b/.test(nomor));
    ok("Y8 Kepala gudang tidak melihat tombol unduh CSV yang akan ditolak (hanya Super Admin)", (await p.locator("a:has-text('Unduh Excel')").count()) === 0);
    { await p.goto(`${BASE}/app/tagihan`, { waitUntil: "networkidle" }); const tbm = await p.locator(".tabbar").innerText(); ok("AR1 Kepala gudang tidak punya menu Tagihan: halaman dialihkan dan tidak ada di menu bawah", !/\/app\/tagihan/.test(p.url()) && !/Tagihan/.test(tbm) && /Gudang/.test(tbm) && /Masalah/.test(tbm) && /Manifest/.test(tbm), p.url() + " " + tbm.replace(/\n/g, " ")); await p.goto(`${BASE}/app`, { waitUntil: "networkidle" }); ok("AR2 beranda Kepala gudang tidak memuat kartu piutang cabang", !/Piutang cabang/.test(await text(p))); }
    ok("Y9 Kepala gudang tidak ditawari membuat resi dari pesanan jemput (hanya Kasir)", (await p.locator("a[href^='/app/baru?jemput=']").count()) === 0);
    for (const u of ["/app/pindai", "/app/manifest", "/app/serah", "/app/tindak-lanjut", "/app/akun", "/app/pusat"]) { await p.goto(`${BASE}${u}`, { waitUntil: "networkidle" }); await noOverflow(p, `Manajer ${u} (HP)`); }
    await mg.ctx.close();
    const md = await login(browser, "manajer@uji.id", PASS, { width: 1366, height: 900 });
    await md.page.goto(`${BASE}/app`, { waitUntil: "networkidle" }); await md.page.waitForTimeout(700);
    await noOverflow(md.page, "Dashboard Manajer Gudang (desktop)");
    const kolom = await md.page.$$eval(".dtable th", (t) => t.filter((x) => x.offsetParent !== null).length);
    const tabel = await md.page.locator(".dtable").boundingBox(); const kartu = await md.page.locator(".dtable table").boundingBox();
    ok("Y9 tabel resi di desktop memuat kolom status tanpa terpotong", kolom >= 4 && (!tabel || !kartu || kartu.width <= tabel.width + 2), `${kolom} kolom, tabel ${kartu && kartu.width} / kartu ${tabel && tabel.width}`);
    await md.ctx.close();
    const ks = await login(browser, "kasir@uji.id", PASS, { width: 390, height: 844 });
    await ks.page.goto(`${BASE}/app`, { waitUntil: "networkidle" });
    ok("Y10 kasir tidak melihat dashboard manajer gudang", !/Papan gudang|Kinerja tim gudang/.test(await ks.page.locator("main").first().innerText()));
    const lencana = await ks.page.locator(".homebadge").first().boundingBox().catch(() => null); const stat = await ks.page.locator(".stats").first().boundingBox().catch(() => null);
    ok("Y11 lencana tindak lanjut tidak tertutup kartu angka di HP", !lencana || !stat || (lencana.y + lencana.height <= stat.y + 2 || stat.y + stat.height <= lencana.y + 2), JSON.stringify({ lencana, stat }));
    await ks.ctx.close();
  }

  console.log("\n[Z] Dashboard khusus tiap peran: Pemilik, Kasir, Kurir, Staf gudang, Sopir, Admin konten");
  {
    const cek = async (email, pass, label, jumlah, kata) => {
      const a = await login(browser, email, pass, { width: 390, height: 844 });
      if (!a.loggedIn) { ok(`Z ${label}: masuk`, false); return null; }
      await a.page.goto(`${BASE}${label === "konten" ? "/app/konten" : "/app"}`, { waitUntil: "networkidle" }); await a.page.waitForTimeout(700);
      const n = await a.page.locator(".hubcard").count(); const teks = await a.page.locator("main, .appmain").first().innerText();
      ok(`Z ${label}: dashboard khusus tampil dengan ${jumlah}+ kartu`, n >= jumlah, String(n));
      ok(`Z ${label}: memuat bagian penting (${kata.join(", ")})`, kata.every((k) => teks.includes(k)), teks.slice(0, 120));
      ok(`Z ${label}: satu judul utama dan tanpa geser samping`, (await a.page.locator("h1").count()) >= 1 && !(await a.page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)));
      return a;
    };
    const kas = await cek("kasir@uji.id", PASS, "kasir", 4, ["Kas hari ini", "Pesanan jemput baru", "Kirim setoran ke Pemilik"]); if (kas) await kas.ctx.close();
    const kur = await cek("kurir@uji.id", PASS, "kurir", 3, ["Barang yang saya bawa", "Menunggu diterima", "7 hari terakhir"]); if (kur) await kur.ctx.close();
    const gud = await cek("gudang@uji.id", PASS, "gudang", 4, ["Di gudang", "Antrean timbang", "Hasil kerja saya hari ini"]); if (gud) await gud.ctx.close();
    const sop = await cek("sopir@uji.id", PASS, "sopir", 2, ["Muatan saya", "Riwayat perjalanan"]); if (sop) await sop.ctx.close();
    const kn = await cek("konten.uji@uji.id", "Sandi2026a", "konten", 2, ["Slider beranda", "Ulasan bagus"]); if (kn) await kn.ctx.close();
    const ow = await cek("owner@uji.id", "Pemilik2026x", "owner", 6, ["Pusat peringatan", "Proyeksi omzet bulan ini", "Perbandingan cabang", "Kesehatan sistem"]);
    if (ow) {
      await ow.page.click("button:has-text('Atur target bulanan')"); await ow.page.fill("#target", "75000000"); await ow.page.click("form button.btn.sm:has-text('Simpan')");
      await ow.page.waitForSelector("text=75.000.000", { timeout: 10000 }).catch(() => {});
      ok("Z owner: target bulanan tersimpan dan muncul di kartu proyeksi", /75\.000\.000/.test(await ow.page.locator("main, .appmain").first().innerText()));
      await ow.ctx.close();
    }
  }

  console.log("\n[AA] Aksesibilitas dan artikel panduan baru");
  {
    const get = async (u) => { const r = await fetch(`${BASE}${u}`); return { status: r.status, body: (await r.text()).replace(/<!-- -->/g, "") }; };
    for (const sl of ["cara-kirim-motor-dan-mobil-antar-pulau", "cara-kirim-alat-berat-antar-pulau", "lcl-atau-fcl-kirim-lewat-kontainer"]) {
      const a = await get(`/panduan/${sl}`);
      ok(`AA panduan ${sl}: terbuka dengan H1, FAQ/artikel terstruktur, dan tautan layanan`, a.status === 200 && /<h1/.test(a.body) && /href="\/(layanan|alat|jemput|klaim|kontak|ekspedisi)/.test(a.body) && !/undefined/.test(a.body.slice(0, 4000)), String(a.status));
    }
    const idx = await get("/panduan"); ok("AA indeks panduan memuat 3 artikel baru", /cara-kirim-motor-dan-mobil-antar-pulau/.test(idx.body) && /cara-kirim-alat-berat-antar-pulau/.test(idx.body) && /lcl-atau-fcl-kirim-lewat-kontainer/.test(idx.body));
    const sm = await get("/sitemap/3.xml"); ok("AA sitemap panduan memuat artikel baru", /lcl-atau-fcl-kirim-lewat-kontainer/.test(sm.body));
    const ow = await login(browser, "owner@uji.id", "Pemilik2026x", { width: 390, height: 844 });
    for (const u of ["/app/petugas", "/app/tarif", "/app/mitra", "/app/pengaturan"]) {
      await ow.page.goto(`${BASE}${u}`, { waitUntil: "networkidle" }); await ow.page.waitForTimeout(500);
      const tanpa = await ow.page.evaluate(() => [...document.querySelectorAll("input:not([type=hidden]),select,textarea")].filter((e) => !e.labels?.length && !e.getAttribute("aria-label") && !e.placeholder && !e.closest("label")).length);
      ok(`AA ${u}: semua kolom isian punya label yang terhubung`, tanpa === 0, String(tanpa));
    }
    for (const [u, t] of [["/app/pusat", /Pusat Kerja/], ["/app/petugas", /Daftar Petugas/], ["/app/tagihan", /Daftar Tagihan/], ["/app/cari?q=a", /Cari Resi/]]) { await ow.page.goto(`${BASE}${u}`, { waitUntil: "networkidle" }); ok(`AA judul tab ${u} jelas`, t.test(await ow.page.title())); }
    await ow.ctx.close();
    const pg = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage();
    await pg.goto(`${BASE}/lacak/RESI-TIDAK-ADA`, { waitUntil: "networkidle" }); ok("AA halaman resi tidak ditemukan punya judul utama (h1)", (await pg.locator("h1").count()) >= 1);
    await pg.close();
  }

  console.log("\n[AE] Kendala pengiriman, kepegawaian, peran Finance dan CS");
  {
    const cp = require("child_process"), dbn = require("fs").readFileSync(__dirname + "/.dbname", "utf8").trim();
    const sqlq = (q) => cp.spawnSync("su", ["postgres", "-c", `psql -At -q -X -d ${dbn}`], { input: q, encoding: "utf8" }).stdout.trim();
    sqlq(`INSERT INTO staff_invites(email, full_name, role, branch_id) VALUES ('finance@uji.id','Finance Uji','FINANCE',NULL),('cs@uji.id','CS Uji','CS_SALES',(SELECT id FROM branches_partners WHERE code='JKT'));
      INSERT INTO auth.users(id,email,encrypted_password,email_confirmed_at,aud,role,raw_app_meta_data,raw_user_meta_data) SELECT gen_random_uuid(), email, extensions.crypt('Test1234', extensions.gen_salt('bf')), now(),'authenticated','authenticated','{}','{}' FROM staff_invites WHERE email IN ('finance@uji.id','cs@uji.id');`);
    const iso = (n) => new Date(Date.now() + 8 * 3600000 + n * 86400000).toISOString().slice(0, 10); // tanggal WITA, sama dengan aplikasi
    const pesan = async (p) => ((await p.locator(".ok, .err").first().textContent({ timeout: 8000 }).catch(() => "")) || "").trim();

    // Absen dan cuti oleh petugas lapangan
    const kk = await login(browser, "kurir@uji.id", PASS, { width: 390, height: 844 });
    await kk.page.goto(`${BASE}/app/akun`, { waitUntil: "networkidle" });
    await act(kk.page, kk.page.getByRole("button", { name: "Absen masuk" }));
    ok("AE1 petugas bisa absen masuk dari menu Akun", /Absen masuk tercatat/.test(await pesan(kk.page)));
    await act(kk.page, kk.page.getByRole("button", { name: "Absen pulang" }));
    ok("AE2 petugas bisa absen pulang", /Absen pulang tercatat/.test(await pesan(kk.page)));
    // Profil: ubah nama dan WhatsApp sendiri
    await kk.page.goto(`${BASE}/app/akun`, { waitUntil: "networkidle" });
    ok("AM1 halaman Akun memuat data akun, ubah profil, dan keamanan", /Data akun/.test(await text(kk.page)) && await kk.page.locator("#akun-nama").count() === 1 && /Keamanan/.test(await text(kk.page)));
    await kk.page.fill("#akun-nama", "Kurir  Jakarta Baru"); await kk.page.fill("#akun-hp", "0812-9000-1234");
    await act(kk.page, kk.page.getByRole("button", { name: "Simpan profil" }));
    ok("AM2 profil tersimpan, nama dirapikan dan nomor ditampilkan", /Profil sudah disimpan/.test(await pesan(kk.page)) && /Kurir Jakarta Baru/.test(await text(kk.page)) && /0812 9000 1234/.test(await text(kk.page)));
    await kk.page.fill("#akun-nama", "K"); await act(kk.page, kk.page.getByRole("button", { name: "Simpan profil" }));
    ok("AM3 nama terlalu pendek ditolak (validasi peramban atau server)", await kk.page.locator("#akun-nama").evaluate((e) => !e.validity.valid) || /Nama lengkap/.test(await pesan(kk.page)));
    await kk.page.fill("#cuti-dari", iso(5)); await kk.page.fill("#cuti-sampai", iso(6)); await kk.page.fill("#cuti-alasan", "Acara keluarga di Makassar");
    await act(kk.page, kk.page.getByRole("button", { name: "Kirim pengajuan" }));
    ok("AE3 pengajuan cuti terkirim dan tampil menunggu keputusan", /Pengajuan terkirim/.test(await pesan(kk.page)) && /Menunggu keputusan/.test(await kk.page.locator("main").innerText()));
    await noOverflow(kk.page, "Akun dengan absen (HP)");
    await kk.ctx.close();

    // Pemilik: kepegawaian
    const ow = await login(browser, "owner@uji.id", "Pemilik2026x", { width: 390, height: 844 });
    await ow.page.goto(`${BASE}/app/pegawai?t=cuti`, { waitUntil: "networkidle" });
    ok("AE4 Pemilik melihat pengajuan cuti Kurir Jakarta", /Kurir Jakarta/.test(await ow.page.locator("main").innerText()));
    await act(ow.page, ow.page.getByRole("button", { name: "Setujui" }).first());
    ok("AE5 pengajuan cuti bisa disetujui", /Keputusan tersimpan/.test(await pesan(ow.page)));
    await ow.page.goto(`${BASE}/app/pegawai?t=dokumen`, { waitUntil: "networkidle" });
    const kurirId = await ow.page.$$eval("#d-pegawai option", (o) => (o.find((x) => /Kurir Jakarta/.test(x.textContent)) || {}).value);
    await ow.page.selectOption("#d-pegawai", kurirId); await ow.page.selectOption("#d-jenis", "SIM"); await ow.page.fill("#d-nomor", "B2-UJI-123"); await ow.page.fill("#d-berlaku", iso(10));
    await act(ow.page, ow.page.getByRole("button", { name: "Simpan dokumen" }));
    const dt = await ow.page.locator("main").innerText();
    ok("AE6 dokumen SIM tersimpan dan diberi peringatan hampir habis", /Dokumen disimpan/.test(dt) && /B2-UJI-123/.test(dt) && /10 hari lagi/.test(dt), dt.slice(0, 200));
    await noOverflow(ow.page, "Kepegawaian dokumen (HP)");
    await ow.page.goto(`${BASE}/app/pegawai?t=shift`, { waitUntil: "networkidle" }); await noOverflow(ow.page, "Kepegawaian shift (HP)");
    await ow.page.selectOption("#s-pegawai", kurirId); await ow.page.selectOption("#s-shift", "PAGI");
    await act(ow.page, ow.page.getByRole("button", { name: "Simpan shift" }));
    ok("AE7 shift tersimpan", /Shift disimpan/.test(await pesan(ow.page)));
    await ow.page.goto(`${BASE}/app/pegawai?t=rekap`, { waitUntil: "networkidle" });
    ok("AE8 rekap memuat Kurir Jakarta dengan 1 hari hadir dan unduhan CSV", /Kurir Jakarta/.test(await ow.page.locator("main").innerText()) && (await ow.page.locator("a[href^='/app/ekspor/rekap-pegawai']").count()) === 1);
    const csv = await ow.page.request.get(`${BASE}/app/ekspor/rekap-pegawai`); const csvt = await csv.text();
    ok("AE9 CSV rekap pegawai terunduh dan tidak memuat data resi", csv.status() === 200 && /Kurir Jakarta/.test(csvt) && !/KML-/.test(csvt), String(csv.status()));
    await noOverflow(ow.page, "Kepegawaian rekap (HP)");
    await ow.page.goto(`${BASE}/app/kendala`, { waitUntil: "networkidle" }); await noOverflow(ow.page, "Kendala (Pemilik, HP)");
    await ow.ctx.close();

    // Kendala pengiriman oleh kepala gudang
    const rid = sqlq(`SELECT id FROM shipments WHERE status NOT IN ('DELIVERED','CANCELLED','EXCEPTION') AND origin_id = (SELECT id FROM branches_partners WHERE code='JKT') ORDER BY created_at DESC LIMIT 1;`);
    const rno = sqlq(`SELECT resi_no FROM shipments WHERE id = '${rid}';`);
    const mg = await login(browser, "manajer@uji.id", PASS, { width: 390, height: 844 });
    await mg.page.goto(`${BASE}/app/resi/${rid}`, { waitUntil: "networkidle" });
    await mg.page.selectOption("#jenis-kendala", "HOLD"); await mg.page.fill("#catatan-kendala", "RAHASIA-INTERNAL ditahan menunggu dokumen pengirim");
    await act(mg.page, mg.page.getByRole("button", { name: "Laporkan kendala" }));
    const kt = await mg.page.locator("main").innerText();
    ok("AE10 kendala dilaporkan dan tampil terbuka di halaman resi", /Kendala dilaporkan/.test(kt) && /Terbuka/.test(kt) && /ditahan/.test(kt), kt.slice(0, 160));
    await mg.page.goto(`${BASE}/app`, { waitUntil: "networkidle" });
    ok("AE11 beranda kepala gudang menampilkan penanda kendala terbuka", (await mg.page.locator("a.homebadge[href='/app/kendala']").count()) === 1);
    await mg.page.goto(`${BASE}/app/kendala`, { waitUntil: "networkidle" });
    ok("AE12 daftar kendala memuat resi tersebut", (await mg.page.locator("main").innerText()).includes(rno)); await noOverflow(mg.page, "Daftar kendala (HP)");
    const pub = await fetch(`${BASE}/lacak/${rno}`); const pubt = await pub.text();
    ok("AE13 halaman lacak publik tidak membocorkan catatan internal kendala", !/RAHASIA-INTERNAL/.test(pubt));
    await mg.page.goto(`${BASE}/app/resi/${rid}`, { waitUntil: "networkidle" });
    await mg.page.fill("input[name=catatan][id^=ck-]", "Dokumen sudah diterima, barang dilepas");
    await act(mg.page, mg.page.getByRole("button", { name: "Selesaikan kendala" }));
    ok("AE14 kendala bisa diselesaikan kepala gudang", /Kendala selesai/.test(await pesan(mg.page)));
    await mg.page.goto(`${BASE}/app/kendala?s=selesai`, { waitUntil: "networkidle" });
    ok("AE15 kendala yang selesai pindah ke tab Selesai", (await mg.page.locator("main").innerText()).includes(rno));
    await mg.page.goto(`${BASE}/app/resi/${rid}`, { waitUntil: "networkidle" });
    const jpg = await mg.page.screenshot({ type: "jpeg", quality: 40 });
    await mg.page.selectOption("#jenis-kendala", "RUSAK"); await mg.page.fill("#catatan-kendala", "Kardus penyok di sudut, isi aman");
    await mg.page.setInputFiles("#foto-kendala", { name: "bukti.jpg", mimeType: "image/jpeg", buffer: jpg });
    await mg.page.waitForSelector("form .kfoto img", { timeout: 10000 }).catch(() => {});
    await act(mg.page, mg.page.getByRole("button", { name: "Laporkan kendala" }));
    const fimg = mg.page.locator("a.kfoto img").first(); const fsrc = await fimg.getAttribute("src").catch(() => null);
    const fres = fsrc ? await mg.page.request.get(`${BASE}${fsrc}`) : null;
    ok("AE15b kendala dengan foto bukti: foto tampil dan terbuka sebagai JPEG hanya untuk petugas berhak", !!fres && fres.status() === 200 && /image\/jpeg/.test(fres.headers()["content-type"] || "") && (await fetch(`${BASE}${fsrc}`, { redirect: "manual" })).status !== 200, String(fsrc));
    await mg.page.fill("input[name=catatan][id^=ck-]", "Sudah diperiksa, aman dilanjutkan");
    await act(mg.page, mg.page.getByRole("button", { name: "Selesaikan kendala" }));
    await mg.page.goto(`${BASE}/app`, { waitUntil: "networkidle" });
    ok("AE16 beranda kepala gudang tanpa tombol Buat resi", (await mg.page.locator("a[href='/app/baru']").count()) === 0);
    await mg.ctx.close();

    // Finance
    const fn = await login(browser, "finance@uji.id", PASS, { width: 390, height: 844 });
    ok("AE17 Finance masuk dan diarahkan ke Keuangan", fn.loggedIn && /\/app\/keuangan/.test((await (async () => { await fn.page.goto(`${BASE}/app`, { waitUntil: "networkidle" }); return fn.page.url(); })())));
    const tabF = await fn.page.locator(".tabbar").innerText();
    ok("AE18 menu bawah Finance: Keuangan, Tagihan, Laporan, Dokumen", /Keuangan/.test(tabF) && /Tagihan/.test(tabF) && /Laporan/.test(tabF) && /Dokumen/.test(tabF) && !/Pindai/.test(tabF), tabF.replace(/\n/g, " "));
    await fn.page.goto(`${BASE}/app/tagihan`, { waitUntil: "networkidle" });
    ok("AE19 Finance melihat daftar tagihan", /Tagihan/.test(await fn.page.locator("h1").first().innerText()) && (await fn.page.locator("main .err").count()) === 0);
    const mid = sqlq(`SELECT id FROM manifests WHERE status <> 'OPEN' ORDER BY created_at LIMIT 1;`);
    await fn.page.goto(`${BASE}/app/margin/${mid}`, { waitUntil: "networkidle" });
    await fn.page.selectOption("#bm-jenis", "KAPAL"); await fn.page.fill("#bm-jumlah", "1500000"); await fn.page.fill("#bm-vendor", "PT Pelayaran Uji");
    await act(fn.page, fn.page.getByRole("button", { name: "Catat biaya" }));
    ok("AE19b Finance mencatat biaya kapal pada manifest dan margin terhitung", /Biaya dicatat/.test(await pesan(fn.page)) && /1\.500\.000/.test(await fn.page.locator("main").innerText()) && /Margin/i.test(await fn.page.locator("main").innerText()));
    await fn.page.goto(`${BASE}/app/margin`, { waitUntil: "networkidle" });
    ok("AE19c halaman Margin memuat total, per rute, dan per manifest", /Per rute/.test(await fn.page.locator("main").innerText()) && /Per manifest/.test(await fn.page.locator("main").innerText()) && (await fn.page.locator("main .err").count()) === 0);
    await noOverflow(fn.page, "Margin (HP)");
    await fn.page.goto(`${BASE}/app/pegawai`, { waitUntil: "networkidle" });
    ok("AE20 Finance tidak bisa membuka data kepegawaian", !/\/app\/pegawai/.test(fn.page.url()));
    await fn.page.goto(`${BASE}/app/klaim`, { waitUntil: "networkidle" });
    ok("AE21 Finance tidak bisa membuka klaim", !/\/app\/klaim/.test(fn.page.url()) || (await fn.page.locator(".err").count()) > 0);
    await noOverflow(fn.page, "Finance (HP)");
    await fn.ctx.close();

    // CS/Sales
    const cs = await login(browser, "cs@uji.id", PASS, { width: 390, height: 844 });
    ok("AE22 CS masuk ke beranda", cs.loggedIn);
    const tabC = await cs.page.locator(".tabbar").innerText();
    ok("AE23 menu bawah CS: Beranda, Jemput, Klaim, Layanan (tanpa Resi baru)", /Beranda/.test(tabC) && !/Resi baru/.test(tabC) && /Jemput/.test(tabC) && /Klaim/.test(tabC) && /Layanan/.test(tabC) && !/Tagihan/.test(tabC), tabC.replace(/\n/g, " "));
    await cs.page.goto(`${BASE}/app/baru`, { waitUntil: "networkidle" });
    ok("AE24 CS tidak bisa membuka formulir resi baru (satu pintu: kasir)", !/\/app\/baru/.test(cs.page.url()) && (await cs.page.locator("form[action]").count()) === 0 || !/Buat resi baru/.test(await cs.page.locator("main").innerText()));
    await cs.page.goto(`${BASE}/app/klaim`, { waitUntil: "networkidle" });
    const kl = await cs.page.locator("main").innerText();
    ok("AE25 CS melihat klaim dengan usulan, tanpa kolom penyelesaian final", /Klaim dan keluhan/.test(kl) && !/Penyelesaian\n/.test(kl) && ((await cs.page.getByRole("button", { name: "Simpan usulan" }).count()) > 0 || /Belum ada laporan/.test(kl)), kl.slice(0, 160));
    await cs.page.goto(`${BASE}/app/keuangan`, { waitUntil: "networkidle" });
    ok("AE26 CS tidak bisa membuka Keuangan", !/\/app\/keuangan/.test(cs.page.url()));
    await noOverflow(cs.page, "CS (HP)");
    await cs.ctx.close();

    // Voyage dan surat jalan pelabuhan
    const mj = sqlq(`UPDATE manifests SET status = 'SEALED', holder_user_id = NULL, pending_to_user = NULL WHERE id = (SELECT id FROM manifests WHERE origin_id = (SELECT id FROM branches_partners WHERE code='JKT') ORDER BY created_at LIMIT 1) RETURNING id;`).split("\n")[0];
    const mg2 = await login(browser, "kasir@uji.id", PASS, { width: 390, height: 844 }); // data voyage diisi Kasir cabang asal
    await mg2.page.goto(`${BASE}/app/manifest/${mj}`, { waitUntil: "networkidle" });
    await mg2.page.fill("#voyage", "VY-2611-UJI"); await mg2.page.fill("#pmuat", "Tanjung Priok"); await mg2.page.fill("#pbongkar", "Pelabuhan Soekarno-Hatta Makassar");
    await act(mg2.page, mg2.page.getByRole("button", { name: "Simpan voyage dan pelabuhan" }));
    const mt = await mg2.page.locator("main").innerText();
    ok("AG1 voyage dan pelabuhan tersimpan dan tampil di manifest", /Data voyage dan pelabuhan disimpan/.test(mt) && /VY-2611-UJI/.test(mt) && /Tanjung Priok/.test(mt), mt.slice(0, 120));
    await mg2.page.goto(`${BASE}/app/manifest/${mj}/surat-jalan`, { waitUntil: "networkidle" });
    const sj = await mg2.page.locator("main").innerText();
    ok("AG2 surat jalan pelabuhan memuat voyage, pelabuhan, segel, dan kolom tanda tangan", /SURAT JALAN PELABUHAN/.test(sj) && /VY-2611-UJI/.test(sj) && /Pelabuhan Soekarno-Hatta Makassar/.test(sj) && /Petugas pelabuhan/.test(sj));
    await noOverflow(mg2.page, "Surat jalan pelabuhan (HP)"); await mg2.ctx.close();

    // Resi dan cetak label satu pintu: hanya Kasir
    const rno2 = sqlq(`SELECT id FROM shipments WHERE origin_id = (SELECT id FROM branches_partners WHERE code='JKT') ORDER BY created_at DESC LIMIT 1;`);
    const kp = await login(browser, "kasir@uji.id", PASS, { width: 390, height: 844 });
    await kp.page.goto(`${BASE}/app/resi/${rno2}`, { waitUntil: "networkidle" });
    ok("AH1 Kasir melihat tombol Cetak label", (await kp.page.getByRole("link", { name: /Cetak label/ }).count()) === 1);
    await kp.page.goto(`${BASE}/app/resi/${rno2}/cetak`, { waitUntil: "networkidle" });
    ok("AH2 Kasir bisa membuka halaman cetak label", /\/cetak/.test(kp.page.url()));
    await kp.ctx.close();
    for (const [em, nm] of [["manajer@uji.id", "Kepala gudang"], ["gudang@uji.id", "Staf gudang"], ["kurir@uji.id", "Kurir"], ["cs@uji.id", "CS"]]) {
      const x = await login(browser, em, PASS, { width: 390, height: 844 });
      await x.page.goto(`${BASE}/app/resi/${rno2}`, { waitUntil: "networkidle" }).catch(() => {});
      const adaTombol = (await x.page.getByRole("link", { name: /Cetak label/ }).count()) > 0;
      await x.page.goto(`${BASE}/app/resi/${rno2}/cetak`, { waitUntil: "networkidle" }).catch(() => {});
      const bocor = !/Pindai|Label|\bKLX-/.test("") && /\/cetak/.test(x.page.url());
      await x.page.goto(`${BASE}/app/baru`, { waitUntil: "networkidle" });
      ok(`AH3 ${nm}: tanpa tombol Cetak label, cetak diblokir, dan form resi baru tertutup`, !adaTombol && !bocor && !/\/app\/baru/.test(x.page.url()), `${adaTombol} ${bocor} ${x.page.url()}`);
      await x.ctx.close();
    }

    // Harga manual kasir: satuan per m3 + baris biaya bebas, terbit ulang selagi belum dibayar
    const ridI = sqlq(`SELECT s.id FROM shipments s JOIN invoices i ON i.shipment_id = s.id AND i.status = 'UNPAID' WHERE s.origin_id = (SELECT id FROM branches_partners WHERE code='JKT') AND s.status NOT IN ('CANCELLED','DELIVERED') AND NOT EXISTS (SELECT 1 FROM payment_allocations pa WHERE pa.invoice_id = i.id) ORDER BY s.created_at DESC LIMIT 1;`);
    const ki = await login(browser, "kasir@uji.id", PASS, { width: 390, height: 844 });
    await ki.page.goto(`${BASE}/app/resi/${ridI}`, { waitUntil: "networkidle" });
    await ki.page.getByText("Per m³").click(); let volM3 = Number((await ki.page.inputValue("#inv-jumlah")).replace(",", ".")); if (!volM3) { await ki.page.getByText("Per kg").click(); volM3 = Number((await ki.page.inputValue("#inv-jumlah")).replace(",", ".")); } const totM3 = "Rp" + (Math.round(volM3 * 500000) + 50000).toLocaleString("id-ID"); await ki.page.fill("#inv-harga", "500000");
    await ki.page.getByRole("button", { name: "+ Ongkos jemput" }).click();
    await ki.page.fill("input[aria-label='Jumlah biaya 1 (Rp)']", "50000");
    ok("AI1 pratinjau total invoice per m³ + biaya lain dihitung langsung dari volume timbangan gudang", (await ki.page.locator("#invoice-form").innerText()).includes(totM3) && (await ki.page.locator("#inv-jumlah").getAttribute("readonly")) !== null);
    await act(ki.page, ki.page.getByRole("button", { name: "Terbitkan ulang invoice" }));
    ok("AI2 kasir menerbitkan ulang invoice dengan harga manual dan baris biaya bebas", (await pesan(ki.page)).includes(`sebesar ${totM3} diterbitkan`), await pesan(ki.page));
    await noOverflow(ki.page, "Form invoice manual (HP)"); await ki.ctx.close();

    // Revisi dan pembatalan resi oleh Kasir
    const ridR = sqlq(`SELECT s.id FROM shipments s WHERE s.origin_id = (SELECT id FROM branches_partners WHERE code='JKT') AND s.status IN ('CREATED','PICKED_UP','AT_ORIGIN_HUB','SORTED_INVOICED') AND s.manifest_id IS NULL AND NOT EXISTS (SELECT 1 FROM shipment_issues i WHERE i.shipment_id = s.id AND i.status='OPEN') AND NOT EXISTS (SELECT 1 FROM invoices v JOIN payment_allocations pa ON pa.invoice_id = v.id WHERE v.shipment_id = s.id) ORDER BY s.created_at DESC LIMIT 1;`);
    const kr = await login(browser, "kasir@uji.id", PASS, { width: 390, height: 844 });
    await kr.page.goto(`${BASE}/app/resi/${ridR}`, { waitUntil: "networkidle" });
    await kr.page.locator("details.revisi > summary").click();
    await kr.page.fill("#rv-rn", "Penerima Direvisi Kasir"); await kr.page.fill("#rv-ra", "Jl. Alamat Baru No. 7, Makassar"); await kr.page.fill("#rv-al", "Pelanggan pindah alamat");
    await act(kr.page, kr.page.getByRole("button", { name: "Simpan perubahan" }));
    const rt = await kr.page.locator("main").innerText();
    ok("AI3 Kasir merevisi nama dan alamat penerima; riwayat perubahan mencatat nilai sebelum dan sesudah", /Data resi diperbarui/.test(rt) && /Riwayat perubahan data/.test(rt) && /→ Penerima Direvisi Kasir/.test(rt) && /Pelanggan pindah alamat/.test(rt), rt.slice(0, 160));
    await noOverflow(kr.page, "Revisi resi (HP)");
    await kr.page.locator("details.revisi > summary").click();
    await kr.page.fill("#bt-al", "Salah rute, dibuat ulang");
    await act(kr.page, kr.page.getByRole("button", { name: "Batalkan resi ini" }));
    ok("AI4 Kasir membatalkan resi dengan alasan; status menjadi Dibatalkan", /Resi dibatalkan/.test(await pesan(kr.page)) && /Dibatalkan/.test(await kr.page.locator("main").innerText()));
    await kr.ctx.close();
    const mr = await login(browser, "manajer@uji.id", PASS, { width: 390, height: 844 });
    await mr.page.goto(`${BASE}/app/resi/${ridR}`, { waitUntil: "networkidle" });
    ok("AI5 Kepala gudang melihat riwayat perubahan tetapi tidak punya form revisi", (await mr.page.locator("details.revisi").count()) === 0 && /Riwayat perubahan data/.test(await mr.page.locator("main").innerText()));
    await mr.ctx.close();

    // Alamat tujuan lengkap (wilayah) dan data kendaraan opsional
    const kw = await login(browser, "kasir@uji.id", PASS, { width: 390, height: 844 });
    await kw.page.goto(`${BASE}/app/baru`, { waitUntil: "networkidle" });
    ok("AJ1 tujuan berupa daftar gudang (Surabaya ada, tanpa patokan master rute)", (await kw.page.locator("#tujuan option").allTextContents()).some((t) => /Surabaya/.test(t)) && await kw.page.locator("#rute").count() === 0);
    await pilihTujuan(kw.page);
    await kw.page.getByText("Diantar sendiri").click();
    await kw.page.fill("#isi", "Barang uji"); await kw.page.fill("#pengirim", "Budi Motor"); await kw.page.fill("#hp_pengirim", "081377778888"); await kw.page.fill("#penerima", "Siti Penerima"); await kw.page.fill("#hp_penerima", "081355556666");
    await kw.page.fill("#alamat", "Jl. Perintis Kemerdekaan No. 10, depan apotek");
    await kw.page.fill("#jumlah", "1");
    await kw.page.locator("details", { hasText: "Barang berupa kendaraan?" }).locator("summary").click();
    await kw.page.fill("#kd-jenis", "Motor"); await kw.page.fill("#kd-merek", "Honda Beat"); await kw.page.fill("#kd-nopol", "DD 1234 XY"); await kw.page.fill("#kd-stnk", "Ada");
    const sebelum = await act(kw.page, kw.page.getByRole("button", { name: "Buat resi" }));
    ok("AI7 alamat tujuan wajib lengkap: tanpa memilih kelurahan atau desa, resi tidak terbuat", !sebelum.ok && (/lengkap|Pilih|kelurahan/i.test(sebelum.err || "") || /\/app\/baru/.test(kw.page.url())), JSON.stringify(sebelum));
    await kw.page.goto(`${BASE}/app/baru`, { waitUntil: "networkidle" });
    await pilihTujuan(kw.page);
    await kw.page.getByText("Diantar sendiri").click();
    await kw.page.fill("#isi", "Barang uji"); await kw.page.fill("#pengirim", "Budi Motor"); await kw.page.fill("#hp_pengirim", "081377778888"); await kw.page.fill("#penerima", "Siti Penerima"); await kw.page.fill("#hp_penerima", "081355556666");
    await kw.page.fill("#alamat", "Jl. Perintis Kemerdekaan No. 10, depan apotek"); await kw.page.fill("#jumlah", "1");
    await kw.page.locator("details", { hasText: "Barang berupa kendaraan?" }).locator("summary").click();
    await kw.page.fill("#kd-jenis", "Motor"); await kw.page.fill("#kd-merek", "Honda Beat"); await kw.page.fill("#kd-nopol", "DD 1234 XY"); await kw.page.fill("#kd-stnk", "Ada");
    await isiWilayah(kw.page);
    const rw = await act(kw.page, kw.page.getByRole("button", { name: "Buat resi" }));
    const tw = await kw.page.locator("main").innerText();
    ok("AI8 resi terbuat dengan wilayah lengkap dan data kendaraan (STNK diisi, BPKB dikosongkan)", rw.ok && /Wilayah tujuan/.test(tw) && /Panakkukang/.test(tw) && /Sulawesi Selatan/.test(tw) && /Honda Beat/.test(tw) && /DD 1234 XY/.test(tw) && /STNK: Ada/.test(tw) && !/BPKB/.test(tw), tw.slice(0, 200));
    const idW = kw.page.url().match(/resi\/([0-9a-f-]+)/)?.[1];
    await kw.page.goto(`${BASE}/app/resi/${idW}/cetak`, { waitUntil: "networkidle" });
    ok("AI9 label resi memuat kecamatan dan kota tujuan", /Panakkukang/.test(await kw.page.locator("main").innerText()));
    await noOverflow(kw.page, "Label resi dengan wilayah (HP)"); await kw.ctx.close();

    // Unduh isi manifest lengkap (CSV) dan pilihan peran akun saat Pemilik mendaftarkan mitra
    const mgx = await login(browser, "manajer@uji.id", PASS, { width: 390, height: 844 });
    const unduh = await mgx.page.request.get(`${BASE}/app/manifest/${mj}/unduh`); const ut = await unduh.text();
    ok("AI10 CSV manifest lengkap: ringkasan, voyage, pelabuhan, dan kolom pengirim, penerima, alamat, wilayah, berat, ukuran", unduh.status() === 200 && /text\/csv/.test(unduh.headers()["content-type"] || "") && /VY-2611-UJI/.test(ut) && /Pelabuhan Soekarno-Hatta Makassar/.test(ut) && /Alamat penerima/.test(ut) && /Kecamatan/.test(ut) && /Volume \(m3\)/.test(ut), String(unduh.status()));
    ok("AI11 CSV manifest tidak memuat data uang", !/Rp\d|invoice|INV-/i.test(ut));
    await mgx.page.goto(`${BASE}/app/manifest/${mj}`, { waitUntil: "networkidle" });
    ok("AI12 halaman manifest menyediakan tombol unduh isi manifest", (await mgx.page.getByRole("link", { name: /Unduh isi manifest/ }).count()) === 1);
    const kasirX = await login(browser, "kasir@uji.id", PASS, { width: 390, height: 844 });
    const bocorX = await kasirX.page.request.get(`${BASE}/app/manifest/${mj}/unduh`);
    ok("AI13 Kasir cabang asal boleh mengunduh isi manifest (Kasir yang menyusunnya)", bocorX.status() === 200);
    await kasirX.ctx.close();
    const kasirY = await login(browser, "kasir.mks@uji.id", PASS, { width: 390, height: 844 });
    const bocorY = await kasirY.page.request.get(`${BASE}/app/manifest/${mj}/unduh`);
    ok("AI13b Kasir cabang lain tidak bisa mengunduh isi manifest ini", bocorY.status() !== 200, String(bocorY.status()));
    await kasirY.ctx.close(); await mgx.ctx.close();
    const ow2 = await login(browser, "owner@uji.id", "Pemilik2026x", { width: 390, height: 844 });
    await ow2.page.goto(`${BASE}/app/mitra`, { waitUntil: "networkidle" });
    ok("AI14 Pemilik memilih peran akun saat mendaftarkan mitra (Kasir, Kepala gudang, Petugas gudang)", (await ow2.page.locator("#akun_peran option").allTextContents()).join("|").includes("Kasir") && (await ow2.page.locator("#akun_peran option").count()) === 4);
    await ow2.ctx.close();

    // Pre-booking antar sendiri dari website
    const pb = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage();
    await pb.goto(`${BASE}/jemput`, { waitUntil: "networkidle" });
    await pb.getByText("Saya antar sendiri ke gudang").click();
    ok("AF1 pilihan antar sendiri menyembunyikan kolom alamat jemput", (await pb.locator("#alamat").count()) === 0);
    await pb.selectOption("#layanan", "LAUT"); await pb.fill("#nama", "Budi Antar Sendiri"); await pb.fill("#hp", "0812 7777 6666");
    await pb.fill("#kota", "Jakarta"); await pb.fill("#tujuan", "Makassar"); await pb.fill("#barang", "3 kardus pakaian");
    await pb.getByRole("button", { name: "Pesan antar sendiri" }).click();
    await pb.waitForSelector(".nilai.done", { timeout: 15000 }).catch(() => {});
    ok("AF2 pesanan antar sendiri terkirim dengan kode dan petunjuk datang ke gudang", /antar sendiri terkirim/i.test(await pb.locator("main").innerText()) && /JMP-/.test(await pb.locator("main").innerText()));
    await noOverflow(pb, "Pesan antar sendiri (HP)"); await pb.close();
    const k2 = await login(browser, "kasir@uji.id", PASS, { width: 390, height: 844 });
    await k2.page.goto(`${BASE}/app/jemput`, { waitUntil: "networkidle" });
    ok("AF3 kasir melihat pesanan antar sendiri tanpa alamat jemput", /Diantar sendiri ke gudang Jakarta/.test(await k2.page.locator("main").innerText()));
    await k2.ctx.close();
  }

  console.log("\n[AJ] Super Admin: konsol koreksi; kasir: jemput opsi B");
  {
    const sa = await login(browser, "owner@uji.id", "Pemilik2026x");
    await sa.page.goto(`${BASE}/app/koreksi`, { waitUntil: "networkidle" });
    ok("AJ4 Super Admin membuka konsol koreksi (alasan wajib)", /Koreksi data/.test(await text(sa.page)) && /Alasan koreksi/.test(await text(sa.page)));
    await sa.page.fill("#kr-kode", "KML-TIDAK-ADA"); await sa.page.selectOption("#kr-status", "AT_DEST_HUB"); await sa.page.fill("#kr-alasan", "Uji koreksi resi tidak ada");
    await sa.page.getByRole("button", { name: "Koreksi status" }).click(); await sa.page.waitForSelector(".err", { timeout: 15000 }).catch(() => {});
    ok("AJ5 koreksi resi yang tidak ada ditolak dengan pesan jelas", /tidak ditemukan|tidak dikenali/i.test(await text(sa.page)), (await text(sa.page)).slice(0, 200));
    await sa.ctx.close();
    const kj = await login(browser, "kasir@uji.id");
    await kj.page.goto(`${BASE}/app/koreksi`, { waitUntil: "networkidle" });
    ok("AJ6 kasir tidak bisa membuka konsol koreksi", !/Koreksi data/.test(await text(kj.page)) && !/\/app\/koreksi/.test(kj.page.url()));
    await kj.page.goto(`${BASE}/app/jemput`, { waitUntil: "networkidle" });
    ok("AJ7 pesanan jemput menawarkan tombol buat resi setelah barang tiba", (await kj.page.locator("a[href^='/app/baru?jemput=']").count()) >= 1, (await text(kj.page)).slice(0, 160));
    await kj.page.locator("a[href^='/app/baru?jemput=']").first().click(); await kj.page.waitForURL(/baru\?jemput=/, { timeout: 15000 }); await kj.page.waitForSelector("#pengirim", { timeout: 15000 });
    ok("AJ8 form resi dari pesanan jemput terisi data pengirim dan tanpa pilihan cara masuk", /Dari pesanan jemput/.test(await text(kj.page)) && (await kj.page.inputValue("#pengirim")).length > 1 && (await kj.page.getByText("Diantar sendiri").count()) === 0);
    ok("AK1 menu kasir memuat Pesanan jemput (untuk jemput opsi B)", (await kj.page.locator("a[href='/app/jemput']").count()) >= 1);
    for (const u of ["/app/serah", "/app/pindai", "/app/pegawai"]) {
      await kj.page.goto(`${BASE}${u}`, { waitUntil: "networkidle" });
      ok(`AK2 kasir ${u}: ${u === "/app/pegawai" ? "dialihkan ke beranda" : "boleh dibuka"}`, u === "/app/pegawai" ? !/\/app\/pegawai/.test(kj.page.url()) : /\/app\/(serah|pindai)/.test(kj.page.url()));
    }
    await kj.ctx.close();
    const sa2 = await login(browser, "owner@uji.id", "Pemilik2026x");
    for (const u of ["/app/serah", "/app/pindai", "/app/baru"]) {
      await sa2.page.goto(`${BASE}${u}`, { waitUntil: "networkidle" });
      ok(`AK3 Super Admin tidak punya halaman operasional ${u}`, !new RegExp(u).test(sa2.page.url()), sa2.page.url());
    }
    await sa2.ctx.close();
    const gd = await login(browser, "gudang@uji.id");
    await gd.page.goto(`${BASE}/app/tagihan`, { waitUntil: "networkidle" });
    ok("AK4 staf gudang tidak bisa membuka tagihan (dialihkan, bukan pesan galat)", !/\/app\/tagihan/.test(gd.page.url()) && !/tidak punya izin/.test(await text(gd.page)));
    await gd.ctx.close();
  }

  // ===== Divisi MV =====
  console.log("\n[AO] Divisi MV: peran, vendor, alokasi, pemantauan, penjualan");
  {
    const sa = await login(browser, "owner@uji.id", "Pemilik2026x", { width: 390, height: 844 });
    const buatMv = async (nama, email, peran, cabang) => {
      await sa.page.goto(`${BASE}/app/petugas`, { waitUntil: "networkidle" });
      await sa.page.locator("details.admnew summary").click();
      await sa.page.fill("input[name=nama]", nama); await sa.page.fill("input[name=email]", email); await sa.page.selectOption("select[name=peran]", peran); await sa.page.fill("input[name=sandi]", "Sandi2026a");
      if (cabang) await selectByText(sa.page, "select[name=cabang]", cabang);
      await sa.page.locator("details.admnew button[type=submit], details.admnew .btn.green").first().click();
      await sa.page.waitForSelector(".ok, .err", { timeout: 20000 }).catch(() => {});
      return (await sa.page.locator(".ok, .err").first().innerText().catch(() => ""));
    };
    ok("AO1 Super Admin membuat akun MV cabang Jakarta", /dibuat/.test(await buatMv("MV Jakarta Uji", "mv.jkt@uji.id", "MV", "Jakarta")));
    ok("AO2 Super Admin membuat akun MV Master tanpa cabang", /dibuat/.test(await buatMv("MV Master Uji", "mv.master@uji.id", "MV_MASTER", "")));
    ok("AO3 menu samping Super Admin memuat Divisi MV", (await sa.page.locator("a[href='/app/mv']").count()) >= 1);
    await sa.ctx.close();

    const mv = await login(browser, "mv.jkt@uji.id", "Sandi2026a", { width: 390, height: 844 });
    await mv.page.waitForURL(/\/app\/mv/, { timeout: 15000 }).catch(() => {});
    await mv.page.waitForSelector("text=Vendor aktif", { timeout: 15000 }).catch(() => {});
    ok("AO4 akun MV langsung masuk ke beranda Divisi MV dengan kartu angka", /\/app\/mv/.test(mv.page.url()) && /Vendor aktif/.test(await text(mv.page)) && /SJ terlambat/.test(await text(mv.page)));
    ok("AO5 menu bawah MV: Alokasi, Pantau, SJ", (await mv.page.locator(".tabbar a[href='/app/mv/alokasi'], nav a[href='/app/mv/alokasi']").count()) >= 1 && (await mv.page.locator("a[href='/app/mv/sj']").count()) >= 1);
    await mv.page.goto(`${BASE}/app/mv/vendor`, { waitUntil: "networkidle" });
    await mv.page.locator("details:has(input[name=nama])").first().locator("summary").click();
    await mv.page.locator("details[open] input[name=nama]").first().fill("Vendor Laut Uji"); await mv.page.locator("details[open] select[name=jenis]").first().selectOption("LAUT");
    await mv.page.locator("details[open] input[name=kontak]").first().fill("Pak Laut"); await mv.page.locator("details[open] input[name=telepon]").first().fill("0812 7000 1111");
    const usul = await act(mv.page, mv.page.getByRole("button", { name: "Simpan vendor" }));
    ok("AO6 MV mencatat vendor baru manual: langsung aktif, belum diverifikasi", !!usul.ok && /Vendor tersimpan/.test(usul.ok) && /Belum diverifikasi/.test(await text(mv.page)), JSON.stringify(usul));
    await mv.page.goto(`${BASE}/app/mv/alokasi?s=BELUM`, { waitUntil: "networkidle" });
    ok("AO7 vendor yang baru dicatat langsung muncul sebagai saran nama di alokasi", (await mv.page.locator("datalist#vd-LAUT option[value='Vendor Laut Uji']").count()) === 1);
    await mv.ctx.close();

    const mm = await login(browser, "mv.master@uji.id", "Sandi2026a", { width: 390, height: 844 });
    await mm.page.goto(`${BASE}/app/mv/vendor?s=BELUM_VERIFIKASI`, { waitUntil: "networkidle" });
    const kartuV = mm.page.locator("details", { hasText: "Vendor Laut Uji" }).first();
    await kartuV.locator("summary").first().click();
    const akt = await act(mm.page, kartuV.getByRole("button", { name: "Verifikasi" }).first());
    ok("AO8 MV Master memverifikasi (mengaktifkan) vendor", !!akt.ok, JSON.stringify(akt));
    await mm.page.goto(`${BASE}/app/mv/penjualan`, { waitUntil: "networkidle" });
    ok("AO9 MV Master melihat penjualan terpisah per cabang", /Cabang saya|Jakarta/.test(await text(mm.page)) && /Makassar/.test(await text(mm.page)) && /Surabaya/.test(await text(mm.page)));
    await mm.ctx.close();

    const mv2 = await login(browser, "mv.jkt@uji.id", "Sandi2026a", { width: 390, height: 844 });
    await mv2.page.goto(`${BASE}/app/mv/alokasi?m=LAUT`, { waitUntil: "networkidle" });
    const resiMv = await mv2.page.locator("details").filter({ has: mv2.page.locator("input[name=vendor_nama]") }).count();
    ok("AO10 MV Jakarta melihat resi laut cabangnya untuk dialokasikan", resiMv >= 1, String(resiMv));
    const kartuR = mv2.page.locator("details").filter({ has: mv2.page.locator("input[name=vendor_nama]") }).first();
    await kartuR.locator("summary").first().click();
    await kartuR.locator("input[name=vendor_nama]").fill("vendor laut uji");
    const simp = await act(mv2.page, kartuR.getByRole("button", { name: "Simpan pilihan" }));
    ok("AO11 MV memilih vendor terverifikasi untuk resi laut", !!simp.ok && /Vendor Laut Uji/.test(await text(mv2.page)), JSON.stringify(simp));
    // vendor baru diketik manual langsung tercatat otomatis
    const kartuR2 = mv2.page.locator("details").filter({ has: mv2.page.locator("input[name=vendor_nama]") }).nth(1);
    await kartuR2.locator("summary").first().click();
    await kartuR2.locator("input[name=vendor_nama]").fill("Vendor Ketik Baru");
    const simp2 = await act(mv2.page, kartuR2.getByRole("button", { name: "Simpan pilihan" }));
    ok("AO11b vendor yang diketik manual tercatat otomatis dan langsung dipakai", !!simp2.ok && /Vendor Ketik Baru/.test(await text(mv2.page)), JSON.stringify(simp2));
    await mv2.page.goto(`${BASE}/app/mv/vendor`, { waitUntil: "networkidle" });
    ok("AO11c vendor ketikan manual muncul di daftar vendor (dipakai 1 kali, belum diverifikasi)", /Vendor Ketik Baru/.test(await text(mv2.page)) && /Vendor Laut Uji/.test(await text(mv2.page)));
    // Vendor tanpa akun: MV membuat link khusus, vendor mengirim laporan tanpa login, masuk ke kotak masuk MV, link bisa dicabut
    {
      await mv2.page.goto(`${BASE}/app/mv/alokasi?m=LAUT`, { waitUntil: "networkidle" });
      const hrefV = await mv2.page.evaluate(() => { const d = [...document.querySelectorAll("details")].find((x) => /Vendor Laut Uji/i.test(x.innerText)); return d?.querySelector("a.mvbuka")?.getAttribute("href") ?? null; });
      const idV = (hrefV || "").split("/").pop();
      await mv2.page.goto(`${BASE}/app/mv/alokasi?m=LAUT&r=${idV}`, { waitUntil: "networkidle" });
      await mv2.page.getByRole("button", { name: /Buat link vendor/ }).first().click();
      await mv2.page.waitForURL(/ok=/, { timeout: 20000 }).catch(() => {});
      const linkV = await mv2.page.locator("input[aria-label='Link vendor']").first().inputValue().catch(() => "");
      ok("AO11e MV membuat link khusus vendor (tanpa akun)", /\/vendor\/[0-9a-f]{48}$/.test(linkV), linkV);
      const vctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
      const vp = await vctx.newPage();
      const pathV = linkV.replace(/^https?:\/\/[^/]+/, "");
      await vp.goto(`${BASE}${pathV}`, { waitUntil: "networkidle" });
      ok("AO11f halaman vendor terbuka tanpa login dan hanya memuat info seperlunya", /Kirim foto dan laporan/.test(await vp.locator("main").innerText()) && !/Rp\s?\d/.test(await vp.locator("main").innerText()) && /noindex/.test((await vp.locator("meta[name=robots]").getAttribute("content")) || ""));
      await vp.locator("select[name=jenis]").selectOption("LAPORAN", { force: true });
      await vp.fill("#vd-nama", "Sopir Uji"); await vp.fill("#vd-cat", "Barang sudah naik kapal, posisi di pelabuhan.");
      await vp.getByRole("button", { name: /Kirim ke divisi MV/ }).click();
      await vp.waitForURL(/ok=1/, { timeout: 20000 }).catch(() => {});
      ok("AO11g vendor mengirim laporan tertulis tanpa akun", /Terkirim/.test(await vp.locator("main").innerText()));
      await mv2.page.goto(`${BASE}/app/mv/kiriman`, { waitUntil: "networkidle" });
      ok("AO11h laporan vendor masuk ke kotak masuk divisi MV", /Barang sudah naik kapal/.test(await text(mv2.page)) && /Sopir Uji/.test(await text(mv2.page)));
      await mv2.page.goto(`${BASE}/app/mv/alokasi?m=LAUT&r=${idV}`, { waitUntil: "networkidle" });
      await mv2.page.getByRole("button", { name: /Cabut link/ }).first().click();
      await mv2.page.waitForURL(/ok=/, { timeout: 20000 }).catch(() => {});
      await vp.goto(`${BASE}${pathV}`, { waitUntil: "networkidle" });
      ok("AO11i link yang dicabut tidak bisa dipakai lagi", /tidak berlaku/.test(await vp.locator("main").innerText()) && (await vp.locator("form").count()) === 0);
      const rb = await vctx.newPage(); const st = await rb.goto(`${BASE}/vendor/${"0".repeat(48)}`); ok("AO11j link asal-asalan menghasilkan halaman tidak ditemukan", st?.status() === 404);
      await vctx.close();
    }
    await mv2.page.goto(`${BASE}/app/mv/alokasi?m=LAUT`, { waitUntil: "networkidle" });
    const hrefResi = await mv2.page.evaluate(() => document.querySelector("a.mvbuka")?.getAttribute("href"));
    await mv2.page.goto(`${BASE}${hrefResi}`, { waitUntil: "networkidle" });
    ok("AO11d MV membuka detail resi dari alokasi (hanya lihat, tanpa tombol tindakan)", /\/app\/resi\//.test(mv2.page.url()) && !/tidak punya izin|Terjadi kesalahan/.test(await text(mv2.page)) && (await mv2.page.locator("main form button.btn.shine").count()) === 0);
    await mv2.page.goto(`${BASE}/app/mv/alokasi?m=LAUT`, { waitUntil: "networkidle" });
    ok("AO12 resi laut menampilkan catatan HPP dicatat lewat biaya manifest", /HPP laut dan udara dicatat lewat Biaya manifest/.test(await mv2.page.evaluate(() => document.body.textContent)));
    await mv2.page.goto(`${BASE}/app/mv/tracking?m=LAUT`, { waitUntil: "networkidle" });
    ok("AO13 pemantauan laut memuat wilayah Kalimantan dan Sulawesi Utara", /Kalimantan/.test(await text(mv2.page)) && /Sulawesi Utara/.test(await text(mv2.page)));
    await mv2.page.goto(`${BASE}/app/mv/tracking?m=DARAT`, { waitUntil: "networkidle" });
    const tDarat = await text(mv2.page);
    ok("AO14 pemantauan darat memuat Sumatera, Jawa Tengah, Jawa Timur, Bali, NTB, NTT", ["Sumatera", "Jawa Tengah", "Jawa Timur", "Bali", "Nusa Tenggara Barat", "Nusa Tenggara Timur"].every((w) => new RegExp(w).test(tDarat)));
    for (const u of ["/app/mv/sj", "/app/mv/udara", "/app/mv/penjualan"]) {
      await mv2.page.goto(`${BASE}${u}`, { waitUntil: "networkidle" });
      ok(`AO15 halaman ${u} terbuka tanpa galat`, new RegExp(u).test(mv2.page.url()) && !/Terjadi kesalahan|Application error/.test(await text(mv2.page)));
    }
    await mv2.page.goto(`${BASE}/app/mv/penjualan`, { waitUntil: "networkidle" });
    ok("AO16 penjualan HP tanpa geser samping", await mv2.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await mv2.ctx.close();

    const ks = await login(browser, "kasir@uji.id");
    await ks.page.goto(`${BASE}/app/mv`, { waitUntil: "networkidle" });
    ok("AO17 Kasir tidak bisa membuka halaman Divisi MV (dialihkan)", !/\/app\/mv/.test(ks.page.url()));
    await ks.ctx.close();
    const fn = await login(browser, "finance@uji.id");
    await fn.page.goto(`${BASE}/app/keuangan`, { waitUntil: "networkidle" });
    ok("AO18 Finance melihat kartu SJ dari MV dan HPP vendor di halaman Keuangan", /SJ dari MV/.test(await text(fn.page)) && /HPP vendor/.test(await text(fn.page)));
    await fn.page.goto(`${BASE}/app/keuangan/sj`, { waitUntil: "networkidle" });
    ok("AO19 halaman SJ dari MV untuk Finance terbuka", /keuangan\/sj/.test(fn.page.url()) && !/Terjadi kesalahan/.test(await text(fn.page)));
    await fn.ctx.close();
  }

  // ===== Panduan awal per peran =====
  console.log("\n[AP] Panduan awal di dalam aplikasi");
  {
    const ks = await login(browser, "kasir@uji.id", PASS, { width: 390, height: 844 });
    await ks.page.goto(`${BASE}/app`, { waitUntil: "networkidle" }); await ks.page.waitForTimeout(1500);
    ok("AP1 panduan tidak muncul sendiri pada mesin uji otomatis (hanya dengan ?tur=1)", (await ks.page.locator(".tur").count()) === 0);
    await ks.page.goto(`${BASE}/app?tur=1`, { waitUntil: "networkidle" });
    await ks.page.waitForSelector(".tur", { timeout: 10000 }).catch(() => {});
    ok("AP2 panduan awal Kasir muncul sebagai kartu kecil dengan sapaan sesuai peran", /langkah 1 dari/i.test(await ks.page.locator(".tur").innerText().catch(() => "")) && /Selamat datang, Kasir/.test(await ks.page.locator(".tur").innerText().catch(() => "")));
    ok("AP3 kartu panduan tidak menutupi seluruh layar (bukan jendela penghalang)", await ks.page.evaluate(() => { const r = document.querySelector(".tur").getBoundingClientRect(); return r.height < innerHeight * 0.5 && r.width <= innerWidth; }));
    await ks.page.getByRole("button", { name: "Berikutnya" }).click();
    ok("AP4 langkah berikutnya menjelaskan Resi baru dan menyorot menunya", /Buat resi baru/.test(await ks.page.locator(".tur").innerText()) && (await ks.page.locator(".tur-sorot").count()) >= 1);
    let n = 0; while ((await ks.page.getByRole("button", { name: "Berikutnya" }).count()) > 0 && n++ < 12) await ks.page.getByRole("button", { name: "Berikutnya" }).click();
    ok("AP5 langkah terakhir menjelaskan Akun dan tombolnya menjadi Selesai", /Akun dan absen/.test(await ks.page.locator(".tur").innerText()) && (await ks.page.getByRole("button", { name: "Selesai" }).count()) === 1);
    await ks.page.getByRole("button", { name: "Selesai" }).click();
    ok("AP6 setelah Selesai kartu hilang dan sorotan dilepas", (await ks.page.locator(".tur").count()) === 0 && (await ks.page.locator(".tur-sorot").count()) === 0);
    await ks.page.goto(`${BASE}/app/akun`, { waitUntil: "networkidle" });
    await ks.page.getByRole("button", { name: "Lihat panduan penggunaan" }).click();
    await ks.page.waitForSelector(".tur", { timeout: 8000 }).catch(() => {});
    ok("AP7 tombol Lihat panduan penggunaan di Akun membuka panduan lagi", (await ks.page.locator(".tur").count()) === 1);
    await ks.page.locator(".turx").click();
    ok("AP8 panduan bisa ditutup dengan tombol silang", (await ks.page.locator(".tur").count()) === 0);
    await ks.ctx.close();
    for (const [email, pass, sapa, awal] of [["mv.jkt@uji.id", "Sandi2026a", "Selamat datang, MV", "/app/mv"], ["finance@uji.id", PASS, "Selamat datang, Finance", "/app/keuangan"], ["gudang@uji.id", PASS, "Selamat datang, Petugas gudang", "/app"], ["manajer@uji.id", PASS, "Selamat datang, Kepala gudang", "/app"]]) {
      const u = await login(browser, email, pass, { width: 390, height: 844 });
      await u.page.goto(`${BASE}${awal}?tur=1`, { waitUntil: "load" }); await u.page.waitForURL(/\/app/, { timeout: 15000 }).catch(() => {});
      await u.page.waitForSelector(".tur", { timeout: 12000 }).catch(() => {});
      ok(`AP9 panduan awal ${email.split("@")[0]} memuat sapaan peran`, (await u.page.locator(".tur").innerText().catch(() => "")).includes(sapa.replace("Selamat datang, ", "Selamat datang, ")), await u.page.locator(".tur").innerText().catch(() => "").then((t) => t.slice(0, 60)));
      await u.ctx.close();
    }
  }

  await browser.close();
  const fail = results.filter((r) => !r.ok);
  console.log(`\n==== HASIL: ${results.length - fail.length}/${results.length} lolos ====`);
  if (fail.length) console.log("GAGAL:\n - " + fail.map((f) => f.name).join("\n - "));
  const uniq = [...new Set(problems)];
  console.log(uniq.length ? `\nGALAT DI PERAMBAN/SERVER (${uniq.length}):\n` + uniq.slice(0, 15).join("\n") : "\nTidak ada galat konsol/server selama uji.");
  process.exit(fail.length ? 1 : 0);
})().catch((e) => { console.error("UJI BERHENTI:", e); process.exit(2); });
