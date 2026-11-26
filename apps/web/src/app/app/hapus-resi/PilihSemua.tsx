"use client";
/** Centang atau lepas semua resi yang sedang tampil (yang tersaring tidak ikut). */
export default function PilihSemua() {
  const ubah = (on: boolean) => document.querySelectorAll<HTMLInputElement>("form.hapus-form input[name=id]:not(:disabled)").forEach((c) => { if (!c.closest("[hidden]")) c.checked = on; });
  return (
    <div className="dp-bar" style={{ margin: "0 0 8px" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" className="btn ghost sm" onClick={() => ubah(true)}>Centang semua yang tampil</button>
        <button type="button" className="btn ghost sm" onClick={() => ubah(false)}>Lepas semua</button>
      </div>
    </div>
  );
}
