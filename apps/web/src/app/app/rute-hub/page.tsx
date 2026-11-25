import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import BackLink from "@/components/BackLink";
import SubmitButton from "@/components/SubmitButton";
import { aturHubTransit } from "../admin-actions";

export const metadata: Metadata = { title: "Hub transit" };
type P = { id: string; type: string; code: string; name: string; city: string; status: string; transitHubId?: string | null };
const JENIS: Record<string, string> = { HUB: "Gudang / cabang", MITRA: "Gerai mitra", REKANAN: "Rekanan ekspedisi", PELABUHAN: "Pelabuhan" };

export default async function RuteHub({ searchParams }: { searchParams: Promise<{ ok?: string; e?: string }> }) {
  await requireRole(["SUPER_ADMIN", "OWNER"]);
  const sp = await searchParams;
  const r = await staffRpc<P[]>("owner_list_partners");
  const list = (r.data ?? []).filter((p) => p.status === "ACTIVE");
  const hubs = list.filter((p) => p.type === "HUB");
  const cabang = list.filter((p) => p.type === "MITRA" || p.type === "HUB");
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <BackLink />
      <div className="pghead"><div><h1>Hub transit</h1>
        <p className="muted">Tentukan cabang mana yang wajib singgah di hub dulu (misalnya semua kiriman dari Ternate lewat Hub Makassar) dan mana yang berangkat langsung ke Jakarta, Surabaya, atau Balikpapan. Berlaku untuk resi baru. Resi yang sudah dibuat tidak berubah.</p></div></div>
      {sp.ok && <div className="ok" role="status">{sp.ok}</div>}{sp.e && <div className="err" role="alert">{sp.e}</div>}{r.error && <div className="err">{r.error}</div>}
      <div className="stack">
        {cabang.map((p) => (
          <form key={p.id} action={aturHubTransit} className="card rbsek">
            <input type="hidden" name="id" value={p.id} /><input type="hidden" name="kembali" value="/app/rute-hub" />
            <h2 className="cardh">{p.name} <small className="muted">· {JENIS[p.type]} · {p.city} · kode {p.code}</small></h2>
            <div className="rbf"><label className="f" htmlFor={`hub-${p.id}`}>Singgah di hub</label>
              <select id={`hub-${p.id}`} name="hub" defaultValue={p.transitHubId ?? ""}><option value="">Langsung, tanpa singgah</option>{hubs.filter((h) => h.id !== p.id).map((h) => <option key={h.id} value={h.id}>{h.name} ({h.city})</option>)}</select></div>
            <SubmitButton className="btn ghost" steps={["Menyimpan…"]}>Simpan</SubmitButton>
          </form>
        ))}
        {cabang.length === 0 && <div className="card"><p className="muted" style={{ margin: 0 }}>Belum ada cabang aktif.</p></div>}
      </div>
    </main>
  );
}
