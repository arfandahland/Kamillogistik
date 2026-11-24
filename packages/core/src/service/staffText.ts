import { canSetStatus, nextStatus, type Actor, type AnyStatus, type ShipmentStatus } from "../status";

/** Teks untuk petugas — tanpa istilah teknis. */
export const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  OWNER: "Pemilik (pantau)",
  HRD: "HRD (kepegawaian dan rekrutmen)",
  FINANCE: "Finance",
  CS_SALES: "CS dan Sales",
  KONTEN: "Admin konten website",
  HUB_MANAGER: "Kepala gudang",
  MITRA_POS: "Kasir mitra",
  DRIVER: "Kurir",
  WAREHOUSE: "Petugas gudang",
  CONTAINER_DRIVER: "Sopir kontainer",
  MV: "MV (Mitra Vendor)",
  MV_MASTER: "MV Master",
};

export const STATUS_LABEL: Record<AnyStatus, string> = {
  CREATED: "Order baru",
  PICKED_UP: "Sudah dijemput",
  AT_ORIGIN_HUB: "Di gudang asal",
  SORTED_INVOICED: "Sudah ditimbang",
  LOADED: "Sudah dimuat",
  IN_TRANSIT_SEA: "Dalam pelayaran",
  ARRIVED_DEST_PORT: "Tiba di pelabuhan tujuan",
  AT_DEST_HUB: "Di gudang tujuan",
  OUT_FOR_DELIVERY: "Sedang diantar",
  DELIVERED: "Sudah diterima",
  CANCELLED: "Dibatalkan",
  EXCEPTION: "Perlu ditangani",
};

/** Label tahap menurut moda: kapal untuk laut, pesawat untuk udara, truk untuk darat. */
export function statusLabel(status: AnyStatus, mode: "LAUT" | "DARAT" | "UDARA" = "LAUT"): string {
  if (mode === "UDARA") {
    if (status === "IN_TRANSIT_SEA") return "Dalam penerbangan";
    if (status === "ARRIVED_DEST_PORT") return "Tiba di bandara tujuan";
  }
  if (mode === "DARAT") {
    if (status === "IN_TRANSIT_SEA") return "Dalam perjalanan darat";
    if (status === "ARRIVED_DEST_PORT") return "Tiba di kota tujuan";
  }
  return STATUS_LABEL[status];
}

const ACTION_LABEL: Partial<Record<ShipmentStatus, { label: string; done: string }>> = {
  PICKED_UP: { label: "Barang sudah saya jemput", done: "Tercatat: barang sudah dijemput." },
  AT_ORIGIN_HUB: { label: "Barang sudah saya terima di gudang", done: "Tercatat: barang sudah diterima di gudang." },
  LOADED: { label: "Barang sudah dimuat ke kontainer", done: "Tercatat: barang sudah dimuat." },
  IN_TRANSIT_SEA: { label: "Kapal sudah berangkat", done: "Tercatat: kapal sudah berangkat." },
  ARRIVED_DEST_PORT: { label: "Kapal sudah sandar di pelabuhan tujuan", done: "Tercatat: kapal sudah sandar." },
  AT_DEST_HUB: { label: "Barang sudah dibongkar di gudang tujuan", done: "Tercatat: barang sudah di gudang tujuan." },
  OUT_FOR_DELIVERY: { label: "Saya berangkat mengantar barang", done: "Tercatat: barang sedang diantar." },
};

export type NextAction =
  | { kind: "advance"; to: ShipmentStatus; label: string; done: string }
  | { kind: "measure" }
  | { kind: "pod" }
  | { kind: "manifest"; label: string; hint: string };

