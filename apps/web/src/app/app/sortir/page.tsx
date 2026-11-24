import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getMe, staffRpc } from "@/lib/supabase/server";
import Icon from "@/components/Icon";
import BackLink from "@/components/BackLink";

export const metadata: Metadata = { title: "Sortir Tujuan Akhir" };
export const dynamic = "force-dynamic";
type R = { id: string; resiNo: string; receiver: string; mode: string; province: string; regency: string; district: string | null; village: string | null; items: number; legs: number };

/** Papan sortir: barang yang sudah dibongkar di gudang ini, dikelompokkan menurut kabupaten/kota tujuan akhir penerima. */
export default async function Sortir() {
  const me = (await getMe()).data;
  if (!me || !["HUB_MANAGER", "WAREHOUSE"].includes(me.role)) redirect("/app");
  const r = await staffRpc<R[]>("hub_sort_board");
  const rows = r.data ?? [];
  const grup = new Map<string, R[]>();
  for (const x of rows) { const k = `${x.province} · ${x.regency}`; grup.set(k, [...(grup.get(k) ?? []), x]); }
  return (
    <main className="wrap section stack">
      <BackLink />
      <h1>Sortir tujuan akhir</h1>
      <p className="muted" style={{ margin: 0 }}>Barang yang sudah dibongkar di gudang ini, dikelompokkan menurut kabupaten atau kota penerima. Buka resi untuk meneruskannya ke gudang lain bila tujuan akhir masih jauh, atau antar lewat kurir bila dekat.</p>
      {r.error && <div className="err">{r.error}</div>}
      {!r.error && rows.length === 0 && <div className="card kosong-kartu"><span className="kosong-ik"><Icon name="check" size={28} /></span><b>Semua barang sudah disortir</b><p className="muted" style={{ margin: "4px 0 0" }}>Belum ada barang yang menunggu disortir.</p></div>}
      {[...grup.entries()].map(([k, list]) => (
        <section key={k} className="card">
          <h2 style={{ marginTop: 0 }}><Icon name="pin" size={18} /> {k} <span className="muted">· {list.length} resi</span></h2>
          <div className="stack">
            {list.map((x) => (
              <Link key={x.id} href={`/app/resi/${x.id}`} className="pend">
                <span><b>{x.resiNo}</b><small>untuk {x.receiver}{x.district ? ` · ${x.district}` : ""}{x.village ? `, ${x.village}` : ""} · {x.items} barang{x.legs ? ` · sudah ${x.legs}× diteruskan` : ""}</small></span><Icon name="arrow" size={18} />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
