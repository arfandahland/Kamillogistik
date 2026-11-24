import type { Metadata } from "next";
import Icon from "@/components/Icon";
import AbsenForm from "@/components/AbsenForm";
import { publicRpc } from "@/lib/publicRpc";

export const metadata: Metadata = { title: "Absen Karyawan", robots: { index: false, follow: false, nocache: true }, referrer: "no-referrer" };
export const dynamic = "force-dynamic";

/** Halaman absen karyawan: tanpa akun dan tanpa menu. Izin dari QR resmi, kode pegawai, dan PIN pribadi. */
export default async function Absen({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const ok = /^[0-9a-f]{32}$/.test(token) && (await publicRpc<{ berlaku: boolean }>("absen_info", { p_token: token }))?.berlaku === true;
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 16, paddingBottom: 40 }}>
      <p className="overline">Kamil Logistik · Absensi karyawan</p>
      <h1 style={{ marginTop: -6 }}>Absen masuk dan pulang</h1>
      {ok ? <AbsenForm token={token} /> : (
        <section className="card stack"><p style={{ margin: 0 }}><Icon name="alert" size={18} /> <b>QR ini sudah tidak berlaku.</b></p><p className="muted" style={{ margin: 0 }}>Minta QR absensi terbaru ke Finance atau HRD.</p></section>
      )}
    </main>
  );
}
