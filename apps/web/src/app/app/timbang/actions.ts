"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isManifestCode, normalizeResi } from "@kamil/core";
import { staffRpc } from "@/lib/supabase/server";
import type { HasilCari } from "@/components/Pemindai";

const num = (v: FormDataEntryValue | null) => { const s = String(v ?? "").trim().replace(",", "."); return s === "" ? null : Number(s); };

/** Hasil pindai di halaman Timbang: langsung membuka layar timbang barang itu. */
export async function cariBarangTimbang(kode: string): Promise<HasilCari> {
  const k = normalizeResi(String(kode ?? "").slice(0, 80));
  if (isManifestCode(k)) return { ok: false, error: "Ini kode manifest. Pindai label barang (berakhiran -01, -02, dan seterusnya)." };
  const r = await staffRpc<{ resiNo: string; index: number; total: number }>("item_for_weighing", { p_code: k });
  if (r.error || !r.data) return { ok: false, error: r.error ?? "Kode barang tidak dikenali." };
  return { ok: true, judul: r.data.resiNo, sub: `Barang ${r.data.index} dari ${r.data.total}`, href: `/app/timbang?kode=${encodeURIComponent(k)}` };
}

export async function timbangBarang(fd: FormData) {
  const kode = String(fd.get("kode") ?? "");
  const l = num(fd.get("l")), w = num(fd.get("w")), h = num(fd.get("h"));
  const jumlah = Math.max(1, Math.floor(Number(num(fd.get("jumlah")) ?? 1)));
  const r = jumlah > 1
    ? await staffRpc<{ resiNo: string; index: number; total: number; remaining: number; totalKg: number; selesai: boolean; count?: number; batchKg?: number; batchCbm?: number }>("measure_items_bulk", {
      p_code: kode, p_count: jumlah, p_weight: num(fd.get("berat")), p_l: l, p_w: w, p_h: h })
    : await staffRpc<{ resiNo: string; index: number; total: number; remaining: number; totalKg: number; selesai: boolean; count?: number; batchKg?: number; batchCbm?: number }>("measure_item", {
      p_code: kode, p_weight: num(fd.get("berat")), p_l: l, p_w: w, p_h: h });
  revalidatePath("/app");
  if (r.error || !r.data) redirect(`/app/timbang?kode=${encodeURIComponent(kode)}&e=${encodeURIComponent(r.error ?? "Gagal menyimpan")}`);
  const d = r.data!;
  const m3 = Number(d.totalKg ?? 0) === 0; // akun kubikasi tidak mencatat berat
  const pesan = d.selesai && m3
    ? `Semua ${d.total} barang resi ${d.resiNo} sudah diukur. Data masuk ke Kasir untuk dibuatkan invoice per m³.`
    : d.selesai
    ? `Semua ${d.total} barang resi ${d.resiNo} sudah ditimbang (${Number(d.totalKg).toLocaleString("id-ID")} kg). Data masuk ke Kasir untuk dibuatkan invoice.`
    : jumlah > 1
      ? `${jumlah} barang sekaligus tersimpan (total ${Number(d.batchKg ?? 0).toLocaleString("id-ID")} kg${d.batchCbm ? `, ${Number(d.batchCbm).toLocaleString("id-ID", { maximumFractionDigits: 4 })} m³` : ""}). Tinggal ${d.remaining} barang lagi untuk resi ${d.resiNo}.`
      : `Barang ${d.index} dari ${d.total} tersimpan. Tinggal ${d.remaining} barang lagi untuk resi ${d.resiNo}.`;
  redirect(`/app/timbang?ok=${encodeURIComponent(pesan)}`);
}
