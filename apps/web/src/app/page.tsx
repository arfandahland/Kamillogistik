import Link from "next/link";
import ResiForm from "@/components/ResiForm";
import { handleRoutes } from "@kamil/core";
import { repo } from "@/lib/repo";
import { rupiah } from "@/lib/brand";

export const dynamic = "force-dynamic";

export default async function Home() {
  const routes = (await handleRoutes(repo)).body as any[];
  return (
    <main>
      <section className="hero">
        <div className="wrap">
          <span className="badge">#BestPriceBestService</span>
          <h1>Kirim barang ke seluruh Sulawesi, murah dan bisa dipantau</h1>
          <p>Dari Jakarta ke Makassar sampai Morowali. Tahu persis barang Anda sudah sampai mana.</p>
        </div>
      </section>

      <div className="wrap stack">
        <div className="card float fade">
          <h2>Barang saya sudah sampai mana?</h2>
          <ResiForm />
        </div>

        <div className="card">
          <h2>Mau kirim barang? Hitung ongkirnya</h2>
          <p className="muted">Isi kota dan berat barang, harga langsung muncul. Tanpa daftar.</p>
          <Link href="/ongkir" className="btn green">🧮 Hitung ongkir</Link>
        </div>

        <section className="card">
          <h2>Harga kirim kami</h2>
          {routes.map((r) => (
            <div className="tarif" key={r.slug}>
              <div>
                <b>{r.origin.city} → {r.dest.city}</b><br />
                <span className="muted" style={{ fontSize: 14 }}>
                  {r.serviceTitle}{r.minChargeable ? ` · minimal ${r.minChargeable} kg` : ""}
                </span>
              </div>
              <b className="p">{rupiah(r.unitPrice)}<small>/{r.basis === "PER_M3" ? "m³" : "kg"}</small></b>
            </div>
          ))}
          <p className="hint">Harga perkiraan, dapat berubah. Biaya pasti dihitung setelah barang ditimbang.</p>
        </section>

        <section className="card">
          <h2>Caranya gampang</h2>
          <ol className="steps">
            <li><span className="n">1</span><div><b>Hubungi kami</b><br /><span className="muted">Lewat WhatsApp atau datang ke gerai mitra.</span></div></li>
            <li><span className="n">2</span><div><b>Barang dijemput dan ditimbang</b><br /><span className="muted">Anda dapat nomor resi dan tagihan resmi.</span></div></li>
            <li><span className="n">3</span><div><b>Pantau terus</b><br /><span className="muted">Kabar dikirim lewat WhatsApp sampai barang diterima.</span></div></li>
          </ol>
        </section>
      </div>
    </main>
  );
}
