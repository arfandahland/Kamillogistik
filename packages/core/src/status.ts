/**
 * Mesin status resi + serah terima dua arah (PRD §10, F-11, F-17).
 * Status hanya maju lewat tindakan yang sah. Pemegang barang berpindah
 * hanya setelah penerima mengonfirmasi (ACCEPTED).
 */

export const SHIPMENT_STATUSES = [
  "CREATED",
  "PICKED_UP",
  "AT_ORIGIN_HUB",
  "SORTED_INVOICED",
  "LOADED",
  "IN_TRANSIT_SEA",
  "ARRIVED_DEST_PORT",
  "AT_DEST_HUB",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
] as const;
export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number];
export type TerminalStatus = "CANCELLED" | "EXCEPTION";
export type AnyStatus = ShipmentStatus | TerminalStatus;

export type Actor =
  | "RETAIL" | "B2B" | "PARTNER_API"
  | "SUPER_ADMIN" | "HUB_MANAGER" | "MITRA_POS"
  | "DRIVER" | "WAREHOUSE" | "CONTAINER_DRIVER" | "SYSTEM";

/** Peran yang boleh memicu perpindahan ke status tertentu (RBAC alur). */
const ALLOWED_ACTORS: Record<ShipmentStatus, Actor[]> = {
  CREATED: ["RETAIL", "B2B", "PARTNER_API", "SUPER_ADMIN", "HUB_MANAGER", "MITRA_POS", "SYSTEM"],
  PICKED_UP: ["DRIVER", "HUB_MANAGER", "SUPER_ADMIN"],
  AT_ORIGIN_HUB: ["WAREHOUSE", "DRIVER", "HUB_MANAGER", "SUPER_ADMIN"],
  SORTED_INVOICED: ["WAREHOUSE", "HUB_MANAGER", "SUPER_ADMIN"],
  LOADED: ["WAREHOUSE", "CONTAINER_DRIVER", "HUB_MANAGER", "SUPER_ADMIN"],
  IN_TRANSIT_SEA: ["CONTAINER_DRIVER", "HUB_MANAGER", "SUPER_ADMIN"],
  ARRIVED_DEST_PORT: ["CONTAINER_DRIVER", "HUB_MANAGER", "SUPER_ADMIN"],
  AT_DEST_HUB: ["WAREHOUSE", "HUB_MANAGER", "SUPER_ADMIN"],
  OUT_FOR_DELIVERY: ["DRIVER", "HUB_MANAGER", "SUPER_ADMIN"],
  DELIVERED: ["DRIVER", "SUPER_ADMIN"],
};

export type TransitionResult = { ok: true; to: ShipmentStatus } | { ok: false; reason: string };

export function indexOfStatus(s: ShipmentStatus): number {
  return SHIPMENT_STATUSES.indexOf(s);
}

export function nextStatus(s: ShipmentStatus): ShipmentStatus | null {
  return SHIPMENT_STATUSES[indexOfStatus(s) + 1] ?? null;
}

export function isFinal(s: AnyStatus): boolean {
  return s === "DELIVERED" || s === "CANCELLED";
}

export type TransitionContext = {
  /** Wajib untuk DELIVERED (F-19). */
  pod?: { photoUrl?: string; signatureUrl?: string; receiverName?: string } | null;
  /** Untuk SORTED_INVOICED: berat sudah diinput (F-12). */
  measured?: boolean;
  /** Masih ada kasus selisih koli yang belum selesai untuk resi ini. */
  openDiscrepancy?: boolean;
};

/** Validasi perpindahan status. Tidak boleh loncat, mundur, atau dilakukan peran yang salah. */
export function validateTransition(
  from: AnyStatus,
  to: ShipmentStatus,
  actor: Actor,
  ctx: TransitionContext = {},
): TransitionResult {
  if (from === "CANCELLED" || from === "EXCEPTION")
    return { ok: false, reason: `resi berstatus ${from}, tidak bisa diubah lewat alur normal` };
  if (from === "DELIVERED") return { ok: false, reason: "resi sudah DELIVERED (final)" };

  const expected = nextStatus(from);
  if (expected !== to)
    return { ok: false, reason: `perpindahan ${from} -> ${to} tidak sah (berikutnya harus ${expected})` };
  if (!ALLOWED_ACTORS[to].includes(actor))
    return { ok: false, reason: `peran ${actor} tidak boleh menetapkan status ${to}` };

  if (to === "SORTED_INVOICED" && !ctx.measured)
    return { ok: false, reason: "berat/dimensi belum diinput; invoice belum bisa terbit" };
  if (to === "OUT_FOR_DELIVERY" && ctx.openDiscrepancy)
    return { ok: false, reason: "masih ada Discrepancy Alert terbuka untuk resi ini" };
  if (to === "DELIVERED") {
    const p = ctx.pod;
    if (!p?.photoUrl || !p?.signatureUrl || !p?.receiverName)
      return { ok: false, reason: "e-POD wajib lengkap: foto, tanda tangan, dan nama penerima" };
  }
  return { ok: true, to };
}

/* ---------- Serah terima dua arah (chain-of-custody) ---------- */

export type HandoverState = "PENDING_ACK" | "ACCEPTED";

export type Handover = {
  id: string;
  shipmentId: string;
  fromUserId: string;
  toUserId: string;
  state: HandoverState;
};

export type Custody = { currentHolderUserId: string };

/** Pemberi memindai -> PENDING_ACK. Pemegang belum berubah. */
export function initiateHandover(
  custody: Custody,
  h: { id: string; shipmentId: string; fromUserId: string; toUserId: string },
): Handover {
  if (h.fromUserId !== custody.currentHolderUserId)
    throw new Error("hanya pemegang barang saat ini yang bisa memulai serah terima");
  if (h.fromUserId === h.toUserId) throw new Error("pemberi dan penerima tidak boleh sama");
  return { ...h, state: "PENDING_ACK" };
}

/** Penerima memindai -> ACCEPTED, baru saat itu pemegang berpindah. */
export function acceptHandover(
  custody: Custody,
  h: Handover,
  acceptorUserId: string,
): { handover: Handover; custody: Custody } {
  if (h.state !== "PENDING_ACK") throw new Error("serah terima sudah diterima");
  if (acceptorUserId !== h.toUserId) throw new Error("hanya penerima yang dituju yang bisa menerima");
  if (custody.currentHolderUserId !== h.fromUserId)
    throw new Error("pemegang barang sudah berubah; serah terima kedaluwarsa");
  return {
    handover: { ...h, state: "ACCEPTED" },
    custody: { currentHolderUserId: h.toUserId },
  };
}
