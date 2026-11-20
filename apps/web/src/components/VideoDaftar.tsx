import daftar from "@/lib/videoDaftar.json";

export type VideoItem = { id: string; peran: string; judul: string; ringkas: string; kb: number; suara?: boolean };
export const LABEL_PERAN: Record<string, string> = { publik: "Untuk pelanggan", kasir: "Kasir", manajer: "Manajer gudang", gudang: "Staf gudang", kurir: "Kurir", sopir: "Sopir kontainer", owner: "Pemilik", hrd: "HRD", konten: "Admin konten" };
export const URUTAN = ["publik", "kasir", "manajer", "gudang", "kurir", "sopir", "owner", "hrd", "konten"];
export const semuaVideo = daftar as VideoItem[];

/** Daftar video tutorial. Pemuatan malas (preload none) supaya halaman tetap ringan: berkas video baru diunduh saat diputar. */
export default function VideoDaftar({ peran, awal }: { peran?: string[]; awal?: string }) {
  const urut = [...(awal ? [awal] : []), ...URUTAN.filter((p) => p !== awal)].filter((p) => !peran || peran.includes(p));
  const kelompok = urut.map((p) => ({ p, v: semuaVideo.filter((x) => x.peran === p) })).filter((k) => k.v.length > 0);
  if (kelompok.length === 0) return <div className="card"><p className="muted" style={{ margin: 0 }}>Video tutorial sedang disiapkan.</p></div>;
  return (
    <div className="stack">
      {kelompok.map(({ p, v }) => (
        <section key={p} aria-labelledby={`v-${p}`} id={p}>
          <h2 id={`v-${p}`} className="sech">{LABEL_PERAN[p] ?? p}</h2>
          <div className="vidgrid">
            {v.map((x) => (
              <article key={x.id} className="card vidcard">
                <video controls preload="none" playsInline poster={`/video/${x.id}.jpg`} width="234" height="506" aria-label={x.judul}>
                  <source src={`/video/${x.id}.mp4`} type="video/mp4" />
                </video>
                <h3>{x.judul}{x.suara && <span className="tag suaratag">Bersuara</span>}</h3>
                <p className="muted">{x.ringkas}</p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
