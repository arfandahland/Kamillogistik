"use server";
import { LAYANAN_JEMPUT } from "@/lib/layananJemput";
import { publicRpcResult } from "@/lib/publicRpc";
import { BRAND } from "@/lib/brand";

export type JemputHasil = { ok: boolean; error?: string; kode?: string; wa?: string };
const s = (fd: FormData, k: string, n: number) => String(fd.get(k) ?? "").slice(0, n);

/** Pesan jemput dari website: masuk ke antrean petugas, pelanggan boleh langsung memberi tahu tim lewat WhatsApp. */
export async function kirimJemput(fd: FormData): Promise<JemputHasil> {
  if (s(fd, "website", 50)) return { ok: true, kode: "JMP-OK" };            // kotak jebakan robot
  const berat = s(fd, "berat", 10).replace(",", ".").trim(), tgl = s(fd, "tanggal", 10).trim();
  const r = await publicRpcResult<{ ok: boolean; code: string }>("public_pickup_request", {
    p_name: s(fd, "nama", 80), p_phone: s(fd, "hp", 20), p_city: s(fd, "kota", 60), p_address: s(fd, "alamat", 300), p_destination: s(fd, "tujuan", 120),
    p_service: s(fd, "layanan", 20), p_item: s(fd, "barang", 300), p_weight: berat ? Number(berat) : null, p_date: tgl || null, p_note: s(fd, "catatan", 400) || null,
  }, /nama|nomor|kota|alamat|tujuan|layanan|barang|berat|tanggal|catatan|pesanan|terlalu/i);
  if (r.error || !r.data?.code) return { ok: false, error: r.error ?? "Pesanan belum terkirim. Coba lagi." };
  const teks = `Halo Kamil Logistik, saya ${s(fd, "nama", 80).trim()} baru memesan jemput barang lewat website (${LAYANAN_JEMPUT[s(fd, "layanan", 20)] ?? "kiriman"}, ${s(fd, "kota", 60).trim()} ke ${s(fd, "tujuan", 120).trim()}). Kode pesanan saya ${r.data.code}. Mohon dikonfirmasi ya, terima kasih.`;
  return { ok: true, kode: r.data.code, wa: `https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(teks)}` };
}
