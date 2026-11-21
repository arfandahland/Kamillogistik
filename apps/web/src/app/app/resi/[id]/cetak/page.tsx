import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CAN_PRINT_LABEL, MASUK_LABEL, MODA_LABEL, parseResi, type AnyStatus } from "@kamil/core";
import LabelStudio, { type LabelData } from "@/components/LabelStudio";
import { barcodeSvg, qrSvg } from "@/lib/barcode";
import { getMe, staffRpc } from "@/lib/supabase/server";
import { abs } from "@/lib/site";
import Icon from "@/components/Icon";

export const metadata: Metadata = { title: "Cetak Label Resi" };
export const dynamic = "force-dynamic";

type D = {
  id: string; resiNo: string; status: AnyStatus; pickupType: "PICKUP" | "DROPOFF"; mode: "LAUT" | "DARAT" | "UDARA";
  origin: { code: string; city: string; name: string }; dest: { code: string; city: string; name: string };
  senderName: string; senderPhone: string | null; receiverName: string; receiverPhone: string | null; receiverAddress: string | null;
  segment: string; company: string | null;
  items: { barcode: string; weightKg: number | null }[];
};

export default async function Cetak({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const me = (await getMe()).data;
  if (!me || !CAN_PRINT_LABEL.includes(me.role)) redirect(`/app/resi/${id}?e=${encodeURIComponent("Label resi hanya dicetak oleh Kasir di gudang atau gerai.")}`);
  const r = await staffRpc<D>("staff_get_shipment", { p_id: id });
  if (r.error || !r.data) return <main className="wrap section stack"><div className="err">{r.error ?? "Resi tidak ditemukan."}</div><Link className="btn ghost" href="/app">← Kembali</Link></main>;
  const s = r.data, p = parseResi(s.resiNo);
  const tgl = p ? `${String(p.tanggal.dd).padStart(2, "0")}/${String(p.tanggal.mm).padStart(2, "0")}/20${String(p.tanggal.yy).padStart(2, "0")} ${String(p.jam.hh).padStart(2, "0")}.${String(p.jam.mi).padStart(2, "0")} WITA` : "";
  const base = {
    resi: s.resiNo, asal: s.origin.code, tujuan: s.dest.code, kotaAsal: s.origin.city, kotaTujuan: s.dest.city,
    moda: MODA_LABEL[s.mode].toUpperCase(), modaKode: s.mode, masuk: s.pickupType, masukLabel: MASUK_LABEL[s.pickupType],
    penerima: s.receiverName, hpPenerima: s.receiverPhone, alamat: s.receiverAddress, pengirim: s.senderName, hpPengirim: s.senderPhone,
    tanggal: tgl, korporat: s.segment === "B2B" ? s.company : null, lacak: abs("/lacak"),
  };
  const total = s.items.length;
  const labels: LabelData[] = [
    { ...base, kode: s.resiNo, jenis: "induk", item: null, total, berat: s.items.every((i) => i.weightKg != null) ? s.items.reduce((a, i) => a + Number(i.weightKg), 0) : null, bar: barcodeSvg(s.resiNo), qr: qrSvg(s.resiNo) },
    ...s.items.map((it, i): LabelData => ({ ...base, kode: it.barcode, jenis: "barang", item: i + 1, total, berat: it.weightKg != null ? Number(it.weightKg) : null, bar: barcodeSvg(it.barcode), qr: qrSvg(it.barcode) })),
  ];
  return (
    <main className="wrap section stack cetakpage">
      <div className="noprint"><Link href={`/app/resi/${s.id}`} className="btn ghost"><Icon name="back" size={20} /> Kembali ke resi</Link></div>
      <LabelStudio labels={labels} resiId={s.id} />
    </main>
  );
}
