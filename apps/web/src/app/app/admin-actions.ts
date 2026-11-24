"use server";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { staffRpc } from "@/lib/supabase/server";

const go = (path: string, kind: "ok" | "e", msg: string): never => redirect(`${path}${path.includes("?") ? "&" : "?"}${kind}=${encodeURIComponent(msg)}`);
const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const num = (fd: FormData, k: string): number | null => { const s = str(fd, k).replace(/\./g, "").replace(",", "."); return s === "" ? null : Number(s); };
const flag = (fd: FormData, k: string) => fd.get(k) === "on" || fd.get(k) === "1";

/* ---------- Pembayaran ---------- */
export async function catatBayar(fd: FormData) {
  const id = str(fd, "id"), back = `/app/tagihan/${id}`;
  const { data, error } = await staffRpc<{ status: string; outstanding: number }>("record_payment", {
    p_invoice: id, p_method: str(fd, "cara"), p_amount: num(fd, "jumlah"), p_reference: str(fd, "referensi") || null, p_note: str(fd, "catatan") || null, p_bank: str(fd, "bank") || null,
  });
  revalidatePath("/app", "layout");
  if (error || !data) go(back, "e", error ?? "Gagal mencatat pembayaran");
  go(back, "ok", data!.outstanding > 0 ? "Pembayaran tercatat. Tagihan masih punya sisa." : "Pembayaran tercatat. Tagihan sudah lunas.");
}

/** Finance mencatat hard copy invoice sudah diterima customer (untuk rekanan, tempo dihitung dari tanggal ini). */
export async function hardcopyDiterima(fd: FormData) {
  const id = str(fd, "id"), back = `/app/tagihan/${id}`;
  const { data, error } = await staffRpc<{ dueDate: string | null }>("invoice_hardcopy", { p_invoice: id, p_received: str(fd, "tanggal") || null });
  revalidatePath("/app", "layout");
  if (error || !data) go(back, "e", error ?? "Gagal mencatat hard copy");
  go(back, "ok", data!.dueDate ? `Hard copy tercatat diterima. Jatuh tempo ${data!.dueDate}.` : "Hard copy tercatat diterima.");
}
/** Finance menyesuaikan lama tempo (14, 30, atau sesuai PKS). */
export async function aturTempo(fd: FormData) {
  const id = str(fd, "id"), back = `/app/tagihan/${id}`;
  const { error } = await staffRpc("invoice_set_tempo", { p_invoice: id, p_days: Math.round(num(fd, "hari") ?? 0) });
  revalidatePath("/app", "layout");
  if (error) go(back, "e", error);
  go(back, "ok", "Lama tempo diperbarui.");
}

/* ---------- Mitra dan cabang ---------- */
export async function simpanMitra(fd: FormData) {
  const id = str(fd, "id") || null, base = "/app/mitra";
  const type = str(fd, "jenis");
  const { data: pid, error } = await staffRpc<string>("owner_save_partner", {
    p_id: id, p_type: type, p_code: str(fd, "kode"), p_name: str(fd, "nama"), p_city: str(fd, "kota"), p_phone: str(fd, "telepon"), p_address: str(fd, "alamat"),
    p_contact: str(fd, "kontak"), p_commission: num(fd, "komisi") ?? 0, p_status: str(fd, "status") || "ACTIVE", p_notes: str(fd, "catatan"),
  });
  if (error || !pid) go(id ? `${base}?edit=${id}` : base, "e", error ?? "Gagal menyimpan");
  revalidateTag("routes"); revalidatePath("/app", "layout");
  // Daftarkan akun pertama untuk mitra/cabang baru sekalian (opsional)
  const email = str(fd, "akun_email");
  if (!id && email) {
    const pilih = str(fd, "akun_peran");
    const role = ["MITRA_POS", "HUB_MANAGER", "WAREHOUSE"].includes(pilih) ? pilih : type === "MITRA" ? "MITRA_POS" : type === "HUB" ? "HUB_MANAGER" : null;
    if (role) {
      const r = await staffRpc("owner_create_staff", { p_email: email, p_name: str(fd, "akun_nama") || str(fd, "kontak") || str(fd, "nama"), p_role: role, p_branch: pid, p_password: str(fd, "akun_sandi") });
      if (r.error) go(base, "e", `Mitra tersimpan, tetapi akun belum dibuat: ${r.error}`);
      go(base, "ok", `Mitra tersimpan dan akun ${email} dibuat. Beri tahu sandi sementaranya kepada yang bersangkutan.`);
    }
  }
  go(base, "ok", id ? "Perubahan mitra tersimpan." : "Mitra baru terdaftar.");
}

