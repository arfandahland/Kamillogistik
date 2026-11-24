import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SubmitButton from "@/components/SubmitButton";
import { getMe, staffRpc } from "@/lib/supabase/server";
import { buatManifest } from "../actions";
import BackLink from "@/components/BackLink";

export const metadata: Metadata = { title: "Buat Manifest" };

export default async function BaruManifest({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  const me = (await getMe()).data;
  if (!me || !["MITRA_POS", "DEPO"].includes(me.role)) redirect("/app/manifest");
  const tujuan = (await staffRpc<{ code: string; city: string }[]>("manifest_destinations")).data ?? [];
  return (
    <main className="wrap section stack rbpage">
      <BackLink href="/app/manifest" ke="daftar manifest" />
      <header className="pghead">
        <div><h1>Buat manifest</h1><p className="muted">Dari {me.branchName}. Kode manifest dibuat otomatis, contoh MNF-MKS-JKT-L-261118-1432-01-XX.</p></div>
      </header>
      {e && <div className="err" role="alert">{e}</div>}
      <form className="rbform atas" action={buatManifest}>
        <section className="card rbsek">
          <h2 className="tbjudul"><span className="tbno">1</span> Tujuan dan jalur</h2>
          <div className="rbf">
            <label className="f" htmlFor="tujuan">Tujuan</label>
            <select id="tujuan" name="tujuan" required defaultValue="" data-cari>
              <option value="" disabled>Pilih kota tujuan…</option>
              {tujuan.map((t) => <option key={t.code} value={t.code}>{t.city} ({t.code})</option>)}
            </select>
          </div>
          <fieldset className="choicebox"><legend>Jalur</legend>
            <div className="masukopts three">
              {[["LAUT", "Laut", "Kontainer di kapal"], ["UDARA", "Udara", "Bagasi pesawat kargo"], ["DARAT", "Darat", "Truk"]].map(([v, n, k], i) => (
                <label key={v} className="masukopt"><input type="radio" name="jalur" value={v} defaultChecked={i === 0} /><b>{n}</b><small>{k}</small></label>
              ))}
            </div>
          </fieldset>
        </section>
        <section className="card rbsek">
          <h2 className="tbjudul"><span className="tbno">2</span> Pengangkut dan jadwal <small className="muted">boleh diisi nanti</small></h2>
          <div className="rbf">
            <label className="f" htmlFor="kontainer">Nomor kontainer / AWB / plat truk (boleh kosong dulu)</label>
            <input id="kontainer" name="kontainer" autoComplete="off" placeholder="Contoh: MSKU1234567" />
          </div>
          <div className="rbf">
            <label className="f" htmlFor="pengangkut">Nama kapal / nomor penerbangan (boleh kosong dulu)</label>
            <input id="pengangkut" name="pengangkut" autoComplete="off" placeholder="Contoh: KM Sinar Laut" />
          </div>
          <div className="rbrow satu">
            <div className="rbf"><label className="f" htmlFor="berangkat">Perkiraan berangkat</label><input id="berangkat" name="berangkat" type="datetime-local" /></div>
            <div className="rbf"><label className="f" htmlFor="tiba">Perkiraan tiba</label><input id="tiba" name="tiba" type="datetime-local" /></div>
          </div>
          <div className="rbf">
            <label className="f" htmlFor="catatan">Catatan (boleh kosong)</label>
            <input id="catatan" name="catatan" autoComplete="off" />
          </div>
        </section>
        <div className="tbaksi rbaksi">
          <SubmitButton steps={["Memeriksa data…", "Membuat kode manifest…", "Menyimpan…"]}>Buat manifest</SubmitButton>
        </div>
      </form>
    </main>
  );
}
