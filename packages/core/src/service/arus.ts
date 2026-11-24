/**
 * Arus barang per cabang: satu sumber kebenaran untuk memisahkan barang KELUAR (asal = cabang saya)
 * dan barang MASUK (tujuan = cabang saya), lengkap dengan fase, langkah berikutnya, dan giliran peran.
 * Hanya tampilan: tidak mengubah status, hak akses, atau data. Dipakai halaman /app/arus.
 */
import { nextStatus, type AnyStatus, type ShipmentStatus } from "../status";

export type ArahArus = "KELUAR" | "MASUK";
export type FaseArus = { k: string; t: string; d: string; status: ShipmentStatus[] };

export const FASE_KELUAR: FaseArus[] = [
  { k: "siap", t: "Persiapan di sini", d: "Dijemput, diterima gudang, ditimbang, ditagih, disusun ke manifest", status: ["CREATED", "PICKED_UP", "AT_ORIGIN_HUB", "SORTED_INVOICED"] },
  { k: "muat", t: "Siap berangkat", d: "Sudah dimuat, menunggu berangkat", status: ["LOADED"] },
  { k: "jalan", t: "Dalam perjalanan", d: "Sudah berangkat menuju kota tujuan", status: ["IN_TRANSIT_SEA"] },
  { k: "tiba", t: "Di kota tujuan", d: "Sudah tiba, dibongkar, atau sedang diantar ke penerima", status: ["ARRIVED_DEST_PORT", "AT_DEST_HUB", "OUT_FOR_DELIVERY"] },
  { k: "selesai", t: "Diterima", d: "Sudah diterima penerima", status: ["DELIVERED"] },
];

export const FASE_MASUK: FaseArus[] = [
  { k: "asal", t: "Masih di cabang asal", d: "Belum berangkat menuju sini", status: ["CREATED", "PICKED_UP", "AT_ORIGIN_HUB", "SORTED_INVOICED", "LOADED"] },
  { k: "jalan", t: "Dalam perjalanan", d: "Sudah berangkat, menuju sini", status: ["IN_TRANSIT_SEA"] },
  { k: "tiba", t: "Tiba, belum dibongkar", d: "Sudah sampai di sini, menunggu dibongkar", status: ["ARRIVED_DEST_PORT"] },
  { k: "gudang", t: "Di gudang saya", d: "Sudah dibongkar, menunggu diantar", status: ["AT_DEST_HUB"] },
  { k: "antar", t: "Sedang diantar", d: "Kurir membawa ke penerima", status: ["OUT_FOR_DELIVERY"] },
  { k: "selesai", t: "Diterima", d: "Sudah diterima penerima", status: ["DELIVERED"] },
];

export const fasePerArah = (a: ArahArus): FaseArus[] => (a === "KELUAR" ? FASE_KELUAR : FASE_MASUK);

/** Arah untuk satu baris. Resi dalam satu kota (asal = tujuan = cabang saya) dihitung KELUAR. Resi di luar cabang saya: null. */
export function arahArus(arah?: string | null): ArahArus | null {
  if (arah === "KELUAR" || arah === "LOKAL") return "KELUAR";
  if (arah === "MASUK") return "MASUK";
  return null;
}

/** Fase untuk status tertentu; null untuk dibatalkan atau bermasalah (ditampilkan terpisah sebagai "Terkendala"). */
export function faseDari(a: ArahArus, status: AnyStatus): FaseArus | null {
  return fasePerArah(a).find((f) => (f.status as string[]).includes(status)) ?? null;
}

