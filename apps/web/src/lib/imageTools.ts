/**
 * Pengolah foto bukti pengiriman (berjalan di peramban, foto tidak dikirim ke layanan luar).
 * - potongDesain: bila gambar adalah kartu desain Kamil (persegi dengan bingkai), ambil hanya bagian fotonya.
 * - hapusCap: hapus teks putih tipis (timemark/tanggal/jam/lokasi/watermark) di pinggir foto lalu isi otomatis dari sekitarnya.
 * - rapikan: cerahkan dan seimbangkan warna otomatis.
 * Semua bersifat perkiraan: hasilnya selalu ditampilkan sebagai pratinjau sebelum disimpan.
 */
export type Opsi = { potongDesain: boolean; hapusCap: boolean; rapikan: boolean; potongBawah: number };
export type Hasil = { dataUrl: string; catatan: string[]; lebar: number; tinggi: number };

const MAKS_SISI = 1200, MAKS_CHAR = 480_000;

export async function muatGambar(file: File): Promise<HTMLCanvasElement> {
  let src: CanvasImageSource & { width: number; height: number }, tutup = () => {};
  try { const bmp = await createImageBitmap(file, { imageOrientation: "from-image" } as ImageBitmapOptions); src = bmp; tutup = () => bmp.close?.(); }
  catch { // cadangan: elemen <img> (lebih toleran pada berkas yang sedikit rusak)
    const url = URL.createObjectURL(file);
    src = await new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error("tidak terbaca")); i.src = url; });
    tutup = () => URL.revokeObjectURL(url);
  }
  const sk = Math.min(1, 2000 / Math.max(src.width, src.height));
  const c = document.createElement("canvas"); c.width = Math.max(1, Math.round(src.width * sk)); c.height = Math.max(1, Math.round(src.height * sk));
  c.getContext("2d", { willReadFrequently: true })!.drawImage(src, 0, 0, c.width, c.height); tutup();
  return c;
}

/** Kartu desain Kamil: persegi, bilah bawah teal tua. */
export function deteksiDesain(c: HTMLCanvasElement): boolean {
  const r = c.width / c.height; if (r < 0.95 || r > 1.05 || c.width < 900) return false;
  const g = c.getContext("2d", { willReadFrequently: true })!; const y0 = Math.floor(c.height * 0.955), h = Math.max(4, Math.floor(c.height * 0.02));
  const d = g.getImageData(0, y0, c.width, h).data; let teal = 0, n = 0;
  for (let i = 0; i < d.length; i += 16) { n++; if (d[i]! < 45 && d[i + 1]! > 45 && d[i + 1]! < 110 && d[i + 2]! > 40 && d[i + 2]! < 100) teal++; }
  return teal / n > 0.5;
}

function potong(c: HTMLCanvasElement, x0: number, y0: number, x1: number, y1: number): HTMLCanvasElement {
  const w = Math.round((x1 - x0) * c.width), h = Math.round((y1 - y0) * c.height);
  const o = document.createElement("canvas"); o.width = w; o.height = h;
  o.getContext("2d", { willReadFrequently: true })!.drawImage(c, Math.round(x0 * c.width), Math.round(y0 * c.height), w, h, 0, 0, w, h); return o;
}

/** Cari teks putih tipis di pita atas/bawah/kiri-bawah, lalu isi dengan warna sekitarnya (difusi). Mengembalikan jumlah piksel yang diisi. */
function hapusTeksPutih(c: HTMLCanvasElement): number {
  const g = c.getContext("2d", { willReadFrequently: true })!, W = c.width, H = c.height;
  const img = g.getImageData(0, 0, W, H), d = img.data;
  const mask = new Uint8Array(W * H);
  const bandBawah = Math.floor(H * 0.72), bandAtas = Math.floor(H * 0.12);
  let n = 0;
  for (let y = 0; y < H; y++) {
    if (!(y >= bandBawah || y < bandAtas)) continue;
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4, r = d[i]!, gg = d[i + 1]!, b = d[i + 2]!;
      const mn = Math.min(r, gg, b), mx = Math.max(r, gg, b);
      if (mn >= 222 && mx - mn <= 28) { mask[y * W + x] = 1; n++; }
    }
  }
  if (n < W * H * 0.0004) return 0;                       // tidak ada teks yang jelas
  // buang gumpalan putih besar (langit, dinding putih): teks itu tipis, jadi buang yang tebal setelah erosi
  const er = erode(mask, W, H, Math.max(3, Math.round(W / 140)));
  const tebal = dilate(er, W, H, Math.max(3, Math.round(W / 140)));
  for (let i = 0; i < mask.length; i++) if (tebal[i]) mask[i] = 0;
  let sisa = 0; for (let i = 0; i < mask.length; i++) if (mask[i]) sisa++;
  if (sisa < W * H * 0.0003) return 0;
  const m2 = dilate(mask, W, H, Math.max(2, Math.round(W / 300)) + 1);
  difusi(d, m2, W, H);
  g.putImageData(img, 0, 0);
  let terisi = 0; for (let i = 0; i < m2.length; i++) if (m2[i]) terisi++;
  return terisi;
}
function dilate(m: Uint8Array, W: number, H: number, r: number): Uint8Array {
  const t = new Uint8Array(m.length), o = new Uint8Array(m.length);
  for (let y = 0; y < H; y++) { let last = -1e9; for (let x = 0; x < W; x++) { if (m[y * W + x]) last = x; t[y * W + x] = x - last <= r ? 1 : 0; } last = 1e9; for (let x = W - 1; x >= 0; x--) { if (m[y * W + x]) last = x; if (last - x <= r) t[y * W + x] = 1; } }
  for (let x = 0; x < W; x++) { let last = -1e9; for (let y = 0; y < H; y++) { if (t[y * W + x]) last = y; o[y * W + x] = y - last <= r ? 1 : 0; } last = 1e9; for (let y = H - 1; y >= 0; y--) { if (t[y * W + x]) last = y; if (last - y <= r) o[y * W + x] = 1; } }
  return o;
}
function erode(m: Uint8Array, W: number, H: number, r: number): Uint8Array {
  const inv = new Uint8Array(m.length); for (let i = 0; i < m.length; i++) inv[i] = m[i] ? 0 : 1;
  const di = dilate(inv, W, H, r); const o = new Uint8Array(m.length); for (let i = 0; i < m.length; i++) o[i] = di[i] ? 0 : 1; return o;
}
/** Isi area bertopeng dari tepinya (rata-rata tetangga berulang), lalu beri sedikit butiran supaya tidak terlihat rata. */
function difusi(d: Uint8ClampedArray, m: Uint8Array, W: number, H: number) {
  const idx: number[] = []; for (let i = 0; i < m.length; i++) if (m[i]) idx.push(i);
  // inisialisasi: dari kiri/kanan baris terdekat yang tidak bertopeng
  for (const p of idx) { const y = Math.floor(p / W), x = p % W; let a = x, b = x; while (a > 0 && m[y * W + a]) a--; while (b < W - 1 && m[y * W + b]) b++; const t = b === a ? 0 : (x - a) / (b - a); for (let k = 0; k < 3; k++) d[p * 4 + k] = d[(y * W + a) * 4 + k]! * (1 - t) + d[(y * W + b) * 4 + k]! * t; }
  for (let it = 0; it < 40; it++) for (const p of idx) {
    const x = p % W, y = (p / W) | 0; const l = x > 0 ? p - 1 : p, r = x < W - 1 ? p + 1 : p, u = y > 0 ? p - W : p, dn = y < H - 1 ? p + W : p;
    for (let k = 0; k < 3; k++) d[p * 4 + k] = (d[l * 4 + k]! + d[r * 4 + k]! + d[u * 4 + k]! + d[dn * 4 + k]!) / 4;
  }
  for (const p of idx) { const n = (Math.random() - 0.5) * 6; for (let k = 0; k < 3; k++) d[p * 4 + k] = Math.max(0, Math.min(255, d[p * 4 + k]! + n)); }
}

