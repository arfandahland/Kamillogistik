import type { AnyStatus, ShipmentStatus } from "../status";
import { stagesFor } from "../status";
import type { ShipmentRecord } from "./repo";

/** Label ramah pelanggan untuk 9 tahap di halaman lacak (PRD §3). */
export const PUBLIC_STEPS: Record<Exclude<ShipmentStatus, "CREATED">, { title: string; detail: (s: ShipmentRecord) => string }> = {
  PICKED_UP: { title: "Barang dijemput", detail: (s) => `Di ${s.origin.city}, diambil petugas kami` },
  AT_ORIGIN_HUB: { title: "Tiba di gudang", detail: () => "Barang diserahkan ke gudang kami" },
  SORTED_INVOICED: { title: "Ditimbang dan tagihan dibuat", detail: () => "Barang ditimbang, ongkir pasti sudah dihitung" },
  LOADED: { title: "Menuju pelabuhan", detail: () => "Barang sudah dimuat ke kontainer dan disegel" },
  IN_TRANSIT_SEA: { title: "Dalam pelayaran", detail: (s) => (s.vesselName ? `Kapal ${s.vesselName} sudah berangkat` : "Kapal sudah berangkat") },
  ARRIVED_DEST_PORT: { title: "Tiba di pelabuhan tujuan", detail: () => "Kapal sudah sandar" },
  AT_DEST_HUB: { title: "Dibongkar dan dicek", detail: () => "Jumlah barang sudah dicocokkan" },
  OUT_FOR_DELIVERY: { title: "Sedang diantar", detail: () => "Kurir kami menuju alamat penerima" },
  DELIVERED: { title: "Sudah diterima", detail: () => "Ada foto dan tanda tangan penerima" },
};

/** Kata-kata menyesuaikan moda: kapal untuk laut, pesawat untuk udara, truk untuk darat. */
const MODA_KATA: Record<"LAUT" | "DARAT" | "UDARA", { pergi: string; tiba: string; muat: string; kapal: string }> = {
  LAUT: { pergi: "Dalam pelayaran", tiba: "Tiba di pelabuhan", muat: "Menuju pelabuhan", kapal: "Kapal" },
  UDARA: { pergi: "Dalam penerbangan", tiba: "Tiba di bandara", muat: "Menuju bandara", kapal: "Pesawat" },
  DARAT: { pergi: "Dalam perjalanan darat", tiba: "Tiba di kota", muat: "Siap berangkat", kapal: "Truk" },
};
export function stepTitle(st: string, mode: "LAUT" | "DARAT" | "UDARA", fallback: string): string {
  const k = MODA_KATA[mode];
  if (st === "LOADED") return k.muat;
  if (st === "IN_TRANSIT_SEA") return k.pergi;
  if (st === "ARRIVED_DEST_PORT") return `${k.tiba} tujuan`;
  return fallback;
}
function stepDetail(st: string, mode: "LAUT" | "DARAT" | "UDARA", fallback: string): string {
  const k = MODA_KATA[mode];
  if (st === "LOADED") return mode === "UDARA" ? "Barang sudah dikemas dan siap naik pesawat" : mode === "DARAT" ? "Barang sudah dimuat ke truk" : fallback;
  if (st === "IN_TRANSIT_SEA") return mode === "LAUT" ? fallback : `${k.kapal} sudah berangkat`;
  if (st === "ARRIVED_DEST_PORT") return mode === "LAUT" ? fallback : `${k.kapal} sudah tiba`;
  return fallback;
}

export type PublicTrack = {
  resi: string;
  route: { origin: string; dest: string };
  status: AnyStatus;
  statusLabel: string;
  mode: "LAUT" | "DARAT" | "UDARA";
  pickupType: "PICKUP" | "DROPOFF";
  eta: string | null;
  progress: { done: number; total: number };
  history: { status: ShipmentStatus; title: string; detail: string; at: string; location: string | null }[];
  upcoming: { status: ShipmentStatus; title: string }[];
  pod: { receiverName: string; signedAt: string; hasPhoto: boolean; hasSignature: boolean } | null;
};

/**
 * Proyeksi publik. Whitelist eksplisit: HANYA field di bawah yang keluar.
 * Tidak ada lokasi pribadi petugas, nama driver, GPS, atau data keuangan (PRD §3).
 */
export function toPublicTrack(s: ShipmentRecord): PublicTrack {
  const mode = s.mode ?? "LAUT";
  const masuk = s.pickupType ?? "PICKUP";
  const stepStatuses = stagesFor(masuk).slice(1); // tanpa 'CREATED'; barang antaran sendiri juga tanpa 'dijemput'
  const history = s.events
    .filter((e) => e.status !== "CREATED")
    .map((e) => {
      const step = PUBLIC_STEPS[e.status as keyof typeof PUBLIC_STEPS];
      const title =
        e.status === "AT_ORIGIN_HUB" ? `Tiba di gudang ${s.origin.city}`
        : e.status === "ARRIVED_DEST_PORT" ? `${MODA_KATA[mode].tiba} ${s.dest.city}`
        : stepTitle(e.status, mode, step.title);
      return { status: e.status, title, detail: stepDetail(e.status, mode, step.detail(s)), at: e.at, location: e.location ?? null };
    });
  const reached = new Set(history.map((h) => h.status));
  const upcoming = stepStatuses
    .filter((st) => !reached.has(st))
    .map((st) => ({ status: st, title: stepTitle(st, mode, PUBLIC_STEPS[st as keyof typeof PUBLIC_STEPS].title) }));

  const cur = s.status;
  const label =
    cur === "CREATED" ? "Order diterima"
    : cur === "CANCELLED" ? "Dibatalkan"
    : cur === "EXCEPTION" ? "Sedang ditangani petugas kami"
    : stepTitle(cur, mode, PUBLIC_STEPS[cur].title);
  return {
    resi: s.resiNo,
    route: { origin: s.origin.city, dest: s.dest.city },
    status: cur,
    statusLabel: label,
    mode,
    pickupType: masuk,
    eta: s.status === "DELIVERED" ? null : (s.etaAt ?? null),
    progress: { done: history.length, total: stepStatuses.length },
    history,
    upcoming,
    pod: s.pod
      ? { receiverName: maskName(s.pod.receiverName), signedAt: s.pod.signedAt, hasPhoto: !!s.pod.photoUrl, hasSignature: !!s.pod.signatureUrl }
      : null,
  };
}

/** "Budi Santoso" -> "Budi S." — minimalkan data pribadi di halaman tanpa login. */
export function maskName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) return parts[0] ?? "";
  return `${parts[0]} ${parts.slice(1).map((p) => p[0]!.toUpperCase() + ".").join(" ")}`;
}
