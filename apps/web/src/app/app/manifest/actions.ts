"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { staffRpc } from "@/lib/supabase/server";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const waktu = (fd: FormData, k: string) => { const v = str(fd, k); if (!v) return null; const d = new Date(v + (v.length === 16 ? ":00+08:00" : "")); return Number.isNaN(d.getTime()) ? null : d.toISOString(); };
const back = (id: string, kind: "e" | "ok", msg: string): never => redirect(`/app/manifest/${id}?${kind}=${encodeURIComponent(msg)}`);
const hasil = async (id: string, fn: string, args: Record<string, unknown>, okMsg: string) => {
  const r = await staffRpc(fn, args);
  revalidatePath("/app/manifest"); revalidatePath(`/app/manifest/${id}`); revalidatePath("/app");
  if (r.error) back(id, "e", r.error);
  back(id, "ok", okMsg);
};

export async function buatManifest(fd: FormData) {
  const r = await staffRpc<{ id: string; code: string }>("manifest_create", {
    p_dest: str(fd, "tujuan"), p_mode: str(fd, "jalur") || "LAUT", p_container: str(fd, "kontainer") || null, p_carrier: str(fd, "pengangkut") || null,
    p_departure: waktu(fd, "berangkat"), p_eta: waktu(fd, "tiba"), p_note: str(fd, "catatan") || null,
  });
  if (r.error || !r.data) redirect(`/app/manifest/baru?e=${encodeURIComponent(r.error ?? "Gagal membuat manifest")}`);
  revalidatePath("/app/manifest");
  back(r.data.id, "ok", `Manifest ${r.data.code} dibuat. Sekarang tambahkan resi yang akan dimuat.`);
}
export async function ubahManifest(fd: FormData) {
  const id = str(fd, "id");
  await hasil(id, "manifest_update", { p_id: id, p_container: str(fd, "kontainer") || null, p_carrier: str(fd, "pengangkut") || null, p_departure: waktu(fd, "berangkat"), p_eta: waktu(fd, "tiba"), p_note: str(fd, "catatan") || null }, "Data manifest disimpan.");
}
export async function tambahResiForm(fd: FormData) {
  const id = str(fd, "id");
  await hasil(id, "manifest_add", { p_id: id, p_code: str(fd, "kode") }, "Resi ditambahkan ke manifest.");
}
export async function keluarkanResi(fd: FormData) {
  const id = str(fd, "id");
  await hasil(id, "manifest_remove", { p_id: id, p_shipment: str(fd, "resi") }, "Resi dikeluarkan dari manifest.");
}
export async function segelManifest(fd: FormData) {
  const id = str(fd, "id");
  await hasil(id, "manifest_seal", { p_id: id, p_seal: str(fd, "segel") }, "Manifest disegel. Semua resi di dalamnya tercatat sudah dimuat.");
}
export async function serahkanManifest(fd: FormData) {
  const id = str(fd, "id");
  await hasil(id, "manifest_handover_start", { p_id: id, p_to_user: str(fd, "ke") }, "Manifest diserahkan. Menunggu penerima menekan tombol terima.");
}
export async function terimaManifest(fd: FormData) {
  const id = str(fd, "id");
  await hasil(id, "manifest_handover_accept", { p_id: id }, "Manifest sudah Anda terima. Seluruh barang di dalamnya kini tanggung jawab Anda.");
}
export async function berangkatManifest(fd: FormData) {
  const id = str(fd, "id");
  await hasil(id, "manifest_depart", { p_id: id, p_carrier: str(fd, "pengangkut") || null, p_departure: waktu(fd, "berangkat"), p_eta: waktu(fd, "tiba") }, "Tercatat: manifest sudah berangkat. Pelanggan melihat perkiraan tibanya.");
}
export async function tibaManifest(fd: FormData) {
  const id = str(fd, "id");
  await hasil(id, "manifest_arrive", { p_id: id }, "Tercatat: manifest sudah tiba di kota tujuan.");
}
export async function selesaiBongkar(fd: FormData) {
  const id = str(fd, "id");
  const r = await staffRpc<{ selisih: boolean; found: number; expected: number }>("manifest_finish_unload", { p_id: id, p_note: str(fd, "catatan") || null });
  revalidatePath("/app/manifest"); revalidatePath(`/app/manifest/${id}`); revalidatePath("/app");
  if (r.error) back(id, "e", r.error);
  back(id, "ok", r.data?.selisih ? `Pembongkaran selesai, tetapi ada selisih (${r.data.found} dari ${r.data.expected} barang). Kasus selisih dicatat untuk kepala gudang.` : "Pembongkaran selesai. Semua barang cocok dan sudah tercatat di gudang tujuan.");
}
export async function selesaikanSelisih(fd: FormData) {
  const id = str(fd, "id");
  await hasil(id, "manifest_resolve_discrepancy", { p_case: str(fd, "kasus"), p_found: str(fd, "hasil") === "ditemukan", p_note: str(fd, "catatan") }, "Kasus selisih diselesaikan.");
}

