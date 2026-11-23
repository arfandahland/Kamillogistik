import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import VendorForm from "@/components/VendorForm";
import { publicRpc } from "@/lib/publicRpc";

export const metadata: Metadata = { title: "Kirim Foto dan Laporan", robots: { index: false, follow: false, nocache: true }, referrer: "no-referrer" };
export const dynamic = "force-dynamic";
type Info = { resiNo: string; mode: string; asal: string | null; tujuan: string | null; vendor: string; berlaku: boolean; expiresAt: string; jumlah: number };
const MODA: Record<string, string> = { DARAT: "Darat", LAUT: "Laut", UDARA: "Udara" };

/** Halaman khusus vendor: tanpa akun, tanpa menu. Izin hanya dari link yang dibuat divisi MV. */
export default async function Vendor({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ ok?: string; e?: string }> }) {
  const { token } = await params; const sp = await searchParams;
  if (!/^[0-9a-f]{48}$/.test(token)) notFound();
  const info = await publicRpc<Info | null>("vendor_link_info", { p_token: token });
  if (!info) notFound();
  const sampai = new Date(info.expiresAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Makassar" });
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 16, paddingBottom: 40 }}>
      <p className="overline">Kamil Logistik · Laporan vendor</p>
      <h1 style={{ marginTop: -6 }}>Kirim foto dan laporan</h1>
      <section className="card stack" aria-label="Pengiriman">
        <dl className="infogrid">
          <div><dt>Nomor resi</dt><dd>{info.resiNo}</dd></div>
          <div><dt>Moda</dt><dd>{MODA[info.mode] ?? info.mode}</dd></div>
          <div><dt>Rute</dt><dd>{info.asal ?? "-"} → {info.tujuan ?? "-"}</dd></div>
          <div><dt>Pengangkut</dt><dd>{info.vendor}</dd></div>
        </dl>
        <p className="hint" style={{ margin: 0 }}>{info.berlaku ? `Link berlaku sampai ${sampai}. Sudah ${info.jumlah} kiriman.` : "Link ini sudah tidak berlaku."}</p>
      </section>
      {sp.ok && <div className="banner" role="status"><b>Terkirim.</b><p style={{ margin: "4px 0 0" }}>Divisi MV sudah menerimanya. Anda boleh mengirim lagi bila perlu.</p></div>}
      {sp.e && <div className="err" role="alert">{sp.e}</div>}
      {info.berlaku
        ? <VendorForm token={token} />
        : <section className="card"><p style={{ margin: 0 }}><Icon name="alert" size={18} /> Minta link baru ke divisi MV Kamil Logistik.</p></section>}
    </main>
  );
}
