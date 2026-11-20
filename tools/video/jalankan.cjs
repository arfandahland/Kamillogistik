/** Pemakaian: node jalankan.cjs [id ...]   (tanpa id = semua). Hasil: apps/web/public/video/*.mp4 + *.jpg + daftar.json */
const fs = require("fs"), path = require("path");
const { rekam } = require("./lib.cjs"); const skenario = require("./skenario.cjs");
const keluar = path.resolve(__dirname, "../../apps/web/public/video"); fs.mkdirSync(keluar, { recursive: true });
(async () => {
  const pilih = process.argv.slice(2); const daftarJalan = skenario.filter((s) => !pilih.length || pilih.includes(s.id));
  let meta = []; try { meta = JSON.parse(fs.readFileSync(path.join(keluar, "daftar.json"), "utf8")); } catch {}
  for (const s of daftarJalan) {
    const t0 = Date.now(); let narasi = null; const fa = path.join(__dirname, "narasi", s.id + ".audio.json");
    if (fs.existsSync(fa)) { const a = JSON.parse(fs.readFileSync(fa, "utf8")); if (a.lengkap) narasi = a.klip; }
    if (process.env.NARASI_SAJA && !narasi) { console.log(`LEWATI ${s.id} (suara belum lengkap)`); continue; }
    try { const r = await rekam(s, { keluar, mobile: s.mobile !== false, masuk: s.masuk, narasi }); console.log(`OK  ${s.id} ${r.kb} KB${r.bersuara ? ` + ${r.bersuara} kalimat suara` : " (tanpa suara)"} (${Math.round((Date.now() - t0) / 1000)} dtk)`);
      const m = { id: s.id, peran: s.peran, judul: s.judul, ringkas: s.ringkas, kb: r.kb, suara: !!r.bersuara }; const i = meta.findIndex((x) => x.id === s.id); if (i >= 0) meta[i] = m; else meta.push(m);
    } catch (e) { console.log(`GAGAL ${s.id}: ${String(e.message).split("\n")[0]}`); }
  }
  fs.writeFileSync(path.join(keluar, "daftar.json"), JSON.stringify(meta, null, 1));
  fs.writeFileSync(path.resolve(__dirname, "../../apps/web/src/lib/videoDaftar.json"), JSON.stringify(meta, null, 1));
})();
