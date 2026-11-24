import { staffRpc } from "@/lib/supabase/server";

const sel = (v: unknown) => { let s = v == null ? "" : String(v).replace(/\r?\n/g, " "); if (/^[=+\-@\t]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };
const ok = (v: string | null) => (/^\d{4}-\d{2}-\d{2}$/.test(v ?? "") ? v! : null);

/** Rekap kehadiran per karyawan (CSV untuk Excel). Hak akses dicek di database: Finance, HRD, Pemilik, Super Admin. */
export async function GET(req: Request) {
  const u = new URL(req.url), hari = new Date(Date.now() + 8 * 3600_000).toISOString().slice(0, 10);
  const dari = ok(u.searchParams.get("dari")) ?? hari.slice(0, 8) + "01", sampai = ok(u.searchParams.get("sampai")) ?? hari;
  const c = u.searchParams.get("c") ?? "";
  const r = await staffRpc<{ pegawai: Record<string, any>[] }>("fin_kehadiran_rekap", { p_from: dari, p_to: sampai, p_branch: /^[0-9a-f-]{36}$/.test(c) ? c : null });
  if (r.error || !r.data) return new Response("Tidak diizinkan", { status: 403 });
  const baris = [["Kode", "Nama", "Cabang", "Jabatan", "Hari hadir", "Terlambat", "Tanpa absen pulang", "Di luar lokasi", "Tanpa lokasi", "Dikoreksi HRD", "Jam kerja (menit)", "Status"],
    ...r.data.pegawai.map((p) => [p.kode, p.nama, p.cabang, p.jabatan ?? "", p.hadir, p.telat, p.tanpaPulang, p.luar, p.tanpaLokasi, p.koreksi, p.menit, p.aktif ? "Aktif" : "Nonaktif"])];
  const csv = "﻿" + baris.map((b) => b.map(sel).join(",")).join("\r\n");
  return new Response(csv, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="kehadiran-${dari}-sd-${sampai}.csv"`, "cache-control": "private, no-store" } });
}
