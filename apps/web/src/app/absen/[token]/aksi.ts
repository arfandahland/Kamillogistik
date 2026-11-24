"use server";
import { publicRpcResult } from "@/lib/publicRpc";

export type HasilAbsen = {
  ok: boolean; pesan?: string; perluFoto?: boolean; aksi?: "MASUK" | "PULANG" | "SUDAH_MASUK" | "LENGKAP";
  nama?: string; kode?: string; cabang?: string; masuk?: string | null; pulang?: string | null; telat?: boolean; menitTelat?: number;
  luarLokasi?: boolean; jarakM?: number | null; tanpaLokasi?: boolean;
};
export type HasilPortal = {
  ok: boolean; pesan?: string; nama?: string; kode?: string; cabang?: string; jabatan?: string | null; jamMasukStandar?: string;
  riwayat?: { tanggal: string; masuk: string | null; pulang: string | null; telat: boolean; luar: boolean; koreksi: boolean }[];
  cuti?: { jenis: string; dari: string; sampai: string; status: string; catatan: string | null }[];
};
const TAMPIL = /QR|selfie|foto|JPEG|kode|PIN|cuti|besar|berlaku/i;
const TOKEN = /^[0-9a-f]{32}$/;
const cek = (i: { token: string; kode: string; pin: string }): string | null =>
  !TOKEN.test(i.token) ? "QR ini tidak dikenal." : !i.kode.trim() || i.kode.length > 24 ? "Tulis kode pegawai Anda." : !/^[0-9]{6}$/.test(i.pin) ? "PIN harus 6 angka." : null;

/** Absen masuk atau pulang tanpa login. Izin hanya dari QR resmi + kode pegawai + PIN. */
export async function absenCatat(i: { token: string; kode: string; pin: string; lat?: number | null; lng?: number | null; akurasi?: number | null; foto?: string | null; perangkat?: string }): Promise<HasilAbsen> {
  const g = cek(i); if (g) return { ok: false, pesan: g };
  const { data, error } = await publicRpcResult<HasilAbsen>("absen_catat", {
    p_token: i.token, p_kode: i.kode.trim(), p_pin: i.pin, p_lat: i.lat ?? null, p_lng: i.lng ?? null, p_akurasi: i.akurasi != null ? Math.round(i.akurasi) : null,
    p_foto: i.foto || null, p_perangkat: i.perangkat || null,
  }, TAMPIL);
  if (error || !data) return { ok: false, pesan: error ?? "Absen belum bisa dicatat. Coba lagi." };
  return data;
}

/** Riwayat sendiri (31 hari) untuk karyawan tanpa akun. */
export async function absenPortal(i: { token: string; kode: string; pin: string }): Promise<HasilPortal> {
  const g = cek(i); if (g) return { ok: false, pesan: g };
  const { data, error } = await publicRpcResult<HasilPortal>("absen_portal", { p_token: i.token, p_kode: i.kode.trim(), p_pin: i.pin }, TAMPIL);
  if (error || !data) return { ok: false, pesan: error ?? "Riwayat belum bisa dibuka. Coba lagi." };
  return data;
}

/** Karyawan tanpa akun mengajukan cuti, izin, atau sakit. Diputuskan HRD. */
export async function ajukanCuti(i: { token: string; kode: string; pin: string; jenis: string; dari: string; sampai: string; alasan: string }): Promise<{ ok: boolean; pesan: string }> {
  const g = cek(i); if (g) return { ok: false, pesan: g };
  if (!["CUTI", "IZIN", "SAKIT"].includes(i.jenis)) return { ok: false, pesan: "Pilih jenis: cuti, izin, atau sakit." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(i.dari) || !/^\d{4}-\d{2}-\d{2}$/.test(i.sampai)) return { ok: false, pesan: "Isi tanggal mulai dan selesai." };
  const { data, error } = await publicRpcResult<{ ok: boolean; pesan: string }>("absen_cuti_ajukan", {
    p_token: i.token, p_kode: i.kode.trim(), p_pin: i.pin, p_jenis: i.jenis, p_dari: i.dari, p_sampai: i.sampai, p_alasan: i.alasan.trim().slice(0, 300),
  }, TAMPIL);
  if (error || !data) return { ok: false, pesan: error ?? "Pengajuan belum terkirim. Coba lagi." };
  return data;
}
