import { LABEL_STATUS_LAMARAN, ROLE_LABEL, posisiDari, type StatusLamaran } from "@kamil/core";
import { staffRpc } from "@/lib/supabase/server";

/** Awas rumus Excel: sel yang diawali = + - @ diberi tanda petik supaya tidak dijalankan sebagai rumus. */
const sel = (v: unknown) => { let s = v == null ? "" : String(v).replace(/\r?\n/g, " "); if (/^[=+\-@\t]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };
const tgl = (v: string) => new Date(v).toLocaleString("id-ID", { timeZone: "Asia/Makassar", dateStyle: "medium", timeStyle: "short" });

/** Unduh data sebagai CSV (bisa dibuka di Excel). Hak akses dicek di database: hanya Pemilik/HRD (lamaran) dan Pemilik (calon mitra). */
const KOLOM: Record<string, { nama: string; kolom: [string, string][]; tanggal?: string[] }> = {
  resi: { nama: "daftar-resi", tanggal: ["dibuat"], kolom: [["resi", "Resi"], ["dibuat", "Dibuat"], ["status", "Status"], ["moda", "Moda"], ["segmen", "Jenis pelanggan"], ["kotaAsal", "Kota asal"], ["cabangAsal", "Cabang asal"], ["kotaTujuan", "Kota tujuan"], ["pengirim", "Pengirim"], ["penerima", "Penerima"], ["alamatPenerima", "Alamat penerima"], ["beratKg", "Berat (kg)"], ["tagihan", "Tagihan (Rp)"]] },
  tagihan: { nama: "tagihan", tanggal: ["dibuat"], kolom: [["noTagihan", "No tagihan"], ["dibuat", "Dibuat"], ["resi", "Resi"], ["pelanggan", "Pelanggan"], ["beratTagih", "Berat tagih (kg)"], ["total", "Total (Rp)"], ["terbayar", "Terbayar (Rp)"], ["jatuhTempo", "Jatuh tempo"], ["status", "Status"]] },
  pembayaran: { nama: "pembayaran", tanggal: ["dibayar"], kolom: [["dibayar", "Dibayar"], ["metode", "Metode"], ["jumlah", "Jumlah (Rp)"], ["untukTagihan", "Untuk tagihan"]] },
  komisi: { nama: "komisi-mitra", tanggal: ["dibuat"], kolom: [["mitra", "Mitra"], ["kota", "Kota"], ["resi", "Resi"], ["periode", "Periode"], ["komisi", "Komisi (Rp)"], ["dibuat", "Dibuat"]] },
  jemput: { nama: "pesanan-jemput", tanggal: ["dibuat"], kolom: [["kode", "Kode"], ["dibuat", "Dibuat"], ["nama", "Nama"], ["whatsapp", "WhatsApp"], ["kota", "Kota"], ["alamat", "Alamat"], ["tujuan", "Tujuan"], ["layanan", "Layanan"], ["barang", "Barang"], ["beratKg", "Berat (kg)"], ["tanggalJemput", "Tanggal jemput"], ["status", "Status"], ["catatan", "Catatan"]] },
  klaim: { nama: "klaim-keluhan", tanggal: ["dibuat"], kolom: [["kode", "Kode"], ["dibuat", "Dibuat"], ["resi", "Resi"], ["jenis", "Jenis"], ["nama", "Nama"], ["whatsapp", "WhatsApp"], ["cerita", "Cerita"], ["status", "Status"], ["penyelesaian", "Penyelesaian"], ["catatan", "Catatan"]] },
};
const tglOk = (v: string | null) => (/^\d{4}-\d{2}-\d{2}$/.test(v ?? "") ? v : null);

export async function GET(req: Request, { params }: { params: Promise<{ jenis: string }> }) {
  const { jenis } = await params;
  if (KOLOM[jenis]) {
    const u = new URL(req.url), dari = tglOk(u.searchParams.get("dari")), sampai = tglOk(u.searchParams.get("sampai"));
    const r = await staffRpc<Record<string, any>[]>("owner_export", { p_jenis: jenis, p_from: dari, p_to: sampai });
    if (r.error || !r.data) return new Response("Tidak diizinkan", { status: 403 });
    const m = KOLOM[jenis]!;
    const baris = [m.kolom.map(([, l]) => l), ...r.data.map((x) => m.kolom.map(([k]) => (m.tanggal?.includes(k) && x[k] ? tgl(x[k]) : x[k])))] as string[][];
    const csv = "\uFEFF" + baris.map((b) => b.map(sel).join(",")).join("\r\n");
    return new Response(csv, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="${m.nama}-${dari ?? "awal"}-sd-${sampai ?? "kini"}.csv"`, "cache-control": "private, no-store", "x-content-type-options": "nosniff" } });
  }
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
  } else if (jenis === "rekap-pegawai") {
    const u = new URL(req.url), hariIni = new Date(Date.now() + 8 * 3600_000).toISOString().slice(0, 10);
    const dari = tglOk(u.searchParams.get("dari")) ?? hariIni.slice(0, 8) + "01", sampai = tglOk(u.searchParams.get("sampai")) ?? hariIni;
    const r = await staffRpc<Record<string, any>[]>("hr_recap", { p_from: dari, p_to: sampai });
    if (r.error || !r.data) return new Response("Tidak diizinkan", { status: 403 });
    nama = `rekap-pegawai-${dari}-sd-${sampai}`;
    baris = [["Nama", "Peran", "Cabang", "Hari hadir", "Hadir tanpa absen pulang", "Hari cuti disetujui", "Shift terjadwal", "Langkah kerja", "Dijemput", "Ditimbang", "Diantar"],
      ...r.data.map((a) => [a.nama, ROLE_LABEL[a.peran] ?? a.peran, a.cabang ?? "", a.hadir, a.tanpaPulang, a.cutiHari, a.shiftTerjadwal, a.langkah, a.dijemput, a.ditimbang, a.diantar])];
  } else return new Response("Tidak ditemukan", { status: 404 });
  const csv = "﻿" + baris.map((b) => b.map(sel).join(",")).join("\r\n");
  return new Response(csv, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="${nama}-${new Date().toISOString().slice(0, 10)}.csv"`, "cache-control": "private, no-store", "x-content-type-options": "nosniff" } });
}
