"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { staffRpc } from "@/lib/supabase/server";

/** Pindah halaman dengan pesan berhasil (?ok=) atau galat (?e=). Pesan galat dari server ditampilkan apa adanya. */
const go = (path: string, kind: "ok" | "e", msg: string): never => redirect(`${path}${path.includes("?") ? "&" : "?"}${kind}=${encodeURIComponent(msg)}`);
const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const flag = (fd: FormData, k: string) => fd.get(k) === "on" || fd.get(k) === "1";
const uuid = (v: string) => (/^[0-9a-f-]{36}$/i.test(v) ? v : null);
const angka = (fd: FormData, k: string): number | null => { const s = str(fd, k).replace(/[.\s]/g, "").replace(",", "."); return s === "" ? null : Number(s); };
const desimal = (fd: FormData, k: string): number | null => { const s = str(fd, k); if (!s) return null; const n = Number(s); return Number.isFinite(n) ? n : null; };
const waktu = (fd: FormData, k: string): string | null => { const s = str(fd, k); return s && !Number.isNaN(Date.parse(s)) ? s : null; };

/** Alamat kembali dari formulir: hanya halaman MV, tanpa pesan lama. */
function balik(fd: FormData, cadangan: string): string {
  const b = str(fd, "back");
  if (!b.startsWith("/app/mv") || b.startsWith("//")) return cadangan;
  const u = new URL(b, "http://x");
  u.searchParams.delete("ok"); u.searchParams.delete("e");
  return u.pathname + u.search;
}
const segar = () => revalidatePath("/app/mv", "layout");

/* ---------- Vendor ---------- */
export async function simpanVendor(fd: FormData) {
  const back = balik(fd, "/app/mv/vendor"), id = uuid(str(fd, "id"));
  const { error } = await staffRpc("mv_vendor_save", {
    p_id: id, p_name: str(fd, "nama"), p_kind: str(fd, "jenis"), p_contact: str(fd, "kontak") || null, p_phone: str(fd, "telepon") || null, p_email: str(fd, "email") || null,
    p_address: str(fd, "alamat") || null, p_bank: str(fd, "bank") || null, p_account: str(fd, "rekening") || null, p_note: str(fd, "catatan") || null,
  });
  segar();
  if (error) go(back, "e", error);
  go(back, "ok", id ? "Perubahan vendor tersimpan." : "Vendor tersimpan dan sudah bisa dipakai di alokasi. MV Master dapat memverifikasinya kemudian.");
}
export async function ubahStatusVendor(fd: FormData) {
  const back = balik(fd, "/app/mv/vendor"), status = str(fd, "status");
  const { error } = await staffRpc("mv_vendor_set_status", { p_id: uuid(str(fd, "id")), p_status: status, p_note: str(fd, "alasan") || null });
  segar();
  if (error) go(back, "e", error);
  go(back, "ok", status === "AKTIF" ? "Vendor diaktifkan." : status === "NONAKTIF" ? "Vendor dinonaktifkan." : "Vendor ditolak.");
}
export async function tambahRute(fd: FormData) {
  const back = balik(fd, "/app/mv/vendor");
  const { error } = await staffRpc("mv_vendor_route_save", { p_vendor: uuid(str(fd, "vendor")), p_mode: str(fd, "moda"), p_origin: uuid(str(fd, "asal")), p_region: str(fd, "wilayah") || null, p_vehicle: str(fd, "armada") || null });
  segar();
  if (error) go(back, "e", error);
  go(back, "ok", "Rute ditambahkan.");
}
export async function hapusRute(fd: FormData) {
  const back = balik(fd, "/app/mv/vendor");
  const { error } = await staffRpc("mv_vendor_route_delete", { p_id: uuid(str(fd, "id")) });
  segar();
  if (error) go(back, "e", error);
  go(back, "ok", "Rute dihapus.");
}

