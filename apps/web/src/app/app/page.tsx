import Link from "next/link";
import { CAN_CREATE_ORDER, STATUS_GROUPS, STATUS_LABEL, type AnyStatus } from "@kamil/core";
import { staffRpc, type Staff } from "@/lib/supabase/server";
import { tanggalWaktu } from "@/lib/brand";

type Row = { id: string; resiNo: string; status: AnyStatus; origin: string; dest: string; senderName: string; receiverName: string; createdAt: string; mine: boolean };
const TABS = [
  { k: "aktif", t: "Sedang berjalan" },
  { k: "semua", t: "Semua" },
  { k: "selesai", t: "Selesai" },
] as const;

export default async function Beranda({ searchParams }: { searchParams: Promise<{ s?: string; q?: string }> }) {
  const sp = await searchParams;
  const tab = TABS.find((t) => t.k === sp.s)?.k ?? "aktif";
  const q = (sp.q ?? "").trim();
  const [me, list, pend] = await Promise.all([
    staffRpc<Staff>("staff_me"),
    staffRpc<Row[]>("staff_list_shipments", { p_q: q || null, p_limit: 100 }),
    staffRpc<{ id: string; shipmentId: string; resiNo: string; fromName: string }[]>("my_pending_handovers"),
  ]);
  const rows = (list.data ?? []).filter((r) =>
    tab === "semua" ? true : (STATUS_GROUPS[tab] as readonly string[]).includes(r.status));
  const canCreate = me.data && CAN_CREATE_ORDER.includes(me.data.role);

  return (
    <main className="wrap section stack">
      {(pend.data ?? []).length > 0 && (
        <div className="banner" role="status">
          <b>Ada {pend.data!.length} barang menunggu Anda terima:</b>
          <div style={{ marginTop: 8 }}>
            {pend.data!.map((p) => (
              <Link key={p.id} href={`/app/resi/${p.shipmentId}`} className="btn" style={{ minHeight: 48, marginTop: 8, fontSize: 16 }}>
                {p.resiNo} dari {p.fromName} →
              </Link>
            ))}
          </div>
        </div>
      )}

      {canCreate && <Link href="/app/baru" className="btn">＋ Buat resi baru</Link>}

      <form className="card" style={{ padding: 12 }}>
        <input name="q" defaultValue={q} placeholder="Cari nomor resi atau nama" enterKeyHint="search" aria-label="Cari" />
        <input type="hidden" name="s" value={tab} />
      </form>

      <nav className="chips" aria-label="Saring">
        {TABS.map((t) => (
          <Link key={t.k} className={`chip ${tab === t.k ? "on" : ""}`} href={`/app?s=${t.k}${q ? `&q=${encodeURIComponent(q)}` : ""}`}>{t.t}</Link>
        ))}
      </nav>

      {list.error && <div className="err">{list.error}</div>}
      <div>
        {rows.map((r) => (
          <Link key={r.id} href={`/app/resi/${r.id}`} className="card resi">
            <div className="top">
              <b className="no">{r.resiNo}</b>
              <span className={`pill ${r.status === "DELIVERED" ? "done" : ""}`}>{STATUS_LABEL[r.status] ?? r.status}</span>
            </div>
            <div className="muted" style={{ marginTop: 4 }}>{r.origin} → {r.dest} · untuk {r.receiverName}</div>
            <div className="hint">{tanggalWaktu(r.createdAt)}{r.mine ? " · Barang ada di tangan Anda" : ""}</div>
          </Link>
        ))}
        {!list.error && rows.length === 0 && (
          <div className="card"><p className="muted" style={{ margin: 0 }}>
            {q ? "Tidak ada resi yang cocok dengan pencarian." : tab === "aktif" ? "Belum ada tugas untuk Anda saat ini." : "Belum ada data."}
          </p></div>
        )}
      </div>
    </main>
  );
}
