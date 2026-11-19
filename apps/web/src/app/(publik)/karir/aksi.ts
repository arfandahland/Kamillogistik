"use server";
import { POSISI, pesanKeHrd, waHrdLink } from "@kamil/core";
import { publicRpcResult } from "@/lib/publicRpc";

export type LamarHasil = { ok: boolean; error?: string; kode?: string; wa?: string };
const s = (fd: FormData, k: string, n: number) => String(fd.get(k) ?? "").slice(0, n);

/** Terima lamaran dari formulir /karir. Berkas CV sudah berupa data URL (foto dikecilkan di peramban). */
export async function kirimLamaran(fd: FormData): Promise<LamarHasil> {
  if (s(fd, "website", 50)) return { ok: true, kode: "KRR-OK", wa: undefined }; // kotak jebakan untuk robot: pura-pura berhasil
  const posisi = POSISI.find((p) => p.slug === s(fd, "posisi", 40));
  if (!posisi) return { ok: false, error: "Pilih posisi yang dilamar." };
  const nama = s(fd, "nama", 80);
  const r = await publicRpcResult<{ ok: boolean; code: string }>("public_apply", {
    p_position: posisi.slug, p_name: nama, p_phone: s(fd, "hp", 20), p_email: s(fd, "email", 120), p_city: s(fd, "kota", 60),
    p_experience: s(fd, "pengalaman", 600), p_sim: s(fd, "sim", 40), p_note: s(fd, "catatan", 600),
    p_cv_name: s(fd, "cvNama", 120), p_cv_type: s(fd, "cvJenis", 40), p_cv_data: String(fd.get("cvData") ?? "").slice(0, 1_600_000),
  }, /nama|nomor|email|kota|posisi|panjang|cv|berkas|lamaran|terlalu|pdf|foto/i);
  if (r.error || !r.data?.code) return { ok: false, error: r.error ?? "Lamaran belum terkirim. Coba lagi." };
  return { ok: true, kode: r.data.code, wa: waHrdLink(pesanKeHrd(nama, posisi.judul, r.data.code)) };
}
