"use client";
import { useState } from "react";
import Potong from "./Potong";
import FotoDokumen from "./FotoDokumen";
import SubmitButton from "./SubmitButton";
import Icon from "./Icon";
import { serahSJ, terimaSJ, ubahStatusSJ } from "@/app/app/mv/actions";
import { SJ_STATUS, type SJ } from "@/lib/mv";

const tgl = (v: string | null) => (v ? new Date(v).toLocaleDateString("id-ID", { timeZone: "Asia/Makassar", day: "numeric", month: "short", year: "numeric" }) : "");

function sisa(s: SJ): string {
  if (s.status === "DISERAHKAN_FINANCE") return s.handedAt ? `Diserahkan ${tgl(s.handedAt)}` : "";
  if (s.status === "DITERIMA_MV") return s.receivedAt ? `Diterima ${tgl(s.receivedAt)}` : "";
  if (s.sisaHari == null) return "Batas waktu dihitung setelah barang tiba";
  if (s.terlambat) return s.sisaHari < 0 ? `Terlambat ${Math.abs(s.sisaHari)} hari` : "Baru lewat batas waktu";
  return `Sisa ${s.sisaHari} hari (batas ${tgl(s.dueAt)})`;
}

/** Daftar SJ dengan kotak centang untuk aksi massal, lalu dua panel: terima SJ balik dan serahkan ke Finance. */
export default function SJDaftar({ items, bisaUbah, back }: { items: SJ[]; bisaUbah: boolean; back: string }) {
  const [pilih, setPilih] = useState<Set<string>>(new Set());
  const bisaTerima = (s: SJ) => s.status !== "DITERIMA_MV" && s.status !== "DISERAHKAN_FINANCE";
  const bisaSerah = (s: SJ) => s.status === "DITERIMA_MV";
  const dipilih = items.filter((s) => pilih.has(s.id));
  const utkTerima = dipilih.filter(bisaTerima), utkSerah = dipilih.filter(bisaSerah);
  const toggle = (id: string) => setPilih((p) => { const n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const semua = (f: (s: SJ) => boolean) => setPilih(new Set(items.filter(f).map((s) => s.id)));

  const baris = items.map((s) => (
    <div key={s.id} className={`card mvsj ${s.terlambat ? "telat" : s.hampir ? "hampir" : ""}`}>
      <div className="mvsj-a">
        {bisaUbah && s.status !== "DISERAHKAN_FINANCE"
          ? <label className="mvcek"><input type="checkbox" checked={pilih.has(s.id)} onChange={() => toggle(s.id)} aria-label={`Pilih SJ resi ${s.resiNo}`} /><b className="mvno">{s.resiNo}</b></label>
          : <b className="mvno">{s.resiNo}</b>}
        <span className="mvchips">
          <span className="pill">{SJ_STATUS[s.status] ?? s.status}</span>
          {s.terlambat && <span className="pill late">Terlambat</span>}
          {!s.terlambat && s.hampir && <span className="pill warn">Hampir terlambat</span>}
        </span>
      </div>
      <small className="muted">{s.origin} → {s.dest}</small>
      <small>{sisa(s)}{s.note ? ` · Catatan: ${s.note}` : ""}</small>
      {(s.terimaNo || s.serahNo) && <small className="muted">{s.terimaNo ? `Tanda terima ${s.terimaNo}` : ""}{s.terimaNo && s.serahNo ? " · " : ""}{s.serahNo ? `Serah terima ${s.serahNo}` : ""}</small>}
      {bisaUbah && (s.status === "BELUM_KEMBALI" || s.status === "BERMASALAH") && (
        <div className="mvact">
          <form action={ubahStatusSJ}><input type="hidden" name="back" value={back} /><input type="hidden" name="sj" value={s.id} /><input type="hidden" name="status" value="DALAM_PERJALANAN_BALIK" />
            <SubmitButton className="btn ghost sm" steps={["Menyimpan…"]}>Dalam perjalanan balik</SubmitButton></form>
        </div>
      )}
      {bisaUbah && s.status !== "DITERIMA_MV" && s.status !== "DISERAHKAN_FINANCE" && s.status !== "HILANG" && (
        <details className="mvtolak"><summary className="btn ghost sm">Bermasalah atau hilang</summary>
          <form action={ubahStatusSJ} className="mvform">
            <input type="hidden" name="back" value={back} /><input type="hidden" name="sj" value={s.id} />
            <div className="rbf"><label className="f">Keterangan (minimal 5 huruf)</label><textarea name="catatan" required minLength={5} maxLength={300} /></div>
            <div className="mvact">
              <button className="btn ghost sm" name="status" value="BERMASALAH">Tandai bermasalah</button>
              <button className="btn ghost sm" name="status" value="HILANG">Tandai hilang</button>
            </div>
          </form>
        </details>
      )}
    </div>
  ));

  return (
    <>
      {items.length === 0 ? (
        <div className="card kosong"><span className="kic"><Icon name="file" size={28} /></span><b>Tidak ada SJ</b><p className="muted">SJ muncul otomatis saat barang darat berangkat.</p></div>
      ) : <Potong batas={10} satuan="SJ" kelas="mvlist" items={baris} />}
      {bisaUbah && items.length > 0 && (
        <div className="mvdua">
          <form action={terimaSJ} className="card mvform">
            <h2 className="cardh">Terima SJ balik</h2>
            <input type="hidden" name="back" value={back} />
            {utkTerima.map((s) => <input key={s.id} type="hidden" name="sj" value={s.id} />)}
            <p className="muted">{utkTerima.length > 0 ? `${utkTerima.length} SJ dipilih: ${utkTerima.slice(0, 3).map((s) => s.resiNo).join(", ")}${utkTerima.length > 3 ? ", dan lainnya" : ""}.` : "Centang SJ yang diterima di daftar atas."}</p>
            <button type="button" className="btn ghost sm" onClick={() => semua(bisaTerima)}>Pilih semua yang belum diterima</button>
            <div className="rbf"><label className="f">Nama yang menyerahkan SJ</label><input name="nama" required minLength={2} maxLength={80} /></div>
            <div className="rbf"><label className="f">Catatan (boleh kosong)</label><input name="catatan" maxLength={300} /></div>
            <FotoDokumen label="Foto tanda terima" />
            {utkTerima.length > 0 && <SubmitButton className="btn green" steps={["Memeriksa SJ…", "Menerbitkan tanda terima…"]}>Terima {utkTerima.length} SJ dan buat tanda terima</SubmitButton>}
          </form>
          <form action={serahSJ} className="card mvform">
            <h2 className="cardh">Serahkan ke Finance</h2>
            <input type="hidden" name="back" value={back} />
            {utkSerah.map((s) => <input key={s.id} type="hidden" name="sj" value={s.id} />)}
            <p className="muted">{utkSerah.length > 0 ? `${utkSerah.length} SJ dipilih: ${utkSerah.slice(0, 3).map((s) => s.resiNo).join(", ")}${utkSerah.length > 3 ? ", dan lainnya" : ""}.` : "Centang SJ berstatus Diterima MV yang diserahkan ke Finance."}</p>
            <button type="button" className="btn ghost sm" onClick={() => semua(bisaSerah)}>Pilih semua yang sudah diterima MV</button>
            <div className="rbf"><label className="f">Nama penerima di Finance</label><input name="nama" required minLength={2} maxLength={80} /></div>
            <div className="rbf"><label className="f">Catatan (boleh kosong)</label><input name="catatan" maxLength={300} /></div>
            <FotoDokumen label="Foto tanda terima" />
            {utkSerah.length > 0 && <SubmitButton className="btn green" steps={["Memeriksa SJ…", "Menerbitkan tanda terima…"]}>Serahkan {utkSerah.length} SJ ke Finance</SubmitButton>}
          </form>
        </div>
      )}
    </>
  );
}
