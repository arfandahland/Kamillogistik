/** Rekrutmen: daftar posisi, kelompok, dan teks pesan WhatsApp ke HRD. Slug harus sama dengan daftar di db/migrations/019_lamaran.sql. */
export type Posisi = { slug: string; judul: string; kelompok: "Kantor" | "Penjualan" | "Pengadaan" | "Lapangan"; ringkas: string; syarat: string[]; butuhSim?: boolean };

export const HRD_WA = "6287767021005";
export const HRD_WA_TAMPIL = "0877-6702-1005";

export const POSISI: Posisi[] = [
  { slug: "admin-sales", judul: "Admin Sales", kelompok: "Kantor", ringkas: "Mengurus penawaran, data pelanggan, dan tindak lanjut calon pelanggan.", syarat: ["Teliti dan rapi", "Mahir WhatsApp dan Excel dasar", "Sopan saat melayani pelanggan"] },
  { slug: "admin-operasional", judul: "Admin Operasional", kelompok: "Kantor", ringkas: "Membuat resi, memantau muatan, dan memastikan barang tiba sesuai jadwal.", syarat: ["Teliti dengan angka dan nomor resi", "Siap kerja bergiliran", "Paham dasar pengiriman lebih disukai"] },
  { slug: "admin-gudang", judul: "Admin Gudang", kelompok: "Kantor", ringkas: "Mencatat barang masuk dan keluar gudang serta menyiapkan manifest.", syarat: ["Teliti mencatat", "Bisa memakai aplikasi di HP", "Jujur dan bertanggung jawab"] },
  { slug: "sales-b2b", judul: "Sales B2B", kelompok: "Penjualan", ringkas: "Mencari dan merawat pelanggan perusahaan dengan kontrak pengiriman rutin.", syarat: ["Pengalaman menjual ke perusahaan", "Pandai bernegosiasi", "Punya jaringan lebih disukai"] },
  { slug: "sales-retail", judul: "Sales Retail", kelompok: "Penjualan", ringkas: "Melayani pelanggan perorangan dan pelaku usaha kecil yang mengirim barang.", syarat: ["Ramah dan sabar", "Aktif di media sosial", "Siap target bulanan"] },
  { slug: "sales-rekanan", judul: "Sales Rekanan", kelompok: "Penjualan", ringkas: "Mengajak dan membina mitra gerai serta rekanan di kota tujuan.", syarat: ["Mau sering berkunjung ke mitra", "Pandai membangun hubungan", "Paham wilayah Sulawesi, Papua, atau Maluku lebih disukai"] },
  { slug: "purchasing", judul: "Purchasing", kelompok: "Pengadaan", ringkas: "Membeli kebutuhan operasional seperti kemasan, peralatan, dan perlengkapan gudang.", syarat: ["Teliti membandingkan harga", "Jujur", "Bisa membuat laporan pembelian sederhana"] },
  { slug: "procurement", judul: "Procurement", kelompok: "Pengadaan", ringkas: "Menyusun kerja sama dan kontrak pengadaan jasa dan barang dengan pemasok.", syarat: ["Pengalaman pengadaan atau kontrak", "Pandai bernegosiasi", "Teliti pada dokumen"] },
  { slug: "manajemen-vendor", judul: "Manajemen Vendor", kelompok: "Pengadaan", ringkas: "Menilai dan mengatur vendor angkutan, kapal, dan gudang agar layanan terjaga.", syarat: ["Paham angkutan darat atau laut lebih disukai", "Tegas dan komunikatif", "Bisa menyusun evaluasi vendor"] },
  { slug: "staf-gudang", judul: "Staf Gudang", kelompok: "Lapangan", ringkas: "Menerima, menyortir, menimbang, dan memuat barang.", syarat: ["Sehat dan kuat fisik", "Jujur dan disiplin", "Siap kerja bergiliran"] },
  { slug: "driver-sim-a", judul: "Driver SIM A", kelompok: "Lapangan", ringkas: "Menjemput dan mengantar barang memakai mobil.", syarat: ["Punya SIM A yang berlaku", "Hafal jalan kota", "Jujur dan disiplin waktu"], butuhSim: true },
  { slug: "driver-sim-b", judul: "Driver SIM B1 / B2", kelompok: "Lapangan", ringkas: "Mengemudikan truk dan kendaraan besar untuk muatan antar kota atau pelabuhan.", syarat: ["Punya SIM B1 atau B2 yang berlaku", "Berpengalaman mengemudi kendaraan besar", "Siap perjalanan jauh"], butuhSim: true },
];

export const KELOMPOK_POSISI = ["Kantor", "Penjualan", "Pengadaan", "Lapangan"] as const;
export const posisiDari = (slug: string | undefined | null) => POSISI.find((p) => p.slug === slug);

export const STATUS_LAMARAN = ["BARU", "DIHUBUNGI", "WAWANCARA", "DITERIMA", "TIDAK_LOLOS"] as const;
export type StatusLamaran = (typeof STATUS_LAMARAN)[number];
export const LABEL_STATUS_LAMARAN: Record<StatusLamaran, string> = { BARU: "Baru", DIHUBUNGI: "Sudah dihubungi", WAWANCARA: "Wawancara", DITERIMA: "Diterima", TIDAK_LOLOS: "Tidak lolos" };

/** Pesan WhatsApp pelamar ke HRD setelah formulir terkirim (berkas CV ada di sistem, bukan di pesan). */
export function pesanKeHrd(nama: string, posisi: string, kode: string): string {
  return `Halo HRD Kamil Logistik, saya ${nama.trim()} baru mengirim lamaran untuk posisi ${posisi} lewat website. Kode lamaran saya ${kode}. Mohon dicek ya, terima kasih.`;
}
/** Pesan WhatsApp HRD ke pelamar. */
export function pesanKePelamar(nama: string, posisi: string, kode: string): string {
  return `Halo ${nama.trim().split(/\s+/)[0]}, kami dari HRD Kamil Logistik. Lamaran Anda untuk posisi ${posisi} (kode ${kode}) sudah kami terima. Boleh kami lanjutkan prosesnya?`;
}
export const waHrdLink = (text: string) => `https://wa.me/${HRD_WA}?text=${encodeURIComponent(text)}`;
