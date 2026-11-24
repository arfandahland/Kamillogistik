"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { staffRpc } from "@/lib/supabase/server";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const waktuOk = (v: string) => (/^\d{2}:\d{2}$/.test(v) ? v : null);

/** Finance memasukkan absensi satu karyawan pada satu tanggal. Wajib bercatatan; absen QR karyawan sendiri tidak bisa ditimpa. */
export async function inputAbsen(fd: FormData) {
  const cab = str(fd, "cabang"), tgl = str(fd, "tanggal");
  const dasar = `/app/keuangan/input-absen?c=${encodeURIComponent(cab)}&tgl=${encodeURIComponent(tgl)}`;
  const masuk = waktuOk(str(fd, "masuk"));
  if (!masuk) redirect(`${dasar}&e=${encodeURIComponent("Isi jam masuk.")}`);
  const r = await staffRpc<{ nama: string }>("fin_absen_input", { p_emp: str(fd, "emp"), p_tgl: tgl, p_masuk: masuk, p_pulang: waktuOk(str(fd, "pulang")), p_catatan: str(fd, "catatan") });
  revalidatePath("/app/keuangan/kehadiran"); revalidatePath("/app/keuangan/input-absen");
  if (r.error) redirect(`${dasar}&e=${encodeURIComponent(r.error)}`);
  redirect(`${dasar}&ok=${encodeURIComponent(`Absensi ${r.data?.nama ?? "karyawan"} tersimpan.`)}`);
}
