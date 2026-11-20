import type { Metadata } from "next";
import Link from "next/link";
import { parseResi, type PublicTrack } from "@kamil/core";
import { lacakDenganJaga } from "@/lib/lacakGuard";
import { tanggal, tanggalWaktu, waLink } from "@/lib/brand";
import ResiForm from "@/components/ResiForm";
import NilaiForm from "@/components/NilaiForm";
import { publicRpc } from "@/lib/publicRpc";
import KodeResi from "@/components/KodeResi";
import Icon from "@/components/Icon";

export const dynamic = "force-dynamic";
type P = { params: Promise<{ resi: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const resi = decodeURIComponent((await params).resi);
  const r = await lacakDenganJaga(resi);
  const t = r.status === 200 ? (r.body as PublicTrack) : null;
  const judul = t ? `Resi ${t.resi}: ${t.statusLabel}` : `Resi ${resi}`;
  const desk = t ? `${t.route.origin} → ${t.route.dest}. Pantau perjalanan barang Anda di Kamil Logistik, tanpa login.` : "Pantau perjalanan barang Anda di Kamil Logistik.";
  return { title: judul, description: desk, robots: { index: false }, openGraph: { title: judul, description: desk, type: "website" } };
}

export default async function Track({ params }: P) {
  const resi = decodeURIComponent((await params).resi);
  const r = await lacakDenganJaga(resi);

  if (r.status !== 200) {
    return (
      <main className="wrap section stack">
        <div className="err">{(r.body as { error: string }).error}</div>
        <div className="card"><ResiForm initial={resi} /></div>
      </main>
    );
  }

  const t = r.body as PublicTrack;
  const nilai = t.status === "DELIVERED" ? await publicRpc<{ canRate: boolean; rated: boolean; stars: number | null }>("public_rating_state", { p_resi: t.resi }) : null;
  const items = [
    ...t.history.map((h, i) => ({ ...h, kind: i === t.history.length - 1 ? "now" : "done" })),
    ...t.upcoming.map((u) => ({ ...u, detail: "", at: "", location: null as string | null, kind: "todo" })),
  ];
  const doneCount = t.history.length;
  // Penomoran sama dengan aplikasi petugas: "Order diterima" dihitung sebagai tahap pertama.
  const stage = doneCount + 1, stageTotal = t.progress.total + 1;
  const pct = Math.max(4, Math.round((stage / stageTotal) * 100));
  // tinggi garis hijau = sampai titik terakhir yang sudah tercapai
  const fillPct = items.length > 1 ? Math.max(0, ((doneCount - 1) / (items.length - 1)) * 100) : 0;

  return (
    <main className="wrap section stack">
      <div className="card fade">
        <span className="muted">Nomor resi</span>
        <h1 className="resicode">{t.resi}</h1>
        <p><span className={`pill ${t.status === "DELIVERED" ? "done" : ""}`}>{t.statusLabel}</span>{" "}
          <span className="muted">{t.route.origin} → {t.route.dest}</span></p>
        <p className="chipsrow">
          <span className="tag moda"><Icon name={t.mode === "UDARA" ? "plane" : t.mode === "DARAT" ? "truck" : "ship"} size={14} /> {t.mode === "UDARA" ? "Udara" : t.mode === "DARAT" ? "Darat" : "Laut"}</span>
          <span className="tag"><Icon name={t.pickupType === "PICKUP" ? "truck" : "home"} size={14} /> {t.pickupType === "PICKUP" ? "Dijemput kurir" : "Diantar sendiri"}</span>
        </p>
        <KodeResi kode={t.resi} kota={((pr) => (pr ? { [pr.origin]: t.route.origin, [pr.dest]: t.route.dest } : undefined))(parseResi(t.resi))} />
        <div className="bar"><i style={{ width: `${pct}%` }} /></div>
        <small className="muted">Tahap {stage} dari {stageTotal}</small>
        {t.eta && <p style={{ marginTop: 12 }}><Icon name="clock" size={18} /> Perkiraan tiba: <b>{tanggal(t.eta)}</b></p>}
        {t.pod && (
          <p style={{ marginTop: 12 }}><Icon name="check" size={18} /> Diterima oleh <b>{t.pod.receiverName}</b> pada {tanggalWaktu(t.pod.signedAt)}.
            {" "}Foto dan tanda tangan penerima tersimpan sebagai bukti.</p>
        )}
      </div>

      <div className="card">
        <h2>Perjalanan barang</h2>
        {items.length === 0 ? (
          <p className="muted">{t.pickupType === "DROPOFF" ? "Order sudah kami terima. Silakan antar barang ke gudang kami." : "Order sudah kami terima. Petugas kami akan segera menjemput barang Anda."}</p>
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
        <a className="btn" href={waLink(`Halo, saya mau tanya soal resi ${t.resi}`)}><Icon name="chat" size={22} /> Tanya soal resi ini</a>
        <Link href="/lacak" className="btn ghost" style={{ marginTop: 10 }}>Cek resi lain</Link>
        <Link href={`/klaim?resi=${encodeURIComponent(t.resi)}`} className="btn ghost" style={{ marginTop: 10 }}><Icon name="shield" size={20} /> Laporkan masalah barang ini</Link>
      </div>
      {nilai?.canRate && <NilaiForm resi={t.resi} ulasanUrl={process.env.GOOGLE_REVIEW_URL} />}
      {nilai?.rated && <div className="card nilai done"><b>Terima kasih sudah menilai{nilai.stars ? `: ${"★".repeat(nilai.stars)}` : ""}</b></div>}
    </main>
  );
}