type Aksi = { teks: string; peran: string[]; lokasi: "asal" | "jalan" | "tujuan" };
/** Pekerjaan yang MENUNGGU pada tiap status (langkah berikutnya) dan siapa yang mengerjakannya. */
export function aksiBerikut(status: AnyStatus, masuk: "PICKUP" | "DROPOFF" = "PICKUP"): Aksi | null {
  switch (status) {
    case "CREATED": return masuk === "DROPOFF"
      ? { teks: "Gudang menerima barang yang diantar pelanggan", peran: ["WAREHOUSE", "HUB_MANAGER"], lokasi: "asal" }
      : { teks: "Kurir menjemput barang ke alamat pengirim", peran: ["DRIVER", "HUB_MANAGER"], lokasi: "asal" };
    case "PICKED_UP": return { teks: "Gudang asal menerima dan memeriksa barang", peran: ["WAREHOUSE", "HUB_MANAGER"], lokasi: "asal" };
    case "AT_ORIGIN_HUB": return { teks: "Gudang asal menimbang tiap barang", peran: ["WAREHOUSE", "HUB_MANAGER"], lokasi: "asal" };
    case "SORTED_INVOICED": return { teks: "Kasir menagih dan menyusun manifest, gudang memuat", peran: ["MITRA_POS", "WAREHOUSE", "HUB_MANAGER"], lokasi: "asal" };
    case "LOADED": return { teks: "Kepala gudang menyerahkan manifest ke sopir, lalu berangkat", peran: ["HUB_MANAGER", "CONTAINER_DRIVER"], lokasi: "asal" };
    case "IN_TRANSIT_SEA": return { teks: "Dalam perjalanan, menunggu tiba di kota tujuan", peran: ["CONTAINER_DRIVER"], lokasi: "jalan" };
    case "ARRIVED_DEST_PORT": return { teks: "Gudang tujuan membongkar dan menerima", peran: ["WAREHOUSE", "HUB_MANAGER"], lokasi: "tujuan" };
    case "AT_DEST_HUB": return { teks: "Kurir tujuan mengantar ke penerima", peran: ["DRIVER", "HUB_MANAGER"], lokasi: "tujuan" };
    case "OUT_FOR_DELIVERY": return { teks: "Kurir menyerahkan ke penerima", peran: ["DRIVER", "HUB_MANAGER"], lokasi: "tujuan" };
    default: return null;
  }
}

export type Giliran = { berikut: string | null; berikutStatus: ShipmentStatus | null; milikAnda: boolean; ditanganiOleh: string };

/** Langkah berikutnya dan apakah sekarang giliran peran ini di cabangnya. */
export function giliran(a: ArahArus, status: AnyStatus, role: string, masuk: "PICKUP" | "DROPOFF" = "PICKUP", kotaLawan?: string | null): Giliran {
  const k = aksiBerikut(status, masuk);
  if (!k) return { berikut: null, berikutStatus: null, milikAnda: false, ditanganiOleh: "" };
  const nxt = nextStatus(status as ShipmentStatus, masuk);
  const disiniSaya = (a === "KELUAR" && k.lokasi === "asal") || (a === "MASUK" && k.lokasi === "tujuan");
  const oleh = k.lokasi === "jalan" ? "Sedang di perjalanan" : disiniSaya ? "Ditangani cabang ini" : `Ditangani cabang ${a === "KELUAR" ? "tujuan" : "asal"}${kotaLawan ? ` (${kotaLawan})` : ""}`;
  return { berikut: k.teks, berikutStatus: nxt, milikAnda: disiniSaya && k.peran.includes(role), ditanganiOleh: oleh };
}

export type BarisArus = { status: AnyStatus; arah?: string | null };
/** Hitung jumlah resi per fase untuk satu arah, plus yang terkendala (dibatalkan atau bermasalah). */
export function hitungArus<T extends BarisArus>(rows: T[], a: ArahArus): { fase: (FaseArus & { n: number })[]; terkendala: number; total: number } {
  const milik = rows.filter((r) => arahArus(r.arah) === a);
  const fase = fasePerArah(a).map((f) => ({ ...f, n: milik.filter((r) => (f.status as string[]).includes(r.status)).length }));
  const terkendala = milik.filter((r) => faseDari(a, r.status) === null).length;
  return { fase, terkendala, total: milik.length };
}
