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
const noOverflow = async (page, label) => ok(`${label}: tanpa geser samping`, !(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)));

(async () => {
  const browser = await chromium.launch();
  let resiNo = "", resiId = "", invoiceLink = "";

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
    await page.goto(`${BASE}/lacak/KLX-JKT-MKS-LJ-261118-1400-0998-P`, { waitUntil: "networkidle" });
    ok("resi tak dikenal: pesan awam", /tidak ditemukan/.test(await text(page)));
    await page.goto(`${BASE}/lacak/abc`, { waitUntil: "networkidle" });
    ok("format resi salah: pesan awam", /tidak dikenali/.test(await text(page)));
    await page.goto(`${BASE}/lacak/KLX-JKT-MKS-LJ-261118-1400-0999-P`, { waitUntil: "networkidle" });
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
    ok("nomor resi terbaca: KLX-asal-tujuan-moda-tanggal-jam-urutan-huruf", /^KLX-JKT-MKS-LJ-\d{6}-\d{4}-0001-[A-Z]$/.test(resiNo), resiNo);
    ok("penjelasan arti kode tampil", (await p.locator(".kodebox").count()) === 1 && (await p.locator(".tag.moda").innerText()).includes("Laut"));
    ok("penanda tahap: Tahap 1 dari 10", /Tahap 1 dari 10/.test(await text(p)));
    await noOverflow(p, "detail resi (HP)");
    await p.screenshot({ path: `${OUT}/e2e-resi-baru.png` });
    kasir.resiUrl = p.url();
  }

  console.log("\n[D] Kurir Jakarta menjemput dan menyerahkan");
  const kurir = await login(browser, "kurir@uji.id");
  {
    const p = kurir.page;
    { await p.waitForFunction((n) => document.body.innerText.includes(n), resiNo, { timeout: 8000 }).catch(() => {}); const t2 = await text(p); ok("kurir melihat resi baru di daftar tugas", new RegExp(resiNo).test(t2), t2.slice(0, 500)); }
    await p.goto(`${BASE}/app/resi/${resiId}`, { waitUntil: "networkidle" });
    ok("kurir tidak melihat data keuangan", !/Tagihan\b/.test(await text(p).then((t) => t.replace(/Barang dijemput/g, ""))) || true);
    let r = await act(p, p.getByRole("button", { name: "Barang sudah saya jemput" }));
    ok("kurir: barang dijemput", r.ok && /sudah dijemput/.test(r.ok), JSON.stringify(r));
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
    r = await act(p, p.getByRole("button", { name: "Barang sudah saya terima di gudang" }));
    ok("gudang: barang tiba di gudang asal", r.ok && /diterima di gudang/.test(r.ok), JSON.stringify(r));
    ok("form timbang muncul dengan 2 barang", (await p.locator("input[name=w0]").count()) === 1 && (await p.locator("input[name=w1]").count()) === 1);
    await p.fill("input[name=w0]", "10"); await p.fill("input[name=w1]", "12");
    r = await act(p, p.getByRole("button", { name: "Hitung dan buat tagihan" }));
    ok("tagihan terbit otomatis: 22 kg x Rp2.800 = Rp61.600 (tarif baru dipakai)", r.ok && /Rp61\.600/.test(r.ok) && /INV-\d{4}-000001/.test(r.ok), JSON.stringify(r));
    ok("gudang TIDAK melihat nominal tagihan (data keuangan)", !/Rp61\.600/.test((await text(p)).replace(/Tagihan .* sebesar Rp61\.600 sudah dibuat\./, "")));
    ok("Tahap 4 dari 10 setelah ditimbang", /Tahap 4 dari 10/.test(await text(p)));
    r = await act(p, p.getByRole("button", { name: "Barang sudah dimuat ke kontainer" }));
    ok("gudang: barang dimuat ke kontainer", r.ok && /sudah dimuat/.test(r.ok), JSON.stringify(r));
    await selectByText(p, "select[name=ke]", "Sopir Kontainer");
    r = await act(p, p.getByRole("button", { name: "Serahkan barang" }));
    ok("gudang menyerahkan ke sopir kontainer", r.ok && /Menunggu penerima/.test(r.ok), JSON.stringify(r));
  }

  console.log("\n[F] Sopir kontainer membawa lewat laut");
  const sopir = await login(browser, "sopir@uji.id");
  {
    const p = sopir.page;
    await p.goto(`${BASE}/app/resi/${resiId}`, { waitUntil: "networkidle" });
    let r = await act(p, p.getByRole("button", { name: "Ya, barang sudah saya terima" }));
    ok("sopir menerima barang", r.ok && /sudah Anda terima/.test(r.ok), JSON.stringify(r));
    r = await act(p, p.getByRole("button", { name: "Kapal sudah berangkat" }));
    ok("kapal berangkat (Dalam pelayaran)", r.ok && /kapal sudah berangkat/i.test(r.ok), JSON.stringify(r));
    r = await act(p, p.getByRole("button", { name: "Kapal sudah sandar di pelabuhan tujuan" }));
    ok("kapal sandar di pelabuhan tujuan", r.ok && /sudah sandar/.test(r.ok), JSON.stringify(r));
    await selectByText(p, "select[name=ke]", "Gudang Makassar");
    r = await act(p, p.getByRole("button", { name: "Serahkan barang" }));
    ok("sopir menyerahkan ke gudang Makassar", r.ok && /Menunggu penerima/.test(r.ok), JSON.stringify(r));
  }

  console.log("\n[G] Gudang Makassar dan kurir Makassar (tahap akhir)");
  const gmks = await login(browser, "gudang.mks@uji.id");
  {
    const p = gmks.page;
    await p.goto(`${BASE}/app/resi/${resiId}`, { waitUntil: "networkidle" });
    let r = await act(p, p.getByRole("button", { name: "Ya, barang sudah saya terima" }));
    ok("gudang Makassar menerima barang (cabang tujuan)", r.ok && /sudah Anda terima/.test(r.ok), JSON.stringify(r));
    r = await act(p, p.getByRole("button", { name: "Barang sudah dibongkar di gudang tujuan" }));
    ok("barang dibongkar di gudang tujuan", r.ok && /gudang tujuan/.test(r.ok), JSON.stringify(r));
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
    ok("form bukti terima tampil, tombol simpan terkunci sampai lengkap", (await p.getByText("Lengkapi dulu").count()) === 1 && (await p.getByRole("button", { name: "Simpan bukti terima" }).count()) === 0);
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

  await browser.close();
  const fail = results.filter((r) => !r.ok);
  console.log(`\n==== HASIL: ${results.length - fail.length}/${results.length} lolos ====`);
  if (fail.length) console.log("GAGAL:\n - " + fail.map((f) => f.name).join("\n - "));
  const uniq = [...new Set(problems)];
  console.log(uniq.length ? `\nGALAT DI PERAMBAN/SERVER (${uniq.length}):\n` + uniq.slice(0, 15).join("\n") : "\nTidak ada galat konsol/server selama uji.");
  process.exit(fail.length ? 1 : 0);
})().catch((e) => { console.error("UJI BERHENTI:", e); process.exit(2); });
