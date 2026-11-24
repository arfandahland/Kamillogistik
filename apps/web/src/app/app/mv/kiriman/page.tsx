import Pager from "@/components/Pager";
import { halamanDari } from "@/lib/halaman";
import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import MvPesan from "@/components/MvPesan";
import SubmitButton from "@/components/SubmitButton";
import { requireRole } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import { tanggalWaktu } from "@/lib/brand";
import { MODA_NAMA, MV_TULIS } from "@/lib/mv";
import { tandaiBacaVendor } from "../actions";

export const metadata: Metadata = { title: "Kiriman Vendor" };
const KIRIMAN_JENIS: Record<string, string> = { FOTO_SERAH: "Foto serah terima", FOTO_PERJALANAN: "Foto di perjalanan", FOTO_TIBA: "Foto barang tiba", LAPORAN: "Laporan" };
type Item = { id: string; kind: string; note: string | null; name: string; phone: string | null; hasPhoto: boolean; read: boolean; at: string; shipmentId: string; resiNo: string; vendor: string | null; mode: string; cabang: string | null };

/** Kotak masuk divisi MV: foto dan laporan yang dikirim vendor lewat link khusus. */
export default async function Kiriman({ searchParams }: { searchParams: Promise<{ hal?: string; b?: string; ok?: string; e?: string }> }) {
  await requireRole(MV_TULIS); const sp = await searchParams;
  const belum = sp.b === "1";
  const r = await staffRpc<{ belumDibaca: number; daftar: Item[] }>("mv_vendor_inbox", { p_only_unread: belum, p_limit: 80 });
  const d = r.data?.daftar ?? [];
  const pg = halamanDari(d, sp.hal);
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <div className="pghead"><div><h1>Kiriman vendor</h1><p className="muted">Foto dan laporan dari vendor lewat link khusus, tanpa akun. Link dibuat di halaman Alokasi.</p></div></div>
      <MvPesan ok={sp.ok} e={sp.e} galat={[r.error]} />
      <div className="fchips" role="tablist" aria-label="Saring">
        <Link role="tab" aria-selected={!belum} className={`chip ${!belum ? "on" : ""}`} href="/app/mv/kiriman">Semua</Link>
        <Link role="tab" aria-selected={belum} className={`chip ${belum ? "on" : ""}`} href="/app/mv/kiriman?b=1">Belum dibaca ({r.data?.belumDibaca ?? 0})</Link>
      </div>
      {d.length === 0 ? <div className="card" style={{ textAlign: "center" }}><b>{belum ? "Semua sudah dibaca" : "Belum ada kiriman"}</b><p className="muted" style={{ margin: "4px 0 0" }}>Kiriman vendor akan muncul di sini.</p></div> : (
        <div className="stagger">{pg.tampil.map((k) => (
          <article key={k.id} className={`card mvkir ${k.read ? "" : "baru"}`}>
            <header><b>{KIRIMAN_JENIS[k.kind] ?? k.kind}</b>{!k.read && <span className="pill warn">Baru</span>}</header>
            <p className="hint" style={{ margin: 0 }}>{tanggalWaktu(k.at)} · {k.name}{k.phone ? ` · ${k.phone}` : ""}</p>
            <p style={{ margin: 0 }}><Link href={`/app/mv/alokasi?r=${k.shipmentId}#r-${k.shipmentId}`}><b>{k.resiNo}</b></Link> · {MODA_NAMA[k.mode as keyof typeof MODA_NAMA] ?? k.mode} · {k.vendor ?? "Armada internal"}{k.cabang ? ` · ${k.cabang}` : ""}</p>
            {k.hasPhoto && (
              <a href={`/app/mv/vendor-foto/${k.id}`} target="_blank" rel="noopener" className="mvdokitem">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/app/mv/vendor-foto/${k.id}`} alt={KIRIMAN_JENIS[k.kind] ?? k.kind} loading="lazy" />
              </a>)}
            {k.note && <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{k.note}</p>}
            {!k.read && !k.hasPhoto && <form action={tandaiBacaVendor}><input type="hidden" name="back" value={belum ? "/app/mv/kiriman?b=1" : "/app/mv/kiriman"} /><input type="hidden" name="id" value={k.id} /><SubmitButton className="btn ghost" steps={["Menandai…"]}><Icon name="check" size={18} /> Tandai sudah dibaca</SubmitButton></form>}
          </article>))}
        </div>)}
      <Pager h={pg} path="/app/mv/kiriman" params={{ b: sp.b }} satuan="kiriman" />
    </main>
  );
}
