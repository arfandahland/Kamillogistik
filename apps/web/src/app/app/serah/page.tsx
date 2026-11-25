import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import { staffRpc } from "@/lib/supabase/server";
import { tanggalWaktu } from "@/lib/brand";
import StatRow from "@/components/StatRow";
import { requireRole } from "@/lib/auth";
import Daftar from "@/components/Daftar";
import SubmitButton from "@/components/SubmitButton";
import { terimaSemuaSerah } from "../actions";
import BackLink from "@/components/BackLink";

export const metadata: Metadata = { title: "Serah Terima" };

export default async function Serah({ searchParams }: { searchParams: Promise<{ hal?: string; ok?: string; e?: string }> }) {
  const sp = await searchParams;
  await requireRole(["HUB_MANAGER","WAREHOUSE","DRIVER","CONTAINER_DRIVER"]);
  const p = await staffRpc<{ id: string; shipmentId: string; resiNo: string; fromName: string; createdAt: string }[]>("my_pending_handovers");
  const list = p.data ?? [];
  return (
    <main className="wrap stack" style={{ paddingTop: 8 }}>
      <BackLink />
      <div className="pghead"><div><h1>Serah terima</h1><p className="muted">Barang yang diserahkan kepada Anda. Periksa barangnya, lalu terima.</p></div></div>
      <StatRow items={[{ ikon: "swap", n: list.length, label: "Menunggu diterima", sub: list.length ? "Ketuk untuk memeriksa" : "Semua sudah diterima", warm: list.length > 0 }]} />
      {sp.ok && <div className="ok" role="status">{sp.ok}</div>}{sp.e && <div className="err" role="alert">{sp.e}</div>}
      {p.error && <div className="err">{p.error}</div>}
      {list.length > 1 && <form action={terimaSemuaSerah}><SubmitButton className="btn green" steps={["Menerima semua…"]}>Terima semua ({list.length} barang)</SubmitButton></form>}
      <Daftar p={sp.hal} path="/app/serah" params={{  }} kelas="rlist stagger" satuan="barang" items={list.map((h) => (
          <Link key={h.id} href={`/app/resi/${h.shipmentId}`} className="card resi lift">
            <span className="ic warm"><Icon name="swap" size={24} /></span>
            <span className="meta"><span className="toprow"><b className="no">{h.resiNo}</b><span className="pill new">Perlu diterima</span></span><small>Dari {h.fromName}</small><small>{tanggalWaktu(h.createdAt)}</small></span>
          </Link>
        ))} />
      <div>
        {list.length === 0 && !p.error && (
          <div className="card kosong">
            <span className="kic"><Icon name="check" size={28} /></span>
            <b>Tidak ada yang menunggu</b>
            <p className="muted">Semua barang yang diserahkan kepada Anda sudah diterima.</p>
          </div>
        )}
      </div>
    </main>
  );
}
