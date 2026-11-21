import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CAN_CREATE_ORDER } from "@kamil/core";
import { staffRpc, getMe, type Staff } from "@/lib/supabase/server";
import SubmitButton from "@/components/SubmitButton";
import CaraMasukField from "@/components/CaraMasukField";
import PelangganField from "@/components/PelangganField";
import WilayahField from "@/components/WilayahField";
import DataKendaraan from "@/components/DataKendaraan";
import { randomUUID } from "node:crypto";
import { buatResi } from "../actions";

export const metadata: Metadata = { title: "Buat Resi Baru" };

export default async function Baru({ searchParams }: { searchParams: Promise<{ e?: string; jemput?: string }> }) {
  const { e, jemput } = await searchParams;
  const me = (await getMe()).data;
  if (!me || !CAN_CREATE_ORDER.includes(me.role)) redirect("/app");
  const tujuan = (await staffRpc<{ id: string; name: string; city: string }[]>("staff_dest_hubs")).data ?? [];
  const pj = jemput && /^[0-9a-f-]{36}$/i.test(jemput) ? (await staffRpc<{ id: string; code: string; name: string; phone: string; address: string; itemDesc: string; status: string; shipmentId: string | null }>("staff_pickup_get", { p_id: jemput })).data : null;
  const perusahaan = (await staffRpc<{ id: string; name: string; top: number }[]>("staff_list_customers")).data ?? [];

  return (
    <main className="wrap narrow section">
      <form className="card" action={buatResi}>
        <input type="hidden" name="ref" value={randomUUID()} />
        <h1>Buat resi baru</h1>
        {pj && <input type="hidden" name="jemput" value={pj.id} />}
        {pj && <div className="banner"><b>Dari pesanan jemput {pj.code}</b><p style={{ margin: "4px 0 0" }}>Barang sudah dijemput dan tiba di gudang. Resi dibuat sekarang dan langsung tercatat Di gudang asal. Alamat jemput: {pj.address}</p></div>}
        {e && <div className="err" role="alert">{e}</div>}
        {tujuan.length === 0 ? <p className="muted">Belum ada gudang tujuan yang aktif. Hubungi pemilik.</p> : (
          <>
            <label className="f" htmlFor="tujuan">Gudang tujuan</label>
            <select id="tujuan" name="tujuan" required defaultValue="">
              <option value="" disabled>Pilih gudang tujuan</option>
              {tujuan.map((t) => <option key={t.id} value={t.id}>{t.city} · {t.name}</option>)}
            </select>
            <label className="f" htmlFor="moda">Lewat apa?</label>
            <select id="moda" name="moda" defaultValue="LAUT">
              <option value="LAUT">Laut (kapal)</option>
              <option value="UDARA">Udara (pesawat)</option>
              <option value="DARAT">Darat (truk)</option>
            </select>

            <PelangganField perusahaan={perusahaan} />
            {!pj && <CaraMasukField kotaAsal={me.branchName?.replace(/^Gudang /, "") ?? undefined} />}

            <h3 style={{ marginTop: 20 }}>Pengirim</h3>
            <label className="f" htmlFor="pengirim">Nama pengirim</label>
            <input id="pengirim" name="pengirim" required autoComplete="off" defaultValue={pj?.name ?? ""} />
            <label className="f" htmlFor="hp_pengirim">Nomor WhatsApp pengirim</label>
            <input id="hp_pengirim" name="hp_pengirim" inputMode="tel" placeholder="Contoh: 0812 3456 7890" required autoComplete="tel" defaultValue={pj?.phone ?? ""} />
            <p className="hint">Wajib diisi dan benar. Dipakai untuk kabar jemput dan tagihan lewat WhatsApp.</p>

            <h3 style={{ marginTop: 20 }}>Penerima</h3>
            <label className="f" htmlFor="penerima">Nama penerima</label>
            <input id="penerima" name="penerima" required autoComplete="off" />
            <label className="f" htmlFor="hp_penerima">Nomor WhatsApp penerima</label>
            <input id="hp_penerima" name="hp_penerima" inputMode="tel" placeholder="Contoh: 0812 3456 7890" required />
            <p className="hint">Wajib diisi dan benar. Dipakai kurir dan tim untuk menghubungi penerima.</p>
            <label className="f" htmlFor="alamat">Alamat lengkap penerima (jalan, nomor, patokan)</label>
            <textarea id="alamat" name="alamat" required minLength={5} />
            <WilayahField />

            <h3 style={{ marginTop: 20 }}>Barang</h3>
            <label className="f" htmlFor="isi">Isi barang</label>
            <input id="isi" name="isi" required minLength={2} maxLength={200} placeholder="Contoh: pakaian, spare part motor, sepeda motor" autoComplete="off" />
            <label className="f" htmlFor="jumlah">Jumlah barang (koli/dus)</label>
            <input id="jumlah" name="jumlah" type="number" inputMode="numeric" min={1} max={100} defaultValue={1} required />
            <label className="f" htmlFor="kemasan">Jenis kemasan (boleh kosong)</label>
            <select id="kemasan" name="kemasan" defaultValue="">
              <option value="">Pilih kemasan</option><option>Kardus</option><option>Karung</option><option>Peti kayu</option><option>Palet</option><option>Plastik</option><option>Tanpa kemasan</option><option>Lainnya</option>
            </select>
            <label className="f" htmlFor="estimasi">Perkiraan berat total, kg (boleh kosong)</label>
            <input id="estimasi" name="estimasi" inputMode="decimal" placeholder="Contoh: 25" />
            <label className="f" htmlFor="nilai">Nilai barang, Rp (boleh kosong)</label>
            <input id="nilai" name="nilai" inputMode="numeric" placeholder="Contoh: 1500000" />
            <label className="chk" style={{ display: "flex", gap: 10, alignItems: "center", margin: "10px 0" }}><input type="checkbox" name="rapuh" style={{ width: 22, height: 22 }} /> Barang mudah pecah atau rapuh</label>
            <label className="f" htmlFor="catatan">Catatan kondisi barang (boleh kosong)</label>
            <input id="catatan" name="catatan" placeholder="Contoh: dus sedikit penyok" />
            <p className="hint">Berat dan ukuran sebenarnya dicatat petugas gudang dengan memindai barcode tiap barang. Harga diisi Kasir saat membuat invoice. Data ini ikut terbaca semua petugas yang memproses resi.</p>
            <DataKendaraan />

            <SubmitButton style={{ marginTop: 18 }} steps={["Memeriksa data…", "Membuat nomor resi…", "Menyiapkan barang…", "Menyimpan resi…"]}>Buat resi</SubmitButton>
          </>
        )}
      </form>
    </main>
  );
}
