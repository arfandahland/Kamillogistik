/**
 * Daftar harga sementara dari materi promosi Kamil Logistik 2026 (Jakarta ke seluruh Sulawesi, dan Makassar ke Papua dan Maluku).
 * DIPAKAI HANYA OLEH KALKULATOR ONGKIR PUBLIK. Tidak dipakai invoice, tarif master, atau laporan: harga resmi tiap resi diisi Kasir.
 * Data lain menyusul. Rute yang sudah ada di master tarif tetap memakai master tarif, bukan daftar ini.
 */
export type HargaBaris = { asal: "JKT" | "MKS"; kota: string; wilayah: string; rate: number; minKg: number; eta: string };

export const DAFTAR_HARGA: HargaBaris[] = [
  { asal: "JKT", kota: "Makassar", wilayah: "Sulawesi Selatan", rate: 2500, minKg: 50, eta: "4-6" },
  { asal: "JKT", kota: "Maros", wilayah: "Sulawesi Selatan", rate: 3000, minKg: 50, eta: "4-6" },
  { asal: "JKT", kota: "Pangkajene", wilayah: "Sulawesi Selatan", rate: 3500, minKg: 50, eta: "5-9" },
  { asal: "JKT", kota: "Barru", wilayah: "Sulawesi Selatan", rate: 4000, minKg: 50, eta: "5-9" },
  { asal: "JKT", kota: "Pare-Pare", wilayah: "Sulawesi Selatan", rate: 4000, minKg: 50, eta: "5-9" },
  { asal: "JKT", kota: "Pinrang", wilayah: "Sulawesi Selatan", rate: 4000, minKg: 50, eta: "5-9" },
  { asal: "JKT", kota: "Sidrap", wilayah: "Sulawesi Selatan", rate: 4000, minKg: 50, eta: "5-9" },
  { asal: "JKT", kota: "Gowa", wilayah: "Sulawesi Selatan", rate: 3000, minKg: 50, eta: "4-6" },
  { asal: "JKT", kota: "Takalar", wilayah: "Sulawesi Selatan", rate: 3500, minKg: 50, eta: "4-6" },
  { asal: "JKT", kota: "Jeneponto", wilayah: "Sulawesi Selatan", rate: 4000, minKg: 50, eta: "5-9" },
  { asal: "JKT", kota: "Bantaeng", wilayah: "Sulawesi Selatan", rate: 4000, minKg: 50, eta: "5-9" },
  { asal: "JKT", kota: "Bulukumba", wilayah: "Sulawesi Selatan", rate: 4000, minKg: 50, eta: "5-9" },
  { asal: "JKT", kota: "Selayar", wilayah: "Sulawesi Selatan", rate: 7000, minKg: 100, eta: "5-10" },
  { asal: "JKT", kota: "Bone", wilayah: "Sulawesi Selatan", rate: 4500, minKg: 50, eta: "5-9" },
  { asal: "JKT", kota: "Sinjai", wilayah: "Sulawesi Selatan", rate: 4000, minKg: 50, eta: "5-9" },
  { asal: "JKT", kota: "Enrekang", wilayah: "Sulawesi Selatan", rate: 4500, minKg: 50, eta: "5-9" },
  { asal: "JKT", kota: "Soppeng", wilayah: "Sulawesi Selatan", rate: 4500, minKg: 50, eta: "5-9" },
  { asal: "JKT", kota: "Wajo", wilayah: "Sulawesi Selatan", rate: 4500, minKg: 50, eta: "5-9" },
  { asal: "JKT", kota: "Palopo", wilayah: "Sulawesi Selatan", rate: 4500, minKg: 50, eta: "5-9" },
  { asal: "JKT", kota: "Luwu", wilayah: "Sulawesi Selatan", rate: 5000, minKg: 50, eta: "5-9" },
  { asal: "JKT", kota: "Luwu Utara", wilayah: "Sulawesi Selatan", rate: 4500, minKg: 50, eta: "5-9" },
  { asal: "JKT", kota: "Luwu Timur", wilayah: "Sulawesi Selatan", rate: 4500, minKg: 50, eta: "5-9" },
  { asal: "JKT", kota: "Toraja", wilayah: "Sulawesi Selatan", rate: 5000, minKg: 50, eta: "5-9" },
  { asal: "JKT", kota: "Toraja Utara", wilayah: "Sulawesi Selatan", rate: 5000, minKg: 50, eta: "5-9" },
  { asal: "JKT", kota: "Kendari", wilayah: "Sulawesi Tenggara", rate: 6000, minKg: 50, eta: "9-12" },
  { asal: "JKT", kota: "Kolaka Utara", wilayah: "Sulawesi Tenggara", rate: 5500, minKg: 50, eta: "9-12" },
  { asal: "JKT", kota: "Kolaka", wilayah: "Sulawesi Tenggara", rate: 5500, minKg: 50, eta: "9-12" },
  { asal: "JKT", kota: "Kolaka Timur", wilayah: "Sulawesi Tenggara", rate: 6000, minKg: 50, eta: "9-12" },
  { asal: "JKT", kota: "Bombana", wilayah: "Sulawesi Tenggara", rate: 7000, minKg: 50, eta: "9-12" },
  { asal: "JKT", kota: "Konawe", wilayah: "Sulawesi Tenggara", rate: 6000, minKg: 50, eta: "9-12" },
  { asal: "JKT", kota: "Konawe Selatan", wilayah: "Sulawesi Tenggara", rate: 6000, minKg: 50, eta: "9-12" },
  { asal: "JKT", kota: "Konawe Utara", wilayah: "Sulawesi Tenggara", rate: 6000, minKg: 50, eta: "9-12" },
  { asal: "JKT", kota: "Muna", wilayah: "Sulawesi Tenggara", rate: 6000, minKg: 50, eta: "9-12" },
  { asal: "JKT", kota: "Muna Barat", wilayah: "Sulawesi Tenggara", rate: 8000, minKg: 100, eta: "9-12" },
  { asal: "JKT", kota: "Bau Bau", wilayah: "Sulawesi Tenggara", rate: 7000, minKg: 50, eta: "9-12" },
  { asal: "JKT", kota: "Buton Utara", wilayah: "Sulawesi Tenggara", rate: 9000, minKg: 100, eta: "9-12" },
  { asal: "JKT", kota: "Buton Tengah", wilayah: "Sulawesi Tenggara", rate: 9000, minKg: 100, eta: "9-12" },
  { asal: "JKT", kota: "Polewali Mandar", wilayah: "Sulawesi Barat dan Sulawesi Tengah", rate: 4500, minKg: 50, eta: "9-12" },
  { asal: "JKT", kota: "Majene", wilayah: "Sulawesi Barat dan Sulawesi Tengah", rate: 4500, minKg: 50, eta: "9-12" },
  { asal: "JKT", kota: "Mamasa", wilayah: "Sulawesi Barat dan Sulawesi Tengah", rate: 6000, minKg: 50, eta: "9-12" },
  { asal: "JKT", kota: "Mamuju", wilayah: "Sulawesi Barat dan Sulawesi Tengah", rate: 4500, minKg: 50, eta: "9-12" },
  { asal: "JKT", kota: "Mamuju Tengah", wilayah: "Sulawesi Barat dan Sulawesi Tengah", rate: 4500, minKg: 50, eta: "9-12" },
  { asal: "JKT", kota: "Pasangkayu", wilayah: "Sulawesi Barat dan Sulawesi Tengah", rate: 4500, minKg: 50, eta: "9-12" },
  { asal: "JKT", kota: "Donggala", wilayah: "Sulawesi Barat dan Sulawesi Tengah", rate: 5000, minKg: 50, eta: "9-12" },
  { asal: "JKT", kota: "Palu", wilayah: "Sulawesi Barat dan Sulawesi Tengah", rate: 5000, minKg: 50, eta: "9-12" },
  { asal: "JKT", kota: "Parigi", wilayah: "Sulawesi Barat dan Sulawesi Tengah", rate: 5000, minKg: 50, eta: "9-12" },
  { asal: "JKT", kota: "Poso", wilayah: "Sulawesi Barat dan Sulawesi Tengah", rate: 6000, minKg: 50, eta: "9-12" },
  { asal: "JKT", kota: "Luwuk Banggai", wilayah: "Sulawesi Barat dan Sulawesi Tengah", rate: 7000, minKg: 50, eta: "9-12" },
  { asal: "JKT", kota: "Pendolo", wilayah: "Sulawesi Barat dan Sulawesi Tengah", rate: 5000, minKg: 50, eta: "9-12" },
  { asal: "JKT", kota: "Morowali Utara", wilayah: "Sulawesi Barat dan Sulawesi Tengah", rate: 5500, minKg: 50, eta: "9-12" },
  { asal: "JKT", kota: "Morowali", wilayah: "Sulawesi Barat dan Sulawesi Tengah", rate: 6000, minKg: 50, eta: "9-12" },
  { asal: "JKT", kota: "Tojo Una-Una", wilayah: "Sulawesi Barat dan Sulawesi Tengah", rate: 7000, minKg: 50, eta: "9-12" },
  { asal: "JKT", kota: "Sigi", wilayah: "Sulawesi Barat dan Sulawesi Tengah", rate: 6000, minKg: 50, eta: "9-12" },
  { asal: "JKT", kota: "Toli Toli", wilayah: "Sulawesi Barat dan Sulawesi Tengah", rate: 7000, minKg: 50, eta: "9-12" },
  { asal: "JKT", kota: "Parigi Moutong", wilayah: "Sulawesi Barat dan Sulawesi Tengah", rate: 5500, minKg: 50, eta: "9-12" },
  { asal: "JKT", kota: "Buol", wilayah: "Sulawesi Barat dan Sulawesi Tengah", rate: 6000, minKg: 50, eta: "9-12" },
  { asal: "JKT", kota: "Bolaemo", wilayah: "Gorontalo dan Sulawesi Utara", rate: 7500, minKg: 50, eta: "9-14" },
  { asal: "JKT", kota: "Bone Bolango", wilayah: "Gorontalo dan Sulawesi Utara", rate: 7500, minKg: 50, eta: "9-14" },
  { asal: "JKT", kota: "Kabupaten Gorontalo", wilayah: "Gorontalo dan Sulawesi Utara", rate: 6500, minKg: 50, eta: "9-14" },
  { asal: "JKT", kota: "Gorontalo Utara", wilayah: "Gorontalo dan Sulawesi Utara", rate: 7500, minKg: 50, eta: "9-14" },
  { asal: "JKT", kota: "Pohuwato", wilayah: "Gorontalo dan Sulawesi Utara", rate: 6000, minKg: 50, eta: "9-14" },
  { asal: "JKT", kota: "Kota Gorontalo", wilayah: "Gorontalo dan Sulawesi Utara", rate: 6500, minKg: 50, eta: "9-14" },
  { asal: "JKT", kota: "Minahasa", wilayah: "Gorontalo dan Sulawesi Utara", rate: 6000, minKg: 50, eta: "9-14" },
  { asal: "JKT", kota: "Bitung", wilayah: "Gorontalo dan Sulawesi Utara", rate: 7000, minKg: 50, eta: "9-14" },
  { asal: "JKT", kota: "Manado", wilayah: "Gorontalo dan Sulawesi Utara", rate: 6000, minKg: 50, eta: "9-14" },
  { asal: "JKT", kota: "Tomohon", wilayah: "Gorontalo dan Sulawesi Utara", rate: 7000, minKg: 50, eta: "9-14" },
  { asal: "JKT", kota: "Minahasa Utara", wilayah: "Gorontalo dan Sulawesi Utara", rate: 8000, minKg: 50, eta: "9-14" },
  { asal: "JKT", kota: "Minahasa Selatan", wilayah: "Gorontalo dan Sulawesi Utara", rate: 8000, minKg: 50, eta: "9-14" },
  { asal: "JKT", kota: "Minahasa Tenggara", wilayah: "Gorontalo dan Sulawesi Utara", rate: 8000, minKg: 50, eta: "9-14" },
  { asal: "JKT", kota: "Kotamobagu", wilayah: "Gorontalo dan Sulawesi Utara", rate: 8000, minKg: 50, eta: "9-14" },
  { asal: "JKT", kota: "Bolaang Mongondow", wilayah: "Gorontalo dan Sulawesi Utara", rate: 8000, minKg: 50, eta: "9-14" },
  { asal: "JKT", kota: "Mongondow Utara", wilayah: "Gorontalo dan Sulawesi Utara", rate: 8000, minKg: 50, eta: "9-14" },
  { asal: "JKT", kota: "Mongondow Timur", wilayah: "Gorontalo dan Sulawesi Utara", rate: 8000, minKg: 50, eta: "9-14" },
  { asal: "JKT", kota: "Mongondow Selatan", wilayah: "Gorontalo dan Sulawesi Utara", rate: 8000, minKg: 50, eta: "9-14" },
  { asal: "MKS", kota: "Jayapura", wilayah: "Papua", rate: 7000, minKg: 50, eta: "10-12" },
  { asal: "MKS", kota: "Timika", wilayah: "Papua", rate: 7000, minKg: 50, eta: "12-14" },
  { asal: "MKS", kota: "Nabire", wilayah: "Papua", rate: 7000, minKg: 50, eta: "12-14" },
  { asal: "MKS", kota: "Biak", wilayah: "Papua", rate: 7000, minKg: 50, eta: "12-14" },
  { asal: "MKS", kota: "Monokwari", wilayah: "Papua", rate: 7000, minKg: 50, eta: "12-14" },
  { asal: "MKS", kota: "Merauke", wilayah: "Papua", rate: 7000, minKg: 50, eta: "12-14" },
  { asal: "MKS", kota: "Sorong", wilayah: "Papua", rate: 7000, minKg: 50, eta: "10-12" },
  { asal: "MKS", kota: "Wamena", wilayah: "Papua", rate: 7000, minKg: 50, eta: "14-16" },
  { asal: "MKS", kota: "Ternate", wilayah: "Maluku", rate: 6000, minKg: 50, eta: "7-10" },
  { asal: "MKS", kota: "Ambon", wilayah: "Maluku", rate: 6000, minKg: 50, eta: "7-10" },
  { asal: "MKS", kota: "Tual", wilayah: "Maluku", rate: 7000, minKg: 50, eta: "10-12" },
  { asal: "MKS", kota: "Halmahera", wilayah: "Maluku", rate: 10000, minKg: 50, eta: "10-12" },
  { asal: "MKS", kota: "Sofifi", wilayah: "Maluku", rate: 10000, minKg: 50, eta: "10-12" },
  { asal: "MKS", kota: "Saumlaki", wilayah: "Maluku", rate: 10000, minKg: 50, eta: "10-12" },
];