/** Dipakai pemindai kamera di halaman manifest: tambah resi (saat mengisi) atau cocokkan barang (saat membongkar). */
export async function pindaiManifest(id: string, mode: "tambah" | "bongkar", kode: string): Promise<{ ok: boolean; pesan: string }> {
  const r = mode === "tambah"
    ? await staffRpc<{ resiNo: string; items: number; kg: number }>("manifest_add", { p_id: id, p_code: kode })
    : await staffRpc<{ scanned: number; expected: number }>("manifest_scan_unload", { p_id: id, p_code: kode });
  if (r.error || !r.data) return { ok: false, pesan: r.error ?? "Gagal." };
  revalidatePath(`/app/manifest/${id}`);
  if (mode === "tambah") { const d = r.data as { resiNo: string; items: number; kg: number }; return { ok: true, pesan: `${d.resiNo} masuk (${d.items} barang, ${Number(d.kg).toLocaleString("id-ID")} kg)` }; }
  const d = r.data as { scanned: number; expected: number };
  return { ok: true, pesan: `Cocok. ${d.scanned} dari ${d.expected} barang sudah dipindai.` };
}
export async function revisiEta(fd: FormData) {
  const id = str(fd, "id");
  await hasil(id, "manifest_revise_eta", { p_id: id, p_eta: waktu(fd, "tiba"), p_reason: str(fd, "alasan") }, "Perkiraan tiba diperbarui untuk semua resi di manifest ini.");
}
export async function isiVoyage(fd: FormData) {
  const id = str(fd, "id");
  await hasil(id, "manifest_voyage_set", { p_id: id, p_voyage: str(fd, "voyage") || null, p_load: str(fd, "muat") || null, p_unload: str(fd, "bongkar") || null }, "Data voyage dan pelabuhan disimpan.");
}

export async function terimaSemuaManifest(fd: FormData) {
  const id = str(fd, "id");
  const r = await staffRpc<{ scanned: number }>("manifest_accept_all", { p_id: id });
  revalidatePath(`/app/manifest/${id}`);
  if (r.error) back(id, "e", r.error);
  back(id, "ok", `Semua ${r.data?.scanned ?? ""} barang diterima sesuai manifest. Periksa lagi bila ada yang rusak, lalu tekan Selesai membongkar.`);
}

/** Satu tombol: semua barang lengkap dan baik sesuai daftar manifest. Menandai semua diterima lalu menyelesaikan pembongkaran. */
export async function bongkarSemuaLengkap(fd: FormData) {
  const id = str(fd, "id");
  const a = await staffRpc<{ scanned: number }>("manifest_accept_all", { p_id: id });
  if (a.error) { revalidatePath(`/app/manifest/${id}`); back(id, "e", a.error); }
  const f = await staffRpc<{ resiSelesai: number }>("manifest_finish_unload", { p_id: id, p_note: null });
  revalidatePath("/app/manifest"); revalidatePath(`/app/manifest/${id}`); revalidatePath("/app");
  if (f.error) back(id, "e", f.error);
  back(id, "ok", `Pembongkaran selesai: ${a.data?.scanned ?? ""} barang diterima lengkap sesuai manifest, ${f.data?.resiSelesai ?? ""} resi sudah tercatat di gudang.`);
}
