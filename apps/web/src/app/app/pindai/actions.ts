"use server";
import { isManifestCode, MANIFEST_STATUS_LABEL, normalizeResi, statusLabel, type AnyStatus } from "@kamil/core";
import { staffRpc } from "@/lib/supabase/server";
import type { HasilCari } from "@/components/Pemindai";

/** Mencari resi dari kode hasil pindai (kode resi atau kode barang). Hanya resi yang boleh dilihat petugas ini. */
export async function cariKode(kode: string): Promise<HasilCari> {
  const k = normalizeResi(String(kode ?? "").slice(0, 80));
  if (isManifestCode(k)) {
    const m = await staffRpc<{ id: string; code: string; status: string }>("manifest_find", { p_code: k });
    if (m.error || !m.data) return { ok: false, error: m.error ?? "Kode manifest tidak dikenali." };
    return { ok: true, judul: m.data.code, sub: `Manifest · ${MANIFEST_STATUS_LABEL[m.data.status] ?? m.data.status}`, href: `/app/manifest/${m.data.id}` };
  }
  const r = await staffRpc<{ id: string; resiNo: string; status: AnyStatus; item: string | null }>("staff_find_shipment", { p_code: k });
  if (r.error || !r.data) return { ok: false, error: r.error ?? "Kode tidak dikenali." };
  const item = r.data.item ? ` · barang ${Number(r.data.item.split("-").pop())}` : "";
  return { ok: true, judul: r.data.resiNo, sub: `${statusLabel(r.data.status)}${item}`, href: `/app/resi/${r.data.id}` };
}
