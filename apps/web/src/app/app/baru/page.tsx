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
import BackLink from "@/components/BackLink";

export const metadata: Metadata = { title: "Buat Resi Baru" };

export default async function Baru({ searchParams }: { searchParams: Promise<{ e?: string; jemput?: string }> }) {
  const { e, jemput } = await searchParams;
  const me = (await getMe()).data;
  if (!me || !CAN_CREATE_ORDER.includes(me.role)) redirect("/app");
  const tujuan = (await staffRpc<{ id: string; name: string; city: string }[]>("staff_dest_hubs")).data ?? [];
  const pj = jemput && /^[0-9a-f-]{36}$/i.test(jemput) ? (await staffRpc<{ id: string; code: string; name: string; phone: string; address: string; itemDesc: string; status: string; shipmentId: string | null }>("staff_pickup_get", { p_id: jemput })).data : null;
  const perusahaan = (await staffRpc<{ id: string; name: string; top: number }[]>("staff_list_customers")).data ?? [];

  return (
    <main className="wrap section stack rbpage">
      <BackLink />
      <header className="pghead">
        <div><h1>Buat resi baru</h1><p className="muted">Isi lima bagian di bawah dari atas ke bawah. Tombol Buat resi ada di paling bawah.</p></div>
      </header>
      {pj && <div className="banner"><b>Dari pesanan jemput {pj.code}</b><p style={{ margin: "4px 0 0" }}>Barang sudah dijemput dan tiba di gudang. Resi dibuat sekarang dan langsung tercatat Di gudang asal. Alamat jemput: {pj.address}</p></div>}
      {e && <div className="err" role="alert">{e}</div>}
      {tujuan.length === 0 ? <section className="card"><p className="muted" style={{ margin: 0 }}>Belum ada gudang tujuan yang aktif. Hubungi pemilik.</p></section> : (
        <form className="rbform" action={buatResi}>
          <input type="hidden" name="ref" value={randomUUID()} />
          {pj && <input type="hidden" name="jemput" value={pj.id} />}
          <div className="rbkol">
            <section className="card rbsek">
              <h2 className="tbjudul"><span className="tbno">1</span> Rute dan cara masuk</h2>
              <div className="rbrow r32">
                <div className="rbf">
                  <label className="f" htmlFor="tujuan">Gudang tujuan</label>
                  <select id="tujuan" name="tujuan" required defaultValue="" data-cari>
                    <option value="" disabled>Pilih gudang tujuan</option>
                    {tujuan.map((t) => <option key={t.id} value={t.id}>{t.city} · {t.name}</option>)}
                  </select>
                </div>
                <div className="rbf">
                  <label className="f" htmlFor="moda">Lewat apa?</label>
                  <select id="moda" name="moda" defaultValue="LAUT">
                    <option value="LAUT">Laut (kapal)</option>
                    <option value="UDARA">Udara (pesawat)</option>
                    <option value="DARAT">Darat (truk)</option>
                  </select>
                </div>
              </div>
              {!pj && <CaraMasukField kotaAsal={me.branchName?.replace(/^Gudang /, "") ?? undefined} />}
              {pj && <p className="hint">Barang masuk lewat pesanan jemput, jadi cara masuk tidak perlu dipilih.</p>}
            </section>

            <section className="card rbsek">
              <h2 className="tbjudul"><span className="tbno">2</span> Pengirim</h2>
              <PelangganField perusahaan={perusahaan} />
              <div className="rbrow r23">
                <div className="rbf">
                  <label className="f" htmlFor="pengirim">Nama pengirim</label>
                  <input id="pengirim" name="pengirim" required autoComplete="off" defaultValue={pj?.name ?? ""} />
                </div>
                <div className="rbf">
                  <label className="f" htmlFor="hp_pengirim">Nomor WhatsApp pengirim</label>
                  <input id="hp_pengirim" name="hp_pengirim" inputMode="tel" placeholder="Contoh: 0812 3456 7890" required autoComplete="tel" defaultValue={pj?.phone ?? ""} />
                </div>
              </div>
              <p className="hint">Wajib diisi dan benar. Dipakai untuk kabar jemput dan tagihan lewat WhatsApp.</p>
            </section>
          </div>

          <div className="rbkol">
            <section className="card rbsek">
              <h2 className="tbjudul"><span className="tbno">3</span> Penerima dan alamat</h2>
              <div className="rbrow r23">
                <div className="rbf">
                  <label className="f" htmlFor="penerima">Nama penerima</label>
                  <input id="penerima" name="penerima" required autoComplete="off" />
                </div>
                <div className="rbf">
                  <label className="f" htmlFor="hp_penerima">Nomor WhatsApp penerima</label>
                  <input id="hp_penerima" name="hp_penerima" inputMode="tel" placeholder="Contoh: 0812 3456 7890" required />
                </div>
              </div>
              <p className="hint">Wajib diisi dan benar. Dipakai kurir dan tim untuk menghubungi penerima.</p>
              <div className="rbf">
                <label className="f" htmlFor="alamat">Alamat lengkap penerima (jalan, nomor, patokan)</label>
                <textarea id="alamat" name="alamat" required minLength={5} />
              </div>
              <WilayahField />
            </section>

            <section className="card rbsek">
              <h2 className="tbjudul"><span className="tbno">4</span> Barang</h2>
              <div className="rbf">
                <label className="f" htmlFor="isi">Isi barang</label>
                <input id="isi" name="isi" required minLength={2} maxLength={200} placeholder="Contoh: pakaian, spare part motor, sepeda motor" autoComplete="off" />
              </div>
              <div className="rbrow">
                <div className="rbf">
                  <label className="f" htmlFor="jumlah">Jumlah barang (koli/dus)</label>
                  <input id="jumlah" name="jumlah" type="number" inputMode="numeric" min={1} max={100} defaultValue={1} required />
                </div>
                <div className="rbf">
                  <label className="f" htmlFor="kemasan">Jenis kemasan (boleh kosong)</label>
                  <select id="kemasan" name="kemasan" defaultValue="">
                    <option value="">Pilih kemasan</option><option>Kardus</option><option>Karung</option><option>Peti kayu</option><option>Palet</option><option>Plastik</option><option>Tanpa kemasan</option><option>Lainnya</option>
                  </select>
                </div>
              </div>
              <div className="rbf">
                <label className="f" htmlFor="nilai">Nilai barang, Rp (boleh kosong)</label>
                <input id="nilai" name="nilai" inputMode="numeric" placeholder="Contoh: 1500000" />
              </div>
              <fieldset className="kchips rbf" aria-label="Asuransi barang">
                <legend className="f">Asuransi barang</legend>
                <label className="kchip"><input type="radio" name="asuransi" value="" defaultChecked /> Tanpa asuransi</label>
                <label className="kchip"><input type="radio" name="asuransi" value="ya" /> Pakai asuransi</label>
              </fieldset>
              <label className="rbcek"><input type="checkbox" name="rapuh" /> Barang mudah pecah atau rapuh</label>
              <div className="rbf">
                <label className="f" htmlFor="catatan">Catatan kondisi barang (boleh kosong)</label>
                <input id="catatan" name="catatan" placeholder="Contoh: dus sedikit penyok" />
              </div>
              <p className="hint">Berat dan ukuran bukan tugas Kasir: petugas gudang mencatatnya dengan memindai barcode tiap barang. Harga diisi Kasir saat membuat invoice. Data ini ikut terbaca semua petugas yang memproses resi.</p>
            </section>

            <section className="card rbsek">
              <h2 className="tbjudul"><span className="tbno">5</span> Jadwal dan pembayaran</h2>
              <div className="rbrow">
                <div className="rbf">
                  <label className="f" htmlFor="jadwal">Tanggal jemput (bila dijemput kurir)</label>
                  <input id="jadwal" name="jadwal" type="date" />
                </div>
                <fieldset className="kchips rbf" aria-label="Waktu jemput">
                  <legend className="f">Waktu jemput</legend>
                  <label className="kchip"><input type="radio" name="waktu" value="" defaultChecked /> Bebas</label>
                  <label className="kchip"><input type="radio" name="waktu" value="PAGI" /> Pagi</label>
                  <label className="kchip"><input type="radio" name="waktu" value="SIANG" /> Siang</label>
                  <label className="kchip"><input type="radio" name="waktu" value="SORE" /> Sore</label>
                </fieldset>
              </div>
              <fieldset className="kchips rbf" aria-label="Rencana pembayaran">
                <legend className="f">Rencana pembayaran</legend>
                <label className="kchip"><input type="radio" name="bayar" value="" defaultChecked /> Belum ditentukan</label>
                <label className="kchip"><input type="radio" name="bayar" value="TUNAI" /> Tunai</label>
                <label className="kchip"><input type="radio" name="bayar" value="TRANSFER" /> Transfer</label>
                <label className="kchip"><input type="radio" name="bayar" value="TAGIH" /> Ditagih ke pelanggan</label>
              </fieldset>
              <div className="rbf">
                <label className="f" htmlFor="refpel">Nomor referensi pelanggan, misalnya PO (boleh kosong)</label>
                <input id="refpel" name="refpel" maxLength={60} autoComplete="off" />
              </div>
              <p className="hint">Semua isian di atas ikut terbaca petugas gudang, kurir, dan Finance pada resi ini.</p>
            </section>

            <DataKendaraan nomor={6} />
          </div>

          <div className="tbaksi rbaksi">
            <SubmitButton steps={["Memeriksa data…", "Membuat nomor resi…", "Menyiapkan barang…", "Menyimpan resi…"]}>Buat resi</SubmitButton>
          </div>
        </form>
      )}
    </main>
  );
}
