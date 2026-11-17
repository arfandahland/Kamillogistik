import type { Metadata } from "next";
import Link from "next/link";
import { handleTrack, type PublicTrack } from "@kamil/core";
import { repo } from "@/lib/repo";
import { tanggal, tanggalWaktu, waLink } from "@/lib/brand";
import ResiForm from "@/components/ResiForm";

export const dynamic = "force-dynamic";
type P = { params: Promise<{ resi: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  return { title: `Resi ${decodeURIComponent((await params).resi)}`, robots: { index: false } };
}

export default async function Track({ params }: P) {
  const resi = decodeURIComponent((await params).resi);
  const r = await handleTrack(repo, resi);

  if (r.status !== 200) {
    return (
      <main className="wrap section stack">
        <div className="err">{(r.body as { error: string }).error}</div>
        <div className="card"><ResiForm initial={resi} /></div>
      </main>
    );
  }

  const t = r.body as PublicTrack;
  const items = [
    ...t.history.map((h, i) => ({ ...h, kind: i === t.history.length - 1 ? "now" : "done" })),
    ...t.upcoming.map((u) => ({ ...u, detail: "", at: "", location: null as string | null, kind: "todo" })),
  ];
  const doneCount = t.history.length;
  const pct = Math.max(4, Math.round((doneCount / t.progress.total) * 100));
  // tinggi garis hijau = sampai titik terakhir yang sudah tercapai
  const fillPct = items.length > 1 ? Math.max(0, ((doneCount - 1) / (items.length - 1)) * 100) : 0;

  return (
    <main className="wrap section stack">
      <div className="card fade">
        <span className="muted">Nomor resi</span>
        <h1 style={{ letterSpacing: 1 }}>{t.resi}</h1>
        <p><span className={`pill ${t.status === "DELIVERED" ? "done" : ""}`}>{t.statusLabel}</span>{" "}
          <span className="muted">{t.route.origin} → {t.route.dest}</span></p>
        <div className="bar"><i style={{ width: `${pct}%` }} /></div>
        <small className="muted">Tahap {doneCount} dari {t.progress.total}</small>
        {t.eta && <p style={{ marginTop: 12 }}>📅 Perkiraan tiba: <b>{tanggal(t.eta)}</b></p>}
        {t.pod && (
          <p style={{ marginTop: 12 }}>✅ Diterima oleh <b>{t.pod.receiverName}</b> pada {tanggalWaktu(t.pod.signedAt)}.
            {" "}Foto dan tanda tangan penerima tersimpan sebagai bukti.</p>
        )}
      </div>

      <div className="card">
        <h2>Perjalanan barang</h2>
        {items.length === 0 ? (
          <p className="muted">Order sudah kami terima. Petugas kami akan segera menjemput barang Anda.</p>
        ) : (
          <ol className="tl" style={{ ["--total" as string]: items.length }}>
            <div className="fill" style={{ height: `calc((100% - 16px) * ${fillPct / 100})` }} />
            {items.map((it, i) => (
              <li key={it.status} className={it.kind} style={{ ["--i" as string]: i }}>
                <span className="dot" />
                <b>{it.title}</b>
                {it.at && <small>{tanggalWaktu(it.at)}{it.location ? ` · ${it.location}` : ""}</small>}
                {it.kind !== "todo" && <small>{it.detail}</small>}
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="card">
        <p className="muted">Ada yang kurang jelas soal barang ini?</p>
        <a className="btn" href={waLink(`Halo, saya mau tanya soal resi ${t.resi}`)}>💬 Tanya soal resi ini</a>
        <Link href="/lacak" className="btn ghost" style={{ marginTop: 10 }}>Cek resi lain</Link>
      </div>
    </main>
  );
}
