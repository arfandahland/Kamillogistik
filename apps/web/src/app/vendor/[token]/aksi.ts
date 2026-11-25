"use server";
import { redirect } from "next/navigation";
import { publicRpcResult } from "@/lib/publicRpc";

/** Kirim foto atau laporan dari halaman vendor. Tanpa login: izin hanya berasal dari link khusus. */
export async function kirimVendor(fd: FormData) {
  const token = String(fd.get("token") ?? "");
  if (!/^[0-9a-f]{48}$/.test(token)) redirect("/");
  const s = (k: string) => String(fd.get(k) ?? "").trim();
  const alasan = s("alasan");
  const catatan = [s("catatan"), s("sumber") === "UNGGAH" && alasan ? `(Diunggah dari galeri: ${alasan})` : ""].filter(Boolean).join(" ");
  const tampil = /link|foto|laporan|nama|telepon|batas|jenis|berlaku|huruf|terima|lunas|berangkat|tujuan|selesai|penerima|terkunci/i;
  const { error } = s("jenis") === "BUKTI_TERIMA"
    ? await publicRpcResult("vendor_link_deliver", { p_token: token, p_receiver: s("penerima"), p_photo: s("foto") || null, p_note: catatan || null, p_name: s("nama"), p_phone: s("telepon") || null }, tampil)
    : await publicRpcResult("vendor_link_submit", {
      p_token: token, p_kind: s("jenis"), p_note: catatan || null, p_photo: s("foto") || null, p_name: s("nama"), p_phone: s("telepon") || null,
    }, tampil);
  if (error) redirect(`/vendor/${token}?e=${encodeURIComponent(error)}`);
  redirect(`/vendor/${token}?ok=1`);
}
