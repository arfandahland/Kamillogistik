import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import { qrSvg } from "@/lib/barcode";
import { abs } from "@/lib/site";
import BackLink from "@/components/BackLink";
import PrintButton from "@/components/PrintButton";
import SubmitButton from "@/components/SubmitButton";
import { gantiQr } from "./actions";

export const metadata: Metadata = { title: "QR Absensi" };
export const dynamic = "force-dynamic";

export default async function QrAbsen({ searchParams }: { searchParams: Promise<{ ok?: string; e?: string }> }) {
  const me = await requireRole(["FINANCE", "HRD", "OWNER", "SUPER_ADMIN"]);
  const sp = await searchParams;
  const r = await staffRpc<{ token: string; dibuat: string }>("hr_qr_get");
  const url = r.data ? abs(`/absen/${r.data.token}`) : "";
  const dibuat = r.data ? new Date(r.data.dibuat).toLocaleDateString("id-ID", { timeZone: "Asia/Makassar", day: "numeric", month: "long", year: "numeric" }) : "";
  const bisaGanti = me.role !== "OWNER";
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <BackLink />
      <h1>QR absensi</h1>
      <p className="muted" style={{ marginTop: -6 }}>Satu QR resmi untuk semua cabang. Cetak, lalu kirim ke Jakarta, Makassar, Surabaya, dan cabang lain. Karyawan tidak perlu login: cukup scan, lalu isi kode pegawai dan PIN.</p>
      {sp.ok && <div className="ok" role="status">{sp.ok}</div>}{sp.e && <div className="err" role="alert">{sp.e}</div>}{r.error && <div className="err">{r.error}</div>}
      {r.data && (
        <>
          <section className="docprint abs-qr" aria-label="Poster QR absensi">
            <h1 style={{ textAlign: "center", margin: "0 0 4px" }}>ABSEN KARYAWAN</h1>
            <p style={{ textAlign: "center", margin: "0 0 14px", fontSize: 15 }}>Kamil Logistik Express</p>
            <div className="abs-qr-kotak" dangerouslySetInnerHTML={{ __html: qrSvg(url) }} />
            <ol className="abs-langkah">
              <li>Scan QR ini dengan kamera HP.</li>
              <li>Ketik <b>kode pegawai</b> dan <b>PIN</b> Anda.</li>
              <li>Ketuk <b>Absen sekarang</b>. Datang = masuk, pulang = pulang.</li>
            </ol>
            <p style={{ textAlign: "center", fontSize: 12, margin: "12px 0 0", wordBreak: "break-all" }}>{url}</p>
          </section>
          <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
            <PrintButton label="Cetak QR" />
          </div>
          <p className="hint" style={{ margin: 0 }}>QR dibuat {dibuat}. Berlaku sampai diganti. Lupa PIN diurus HRD; PIN tidak ada di QR.</p>
          {bisaGanti && (
            <details className="card admnew"><summary>Ganti QR (bila bocor)</summary>
              <form action={gantiQr} className="stack"><p className="hint" style={{ margin: 0 }}>QR lama langsung tidak berlaku. Semua cabang harus menerima QR baru yang dicetak.</p>
                <SubmitButton className="btn ghost" steps={["Membuat QR baru…"]}>Buat QR baru dan cabut yang lama</SubmitButton></form>
            </details>
          )}
        </>
      )}
    </main>
  );
}
