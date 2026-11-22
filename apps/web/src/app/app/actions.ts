"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseServer, staffRpc } from "@/lib/supabase/server";
import { normalizePhone } from "@kamil/core";

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
  const hpS = normalizePhone(String(fd.get("hp_pengirim") ?? "")), hpP = normalizePhone(String(fd.get("hp_penerima") ?? ""));
  if (!hpS.ok) redirect(`/app/baru?e=${encodeURIComponent("Pengirim: " + hpS.error)}`);
  if (!hpP.ok) redirect(`/app/baru?e=${encodeURIComponent("Penerima: " + hpP.error)}`);
  let area: unknown = null;
  try { area = JSON.parse(String(fd.get("area") ?? "")); } catch { area = null; }
  if (!area || typeof area !== "object") redirect(`/app/baru?e=${encodeURIComponent("Pilih alamat tujuan sampai kelurahan atau desa (provinsi, kabupaten atau kota, kecamatan, kelurahan atau desa).")}`);
  const kd = (k: string) => String(fd.get(`kd_${k}`) ?? "").trim().slice(0, 80);
  const kendaraan = Object.fromEntries(["jenis", "merek", "nopol", "rangka", "mesin", "stnk", "bpkb", "catatan"].map((k) => [k, kd(k)]).filter(([, v]) => v));
  const jemput = /^[0-9a-f-]{36}$/i.test(String(fd.get("jemput") ?? "")) ? String(fd.get("jemput")) : null;
  const { data, error } = await staffRpc<{ id: string }>(jemput ? "create_shipment_from_pickup" : "create_shipment_full", {
    ...(jemput ? { p_request: jemput } : {}),
    p_dest_id: /^[0-9a-f-]{36}$/i.test(String(fd.get("tujuan") ?? "")) ? String(fd.get("tujuan")) : null,
    p_mode: ["LAUT", "UDARA", "DARAT"].includes(String(fd.get("moda"))) ? String(fd.get("moda")) : "LAUT",
    p_sender_name: String(fd.get("pengirim") ?? ""),
    p_sender_phone: hpS.ok ? hpS.wa : "",
    p_receiver_name: String(fd.get("penerima") ?? ""),
    p_receiver_phone: hpP.ok ? hpP.wa : "",
    p_receiver_address: String(fd.get("alamat") ?? ""),
    p_area: area,
    p_piece_count: Number(fd.get("jumlah") ?? 1) || 1,
    p_condition_note: String(fd.get("catatan") ?? "") || null,
    p_client_ref: /^[0-9a-f-]{36}$/i.test(String(fd.get("ref") ?? "")) ? String(fd.get("ref")) : null,
    ...(jemput ? {} : { p_pickup_type: fd.get("masuk") === "DROPOFF" ? "DROPOFF" : "PICKUP", p_pickup_address: String(fd.get("alamat_jemput") ?? "").trim() || null }),
    p_company_id: fd.get("jenis") === "B2B" && /^[0-9a-f-]{36}$/i.test(String(fd.get("company") ?? "")) ? String(fd.get("company")) : null,
    p_vehicle: Object.keys(kendaraan).length ? kendaraan : null,
    p_details: {
      contents: String(fd.get("isi") ?? "").trim(),
      declaredValue: String(fd.get("nilai") ?? "").replace(/\D/g, ""),
      packaging: String(fd.get("kemasan") ?? "").trim(),
      fragile: fd.get("rapuh") === "on",
      extra: {
        jadwalJemput: String(fd.get("jadwal") ?? "").trim(), waktuJemput: String(fd.get("waktu") ?? ""), asuransi: fd.get("asuransi") === "ya",
        caraBayar: String(fd.get("bayar") ?? ""), refPelanggan: String(fd.get("refpel") ?? "").trim(),
      },
    },
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
  const { data, error } = await staffRpc<{ totalKg: number; volumeKg: number; volumeM3: number }>("measure_shipment", { p_id: id, p_items: items });
  revalidatePath("/app");
  if (error || !data) back(id, "e", error ?? "Gagal menimbang");
  back(id, "ok", `Selesai ditimbang: ${Number(data!.totalKg).toLocaleString("id-ID")} kg. Data timbang sudah masuk ke Kasir untuk dibuatkan invoice.`);
}

/** Kasir menerbitkan invoice dengan harga yang diisi sendiri (per kg, per m3, atau borongan) ditambah baris biaya bebas. */
export async function terbitkanInvoice(fd: FormData) {
  const id = String(fd.get("id"));
  let baris: { label: string; amount: number }[] = [];
  try { const j = JSON.parse(String(fd.get("baris") ?? "[]")); if (Array.isArray(j)) baris = j.filter((x) => x && String(x.label ?? "").trim() && Number(x.amount) > 0).map((x) => ({ label: String(x.label).trim().slice(0, 80), amount: Math.round(Number(x.amount)) })).slice(0, 10); } catch { /* tanpa baris */ }
  const hari = String(fd.get("tempo") ?? "").trim();
  const { data, error } = await staffRpc<{ invoiceNo: string; total: number }>("invoice_issue", {
    p_shipment: id, p_basis: String(fd.get("satuan") ?? "KG"), p_qty: num(String(fd.get("jumlah") ?? "").replace(",", ".")) ?? 0, p_unit_price: Math.round(num(String(fd.get("harga") ?? "").replace(/\D/g, "")) ?? 0),
    p_lines: baris, p_due_days: hari ? Math.max(0, Math.min(365, Math.round(Number(hari)))) : null, p_note: String(fd.get("catatan") ?? "").trim().slice(0, 300) || null,
  });
  revalidatePath("/app"); revalidatePath(`/app/resi/${id}`);
  if (error || !data) back(id, "e", error ?? "Gagal menerbitkan invoice");
  back(id, "ok", `Invoice ${data!.invoiceNo} sebesar Rp${data!.total.toLocaleString("id-ID")} diterbitkan.`);
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

/** Simpan pemeriksaan fisik barang; bila `to` diisi, lanjut menandai langkah berikutnya (jemput / terima di gudang). */
export async function periksa(fd: FormData) {
  const id = String(fd.get("id"));
  let foto: string[] = [];
  try { const j = JSON.parse(String(fd.get("foto") ?? "[]")); if (Array.isArray(j)) foto = j.filter((x) => typeof x === "string").slice(0, 4); } catch { /* kosong */ }
  const jumlah = Number(String(fd.get("jumlah_hitung") ?? "").trim());
  const r = await staffRpc("record_inspection", {
    p_id: id, p_stage: String(fd.get("stage")), p_contents: String(fd.get("isi") ?? ""), p_packaging: String(fd.get("kemasan") ?? ""),
    p_conditions: fd.getAll("kondisi").map(String), p_note: String(fd.get("catatan") ?? "") || null, p_photos: foto,
    p_pieces: Number.isFinite(jumlah) && jumlah >= 1 ? Math.round(jumlah) : null,
  });
  if (r.error) back(id, "e", r.error);
  const to = String(fd.get("to") ?? "");
  if (to) {
    const a = await staffRpc("advance_shipment", { p_id: id, p_to: to, p_client_event_id: crypto.randomUUID() });
    revalidatePath("/app");
    if (a.error) back(id, "e", a.error);
    back(id, "ok", String(fd.get("done") ?? "Tersimpan."));
  }
  revalidatePath("/app");
  back(id, "ok", "Pemeriksaan barang tersimpan.");
}

export async function tutupResi(fd: FormData) {
  const id = String(fd.get("id"));
  const { error } = await staffRpc("shipment_close", { p_id: id, p_note: String(fd.get("catatan") ?? "") || null, p_proof_url: String(fd.get("tautan") ?? "") || null });
  revalidatePath("/app");
  if (error) back(id, "e", error);
  back(id, "ok", "Resi sudah ditutup. Kasir asal bisa melihat hasilnya dan mengabari pelanggan.");
}

export async function teruskanResi(fd: FormData) {
  const id = String(fd.get("id"));
  const { error } = await staffRpc("shipment_forward", { p_id: id, p_next: String(fd.get("ke") ?? ""), p_mode: String(fd.get("moda") ?? ""), p_note: String(fd.get("catatan") ?? "") || null });
  revalidatePath("/app"); revalidatePath("/app/sortir");
  if (error) back(id, "e", error);
  back(id, "ok", "Resi diteruskan ke gudang berikutnya. Nomor resi tetap sama dan siap dimuat ke manifest.");
}
