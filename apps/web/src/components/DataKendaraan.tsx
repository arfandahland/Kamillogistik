type V = Partial<Record<"jenis" | "merek" | "nopol" | "rangka" | "mesin" | "stnk" | "bpkb" | "catatan", string>> | null;
/** Data kendaraan, semuanya opsional (kirim motor, mobil, alat berat). STNK dan BPKB hanya dicatat, tidak wajib. */
export default function DataKendaraan({ awal, awalBuka, nomor }: { awal?: V; awalBuka?: boolean; nomor?: number }) {
  const v = awal ?? {};
  return (
    <details className="card kdbox" style={nomor ? undefined : { margin: "10px 0" }} open={awalBuka || !!awal}>
      <summary>{nomor != null && <span className="tbno">{nomor}</span>}<span><b>Barang berupa kendaraan?</b> <span className="muted">(opsional, boleh dilewati)</span></span></summary>
      <div className="stack rbgrid" style={{ marginTop: 10 }}>
        <div className="rbf"><label className="f" htmlFor="kd-jenis">Jenis kendaraan</label><input id="kd-jenis" name="kd_jenis" defaultValue={v.jenis ?? ""} maxLength={80} placeholder="Motor, mobil, truk, alat berat…" autoComplete="off" /></div>
        <div className="rbf"><label className="f" htmlFor="kd-merek">Merek dan tipe</label><input id="kd-merek" name="kd_merek" defaultValue={v.merek ?? ""} maxLength={80} autoComplete="off" /></div>
        <div className="rbf"><label className="f" htmlFor="kd-nopol">Nomor polisi</label><input id="kd-nopol" name="kd_nopol" defaultValue={v.nopol ?? ""} maxLength={80} autoCapitalize="characters" autoComplete="off" /></div>
        <div className="rbf"><label className="f" htmlFor="kd-rangka">Nomor rangka</label><input id="kd-rangka" name="kd_rangka" defaultValue={v.rangka ?? ""} maxLength={80} autoCapitalize="characters" autoComplete="off" /></div>
        <div className="rbf"><label className="f" htmlFor="kd-mesin">Nomor mesin</label><input id="kd-mesin" name="kd_mesin" defaultValue={v.mesin ?? ""} maxLength={80} autoCapitalize="characters" autoComplete="off" /></div>
        <div className="rbf"><label className="f" htmlFor="kd-stnk">STNK (ada atau nomornya, boleh kosong)</label><input id="kd-stnk" name="kd_stnk" defaultValue={v.stnk ?? ""} maxLength={80} autoComplete="off" /></div>
        <div className="rbf"><label className="f" htmlFor="kd-bpkb">BPKB (ada atau nomornya, boleh kosong)</label><input id="kd-bpkb" name="kd_bpkb" defaultValue={v.bpkb ?? ""} maxLength={80} autoComplete="off" /></div>
        <div className="rbf"><label className="f" htmlFor="kd-catatan">Catatan kendaraan</label><input id="kd-catatan" name="kd_catatan" defaultValue={v.catatan ?? ""} maxLength={80} autoComplete="off" /></div>
      </div>
    </details>
  );
}
