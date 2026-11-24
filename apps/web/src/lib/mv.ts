/** Bahan bersama halaman Divisi MV: tipe data, teks Indonesia, dan pembantu kecil. */

export const MV_ROLES = ["MV", "MV_MASTER"] as const;
/** Peran yang boleh membuka halaman MV (membaca). */
export const MV_BACA = ["SUPER_ADMIN", "OWNER", "MV", "MV_MASTER", "FINANCE"];
/** Peran yang boleh mengubah data MV. */
export const MV_TULIS = ["SUPER_ADMIN", "MV", "MV_MASTER"];
/** Peran yang melihat semua cabang (boleh memilih cabang di filter). */
export const MV_SEMUA_CABANG = ["SUPER_ADMIN", "OWNER", "MV_MASTER", "FINANCE"];

export type Moda = "DARAT" | "LAUT" | "UDARA";
export const MODA_NAMA: Record<string, string> = { DARAT: "Darat", LAUT: "Laut", UDARA: "Udara" };
export const MODA_IKON: Record<string, string> = { DARAT: "truck", LAUT: "ship", UDARA: "plane" };

export type Wilayah = { code: string; mode: Moda; label: string };
export type Cabang = { id: string; city: string };

export type VendorRute = { id: string; mode: Moda; origin: string | null; region: string | null; regionCode: string | null; vehicle: string | null; active: boolean };
export type Vendor = { mine?: boolean; verified?: boolean; used?: number; lastUsedAt?: string | null; id: string; code: string; name: string; kind: string; status: string; contact: string | null; phone: string | null; email: string | null; address: string | null;
  bank: string | null; account: string | null; note: string | null; branch: string | null; verifiedAt: string | null; createdAt: string; routes: VendorRute[] };

export const VENDOR_STATUS: Record<string, { label: string; kelas: string }> = {
  DIUSULKAN: { label: "Menunggu verifikasi", kelas: "warn" },
  AKTIF: { label: "Aktif", kelas: "done" },
  NONAKTIF: { label: "Nonaktif", kelas: "" },
  DITOLAK: { label: "Ditolak", kelas: "late" },
};
export const VENDOR_JENIS: Record<string, string> = { DARAT: "Darat", LAUT: "Laut", UDARA: "Udara", MULTI: "Campuran" };

export type Alokasi = { vendorVerified?: boolean; id: string; status: string; vendorId: string | null; vendor: string | null; vendorCode: string | null; internal: boolean; driver: string | null; plate: string | null; hpp: number | null; locked: boolean; paidAt?: string | null; paidRef?: string | null; note: string | null };
export type TagihanVendor = { vendorId: string; name: string; code: string; belumLunas: number; lunas: number; jumlahBelum: number; jumlahLunas: number; bank: string | null; rekening: string | null;
  items: { allocId: string; shipmentId: string; resiNo: string; origin: string; dest: string; hpp: number; status: string; paidAt: string | null; paidRef: string | null; createdAt: string }[] };
export type ResiAlokasi = { shipmentId: string; resiNo: string; origin: string; originId: string; dest: string; mode: Moda; shipStatus: string; destProvince: string | null; destRegency: string | null;
  createdAt: string; tagihan: number | null; alloc: Alokasi | null };

export const ALOK_STATUS: Record<string, string> = { DRAFT: "Belum diatur", VENDOR_DIPILIH: "Vendor dipilih", HPP_DIISI: "HPP diisi", BERANGKAT: "Berangkat", TIBA: "Tiba", SELESAI: "Selesai" };
export const ALOK_FILTER = [["", "Semua"], ["BELUM", "Belum diatur"], ["VENDOR_DIPILIH", "Vendor dipilih"], ["HPP_DIISI", "HPP diisi"], ["BERANGKAT", "Berangkat"], ["TIBA", "Tiba"], ["SELESAI", "Selesai"]] as const;

export const SJ_STATUS: Record<string, string> = {
  BELUM_KEMBALI: "Belum kembali", DALAM_PERJALANAN_BALIK: "Dalam perjalanan balik", DITERIMA_MV: "Diterima MV", BERMASALAH: "Bermasalah", HILANG: "Hilang", DISERAHKAN_FINANCE: "Sudah diserahkan ke Finance",
};
export type SJ = { id: string; shipmentId: string; resiNo: string; origin: string; dest: string; status: string; arrivedAt: string | null; dueAt: string | null; receivedAt: string | null; handedAt: string | null;
  note: string | null; terlambat: boolean; hampir: boolean; sisaHari: number | null; terimaNo: string | null; serahNo: string | null; receiptId?: string | null; cabang?: string };

export const DOK_JENIS: Record<string, string> = { SERAH_BARANG: "Foto serah terima barang", KONDISI_TIBA: "Foto kondisi barang tiba", SJ_BALIK: "Foto surat jalan balik", LAINNYA: "Dokumen lain" };

export const AIR_STATUS: Record<string, { label: string; kelas: string }> = {
  DIUNGGAH: { label: "Diunggah", kelas: "" }, DIVALIDASI: { label: "Cocok semua", kelas: "done" }, ADA_BARIS_TIDAK_COCOK: { label: "Ada yang tidak cocok", kelas: "late" }, DITERIMA: { label: "Diterima", kelas: "done" },
};

/** Bangun alamat dengan parameter filter; nilai kosong dibuang. */
export function href(base: string, p: Record<string, string | undefined | null>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(p)) if (v) q.set(k, v);
  const s = q.toString();
  return s ? `${base}?${s}` : base;
}

export const rp = (n: number | null | undefined) => (n == null ? "-" : "Rp" + Number(n).toLocaleString("id-ID"));
export const uuidOk = (v: string | undefined | null): v is string => !!v && /^[0-9a-f-]{36}$/i.test(v);
export const pilih = <T extends string>(v: string | undefined, daftar: readonly T[]): T | "" => (daftar.includes(v as T) ? (v as T) : "");
