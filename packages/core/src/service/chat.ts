import { pairSlug } from "./seo";
import { calculateTariff } from "../tariff";
import { MODA_LABEL, PEMBAGI_VOLUME, normalizeResi, parseResi, splitItem } from "../resi";
import type { RouteService } from "./repo";
import type { PublicTrack } from "./publicView";

/**
 * Asisten tanya-jawab untuk pengunjung. Bukan model bahasa: jawabannya disusun dari DATA BISNIS yang sama dengan
 * kalkulator dan halaman lacak (tarif, rute, status resi), jadi tidak mengarang angka. Pertanyaan di luar bisnis
 * dijawab singkat lalu diarahkan ke tim lewat WhatsApp.
 */
export type ChatCtx = { intent?: "ongkir"; asal?: string; tujuan?: string; berat?: number; dims?: [number, number, number]; moda?: "LAUT" | "UDARA" | "DARAT" };
export type ChatReply = { text: string; actions?: { label: string; href: string }[]; chips?: string[]; ctx?: ChatCtx };
export type ChatDeps = { routes: () => Promise<RouteService[]>; track: (resi: string) => Promise<PublicTrack | null>; waLink: (text: string) => string };

const rp = (n: number) => "Rp" + Math.round(n).toLocaleString("id-ID");
const nf = (n: number) => n.toLocaleString("id-ID", { maximumFractionDigits: 2 });
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim();
/** Kata pendek (≤4 huruf) dicocokkan sebagai kata utuh supaya "siapa" tidak dianggap "siap"; kata panjang boleh berimbuhan ("dijemput"). */
const has = (t: string, ...w: (string | RegExp)[]) =>
  w.some((x) => (typeof x !== "string" ? x.test(t) : x.length <= 4 ? new RegExp(`(^|[^a-z0-9])${x}([^a-z0-9]|$)`).test(t) : t.includes(x)));

const SINONIM: Record<string, string> = { jkt: "JKT", mks: "MKS", sby: "SUB", sub: "SUB", mrw: "MRW", "ujung pandang": "MKS", ujungpandang: "MKS", batavia: "JKT" };

const KODE_BOLEH = new Set(["JKT", "MKS", "MRW", "SUB"]); // hanya kode kota utama yang boleh dipakai sebagai singkatan (kode lain mirip kata biasa)

function kotaDi(t: string, rs: RouteService[]): { code: string; city: string; at: number }[] {
  const daftar = new Map<string, string>();
  for (const r of rs) { daftar.set(r.origin.code, r.origin.city); daftar.set(r.dest.code, r.dest.city); }
  const hit: { code: string; city: string; at: number; end: number }[] = [];
  for (const [code, city] of daftar) {
    const nama = norm(city), pola = KODE_BOLEH.has(code) ? `${nama}|${code.toLowerCase()}` : nama;
    const m = new RegExp(`(^|[^a-z])(${pola})(?![a-z])`).exec(t);
    if (m) { const at = m.index + m[1]!.length; hit.push({ code, city, at, end: at + m[2]!.length }); }
  }
  for (const [kata, code] of Object.entries(SINONIM)) {
    const m = new RegExp(`(^|[^a-z])${kata}(?![a-z])`).exec(t);
    if (m && daftar.has(code) && !hit.some((h) => h.code === code)) { const at = m.index + m[1]!.length; hit.push({ code, city: daftar.get(code)!, at, end: at + kata.length }); }
  }
  // "Bone Bolango" memuat kata "Bone": pakai yang terpanjang, buang yang tercakup di dalamnya.
  const bersih = hit.filter((h) => !hit.some((o) => o !== h && o.at <= h.at && o.end >= h.end && o.end - o.at > h.end - h.at));
  return bersih.sort((a, b) => a.at - b.at).map(({ code, city, at }) => ({ code, city, at }));
}

function angka(t: string): { berat?: number; dims?: [number, number, number] } {
  const out: { berat?: number; dims?: [number, number, number] } = {};
  const d = /(\d+(?:[.,]\d+)?)\s*(?:x|×|\*|by)\s*(\d+(?:[.,]\d+)?)\s*(?:x|×|\*|by)\s*(\d+(?:[.,]\d+)?)/.exec(t);
  if (d) out.dims = [Number(d[1]!.replace(",", ".")), Number(d[2]!.replace(",", ".")), Number(d[3]!.replace(",", "."))];
  const sisa = d ? t.replace(d[0], " ") : t;
  const b = /(\d+(?:[.,]\d+)?)\s*(kg|kilo|kilogram|ton)\b/.exec(sisa);
  if (b) { const v = Number(b[1]!.replace(",", ".")); out.berat = b[2] === "ton" ? v * 1000 : v; }
  else { const s = /^\s*(\d+(?:[.,]\d+)?)\s*$/.exec(sisa); if (s) out.berat = Number(s[1]!.replace(",", ".")); }
  return out;
}

