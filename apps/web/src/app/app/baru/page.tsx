import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CAN_CREATE_ORDER, handleRoutes } from "@kamil/core";
import { repo } from "@/lib/repo";
import { staffRpc, getMe, type Staff } from "@/lib/supabase/server";
import SubmitButton from "@/components/SubmitButton";
import CaraMasukField from "@/components/CaraMasukField";
import PelangganField from "@/components/PelangganField";
import { randomUUID } from "node:crypto";
import { buatResi } from "../actions";

export const metadata: Metadata = { title: "Buat Resi Baru" };

export default async function Baru({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  const me = (await getMe()).data;
  if (!me || !CAN_CREATE_ORDER.includes(me.role)) redirect("/app");
  const rr = await handleRoutes(repo);
  const all = (rr.status === 200 ? rr.body : []) as any[];
  const routes = me.role === "SUPER_ADMIN" ? all : all.filter((r) => r.origin.name === me.branchName);
  const perusahaan = (await staffRpc<{ id: string; name: string; top: number }[]>("staff_list_customers")).data ?? [];

  return (
    <main className="wrap narrow section">
      <form className="card" action={buatResi}>
        <input type="hidden" name="ref" value={randomUUID()} />
        <h1>Buat resi baru</h1>
        {e && <div className="err" role="alert">{e}</div>}
        {routes.length === 0 ? <p className="muted">Belum ada rute dari cabang Anda. Hubungi pemilik.</p> : (
          <>
            <label className="f" htmlFor="rute">Kirim ke mana?</label>
            <select id="rute" name="rute" required>
              {routes.map((r) => (
                <option key={r.slug} value={r.slug}>
                  {r.origin.city} → {r.dest.city} · {r.serviceTitle} ({r.basis === "PER_M3" ? "per ukuran m³" : "per kilo"}){r.mode && r.mode !== "LAUT" ? ` · ${r.mode === "UDARA" ? "Udara" : "Darat"}` : ""}
                </option>
              ))}
            </select>

            <PelangganField perusahaan={perusahaan} />
            <CaraMasukField kotaAsal={me.role === "SUPER_ADMIN" ? undefined : routes[0]?.origin.city} />

            <h3 style={{ marginTop: 20 }}>Pengirim</h3>
            <label className="f" htmlFor="pengirim">Nama pengirim</label>
            <input id="pengirim" name="pengirim" required autoComplete="off" />
            <label className="f" htmlFor="hp_pengirim">Nomor WhatsApp pengirim</label>
            <input id="hp_pengirim" name="hp_pengirim" inputMode="tel" placeholder="Contoh: 0812xxxxxxx" />

            <h3 style={{ marginTop: 20 }}>Penerima</h3>
            <label className="f" htmlFor="penerima">Nama penerima</label>
            <input id="penerima" name="penerima" required autoComplete="off" />
            <label className="f" htmlFor="hp_penerima">Nomor WhatsApp penerima</label>
            <input id="hp_penerima" name="hp_penerima" inputMode="tel" />
            <label className="f" htmlFor="alamat">Alamat lengkap penerima</label>
            <textarea id="alamat" name="alamat" />

            <h3 style={{ marginTop: 20 }}>Barang</h3>
            <label className="f" htmlFor="jumlah">Jumlah barang (koli/dus)</label>
            <input id="jumlah" name="jumlah" type="number" inputMode="numeric" min={1} max={100} defaultValue={1} required />
            <label className="f" htmlFor="catatan">Catatan kondisi barang (boleh kosong)</label>
            <input id="catatan" name="catatan" placeholder="Contoh: dus sedikit penyok" />
            <p className="hint">Berat dan ukuran dicatat nanti saat barang ditimbang di gudang.</p>

            <SubmitButton style={{ marginTop: 18 }} steps={["Memeriksa data…", "Membuat nomor resi…", "Menyiapkan barang…", "Menyimpan resi…"]}>Buat resi</SubmitButton>
          </>
        )}
      </form>
    </main>
  );
}
