"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { staffRpc } from "@/lib/supabase/server";

export type HasilKaryawan = { ok: boolean; pesan?: string; id?: string; kode?: string; nama?: string; pin?: string; telepon?: string | null };
const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const OFFSET: Record<string, string> = { "Asia/Jakarta": "+07:00", "Asia/Makassar": "+08:00", "Asia/Jayapura": "+09:00" };
const segarkan = () => { revalidatePath("/app/karyawan"); revalidatePath("/app/keuangan/kehadiran"); };

/** Tambah karyawan baru (tanpa id) atau ubah data (dengan id). Karyawan baru langsung mendapat PIN yang hanya tampil sekali. */
export async function simpanKaryawan(_p: HasilKaryawan | null, fd: FormData): Promise<HasilKaryawan> {
  const id = str(fd, "id") || null;
  const r = await staffRpc<{ id: string; kode: string; pin?: string }>("hr_pegawai_simpan", {
    p_id: id, p_nama: str(fd, "nama"), p_cabang: str(fd, "cabang") || null, p_jabatan: str(fd, "jabatan"), p_telepon: str(fd, "telepon"), p_bergabung: str(fd, "bergabung") || null,
  });
  if (r.error || !r.data) return { ok: false, pesan: r.error ?? "Data belum tersimpan." };
  segarkan();
  return { ok: true, id: r.data.id, kode: r.data.kode, pin: r.data.pin, nama: str(fd, "nama"), telepon: str(fd, "telepon") || null, pesan: id ? "Data karyawan disimpan." : undefined };
}

export async function resetPin(_p: HasilKaryawan | null, fd: FormData): Promise<HasilKaryawan> {
  const r = await staffRpc<{ kode: string; nama: string; pin: string }>("hr_pegawai_pin", { p_id: str(fd, "id") });
  if (r.error || !r.data) return { ok: false, pesan: r.error ?? "PIN belum dibuat." };
  segarkan();
  return { ok: true, kode: r.data.kode, nama: r.data.nama, pin: r.data.pin, telepon: str(fd, "telepon") || null };
}

export async function ubahAktif(fd: FormData) {
  const back = str(fd, "back") || "/app/karyawan";
  const r = await staffRpc("hr_pegawai_aktif", { p_id: str(fd, "id"), p_aktif: str(fd, "aktif") === "1" });
  segarkan();
  redirect(`${back}${back.includes("?") ? "&" : "?"}${r.error ? "e" : "ok"}=${encodeURIComponent(r.error ?? "Status karyawan diubah.")}`);
}

/** Koreksi absen (lupa absen, dan sebagainya) oleh HRD. Jam diisi menurut zona waktu cabang karyawan. */
export async function koreksiAbsen(_p: HasilKaryawan | null, fd: FormData): Promise<HasilKaryawan> {
  const tgl = str(fd, "tanggal"), m = str(fd, "masuk"), p = str(fd, "pulang"), off = OFFSET[str(fd, "zona")] ?? "+08:00";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tgl) || !/^\d{2}:\d{2}$/.test(m) || (p && !/^\d{2}:\d{2}$/.test(p))) return { ok: false, pesan: "Isi tanggal dan jam dengan benar." };
  const r = await staffRpc("hr_absen_koreksi", { p_emp: str(fd, "id"), p_tgl: tgl, p_masuk: `${tgl}T${m}:00${off}`, p_pulang: p ? `${tgl}T${p}:00${off}` : null, p_catatan: str(fd, "catatan") });
  if (r.error) return { ok: false, pesan: r.error };
  segarkan();
  return { ok: true, pesan: "Koreksi tersimpan dan tertanda di laporan Finance." };
}

export async function simpanCabang(fd: FormData) {
  const lat = str(fd, "lat").replace(",", "."), lng = str(fd, "lng").replace(",", ".");
  const r = await staffRpc("hr_cabang_absen_set", {
    p_cabang: str(fd, "id"), p_radius: Number(str(fd, "radius")), p_selfie: str(fd, "selfie") === "1", p_jam: str(fd, "jam") || null, p_toleransi: Number(str(fd, "toleransi")),
    p_lat: lat ? Number(lat) : null, p_lng: lng ? Number(lng) : null,
  });
  segarkan(); revalidatePath("/app/karyawan/cabang");
  redirect(`/app/karyawan/cabang?${r.error ? "e" : "ok"}=${encodeURIComponent(r.error ?? "Pengaturan absen cabang disimpan.")}#c-${str(fd, "id")}`);
}