/* ---------- Petugas ---------- */
export async function buatPetugas(fd: FormData) {
  const { error } = await staffRpc("owner_create_staff", { p_email: str(fd, "email"), p_name: str(fd, "nama"), p_role: str(fd, "peran"), p_branch: str(fd, "cabang") || null, p_password: str(fd, "sandi") });
  revalidatePath("/app/petugas");
  if (error) go("/app/petugas", "e", error);
  go("/app/petugas", "ok", `Akun ${str(fd, "email")} dibuat. Beri tahu sandi sementaranya kepada yang bersangkutan, lalu minta diganti lewat menu Akun.`);
}
export async function ubahStatusPetugas(fd: FormData) {
  const aktif = str(fd, "aktif") === "1";
  const { error } = await staffRpc("owner_set_user_status", { p_user: str(fd, "id"), p_active: aktif });
  revalidatePath("/app/petugas");
  if (error) go("/app/petugas", "e", error);
  go("/app/petugas", "ok", aktif ? "Petugas diaktifkan kembali." : "Petugas dinonaktifkan dan tidak bisa masuk lagi.");
}
export async function resetSandi(fd: FormData) {
  const { error } = await staffRpc("owner_set_password", { p_user: str(fd, "id"), p_password: str(fd, "sandi") });
  if (error) go("/app/petugas", "e", error);
  go("/app/petugas", "ok", "Kata sandi diganti. Beri tahu sandi baru kepada petugas dan minta diganti sendiri.");
}

/* ---------- Tarif dan rute ---------- */
export async function simpanRute(fd: FormData) {
  const id = str(fd, "id") || null;
  const { error } = await staffRpc("owner_save_route", {
    p_id: id, p_origin: str(fd, "asal"), p_dest: str(fd, "tujuan"), p_mode: str(fd, "jalur"), p_service: str(fd, "layanan"), p_basis: str(fd, "hitung"),
    p_unit_price: num(fd, "harga"), p_min_chargeable: num(fd, "minimal") ?? 0, p_min_total: num(fd, "min_total"), p_eta_days: num(fd, "eta") ?? 0,
    p_divisor: str(fd, "jalur") === "UDARA" ? 6000 : 4000, // pembagi berat volume: udara 6000, laut/darat 4000
    p_departure_note: str(fd, "jadwal"), p_public: flag(fd, "tampil"),
  });
  if (error) go("/app/tarif", "e", error);
  revalidateTag("routes"); revalidatePath("/"); revalidatePath("/ekspedisi"); revalidatePath("/ongkir");
  go("/app/tarif", "ok", id ? "Tarif tersimpan. Website langsung memakai harga baru." : "Rute baru ditambahkan dan langsung punya halaman di website.");
}

/* ---------- Pengaturan ---------- */
export async function simpanPerusahaan(fd: FormData) {
  const { error } = await staffRpc("owner_save_company", { p_name: str(fd, "nama"), p_phone: str(fd, "telepon"), p_whatsapp: str(fd, "wa"), p_address: str(fd, "alamat"), p_invoice_note: str(fd, "catatan") });
  if (error) go("/app/pengaturan", "e", error);
  go("/app/pengaturan", "ok", "Data perusahaan tersimpan. Invoice berikutnya memakai data ini.");
}
export async function simpanBank(fd: FormData) {
  const { error } = await staffRpc("owner_save_bank", { p_id: str(fd, "id") || null, p_bank: str(fd, "bank"), p_no: str(fd, "no"), p_name: str(fd, "nama"), p_active: flag(fd, "aktif") });
  if (error) go("/app/pengaturan", "e", error);
  go("/app/pengaturan", "ok", "Rekening tersimpan. Rekening aktif langsung tampil di invoice.");
}
