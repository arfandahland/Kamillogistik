/** Menjalankan skenario "kering" (tanpa peramban) untuk mengambil urutan kalimat narasi tiap video. Hasil: narasi/<id>.json (teks saja). */
const fs = require("fs"), path = require("path");
const skenario = require("./skenario.cjs");
const luar = path.join(__dirname, "narasi"); fs.mkdirSync(luar, { recursive: true });
const loc = () => new Proxy(function () {}, { get: (_, k) => (k === "then" ? undefined : k === "count" ? async () => 20 : () => loc()), apply: () => loc() });
const bersih = (s) => String(s).replace(/\s+/g, " ").replace(/\s*,\s*lalu\s*/g, ", lalu ").trim();
(async () => {
  let total = 0, huruf = 0;
  for (const s of skenario) {
    const baris = []; const cat = (x) => { if (x) baris.push(bersih(x)); };
    const t = {
      page: { locator: loc, getByRole: loc, evaluate: async () => "x", goto: async () => {} },
      buka: async () => {}, tunggu: async () => {},
      kartu: async (k, judul, sub) => cat(/[.?!]$/.test(judul) ? `${judul} ${sub}` : `${judul}. ${sub}`), kata: async (x) => cat(x),
      klik: async (l, x) => cat(x), isi: async (l, v, x) => cat(x), pilih: async (l, v, x) => cat(x), gulir: async (p, x) => cat(x), sorot: async (l, x) => cat(x), titik: async () => null,
    };
    await s.langkah(t);
    fs.writeFileSync(path.join(luar, s.id + ".teks.json"), JSON.stringify(baris, null, 1));
    total += baris.length; huruf += baris.join("").length;
    console.log(s.id.padEnd(28), baris.length, "kalimat");
  }
  console.log("TOTAL", total, "kalimat,", huruf, "huruf");
})();
