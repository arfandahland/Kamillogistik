import { canSetStatus, nextStatus, type Actor, type AnyStatus, type ShipmentStatus } from "../status";

/** Teks untuk petugas — tanpa istilah teknis. */
export const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: "Pemilik",
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
  | { kind: "pod" };

/** Tombol langkah berikutnya untuk peran ini, atau null bila bukan giliran peran ini. */
export function nextAction(role: Actor, status: AnyStatus, masuk: "PICKUP" | "DROPOFF" = "PICKUP"): NextAction | null {
  if (status === "CANCELLED" || status === "EXCEPTION" || status === "DELIVERED") return null;
  const to = nextStatus(status, masuk);
  if (!to || !canSetStatus(role, to)) return null;
  if (to === "AT_ORIGIN_HUB" && status === "CREATED") return { kind: "advance", to, label: "Barang diantar pelanggan sudah saya terima", done: "Tercatat: barang diantar sendiri oleh pelanggan dan sudah diterima di gudang." };
  if (to === "SORTED_INVOICED") return { kind: "measure" };
  if (to === "DELIVERED") return { kind: "pod" };
  const a = ACTION_LABEL[to];
  return a ? { kind: "advance", to, ...a } : null;
}

export const STATUS_GROUPS = {
  aktif: ["CREATED", "PICKED_UP", "AT_ORIGIN_HUB", "SORTED_INVOICED", "LOADED", "IN_TRANSIT_SEA", "ARRIVED_DEST_PORT", "AT_DEST_HUB", "OUT_FOR_DELIVERY"],
  selesai: ["DELIVERED", "CANCELLED"],
} as const;

/** Pemilik hanya memantau (lihat dashboard); pembuatan resi dilakukan petugas operasional. */
export const CAN_CREATE_ORDER = ["HUB_MANAGER", "MITRA_POS"];
export const OWNER_ROLE = "SUPER_ADMIN";
export const SEES_MONEY = ["SUPER_ADMIN", "HUB_MANAGER", "MITRA_POS"];