/** Tombol langkah berikutnya untuk peran ini, atau null bila bukan giliran peran ini. */
export function nextAction(role: Actor, status: AnyStatus, masuk: "PICKUP" | "DROPOFF" = "PICKUP"): NextAction | null {
  if (status === "CANCELLED" || status === "EXCEPTION" || status === "DELIVERED") return null;
  const to = nextStatus(status, masuk);
  if (!to || !canSetStatus(role, to)) return null;
  if (to === "AT_ORIGIN_HUB" && status === "CREATED") return { kind: "advance", to, label: "Barang diantar pelanggan sudah saya terima", done: "Tercatat: barang diantar sendiri oleh pelanggan dan sudah diterima di gudang." };
  if (to === "SORTED_INVOICED") return { kind: "measure" };
  // Muat sampai bongkar dilakukan lewat manifest, bukan per resi.
  if (to === "LOADED") return { kind: "manifest", label: "Masukkan ke manifest", hint: "Barang sudah ditimbang. Masukkan resi ini ke manifest muatan tujuan yang sama, lalu segel manifestnya." };
  if (to === "IN_TRANSIT_SEA") return { kind: "manifest", label: "Buka manifest", hint: "Keberangkatan dicatat untuk seluruh manifest sekaligus." };
  if (to === "ARRIVED_DEST_PORT") return { kind: "manifest", label: "Buka manifest", hint: "Kedatangan dicatat untuk seluruh manifest sekaligus." };
  if (to === "AT_DEST_HUB") return { kind: "manifest", label: "Bongkar lewat manifest", hint: "Pindai tiap barang di manifest untuk memastikan jumlahnya cocok." };
  if (to === "DELIVERED") return { kind: "pod" };
  const a = ACTION_LABEL[to];
  return a ? { kind: "advance", to, ...a } : null;
}

export const STATUS_GROUPS = {
  aktif: ["CREATED", "PICKED_UP", "AT_ORIGIN_HUB", "SORTED_INVOICED", "LOADED", "IN_TRANSIT_SEA", "ARRIVED_DEST_PORT", "AT_DEST_HUB", "OUT_FOR_DELIVERY"],
  selesai: ["DELIVERED", "CANCELLED"],
} as const;

/** Pembuatan resi hanya oleh Kasir (satu pintu per gudang). */
export const CAN_CREATE_ORDER = ["MITRA_POS"];
/** Satu pintu: resi dibuat dan label dicetak hanya oleh Kasir di tiap gudang atau gerai. */
export const CAN_PRINT_LABEL = ["MITRA_POS"];
export const OWNER_ROLE = "SUPER_ADMIN";
/** Tampilan pantauan pemilik: Super Admin (kendali penuh) dan Owner (hanya memantau). */
export const OWNER_VIEW: readonly string[] = ["SUPER_ADMIN", "OWNER"];
export const SEES_MONEY = ["SUPER_ADMIN", "OWNER", "HUB_MANAGER", "MITRA_POS", "FINANCE"];

/** Peran yang bisa dipilih saat Pemilik membuat akun baru. Tiga yang terakhir tidak terikat cabang. */
/** Peran untuk akun baru. Sopir (CONTAINER_DRIVER) tidak dibuat lagi: nama sopir dan vendor dicatat sebagai teks pada manifest. */
export const PERAN_BARU = ["DRIVER", "WAREHOUSE", "MITRA_POS", "HUB_MANAGER", "HRD", "KONTEN", "FINANCE", "CS_SALES", "MV", "MV_MASTER", "OWNER", "SUPER_ADMIN"] as const;
export const PERAN_TANPA_CABANG = ["HRD", "KONTEN", "FINANCE", "MV_MASTER", "OWNER", "SUPER_ADMIN"] as const;
export const PERAN_KETERANGAN: Record<string, string> = {
  HRD: "Kepegawaian (dokumen, shift, absensi, cuti, rekap) dan Lamaran kerja. Tidak melihat resi maupun keuangan.",
  FINANCE: "Tagihan, pembayaran, komisi, dan laporan keuangan seluruh cabang. Tidak menjalankan langkah resi.",
  CS_SALES: "Memantau resi cabang, tindak lanjut, pesanan jemput, dan mengusulkan ganti rugi klaim. Tidak membuat resi dan tidak melihat uang.",
  KONTEN: "Hanya mengelola foto dan testimoni di website.",
  MV: "Mengelola vendor, alokasi, HPP, SJ balik, dan dokumen pengiriman cabangnya. Melihat penjualan semua cabang, hanya baca.",
  MV_MASTER: "Semua tugas MV untuk semua cabang, ditambah memverifikasi vendor yang diusulkan.",
  OWNER: "Hanya memantau: dashboard, semua resi, keuangan, laporan, margin, dan peta. Tidak bisa mengubah data apa pun.",
  SUPER_ADMIN: "Kendali penuh: semua menu, tarif, mitra, petugas, dan konsol koreksi data (alasan wajib, tercatat). Berikan dengan hati-hati.",
};