export const ASAL_HARGA: Record<HargaBaris["asal"], { kota: string; layanan: string; catatan: string[] }> = {
  JKT: { kota: "Jakarta", layanan: "Dijemput dan diantar (door to door)", catatan: [
    "Harga masih dapat dinego.",
    "Biaya sudah termasuk biaya door to door.",
    "Harga belum termasuk biaya asuransi barang.",
    "Biaya belum termasuk PPh sebesar 1,1%.",
    "Biaya belum termasuk bongkar muat dan biaya lainnya di lokasi.",
  ] },
  MKS: { kota: "Makassar", layanan: "Dijemput sampai pelabuhan tujuan (door to port)", catatan: [
    "Harga masih dapat dinego.",
    "Biaya sudah termasuk biaya door to port.",
    "Harga belum termasuk biaya asuransi barang.",
    "Biaya belum termasuk PPN sebesar 1,1%.",
    "Biaya belum termasuk bongkar muat dan biaya lainnya di lokasi.",
  ] },
};

/** Kode tujuan untuk daftar ini: "PL-" + nomor urut baris (data baru ditambahkan di akhir supaya nomor lama tetap). Tidak pernah bentrok dengan kode cabang. */
export const kodeHarga = (h: HargaBaris) => "PL-" + String(DAFTAR_HARGA.indexOf(h) + 1).padStart(3, "0");

