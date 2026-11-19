"use server";
import { publicRpcResult } from "@/lib/publicRpc";
import { BRAND } from "@/lib/brand";

export type MitraHasil = { ok: boolean; error?: string; kode?: string; wa?: string };
const s = (fd: FormData, k: string, n: number) => String(fd.get(k) ?? "").slice(0, n);
const JENIS: Record<string, string> = { GERAI: "gerai / agen pengiriman", GUDANG: "gudang atau pergudangan", REKANAN: "rekanan (angkutan, kapal, atau pelabuhan)" };

/** Pendaftaran calon mitra dari halaman /mitra. */
export async function kirimCalonMitra(fd: FormData): Promise<MitraHasil> {
  if (s(fd, "website", 50)) return { ok: true, kode: "MTR-OK" };            // kotak jebakan robot
  const kind = s(fd, "jenis", 10);
  const r = await publicRpcResult<{ ok: boolean; code: string }>("public_partner_lead", {
    p_kind: kind, p_business: s(fd, "usaha", 90), p_owner: s(fd, "pemilik", 80), p_phone: s(fd, "hp", 20), p_city: s(fd, "kota", 60), p_address: s(fd, "alamat", 300) || null, p_note: s(fd, "catatan", 500) || null,
  }, /jenis|usaha|pemilik|nomor|kota|panjang|pendaftaran|terlalu|sudah/i);
  if (r.error || !r.data?.code) return { ok: false, error: r.error ?? "Pendaftaran belum terkirim. Coba lagi." };
  const teks = `Halo Kamil Logistik, saya ${s(fd, "pemilik", 80).trim()} dari ${s(fd, "usaha", 90).trim()} (${s(fd, "kota", 60).trim()}) baru mendaftar menjadi mitra (${JENIS[kind] ?? "mitra"}) lewat website. Kode pendaftaran saya ${r.data.code}. Mohon dihubungi ya, terima kasih.`;
  return { ok: true, kode: r.data.code, wa: `https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(teks)}` };
}
