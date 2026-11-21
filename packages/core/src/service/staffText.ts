import { canSetStatus, nextStatus, type Actor, type AnyStatus, type ShipmentStatus } from "../status";

/** Teks untuk petugas — tanpa istilah teknis. */
export const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: "Pemilik / Admin pusat",
  HRD: "HRD (kepegawaian dan rekrutmen)",
  FINANCE: "Finance",
  CS_SALES: "CS dan Sales",
  KONTEN: "Admin konten website",
  HUB_MANAGER: "Kepala gudang",
  MITRA_POS: "Kasir mitra",
  DRIVER: "Kurir",
  WAREHOUSE: "Petugas gudang",
  CONTAINER_DRIVER: "Sopir kontainer",
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

/** Pemilik hanya memantau (lihat dashboard); pembuatan resi dilakukan petugas operasional. */
export const CAN_CREATE_ORDER = ["HUB_MANAGER", "MITRA_POS", "CS_SALES"];
export const OWNER_ROLE = "SUPER_ADMIN";
export const SEES_MONEY = ["SUPER_ADMIN", "HUB_MANAGER", "MITRA_POS", "FINANCE"];

/** Peran yang bisa dipilih saat Pemilik membuat akun baru. Tiga yang terakhir tidak terikat cabang. */
export const PERAN_BARU = ["DRIVER", "WAREHOUSE", "CONTAINER_DRIVER", "MITRA_POS", "HUB_MANAGER", "HRD", "KONTEN", "FINANCE", "CS_SALES", "SUPER_ADMIN"] as const;
export const PERAN_TANPA_CABANG = ["HRD", "KONTEN", "FINANCE", "SUPER_ADMIN"] as const;
export const PERAN_KETERANGAN: Record<string, string> = {
  HRD: "Kepegawaian (dokumen, shift, absensi, cuti, rekap) dan Lamaran kerja. Tidak melihat resi maupun keuangan.",
  FINANCE: "Tagihan, pembayaran, komisi, dan laporan keuangan seluruh cabang. Tidak menjalankan langkah resi.",
  CS_SALES: "Membuat booking resi, memantau resi cabang, tindak lanjut, pesanan jemput, dan mengusulkan ganti rugi klaim. Tidak melihat uang.",
  KONTEN: "Hanya mengelola foto dan testimoni di website.",
  SUPER_ADMIN: "Akses penuh seperti Pemilik: semua menu, tarif, mitra, keuangan, dan petugas. Berikan dengan hati-hati.",
};