export function cariHarga(asal: string, kodeTujuan: string): HargaBaris | undefined {
  return DAFTAR_HARGA.find((h) => h.asal === asal.toUpperCase() && kodeHarga(h) === kodeTujuan.toUpperCase());
}

/** "4-6" -> 5 (tengah, dibulatkan ke atas) untuk kolom estimasi angka. */
export const etaTengah = (eta: string) => { const [a, b] = eta.split("-").map(Number); return Math.ceil(((a ?? 0) + (b ?? a ?? 0)) / 2); };

/**
 * Arah sebaliknya (kota tujuan ke Jakarta atau Makassar). Daftar harga resmi baru satu arah, jadi sementara arah sebaliknya
 * memakai tarif, minimal, dan estimasi yang sama. Hasilnya diberi catatan agar pelanggan mengonfirmasi lewat WhatsApp.
 * Ganti dengan daftar harga arah sebaliknya begitu diterima.
 */
export function cariHargaBalik(asalKode: string, tujuan: string): HargaBaris | undefined {
  return DAFTAR_HARGA.find((h) => kodeHarga(h) === asalKode.toUpperCase() && h.asal === tujuan.toUpperCase());
}
export const CATATAN_BALIK = "Tarif arah sebaliknya sementara memakai tarif yang sama dengan arah berangkat. Hubungi kami lewat WhatsApp untuk konfirmasi harga pasti.";
