import { MANIFEST_STATUS_LABEL, MASUK_LABEL, MODA_LABEL, statusLabel } from "@kamil/core";
import { staffRpc } from "@/lib/supabase/server";

/** Awas rumus Excel: sel yang diawali = + - @ diberi tanda petik supaya tidak dijalankan sebagai rumus. */
const sel = (v: unknown) => { let s = v == null ? "" : String(v).replace(/\r?\n/g, " "); if (/^[=+\-@\t]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };
const wkt = (v: string | null) => (v ? new Date(v).toLocaleString("id-ID", { timeZone: "Asia/Makassar", dateStyle: "medium", timeStyle: "short" }) : "");
type Baris = { resi: string; barang: string; status: string; cara: "PICKUP" | "DROPOFF"; moda: "LAUT" | "DARAT" | "UDARA"; pengirim: string; hpPengirim: string | null; penerima: string; hpPenerima: string | null; alamat: string | null;
  provinsi: string | null; kabupaten: string | null; kecamatan: string | null; desa: string | null; beratKg: number | null; p: number | null; l: number | null; t: number | null; volumeM3: number | null; kondisi: string | null; isi: string | null; kemasan: string | null; rapuh: boolean | null; asuransi: boolean | null; refPelanggan: string | null; kendaraan: Record<string, string> | null; dibongkar: string | null };
type Ekspor = { manifest: { code: string; status: string; mode: "LAUT" | "DARAT" | "UDARA"; asal: string; tujuan: string; kontainer: string | null; segel: string | null; pengangkut: string | null; voyage: string | null; pelabuhanMuat: string | null; pelabuhanBongkar: string | null; berangkat: string | null; eta: string | null; dipegang: string | null; catatan: string | null }; baris: Baris[] };

/** Unduh isi manifest lengkap (CSV, bisa dibuka di Excel): ringkasan muatan lalu satu baris per barang. Tanpa data uang. */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("Tidak ditemukan", { status: 404 });
  const r = await staffRpc<Ekspor>("manifest_export", { p_id: id });
  if (r.error || !r.data) return new Response("Tidak diizinkan", { status: 403 });
  const { manifest: m, baris } = r.data;
  const alat = m.mode === "UDARA" ? "Penerbangan" : m.mode === "DARAT" ? "Truk" : "Kapal";
  const totalKg = baris.reduce((a, b) => a + Number(b.beratKg ?? 0), 0), totalM3 = baris.reduce((a, b) => a + Number(b.volumeM3 ?? 0), 0);
  const atas: string[][] = [
    ["MANIFEST MUATAN KAMIL LOGISTIK"], ["Kode manifest", m.code], ["Status", MANIFEST_STATUS_LABEL[m.status] ?? m.status], ["Jalur", MODA_LABEL[m.mode]], ["Asal", m.asal], ["Tujuan", m.tujuan],
    ["Nomor kontainer / AWB / plat", m.kontainer ?? ""], ["Nomor segel", m.segel ?? ""], [alat, m.pengangkut ?? ""], ["Nomor voyage", m.voyage ?? ""], ["Pelabuhan atau bandara muat", m.pelabuhanMuat ?? ""],
    ["Pelabuhan atau bandara bongkar", m.pelabuhanBongkar ?? ""], ["Berangkat", wkt(m.berangkat)], ["Perkiraan tiba", wkt(m.eta)], ["Pemegang muatan", m.dipegang ?? ""], ["Catatan", m.catatan ?? ""],
    ["Jumlah barang", String(baris.length)], ["Total berat (kg)", String(totalKg)], ["Total volume (m3)", String(Math.round(totalM3 * 10000) / 10000)], [],
  ];
  const kepala = ["No", "Kode resi", "Kode barang", "Status resi", "Cara masuk", "Pengirim", "HP pengirim", "Penerima", "HP penerima", "Alamat penerima", "Provinsi", "Kabupaten/Kota", "Kecamatan", "Kelurahan/Desa",
    "Berat (kg)", "Panjang (cm)", "Lebar (cm)", "Tinggi (cm)", "Volume (m3)", "Isi barang", "Kemasan", "Rapuh", "Asuransi", "Referensi pelanggan", "Kondisi", "Kendaraan", "Sudah dipindai bongkar"];
  const isi = baris.map((b, i) => [i + 1, b.resi, b.barang, statusLabel(b.status as never, b.moda), MASUK_LABEL[b.cara], b.pengirim, b.hpPengirim ?? "", b.penerima, b.hpPenerima ?? "", b.alamat ?? "", b.provinsi ?? "", b.kabupaten ?? "", b.kecamatan ?? "", b.desa ?? "",
    b.beratKg ?? "", b.p ?? "", b.l ?? "", b.t ?? "", b.volumeM3 ?? "", b.isi ?? "", b.kemasan ?? "", b.rapuh ? "Ya" : "", b.asuransi ? "Ya" : "", b.refPelanggan ?? "", b.kondisi ?? "", b.kendaraan ? Object.entries(b.kendaraan).map(([k, v]) => `${k}: ${v}`).join("; ") : "", b.dibongkar ? "Ya" : "Belum"]);
  const csv = "﻿" + [...atas, kepala, ...isi].map((b) => b.map(sel).join(",")).join("\r\n");
  return new Response(csv, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="${m.code}.csv"`, "cache-control": "private, no-store", "x-content-type-options": "nosniff" } });
}
