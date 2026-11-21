"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { staffRpc } from "@/lib/supabase/server";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const tglOk = (v: string) => (/^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null);
const kembali = (url: string, kind: "e" | "ok", msg: string): never => redirect(`${url}${url.includes("?") ? "&" : "?"}${kind}=${encodeURIComponent(msg)}`);
const selesai = (url: string, r: { error: string | null }, ok: string): never => { revalidatePath("/app/pegawai"); revalidatePath("/app/akun"); return r.error ? kembali(url, "e", r.error) : kembali(url, "ok", ok); };

/* ----- Semua petugas ----- */
export async function absen(fd: FormData) {
  const aksi = str(fd, "aksi");
  selesai("/app/akun", await staffRpc("hr_attend", { p_action: aksi }), aksi === "MASUK" ? "Absen masuk tercatat." : "Absen pulang tercatat.");
}
export async function ajukanCuti(fd: FormData) {
  selesai("/app/akun", await staffRpc("hr_leave_request", { p_kind: str(fd, "jenis"), p_from: tglOk(str(fd, "dari")), p_to: tglOk(str(fd, "sampai")), p_reason: str(fd, "alasan") }), "Pengajuan terkirim. HRD akan memutuskan.");
}

/* ----- HRD dan Pemilik ----- */
export async function simpanDokumen(fd: FormData) {
  selesai("/app/pegawai?t=dokumen", await staffRpc("hr_document_set", { p_user: str(fd, "pegawai"), p_kind: str(fd, "jenis"), p_no: str(fd, "nomor") || null, p_expires: tglOk(str(fd, "berlaku")), p_note: str(fd, "catatan") || null }), "Dokumen disimpan.");
}
export async function hapusDokumen(fd: FormData) {
  selesai("/app/pegawai?t=dokumen", await staffRpc("hr_document_delete", { p_id: str(fd, "id") }), "Dokumen dihapus.");
}
export async function aturShift(fd: FormData) {
  selesai("/app/pegawai?t=shift", await staffRpc("hr_shift_set", { p_user: str(fd, "pegawai"), p_from: tglOk(str(fd, "dari")), p_to: tglOk(str(fd, "sampai")) ?? tglOk(str(fd, "dari")), p_shift: str(fd, "shift") }), "Shift disimpan.");
}
export async function putusCuti(fd: FormData) {
  selesai("/app/pegawai?t=cuti", await staffRpc("hr_leave_decide", { p_id: str(fd, "id"), p_status: str(fd, "putusan"), p_note: str(fd, "catatan") || null }), "Keputusan tersimpan.");
}
