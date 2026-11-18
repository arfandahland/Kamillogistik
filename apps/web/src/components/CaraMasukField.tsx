"use client";
import { useState } from "react";
import Icon from "./Icon";

/** Dua cara barang masuk: dijemput kurir, atau diantar sendiri oleh pelanggan ke gudang/gerai. */
export default function CaraMasukField({ kotaAsal }: { kotaAsal?: string }) {
  const [v, setV] = useState<"PICKUP" | "DROPOFF">("PICKUP");
  return (
    <fieldset className="choicebox">
      <legend>Bagaimana barang sampai ke kami?</legend>
      <div className="masukopts" role="radiogroup">
        <label className={`masukopt ${v === "PICKUP" ? "on" : ""}`}>
          <input type="radio" name="masuk" value="PICKUP" checked={v === "PICKUP"} onChange={() => setV("PICKUP")} />
          <span className="ci"><Icon name="truck" size={24} /></span>
          <b>Dijemput kurir</b>
          <small>Kurir kami datang mengambil barang ke alamat penjemputan.</small>
        </label>
        <label className={`masukopt ${v === "DROPOFF" ? "on" : ""}`}>
          <input type="radio" name="masuk" value="DROPOFF" checked={v === "DROPOFF"} onChange={() => setV("DROPOFF")} />
          <span className="ci"><Icon name="home" size={24} /></span>
          <b>Diantar sendiri</b>
          <small>Pelanggan membawa barang ke gudang{kotaAsal ? ` ${kotaAsal}` : ""}. Tanpa biaya jemput.</small>
        </label>
      </div>
      {v === "PICKUP" ? (
        <>
          <label className="f" htmlFor="alamat_jemput">Alamat penjemputan</label>
          <textarea id="alamat_jemput" name="alamat_jemput" required placeholder="Alamat lengkap tempat barang diambil, beserta patokan" />
        </>
      ) : (
        <p className="hint" style={{ margin: "10px 2px 0" }}>Petugas gudang akan menerima barang langsung dari pelanggan, lalu menimbangnya.</p>
      )}
    </fieldset>
  );
}
