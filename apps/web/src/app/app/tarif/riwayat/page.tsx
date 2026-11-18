import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import { requireOwner } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import { rupiah, tanggalWaktu } from "@/lib/brand";

export const metadata: Metadata = { title: "Riwayat Harga" };
type H = { id: string; kind: "BARU" | "UBAH"; route: string; oldPrice: number | null; newPrice: number | null; oldMinKg: number | null; newMinKg: number | null; oldEta: number | null; newEta: number | null; oldPublic: boolean | null; newPublic: boolean | null; by: string | null; at: string };

function Ubah({ label, a, b, fmt = String }: { label: string; a: unknown; b: unknown; fmt?: (v: never) => string }) {
  if (a === b || (a == null && b == null)) return null;
  const f = (v: unknown) => (v == null ? "–" : fmt(v as never));
  return <li><span>{label}</span><b><s>{f(a)}</s> <Icon name="arrow" size={14} /> {f(b)}</b></li>;
}

export default async function Riwayat() {
  await requireOwner();
  const r = await staffRpc<H[]>("owner_price_history", { p_limit: 150 });
  const list = r.data ?? [];
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <Link href="/app/tarif" className="muted">← Tarif dan rute</Link>
      <h1>Riwayat perubahan harga</h1>
      <p className="muted" style={{ marginTop: -6 }}>Setiap perubahan harga, minimal berat, estimasi, dan status tayang tercatat otomatis dan tidak bisa dihapus.</p>
      {r.error && <div className="err">{r.error}</div>}
      <div className="stagger fstack">
        {list.map((h) => (
          <article key={h.id} className="card hist">
            <div className="insph"><b>{h.route}</b><span className={`pill ${h.kind === "BARU" ? "done" : ""}`}>{h.kind === "BARU" ? "Rute baru" : "Diubah"}</span></div>
            <ul className="chg">
              {h.kind === "BARU" ? <li><span>Harga awal</span><b>{h.newPrice == null ? "–" : rupiah(h.newPrice)}</b></li> : <>
                <Ubah label="Harga" a={h.oldPrice} b={h.newPrice} fmt={(v: number) => rupiah(v)} />
                <Ubah label="Minimal berat" a={h.oldMinKg == null ? null : Number(h.oldMinKg)} b={h.newMinKg == null ? null : Number(h.newMinKg)} fmt={(v: number) => `${v} kg`} />
                <Ubah label="Estimasi" a={h.oldEta} b={h.newEta} fmt={(v: number) => `${v} hari`} />
                <Ubah label="Tayang di website" a={h.oldPublic} b={h.newPublic} fmt={(v: boolean) => (v ? "Ya" : "Tidak")} />
              </>}
            </ul>
            <small className="muted">{h.by ?? "Sistem"} · {tanggalWaktu(h.at)}</small>
          </article>
        ))}
        {list.length === 0 && !r.error && <div className="card" style={{ textAlign: "center" }}><b>Belum ada perubahan</b><p className="muted" style={{ margin: "4px 0 0" }}>Perubahan harga berikutnya akan muncul di sini.</p></div>}
      </div>
    </main>
  );
}
