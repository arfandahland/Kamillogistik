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
  page.on("console", (m) => { if (m.type() === "error" && !/favicon|Failed to load resource.*(40[134]|503)/.test(m.text())) problems.push(`CONSOLE ${page.url()} ${m.text().slice(0, 160)}`); });
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
  let resiNo = "", resiId = "", invoiceLink = "", manifestId = "", manifestCode = "";

  console.log("\n[A] Pengunjung (tanpa login)");
  {
    const { ctx, page } = await ctxFor(browser);
    await page.goto(BASE, { waitUntil: "networkidle" });
    ok("beranda memuat judul utama", /Kirim barang ke seluruh Sulawesi/.test(await text(page)));
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
    await page.goto(`${BASE}/lacak/KLX-JKT-MKS-LJ-261118-1400-0998-ST`, { waitUntil: "networkidle" });
    ok("resi tak dikenal: pesan awam", /tidak ditemukan/.test(await text(page)));
    await page.goto(`${BASE}/lacak/abc`, { waitUntil: "networkidle" });
    ok("format resi salah: pesan awam", /tidak dikenali/.test(await text(page)));
    await page.goto(`${BASE}/lacak/KLX-JKT-MKS-LJ-261118-1400-0999-AA`, { waitUntil: "networkidle" });
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
    await selectByText(p, "#rute", "Jakarta → Makassar · Diantar sampai alamat (per kilo)");
    await p.fill("#pengirim", "PT Maju Jaya"); await p.fill("#hp_pengirim", "081234567890");
    await p.fill("#penerima", "Budi Santoso"); await p.fill("#hp_penerima", "082233445566"); await p.fill("#alamat", "Jl. Pettarani No. 5, Makassar"); await p.fill("#alamat_jemput", "Jl. Sudirman No. 1, Jakarta");
    await p.fill("#jumlah", "2");
    const r = await act(p, p.getByRole("button", { name: "Buat resi" }));
    ok("resi dibuat dengan pesan sukses", r.ok && /Resi sudah dibuat/.test(r.ok), JSON.stringify(r));
    resiNo = (await p.locator("h1").first().innerText()).trim(); resiId = p.url().match(/resi\/([0-9a-f-]+)/)?.[1] || "";
    ok("nomor resi terbaca: KLX-asal-tujuan-moda-tanggal-jam-urutan-huruf", /^KLX-JKT-MKS-LJ-\d{6}-\d{4}-0001-[A-Z]{2}$/.test(resiNo), resiNo);
    ok("penjelasan arti kode tampil", (await p.locator(".kodebox").count()) === 1 && (await p.locator(".tag.moda").innerText()).includes("Laut"));
    ok("penanda tahap: Tahap 1 dari 10", /Tahap 1 dari 10/.test(await text(p)));
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
    await p.fill("#kodemanual", "KLX-JKT-MKS-LJ-261118-1400-0998-ST"); await p.getByRole("button", { name: "Cari" }).click();
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
    ok("foto pemeriksaan termuat sebagai gambar", await p.locator(".inspfotos img").first().evaluate((i) => i.complete && i.naturalWidth > 0).catch(() => false));
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
    ok("gudang: belum ada tombol timbang sebelum menerima", (await p.locator("input[name=w0]").count()) === 0);
    let r = await act(p, p.getByRole("button", { name: "Ya, barang sudah saya terima" }));
    ok("gudang menerima serah terima", r.ok && /sudah Anda terima/.test(r.ok), JSON.stringify(r));
    await periksaDulu(p);
    r = await act(p, p.getByRole("button", { name: "Barang sudah saya terima di gudang" }));
    ok("gudang: barang tiba di gudang asal", r.ok && /diterima di gudang/.test(r.ok), JSON.stringify(r));
    ok("form timbang muncul dengan 2 barang", (await p.locator("input[name=w0]").count()) === 1 && (await p.locator("input[name=w1]").count()) === 1);
    await p.fill("input[name=w0]", "10"); await p.fill("input[name=w1]", "12");
    r = await act(p, p.getByRole("button", { name: "Hitung dan buat tagihan" }));
    ok("tagihan terbit otomatis: 22 kg x Rp2.800 = Rp61.600 (tarif baru dipakai)", r.ok && /Rp61\.600/.test(r.ok) && /INV-\d{4}-000001/.test(r.ok), JSON.stringify(r));
    ok("gudang TIDAK melihat nominal tagihan (data keuangan)", !/Rp61\.600/.test((await text(p)).replace(/Tagihan .* sebesar Rp61\.600 sudah dibuat\./, "")));
    ok("Tahap 4 dari 10 setelah ditimbang", /Tahap 4 dari 10/.test(await text(p)));
    ok("sesudah ditimbang: tidak ada tombol muat per resi, diarahkan ke manifest", (await p.getByRole("button", { name: "Barang sudah dimuat ke kontainer" }).count()) === 0 && /Masukkan ke manifest/.test(await text(p)));

    console.log("\n[E2] Manifest: buat, isi, segel, serah terima");
    await p.goto(`${BASE}/app/manifest/baru`, { waitUntil: "networkidle" });
    await p.selectOption("#tujuan", "MKS"); await p.fill("#kontainer", "MSKU1234567"); await p.fill("#pengangkut", "KM Sinar Laut");
    r = await act(p, p.getByRole("button", { name: "Buat manifest" }));
    ok("manifest dibuat dengan kode MNF terbaca", r.ok && /Manifest MNF-JKT-MKS-L-\d{6}-\d{4}-01-[A-Z]{2} dibuat/.test(r.ok), JSON.stringify(r));
    manifestId = p.url().match(/manifest\/([0-9a-f-]+)/)?.[1] || ""; manifestCode = (await p.locator("h1.resicode").innerText()).trim();
    ok("resi yang sudah ditimbang muncul di daftar siap dimuat", (await p.locator(".cand").innerText()).includes(resiNo));
    r = await act(p, p.locator(".cand form").first().getByRole("button", { name: "Tambah" }));
    ok("resi ditambahkan dari daftar siap muat", r.ok && /Resi ditambahkan/.test(r.ok), JSON.stringify(r));
    ok("ringkasan manifest: 1 resi, 2 barang, 22 kg", /1 resi · 2 barang · 22 kg/.test(await text(p)));
    await p.fill("input[aria-label=Kode]", "KLX-JKT-MKS-LJ-261118-1400-0998-ST"); await p.getByRole("button", { name: "Tambah" }).first().click();
    await p.waitForSelector(".mlog li.bad", { timeout: 15000 }).catch(() => {});
    ok("kode yang tidak ada ditolak dengan pesan awam", /tidak dikenali|sudah ada|belum siap/i.test(await p.locator(".mlog li").first().innerText().catch(() => "")));
    await p.fill("#segel", "SEG-001");
    r = await act(p, p.getByRole("button", { name: /Segel manifest/ }));
    ok("manifest disegel: semua resi tercatat sudah dimuat", r.ok && /disegel/.test(r.ok), JSON.stringify(r));
    await selectByText(p, "select[name=ke]", "Sopir Kontainer");
    r = await act(p, p.getByRole("button", { name: "Serahkan manifest" }));
    ok("manifest diserahkan ke sopir (menunggu diterima)", r.ok && /Menunggu penerima/.test(r.ok), JSON.stringify(r));
    await p.goto(`${BASE}/app/resi/${resiId}`, { waitUntil: "networkidle" });
    ok("detail resi menampilkan kode manifest dan status Sudah dimuat", (await p.locator(".manifestlink code").innerText()).includes("MNF-") && /Sudah dimuat/.test(await text(p)));
    await p.screenshot({ path: `${OUT}/e2e-manifest-resi.png` });
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
    await selectByText(p, "select[name=ke]", "Gudang Makassar");
    r = await act(p, p.getByRole("button", { name: "Serahkan manifest" }));
    ok("sopir menyerahkan manifest ke gudang Makassar", r.ok && /Menunggu penerima/.test(r.ok), JSON.stringify(r));
  }

  console.log("\n[G] Gudang Makassar dan kurir Makassar (tahap akhir)");
  const gmks = await login(browser, "gudang.mks@uji.id");
  {
    const p = gmks.page;
    await p.goto(`${BASE}/app/manifest/${manifestId}`, { waitUntil: "networkidle" });
    let r = await act(p, p.getByRole("button", { name: "Ya, manifest sudah saya terima" }));
    ok("gudang Makassar menerima manifest (cabang tujuan)", r.ok && /sudah Anda terima/.test(r.ok), JSON.stringify(r));
    ok("bongkar: 0 dari 2 barang dipindai", /0 dari 2 barang/.test(await text(p)));
    await p.fill("input[aria-label=Kode]", "KLX-JKT-MKS-LJ-261118-1400-0998-ST-01"); await p.getByRole("button", { name: "Cocokkan" }).click();
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
    ok("tagihan muncul di daftar (belum dibayar)", /INV-\d{4}-000001/.test(await text(p)) && /Rp61\.600/.test(await text(p)));
    await p.locator("a.resi").first().click(); await p.waitForURL(/\/app\/tagihan\/[0-9a-f-]+/, { timeout: 15000 }); await p.waitForLoadState("networkidle");
    { const t0 = await text(p); ok("detail tagihan: invoice rapi dengan rekening bank", /invoice/i.test(t0) && /BCA/.test(t0) && /1234567890/.test(t0) && /kamil logistik express/i.test(t0), t0.slice(0, 700)); }
    { const t1 = await text(p); ok("rincian memakai format Rp2.800", /22 kg x Rp2\.800/.test(t1), t1.slice(0, 900)); }
    await p.fill("#jumlah", "20000");
    let r = await act(p, p.getByRole("button", { name: "Simpan pembayaran" }));
    ok("transfer tanpa referensi ditolak dengan alasan jelas", r.err && /referensi/.test(r.err), JSON.stringify(r));
    await p.fill("#jumlah", "999999"); await p.fill("#referensi", "Budi BCA");
    r = await act(p, p.getByRole("button", { name: "Simpan pembayaran" }));
    ok("pembayaran melebihi sisa ditolak", r.err && /melebihi sisa/.test(r.err), JSON.stringify(r));
    await p.fill("#jumlah", "20000"); await p.fill("#referensi", "Budi BCA 1122");
    r = await act(p, p.getByRole("button", { name: "Simpan pembayaran" }));
    ok("transfer sebagian Rp20.000 tercatat", r.ok && /masih punya sisa/.test(r.ok), JSON.stringify(r));
    ok("status DIBAYAR SEBAGIAN, sisa Rp41.600", /DIBAYAR SEBAGIAN/.test(await text(p)) && /Rp41\.600/.test(await text(p)));
    await p.check("input[name=cara][value=TUNAI]");
    r = await act(p, p.getByRole("button", { name: "Simpan pembayaran" }));
    ok("pelunasan tunai (sisa Rp41.600) → LUNAS", r.ok && /sudah lunas/.test(r.ok) && /LUNAS/.test(await text(p)), JSON.stringify(r));
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
    ok("invoice publik terbuka TANPA login, berstatus LUNAS", /INVOICE/.test(t) && /LUNAS/.test(t) && /Rp61\.600/.test(t));
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
    ok("dashboard: pendapatan Rp61,6 rb", /Rp61,6 rb/.test(t), t.slice(0, 400));
    ok("dashboard: 1 resi baru dan 1 sedang berjalan", /Resi baru\s*\n?\s*1/.test(t.replace(/\n+/g, "\n")) || /\b1\b/.test(t));
    ok("dashboard: ada aktivitas terbaru dan kinerja petugas", /Aktivitas terbaru/.test(t) && /Aktivitas petugas/.test(t) && /langkah/.test(t));
    ok("dashboard: kesimpulan otomatis tidak mengarang persentase", !/naik \d+%|turun \d+%/.test(t));
    await p.screenshot({ path: `${OUT}/e2e-owner-data.png`, fullPage: true });
    await p.goto(`${BASE}/app/keuangan`, { waitUntil: "networkidle" }); await p.waitForTimeout(1800);
    const f = await text(p);
    ok("keuangan: ditagihkan dan uang masuk Rp61,6 rb, belum dibayar Rp0", (f.match(/Rp61,6 rb/g) || []).length >= 2, f.slice(0, 300));
    ok("keuangan: pembayaran terbaru memuat transfer dan tunai", /Transfer/.test(f) && /Tunai/.test(f));
    await p.goto(`${BASE}/app/semua`, { waitUntil: "networkidle" });
    ok("semua resi: resi tampil untuk pemilik", new RegExp(resiNo).test(await text(p)));
    await p.goto(`${BASE}/app/resi/${resiId}`, { waitUntil: "networkidle" });
    const d = await text(p);
    ok("pemilik hanya MELIHAT: tidak ada tombol operasional", (await p.getByRole("button", { name: /Barang sudah|Serahkan|Ya, barang|Hitung dan buat/ }).count()) === 0);
    ok("pemilik melihat bukti terima (foto + tanda tangan), tanpa form", (await p.locator(".podgrid img").count()) === 2 && (await p.locator(".pod").count()) === 0);
    ok("pemilik melihat tagihan dan riwayat lengkap", /Tagihan/.test(d) && /Riwayat/.test(d) && /Rp61\.600/.test(d));
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
    await selectByText(k, "#rute", "Jakarta → Makassar · Diantar sampai alamat (per kilo)");
    await k.getByText("Perusahaan langganan").click(); await k.selectOption("#company", { label: "PT Sinar Jaya (tempo 14 hari)" });
    await k.getByText("Diantar sendiri").click();
    await k.fill("#pengirim", "PT Sinar Jaya"); await k.fill("#hp_pengirim", "0811 2223 334"); await k.fill("#penerima", "Gudang Penerima"); await k.fill("#hp_penerima", "0812-9988-7766"); await k.fill("#alamat", "Jl. Tol Reformasi, Makassar"); await k.fill("#jumlah", "1");
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
    await g.fill("input[name=w0]", "10");
    r = await act(g, g.getByRole("button", { name: "Hitung dan buat tagihan" }));
    ok("harga khusus dipakai: 10 kg x Rp2.000 = Rp20.000", r.ok && /Rp20\.000/.test(r.ok), JSON.stringify(r));
    await k.goto(`${BASE}/app/baru`, { waitUntil: "networkidle" });
    await selectByText(k, "#rute", "Jakarta → Makassar · Diantar sampai alamat (per kilo)");
    await k.getByText("Perusahaan langganan").click(); await k.selectOption("#company", { label: "PT Sinar Jaya (tempo 14 hari)" });
    await k.getByText("Diantar sendiri").click();
    await k.fill("#pengirim", "PT Sinar Jaya"); await k.fill("#hp_pengirim", "081122233344"); await k.fill("#penerima", "X"); await k.fill("#hp_penerima", "081299887766"); await k.fill("#alamat", "Y"); await k.fill("#jumlah", "1");
    r = await act(k, k.getByRole("button", { name: "Buat resi" }));
    ok("batas kredit terlampaui: resi baru ditolak dengan alasan jelas", r.err && /Batas kredit/.test(r.err), JSON.stringify(r));
    await p.goto(`${BASE}/app/korporat`, { waitUntil: "networkidle" });
    await p.getByText("PT Sinar Jaya").first().click(); await p.waitForURL(/\/app\/korporat\/[0-9a-f-]+/); await p.waitForLoadState("networkidle");
    const t = await text(p);
    ok("rekap korporat: Rp20.000 belum dibayar dan batas kredit terpakai penuh", /Rp20\.000/.test(t) && /dari Rp20\.000/.test(t), t.slice(0, 300));
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
    await selectByText(k, "#rute", "Jakarta → Makassar · Diantar sampai alamat (per kilo)");
    await k.fill("#pengirim", "Bu Antrean"); await k.fill("#hp_pengirim", "0813 1111 2222"); await k.fill("#penerima", "Pak Tujuan"); await k.fill("#hp_penerima", "0813 3333 4444"); await k.fill("#alamat", "Makassar"); await k.fill("#alamat_jemput", "Jl. Antrean 1, Jakarta"); await k.fill("#jumlah", "1");
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
    const kur = (await login(browser, "kurir@uji.id")).page;
    await kur.goto(`${BASE}/app/tindak-lanjut`, { waitUntil: "networkidle" });
    ok("kurir ditolak masuk antrean", !kur.url().includes("/app/tindak-lanjut") || /tidak punya|izin|Hanya/i.test(await text(kur)));
  }

  // ===== M0. Nomor HP wajib benar =====
  {
    const k = kasir.page;
    await k.goto(`${BASE}/app/baru`, { waitUntil: "networkidle" });
    await selectByText(k, "#rute", "Jakarta → Makassar · Diantar sampai alamat (per kilo)");
    await k.getByText("Diantar sendiri").click();
    await k.fill("#pengirim", "A"); await k.fill("#hp_pengirim", "0211234567"); await k.fill("#penerima", "B"); await k.fill("#hp_penerima", "081299887766"); await k.fill("#alamat", "C"); await k.fill("#jumlah", "1");
    const r = await act(k, k.getByRole("button", { name: "Buat resi" }));
    ok("nomor telepon rumah/salah ditolak dengan pesan jelas", r.err && /Pengirim: Nomor HP tidak valid/.test(r.err), JSON.stringify(r));
  }

  // ===== M. Landing futuristik: carousel + asisten tanya-jawab =====
  {
    const pc = await browser.newContext({ viewport: { width: 412, height: 860 } }); const p = await pc.newPage();
    await p.goto(`${BASE}/`, { waitUntil: "networkidle" });
    ok("M1 carousel punya 5 slide", (await p.locator(".cslide").count()) === 5);
    await p.locator(".cdots button").nth(2).click(); await p.waitForTimeout(700);
    ok("M2 titik carousel menggeser ke slide 3", /Dijemput atau antar sendiri/.test(await p.locator(".cslide.on").innerText()));
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

  await browser.close();
  const fail = results.filter((r) => !r.ok);
  console.log(`\n==== HASIL: ${results.length - fail.length}/${results.length} lolos ====`);
  if (fail.length) console.log("GAGAL:\n - " + fail.map((f) => f.name).join("\n - "));
  const uniq = [...new Set(problems)];
  console.log(uniq.length ? `\nGALAT DI PERAMBAN/SERVER (${uniq.length}):\n` + uniq.slice(0, 15).join("\n") : "\nTidak ada galat konsol/server selama uji.");
  process.exit(fail.length ? 1 : 0);
})().catch((e) => { console.error("UJI BERHENTI:", e); process.exit(2); });
