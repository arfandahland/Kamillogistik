import type { ShipmentStatus } from "@kamil/core";
import { SHIPMENT_STATUSES, indexOfStatus } from "@kamil/core";
import type { ShipmentRecord } from "./repo";

/** Label ramah pelanggan untuk 9 tahap di halaman lacak (PRD §3). */
export const PUBLIC_STEPS: Record<Exclude<ShipmentStatus, "CREATED">, { title: string; detail: (s: ShipmentRecord) => string }> = {
  PICKED_UP: { title: "Barang dijemput", detail: (s) => `${s.origin.city} · driver pick-up` },
  AT_ORIGIN_HUB: { title: `Tiba di Hub`, detail: () => "Serah terima ke gudang" },
  SORTED_INVOICED: { title: "Invoice terbit", detail: () => "Berat tertagih dihitung" },
  LOADED: { title: "Menuju pelabuhan", detail: () => "Kontainer disegel" },
  IN_TRANSIT_SEA: { title: "Dalam pelayaran", detail: (s) => (s.vesselName ? `Kapal ${s.vesselName} berangkat` : "Kapal berangkat") },
  ARRIVED_DEST_PORT: { title: "Tiba di pelabuhan tujuan", detail: () => "Kapal sandar" },
  AT_DEST_HUB: { title: "Bongkar dan cek koli", detail: () => "Jumlah koli sesuai" },
  OUT_FOR_DELIVERY: { title: "Sedang diantar", detail: () => "Kurir lokal" },
  DELIVERED: { title: "Diterima", detail: () => "Foto + tanda tangan" },
};

export type PublicTrack = {
  resi: string;
  route: { origin: string; dest: string };
  status: ShipmentStatus;
  statusLabel: string;
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
  const stepStatuses = SHIPMENT_STATUSES.slice(1);
  const history = s.events
    .filter((e) => e.status !== "CREATED")
    .map((e) => {
      const step = PUBLIC_STEPS[e.status as keyof typeof PUBLIC_STEPS];
      const title =
        e.status === "AT_ORIGIN_HUB" ? `Tiba di ${s.origin.name}`
        : e.status === "ARRIVED_DEST_PORT" ? `Tiba di pelabuhan ${s.dest.city}`
        : step.title;
      return { status: e.status, title, detail: step.detail(s), at: e.at, location: e.location ?? null };
    });
  const reached = new Set(history.map((h) => h.status));
  const upcoming = stepStatuses
    .filter((st) => !reached.has(st))
    .map((st) => ({ status: st, title: PUBLIC_STEPS[st as keyof typeof PUBLIC_STEPS].title }));

  const cur = s.status;
  return {
    resi: s.resiNo,
    route: { origin: s.origin.city, dest: s.dest.city },
    status: cur,
    statusLabel: cur === "CREATED" ? "Order diterima" : PUBLIC_STEPS[cur as keyof typeof PUBLIC_STEPS].title,
    eta: s.status === "DELIVERED" ? null : (s.etaAt ?? null),
    progress: { done: Math.max(indexOfStatus(cur), 0), total: stepStatuses.length },
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