function modaDari(t: string): ChatCtx["moda"] | undefined {
  if (has(t, "udara", "pesawat", "cargo udara", "kargo udara")) return "UDARA";
  if (has(t, "laut", "kapal", "kontainer", "container")) return "LAUT";
  if (has(t, "darat", "truk", "truck")) return "DARAT";
  return undefined;
}

const SERVIS: Record<string, string> = { PORT_TO_PORT: "sampai pelabuhan tujuan", PORT_TO_DOOR: "diantar sampai alamat", DOOR_TO_DOOR: "dijemput dan diantar" };
const KONTAK = "Hubungi tim kami lewat WhatsApp untuk jawaban pasti.";

function ringkasRute(rs: RouteService[]) {
  const pairs = new Map<string, RouteService>();
  for (const r of rs.filter((x) => x.basis === "PER_KG" && x.unitPrice > 0)) { const k = `${r.origin.code}-${r.dest.code}`; const c = pairs.get(k); if (!c || r.unitPrice < c.unitPrice) pairs.set(k, r); }
  return [...pairs.values()];
}

export async function jawab(deps: ChatDeps, pesan: string, ctxIn: ChatCtx = {}): Promise<ChatReply> {
  const raw = String(pesan ?? "").slice(0, 400);
  const t = norm(raw);
  const wa = (x: string) => ({ label: "Chat WhatsApp", href: deps.waLink(x) });
  if (!t) return { text: "Silakan tulis pertanyaan Anda. Contoh: “ongkir Jakarta ke Makassar 25 kg”.", chips: CHIPS_AWAL };

  // 1) Kode resi di dalam kalimat
  const token = raw.toUpperCase().split(/[\s,;:()]+/).map((x) => x.replace(/^[^A-Z0-9]+|[^A-Z0-9-]+$/g, "")).find((x) => /^KLX[-A-Z0-9]{8,}$/.test(x.replace(/[._/\\]/g, "-")));
  if (token) {
    const { resi } = splitItem(normalizeResi(token));
    const p = parseResi(resi);
    if (!p) return { text: "Kode resi itu tidak valid. Huruf pemeriksa di ujung kode tidak cocok, kemungkinan ada salah ketik. Periksa lagi atau salin dari struk.", chips: ["Cara membaca kode resi", "Hitung ongkir"], actions: [{ label: "Cek resi manual", href: "/lacak" }] };
    const s = await deps.track(resi);
    if (!s) return { text: `Resi ${resi} belum ditemukan. Mungkin baru dibuat atau salah salin. Coba lagi beberapa menit, atau tanyakan tim kami.`, actions: [wa(`Halo, saya cek resi ${resi} tapi belum ditemukan.`)] };
    const eta = s.eta ? ` Perkiraan tiba ${new Date(s.eta).toLocaleDateString("id-ID", { day: "numeric", month: "long" })}.` : "";
    const akhir = s.history[s.history.length - 1];
    return {
      text: `${s.resi}\n${s.route.origin} → ${s.route.dest} · ${MODA_LABEL[s.mode]}\nStatus: ${s.statusLabel}${akhir?.location ? ` (${akhir.location})` : ""}.${eta}`,
      actions: [{ label: "Lihat perjalanan lengkap", href: `/lacak/${encodeURIComponent(resi)}` }], chips: ["Lacak resi lain", "Hitung ongkir"],
    };
  }

  const rs = await deps.routes();
  const kota = kotaDi(t, rs);
  const a = angka(t);
  const moda = modaDari(t);

  if (has(t, "volumetrik", "berat volume", "dimensi", "p x l x t", "pxlxt", "cara hitung", "cara menghitung") && !(kota.length >= 2 || a.berat || a.dims)) {
    return { text: `Ongkir memakai angka yang lebih besar antara berat timbangan dan berat volume.\nBerat volume = panjang × lebar × tinggi (cm) ÷ pembagi.\n• Laut/darat: ÷ ${PEMBAGI_VOLUME.LAUT}\n• Udara: ÷ ${PEMBAGI_VOLUME.UDARA}\nContoh laut: 80×50×50 cm = 50 kg.`, chips: ["Jakarta ke Makassar 80x50x50 cm 5 kg"], actions: [{ label: "Baca panduan lengkap", href: "/panduan/cara-hitung-ongkir-cargo" }] };
  }
  if (has(t, "lama", "berapa hari", "estimasi", "sampai kapan", "jadwal", "berangkat", "kapan sampai") && !has(t, "ongkir", "ongkos", "tarif", "harga", "biaya")) {
    const k = kota.length >= 2 ? rs.find((r) => r.origin.code === kota[0]!.code && r.dest.code === kota[1]!.code) : undefined;
    if (k) return { text: `${k.origin.city} → ${k.dest.city}: sekitar ${k.etaDays} hari${k.departureNote ? `. ${k.departureNote}` : ""}. Lama sebenarnya bergantung jadwal keberangkatan.`, actions: [{ label: "Lihat rute", href: `/${pairSlug(k.origin.city, k.dest.city)}` }] };
    const r = ringkasRute(rs).slice(0, 4).map((x) => `• ${x.origin.city} → ${x.dest.city}: sekitar ${x.etaDays} hari`).join("\n");
    return { text: `${r}\nSebutkan kota asal dan tujuan untuk perkiraan yang lebih tepat.`, chips: ["Jakarta ke Makassar", "Makassar ke Jakarta"], actions: [{ label: "Semua rute", href: "/ekspedisi" }] };
  }
  // 2) Ongkir (termasuk pertanyaan lanjutan untuk melengkapi data)
  const pasangan = /\b(dari)\b/.test(t) && kota.length >= 2 ? kota : kota.length >= 2 ? kota : [];
  const sedangOngkir = ctxIn.intent === "ongkir" && !has(t, "lacak", "resi", "bayar", "jemput", "mitra", "korporat");
  if (has(t, "ongkir", "ongkos", "tarif", "harga", "biaya") || (has(t, "berapa", "hitung") && (kota.length >= 2 || a.berat || a.dims)) || sedangOngkir || (pasangan.length >= 2 && (a.berat || a.dims))) {
    const asal = pasangan[0]?.code ?? (kota.length === 1 && /\b(dari)\b/.test(t) ? kota[0]!.code : ctxIn.asal);
    const tujuan = pasangan[1]?.code ?? (kota.length === 1 && /\b(ke|tujuan)\b/.test(t) && !/\bdari\b/.test(t) ? kota[0]!.code : ctxIn.tujuan);
    const berat = a.berat ?? ctxIn.berat; const dims = a.dims ?? ctxIn.dims; const m = moda ?? ctxIn.moda;
    const ctx: ChatCtx = { intent: "ongkir", asal, tujuan, berat, dims, moda: m };
    if (!asal || !tujuan) {
      if (!asal && !tujuan) {
        const r = ringkasRute(rs);
        const daftar = r.slice(0, 4).map((x) => `• ${x.origin.city} → ${x.dest.city}: mulai ${rp(x.unitPrice)}/kg`).join("\n");
        return { text: `${daftar || "Tarif tiap rute ada di halaman Ekspedisi."}\n\nUntuk hitung pastinya, sebutkan kota asal, tujuan, dan berat. Contoh: “Jakarta ke Makassar 25 kg”.`, chips: ["Jakarta ke Makassar 25 kg", "Makassar ke Jakarta 50 kg"], actions: [{ label: "Buka kalkulator", href: "/ongkir" }], ctx: { intent: "ongkir" } };
      }
      return { text: asal ? `Dari ${kota.find((k) => k.code === asal)?.city ?? asal}. Dikirim ke kota mana?` : "Dikirim dari kota mana?", chips: unique(rs.map((r) => r.dest.city)).slice(0, 4), ctx };
    }
    const opsi = rs.filter((r) => r.origin.code === asal && r.dest.code === tujuan && r.unitPrice > 0 && (!m || r.mode === m));
    if (opsi.length === 0) {
      const ada = rs.some((r) => r.origin.code === asal && r.dest.code === tujuan);
      return { text: ada && m ? `Untuk jalur ${MODA_LABEL[m].toLowerCase()} rute ini belum ada tarif resmi. ${KONTAK}` : `Rute itu belum tersedia di tarif kami. ${KONTAK}`, actions: [wa(`Halo, saya mau kirim barang ${asal} ke ${tujuan}. Mohon info tarifnya.`)], ctx: {} };
    }
    if (!berat && !dims) return { text: `Rute ${opsi[0]!.origin.city} → ${opsi[0]!.dest.city}. Berapa kg beratnya? (kalau barangnya besar, tulis juga ukurannya, contoh 80x50x50 cm)`, chips: ["10 kg", "25 kg", "50 kg", "100 kg"], ctx };
    const baris = opsi.filter((r) => r.basis === "PER_KG" || dims).slice(0, 3).map((r) => {
      const c = calculateTariff({ pieces: [{ weightKg: berat ?? 0, ...(dims ? { dims: { lCm: dims[0], wCm: dims[1], hCm: dims[2] } } : {}) }], service: { basis: r.basis, unitPrice: r.unitPrice, volumetricDivisor: r.volumetricDivisor || PEMBAGI_VOLUME[r.mode], minChargeable: r.minChargeable, minTotal: r.minTotal, rounding: r.rounding, roundingStep: r.roundingStep } });
      const dasar = r.basis === "PER_M3" ? `${nf(c.chargeable)} m³` : c.volumetricKg > c.actualKg ? `${nf(c.chargeable)} kg (dihitung dari ukuran)` : `${nf(c.chargeable)} kg`;
      return `• ${MODA_LABEL[r.mode]} · ${SERVIS[r.service] ?? r.service}: ${rp(c.total)} (${dasar} × ${rp(c.unitPrice)}) · sekitar ${r.etaDays} hari`;
    });
    return { text: `Perkiraan ongkir ${opsi[0]!.origin.city} → ${opsi[0]!.dest.city}:\n${baris.join("\n")}\n\nBiaya pasti dihitung setelah barang ditimbang di gudang.`, chips: ["Dijemput atau antar sendiri?", "Cara pembayaran", "Lacak resi"], actions: [{ label: "Buka kalkulator", href: `/ongkir?dari=${asal}&ke=${tujuan}` }], ctx: {} };
  }

  // 3) Topik lain (aturan sederhana, jawaban ringkas)
  if (has(t, "lacak", "tracking", "cek resi", "posisi barang", "resi saya", "dimana barang", "di mana barang")) {
    return { text: "Kirim nomor resi di sini, atau buka halaman Cek Resi. Anda juga bisa memindai QR di struk dengan kamera. Contoh kode: KLX-MKS-JKT-LJ-261118-1432-0007-PK", actions: [{ label: "Cek resi", href: "/lacak" }], chips: ["Cara membaca kode resi"] };
  }
  if (has(t, "arti kode", "baca kode", "kode resi", "format resi", "nomor resi")) {
    return { text: "Kode resi bisa dibaca: KLX-MKS-JKT-LJ-261118-1432-0007-PK\n• MKS → JKT: asal dan tujuan\n• L = laut (U udara, D darat), J = dijemput (A = diantar sendiri)\n• 261118 tanggal, 1432 jam (WITA), 0007 urutan hari itu\n• PK huruf pemeriksa anti salah ketik", actions: [{ label: "Cek resi", href: "/lacak" }] };
  }
  if (has(t, "jemput", "antar sendiri", "diantar sendiri", "drop", "datang ke gudang", "antar ke gudang")) {
    return { text: "Ada dua cara:\n• Dijemput: kurir kami mengambil barang ke alamat Anda.\n• Diantar sendiri: Anda membawa barang ke gudang kami, tanpa biaya jemput.\nKasir akan menanyakan pilihannya saat membuat resi.", chips: ["Hitung ongkir", "Cara pembayaran"], actions: [wa("Halo, saya mau kirim barang. Bisa dijemput?")] };
  }
  if (has(t, "bayar", "pembayaran", "transfer", "rekening", "tunai", "invoice", "tagihan", "dp") && !has(t, "korporat", "perusahaan", "tempo", "kredit", "langganan")) {
    return { text: "Pembayaran lewat transfer rekening Kamil Logistik atau tunai. Setelah barang ditimbang di gudang, Anda menerima invoice resmi lewat tautan (bisa dicetak). Cantumkan nomor invoice di berita transfer lalu kirim bukti ke WhatsApp.", chips: ["Hitung ongkir", "Lacak resi"] };
  }
  if (has(t, "udara", "pesawat")) return { text: `Layanan kargo udara tersedia dengan pembagi berat volume ${PEMBAGI_VOLUME.UDARA}, lebih cepat dari laut. Tarif udara ditetapkan per rute, silakan tanyakan tim kami.`, actions: [wa("Halo, saya mau tanya kargo udara.")] };
  if (has(t, "larang", "boleh dikirim", "tidak boleh", "barang apa", "pecah belah", "makanan", "cairan", "baterai", "berbahaya")) {
    return { text: "Umumnya bisa: paket, dokumen, pakaian, barang dagangan, suku cadang, furnitur. Tidak boleh: bahan peledak/mudah terbakar, gas, bahan kimia berbahaya, narkotika, senjata, hewan hidup. Barang pecah belah, cair, baterai, atau makanan: tanyakan dulu.", actions: [{ label: "Baca selengkapnya", href: "/panduan/barang-yang-boleh-dan-tidak-boleh-dikirim-lewat-cargo" }, wa("Halo, saya mau tanya apakah barang saya boleh dikirim.")] };
  }
  if (has(t, "packing", "kemas", "bungkus", "kardus")) return { text: "Pakai kardus kuat (double wall untuk barang berat), lapisi bubble wrap, isi rongga, lakban bentuk H, dan tulis nama + HP penerima jelas. Jangan terlalu longgar atau terlalu besar karena ukuran memengaruhi ongkir.", actions: [{ label: "Panduan packing", href: "/panduan/cara-packing-barang-cargo-laut" }] };
  if (has(t, "korporat", "perusahaan", "b2b", "tempo", "kredit", "langganan", "partai besar")) return { text: "Untuk perusahaan ada tempo bayar (tunai, 7, 14, atau 30 hari), tarif khusus per rute, dan rekap tagihan bulanan. Hubungi tim untuk pendaftaran pelanggan korporat.", actions: [wa("Halo, perusahaan kami tertarik menjadi pelanggan korporat Kamil Logistik.")] };
  if (has(t, "mitra", "gerai", "agen", "cabang", "kerja sama", "kerjasama")) return { text: "Punya gerai atau gudang? Anda bisa jadi mitra: terima kiriman di kota Anda, buat resi dan invoice sendiri lewat HP. Hubungi tim untuk pendaftaran.", actions: [wa("Halo, saya tertarik menjadi mitra gerai Kamil Logistik.")] };
  if (has(t, "layanan ke mana", "kota apa", "tujuan apa", "melayani", "jangkauan", "rute apa", "kemana saja", "ke mana saja")) {
    const k = unique(rs.flatMap((r) => [r.origin.city, r.dest.city])).join(", ");
    return { text: `Saat ini rute tersedia di: ${k}. Rute baru terus ditambah.`, actions: [{ label: "Lihat semua rute", href: "/ekspedisi" }] };
  }
  if (has(t, "alamat", "lokasi gudang", "jam buka", "jam operasional", "buka jam", "telepon", "kontak", "nomor wa", "whatsapp", "hubungi", "cs", "admin")) {
    return { text: "Gudang Jakarta: Gudang Sarinah 2, Jl. Pancoran Timur II No. 4, Cikoko, Pancoran, Jakarta Selatan 12770. Buka 24 jam. Untuk gudang di kota lain, hubungi tim kami lewat WhatsApp.", actions: [wa("Halo Kamil Logistik, saya mau tanya.")] };
  }
  if (has(t, "halo", "hai", "hallo", "selamat", "pagi", "siang", "sore", "malam", "assalam", "permisi") && t.length < 30) return { text: "Halo! Saya asisten Kamil Logistik. Bisa bantu hitung ongkir, cek resi, atau jelaskan cara kirim. Mau mulai dari mana?", chips: CHIPS_AWAL };
  if (has(t, "terima kasih", "makasih", "thanks", "oke", "ok", "siap")) return { text: "Sama-sama! Kalau ada yang mau ditanyakan lagi, tulis saja.", chips: CHIPS_AWAL };

  return { text: `Maaf, saya belum paham pertanyaan itu. Saya bisa bantu soal ongkir, cek resi, jemput/antar sendiri, pembayaran, dan lama pengiriman. ${KONTAK}`, chips: CHIPS_AWAL, actions: [wa(`Halo Kamil Logistik, saya mau tanya: ${raw.slice(0, 120)}`)] };
}

export const CHIPS_AWAL = ["Hitung ongkir", "Lacak resi", "Dijemput atau antar sendiri?", "Cara pembayaran", "Berapa lama pengiriman?"];
function unique<T>(a: T[]): T[] { return [...new Set(a)]; }
