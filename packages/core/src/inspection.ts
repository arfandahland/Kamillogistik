/** Pemeriksaan fisik barang (jemput, terima gudang asal, kondisi di tujuan). */
export type InspectionStage = "PICKUP" | "ORIGIN_HUB" | "DEST_HUB";
export const STAGE_LABEL: Record<InspectionStage, string> = { PICKUP: "Saat dijemput", ORIGIN_HUB: "Saat diterima gudang asal", DEST_HUB: "Kondisi di kota tujuan" };
export const KEMASAN_LABEL: Record<string, string> = { KARDUS: "Kardus", KARUNG: "Karung", PLASTIK: "Plastik/wrap", KAYU: "Peti kayu", PALET: "Palet", TANPA: "Tanpa kemasan", LAINNYA: "Lainnya" };
export const KONDISI_LABEL: Record<string, string> = { BAIK: "Baik", PENYOK: "Penyok", BASAH: "Basah", SOBEK: "Sobek", SEGEL_RUSAK: "Segel rusak", KURANG_JUMLAH: "Kurang jumlah", LAINNYA: "Lainnya" };
export type Inspection = { id: string; stage: InspectionStage; contents: string; packaging: string; conditions: string[]; note: string | null; pieces: number | null; by: string | null; at: string; photos: number };
export const isProblem = (i: { conditions: string[] }) => !(i.conditions.length === 1 && i.conditions[0] === "BAIK");
