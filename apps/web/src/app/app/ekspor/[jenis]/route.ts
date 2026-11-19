import { LABEL_STATUS_LAMARAN, posisiDari, type StatusLamaran } from "@kamil/core";
import { staffRpc } from "@/lib/supabase/server";

/** Awas rumus Excel: sel yang diawali = + - @ diberi tanda petik supaya tidak dijalankan sebagai rumus. */
const sel = (v: unknown) => { let s = v == null ? "" : String(v).replace(/\r?\n/g, " "); if (/^[=+\-@\t]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };
const tgl = (v: string) => new Date(v).toLocaleString("id-ID", { timeZone: "Asia/Makassar", dateStyle: "medium", timeStyle: "short" });

/** Unduh data sebagai CSV (bisa dibuka di Excel). Hak akses dicek di database: hanya Pemilik/HRD (lamaran) dan Pemilik (calon mitra). */
export async function GET(_: Request, { params }: { params: Promise<{ jenis: string }> }) {
  const { jenis } = await params;
  let baris: string[][] = [], nama = "";
  if (jenis === "lamaran") {
    const r = await staffRpc<{ items: Record<string, any>[] }>("staff_applications");
    if (r.error || !r.data) return new Response("Tidak diizinkan", { status: 403 });
    nama = "lamaran-kerja";
    baris = [["Kode", "Tanggal", "Posisi", "Nama", "WhatsApp", "Email", "Kota", "SIM", "Pengalaman", "Status", "Catatan pelamar", "Catatan HRD"],
      ...r.data.items.map((a) => [a.code, tgl(a.createdAt), posisiDari(a.position)?.judul ?? a.position, a.name, a.phone, a.email, a.city, a.sim, a.experience, LABEL_STATUS_LAMARAN[a.status as StatusLamaran] ?? a.status, a.note, a.hrdNote])];
  } else if (jenis === "calon-mitra") {
    const r = await staffRpc<{ items: Record<string, any>[] }>("staff_partner_leads");
    if (r.error || !r.data) return new Response("Tidak diizinkan", { status: 403 });
    nama = "calon-mitra";
    baris = [["Kode", "Tanggal", "Jenis", "Usaha", "Pemilik", "WhatsApp", "Kota", "Alamat", "Cerita usaha", "Status", "Catatan"],
      ...r.data.items.map((a) => [a.code, tgl(a.createdAt), a.kind, a.business, a.ownerName, a.phone, a.city, a.address, a.note, a.status, a.adminNote])];
  } else return new Response("Tidak ditemukan", { status: 404 });
  const csv = "﻿" + baris.map((b) => b.map(sel).join(",")).join("\r\n");
  return new Response(csv, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="${nama}-${new Date().toISOString().slice(0, 10)}.csv"`, "cache-control": "private, no-store", "x-content-type-options": "nosniff" } });
}
