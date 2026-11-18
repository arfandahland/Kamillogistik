"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseServer, staffRpc } from "@/lib/supabase/server";

const back = (id: string, kind: "e" | "ok", msg: string): never =>
  redirect(`/app/resi/${id}?${kind}=${encodeURIComponent(msg)}`);
const num = (v: FormDataEntryValue | null) => {
  const s = String(v ?? "").trim().replace(",", ".");
  return s === "" ? null : Number(s);
};

export async function keluar() {
  const sb = await supabaseServer();
  await sb.auth.signOut();
  redirect("/masuk");
}

export async function buatResi(fd: FormData) {
  const { data, error } = await staffRpc<{ id: string }>("create_shipment", {
    p_route_slug: String(fd.get("rute") ?? ""),
    p_sender_name: String(fd.get("pengirim") ?? ""),
    p_sender_phone: String(fd.get("hp_pengirim") ?? ""),
    p_receiver_name: String(fd.get("penerima") ?? ""),
    p_receiver_phone: String(fd.get("hp_penerima") ?? ""),
    p_receiver_address: String(fd.get("alamat") ?? ""),
    p_piece_count: Number(fd.get("jumlah") ?? 1) || 1,
    p_condition_note: String(fd.get("catatan") ?? "") || null,
  });
  if (error || !data) redirect(`/app/baru?e=${encodeURIComponent(error ?? "Gagal membuat resi")}`);
  revalidatePath("/app");
  back(data.id, "ok", "Resi sudah dibuat. Berikan nomor resinya ke pengirim.");
}

export async function lanjut(fd: FormData) {
  const id = String(fd.get("id"));
  const { error } = await staffRpc("advance_shipment", { p_id: id, p_to: String(fd.get("to")), p_client_event_id: crypto.randomUUID() });
  revalidatePath("/app");
  if (error) back(id, "e", error);
  back(id, "ok", String(fd.get("done") ?? "Tersimpan."));
}

export async function catatTerima(fd: FormData) {
  const id = String(fd.get("id"));
  const { error } = await staffRpc("record_pod", {
    p_id: id, p_receiver: String(fd.get("penerima") ?? ""), p_photo: String(fd.get("foto") ?? ""), p_signature: String(fd.get("ttd") ?? ""),
    p_lat: num(fd.get("lat")), p_lng: num(fd.get("lng")), p_client_event_id: crypto.randomUUID(),
  });
  revalidatePath("/app");
  if (error) back(id, "e", error);
  back(id, "ok", "Bukti terima tersimpan. Pengiriman ini selesai.");
}

export async function timbang(fd: FormData) {
  const id = String(fd.get("id"));
  const n = Number(fd.get("n") ?? 0);
  const items = Array.from({ length: n }, (_, i) => {
    const w = num(fd.get(`w${i}`));
    const l = num(fd.get(`l${i}`)), wd = num(fd.get(`wd${i}`)), h = num(fd.get(`h${i}`));
    return { weightKg: w, ...(l && wd && h ? { lCm: l, wCm: wd, hCm: h } : {}) };
  });
  const extra = num(fd.get("biaya"));
  const surcharges = extra && extra > 0 ? [{ code: "TAMBAHAN", label: String(fd.get("ket") || "Biaya tambahan"), amount: extra }] : [];
  const { data, error } = await staffRpc<{ invoiceNo: string; total: number }>("measure_shipment", { p_id: id, p_items: items, p_surcharges: surcharges });
  revalidatePath("/app");
  if (error || !data) back(id, "e", error ?? "Gagal menimbang");
  back(id, "ok", `Selesai ditimbang. Tagihan ${data!.invoiceNo} sebesar Rp${data!.total.toLocaleString("id-ID")} sudah dibuat.`);
}

export async function serahkan(fd: FormData) {
  const id = String(fd.get("id"));
  const to = String(fd.get("ke") ?? "");
  if (!to) back(id, "e", "Pilih dulu siapa yang menerima barang.");
  const { error } = await staffRpc("start_handover", { p_shipment: id, p_to_user: to, p_client_event_id: crypto.randomUUID() });
  if (error) back(id, "e", error);
  back(id, "ok", "Barang diserahkan. Menunggu penerima menekan tombol terima.");
}

export async function terima(fd: FormData) {
  const id = String(fd.get("id"));
  const { error } = await staffRpc("accept_handover", { p_handover: String(fd.get("hid")) });
  revalidatePath("/app");
  if (error) back(id, "e", error);
  back(id, "ok", "Barang sudah Anda terima. Sekarang barang ini tanggung jawab Anda.");
}