/* ---------- Alokasi dan HPP ---------- */
export async function simpanAlokasi(fd: FormData) {
  const back = balik(fd, "/app/mv/alokasi"), internal = flag(fd, "internal");
  const { error } = await staffRpc("mv_alloc_save", {
    p_shipment: uuid(str(fd, "shipment")), p_vendor: null, p_vendor_name: internal ? null : (str(fd, "vendor_nama") || null), p_internal: internal,
    p_driver: str(fd, "sopir") || null, p_plate: str(fd, "plat") || null, p_note: str(fd, "catatan") || null,
  });
  segar();
  if (error) go(back, "e", error);
  go(back, "ok", "Pilihan vendor tersimpan.");
}
export async function simpanHpp(fd: FormData) {
  const back = balik(fd, "/app/mv/alokasi"), n = angka(fd, "hpp");
  if (n == null || !Number.isInteger(n) || n <= 0) go(back, "e", "Isi HPP dengan angka rupiah lebih dari nol, tanpa koma.");
  const { error } = await staffRpc("mv_alloc_set_hpp", { p_alloc: uuid(str(fd, "alloc")), p_hpp: n, p_reason: str(fd, "alasan") || null });
  segar();
  if (error) go(back, "e", error);
  go(back, "ok", "HPP tersimpan.");
}
export async function ubahStatusAlokasi(fd: FormData) {
  const back = balik(fd, "/app/mv/alokasi"), status = str(fd, "status");
  const { error } = await staffRpc("mv_alloc_status", { p_alloc: uuid(str(fd, "alloc")), p_status: status });
  segar();
  if (error) go(back, "e", error);
  go(back, "ok", status === "BERANGKAT" ? "Dicatat: barang berangkat." : status === "TIBA" ? "Dicatat: barang tiba." : "Pengiriman ditandai selesai.");
}
export async function kunciHpp(fd: FormData) {
  const back = balik(fd, "/app/mv/alokasi"), kunci = str(fd, "kunci") === "1";
  const { error } = await staffRpc("hpp_match", { p_alloc: uuid(str(fd, "alloc")), p_locked: kunci, p_reason: str(fd, "alasan") || null });
  segar();
  if (error) go(back, "e", error);
  go(back, "ok", kunci ? "HPP sudah dicocokkan dan dikunci." : "Kunci HPP dibuka.");
}
export async function tambahDokumen(fd: FormData) {
  const back = balik(fd, "/app/mv/alokasi");
  const foto = str(fd, "foto"), sumber = str(fd, "sumber");
  if (!foto) go(back, "e", "Ambil foto dulu sebelum menyimpan.");
  const { error } = await staffRpc("mv_doc_add", {
    p_shipment: uuid(str(fd, "shipment")), p_kind: str(fd, "jenis"), p_source: sumber || "KAMERA", p_photo: foto,
    p_captured_at: waktu(fd, "diambil_pada"), p_lat: desimal(fd, "lat"), p_lng: desimal(fd, "lng"), p_reason: str(fd, "alasan") || null,
  });
  segar();
  if (error) go(back, "e", error);
  go(back, "ok", "Dokumen tersimpan.");
}

/* ---------- SJ balik ---------- */
export async function ubahStatusSJ(fd: FormData) {
  const back = balik(fd, "/app/mv/sj"), status = str(fd, "status");
  const { error } = await staffRpc("mv_sj_set", { p_sj: uuid(str(fd, "sj")), p_status: status, p_note: str(fd, "catatan") || null });
  segar();
  if (error) go(back, "e", error);
  go(back, "ok", status === "DALAM_PERJALANAN_BALIK" ? "SJ ditandai dalam perjalanan balik." : status === "BERMASALAH" ? "SJ ditandai bermasalah." : status === "HILANG" ? "SJ ditandai hilang." : "Status SJ diperbarui.");
}
function daftarSJ(fd: FormData): string[] { return fd.getAll("sj").map((v) => String(v)).filter((v) => uuid(v)); }
export async function terimaSJ(fd: FormData) {
  const back = balik(fd, "/app/mv/sj"), ids = daftarSJ(fd);
  if (ids.length === 0) go(back, "e", "Centang dulu SJ yang diterima.");
  const { data, error } = await staffRpc<{ receiptId: string; number: string; jumlah: number }>("mv_sj_receive", { p_sj: ids, p_signed_by: str(fd, "nama"), p_note: str(fd, "catatan") || null, p_photo: str(fd, "foto") || null });
  segar();
  if (error || !data) go(back, "e", error ?? "SJ belum bisa diterima.");
  go(`/app/mv/tanda-terima/${data!.receiptId}`, "ok", `${data!.jumlah} SJ diterima. Nomor tanda terima ${data!.number}.`);
}
export async function serahSJ(fd: FormData) {
  const back = balik(fd, "/app/mv/sj"), ids = daftarSJ(fd);
  if (ids.length === 0) go(back, "e", "Centang dulu SJ yang diserahkan.");
  const { data, error } = await staffRpc<{ receiptId: string; number: string; jumlah: number }>("mv_sj_handover", { p_sj: ids, p_finance_name: str(fd, "nama"), p_note: str(fd, "catatan") || null, p_photo: str(fd, "foto") || null });
  segar();
  if (error || !data) go(back, "e", error ?? "SJ belum bisa diserahkan.");
  go(`/app/mv/tanda-terima/${data!.receiptId}`, "ok", `${data!.jumlah} SJ diserahkan ke Finance. Nomor tanda terima ${data!.number}.`);
}

/* ---------- Manifest udara ---------- */
export async function terimaManifestUdara(fd: FormData) {
  const back = balik(fd, "/app/mv/udara");
  const { error } = await staffRpc("mv_air_accept", { p_id: uuid(str(fd, "id")) });
  segar();
  if (error) go(back, "e", error);
  go(back, "ok", "Manifest udara diterima.");
}
