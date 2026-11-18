import { ImageResponse } from "next/og";
import { handleTrack, type PublicTrack } from "@kamil/core";
import { repo } from "@/lib/repo";

export const alt = "Status pengiriman Kamil Logistik";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

/** Kartu pratinjau saat tautan lacak ditempel di WhatsApp. Hanya memuat data yang memang tampil di halaman lacak publik. */
export default async function Og({ params }: { params: Promise<{ resi: string }> }) {
  const resi = decodeURIComponent((await params).resi);
  const r = await handleTrack(repo, resi);
  const t = r.status === 200 ? (r.body as PublicTrack) : null;
  const pct = t ? Math.max(6, Math.round(((t.history.length + 1) / (t.progress.total + 1)) * 100)) : 0;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, color: "#fff", background: "linear-gradient(135deg,#06352d,#0f6b5a 60%,#1d8a76)", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "#ffb347", color: "#3a2400", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 900 }}>K</div>
          <div style={{ fontSize: 38, fontWeight: 800 }}>Kamil Logistik</div>
        </div>
        {t ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ fontSize: 28, opacity: 0.85 }}>Nomor resi</div>
            <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: 1 }}>{t.resi}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ fontSize: 40, fontWeight: 800 }}>{`${t.route.origin} → ${t.route.dest}`}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ background: t.status === "DELIVERED" ? "#2fd1a8" : "#ffb347", color: "#06352d", fontSize: 34, fontWeight: 900, padding: "10px 26px", borderRadius: 999 }}>{t.statusLabel}</div>
              <div style={{ display: "flex", width: 380, height: 18, borderRadius: 99, background: "rgba(255,255,255,.22)" }}><div style={{ width: `${pct}%`, height: 18, borderRadius: 99, background: "#ffcf6b" }} /></div>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 56, fontWeight: 900 }}>Lacak kiriman Anda</div>
        )}
        <div style={{ fontSize: 28, opacity: 0.85 }}>Best Price, Best Service · pantau tanpa login</div>
      </div>
    ),
    size,
  );
}