/** Cerahkan dan seimbangkan: regangkan histogram (1%–99%) dan naikkan sedikit warna. */
function rapikanWarna(c: HTMLCanvasElement) {
  const g = c.getContext("2d", { willReadFrequently: true })!, img = g.getImageData(0, 0, c.width, c.height), d = img.data;
  const h = new Uint32Array(256); for (let i = 0; i < d.length; i += 4) h[Math.round(0.299 * d[i]! + 0.587 * d[i + 1]! + 0.114 * d[i + 2]!)]!++;
  const tot = d.length / 4; let lo = 0, hi = 255, acc = 0;
  for (let v = 0; v < 256; v++) { acc += h[v]!; if (acc > tot * 0.01) { lo = v; break; } }
  acc = 0; for (let v = 255; v >= 0; v--) { acc += h[v]!; if (acc > tot * 0.01) { hi = v; break; } }
  if (hi - lo < 40) return;
  const lut = new Uint8ClampedArray(256); for (let v = 0; v < 256; v++) lut[v] = 255 * Math.pow(Math.max(0, Math.min(1, (v - lo) / (hi - lo))), 0.92);
  for (let i = 0; i < d.length; i += 4) {
    const r = lut[d[i]!]!, gg = lut[d[i + 1]!]!, b = lut[d[i + 2]!]!, y = 0.299 * r + 0.587 * gg + 0.114 * b;
    d[i] = Math.max(0, Math.min(255, y + (r - y) * 1.1)); d[i + 1] = Math.max(0, Math.min(255, y + (gg - y) * 1.1)); d[i + 2] = Math.max(0, Math.min(255, y + (b - y) * 1.1));
  }
  g.putImageData(img, 0, 0);
}

export function olah(sumber: HTMLCanvasElement, o: Opsi): Hasil {
  const catatan: string[] = [];
  let c = sumber;
  if (o.potongDesain) { if (deteksiDesain(c)) { c = potong(c, 0.464, 0.205, 0.998, 0.838); catatan.push("Bagian foto diambil dari kartu desain."); } else catatan.push("Bukan kartu desain Kamil, tidak dipotong."); }
  else { const k = document.createElement("canvas"); k.width = c.width; k.height = c.height; k.getContext("2d", { willReadFrequently: true })!.drawImage(c, 0, 0); c = k; }
  if (o.potongBawah > 0) { c = potong(c, 0, 0, 1, 1 - o.potongBawah / 100); catatan.push(`Bagian bawah dipotong ${o.potongBawah}%.`); }
  if (o.hapusCap) { const n = hapusTeksPutih(c); catatan.push(n ? "Teks timemark/watermark dihapus dan diisi otomatis." : "Tidak ditemukan teks putih yang jelas."); }
  if (o.rapikan) { rapikanWarna(c); catatan.push("Warna dirapikan."); }
  const sk = Math.min(1, MAKS_SISI / Math.max(c.width, c.height));
  const out = document.createElement("canvas"); out.width = Math.round(c.width * sk); out.height = Math.round(c.height * sk);
  out.getContext("2d", { willReadFrequently: true })!.drawImage(c, 0, 0, out.width, out.height);
  let q = 0.82, url = out.toDataURL("image/jpeg", q);
  while (url.length > MAKS_CHAR && q > 0.4) { q -= 0.08; url = out.toDataURL("image/jpeg", q); }
  return { dataUrl: url, catatan, lebar: out.width, tinggi: out.height };
}
