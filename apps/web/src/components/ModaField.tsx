"use client";
import { useEffect, useState } from "react";
import { modaTersedia } from "@/app/app/actions";

const SEMUA = [["LAUT", "Laut (kapal)"], ["UDARA", "Udara (pesawat)"], ["DARAT", "Darat (truk)"]] as const;

/** Pilihan moda. Setelah gudang tujuan dipilih, moda yang tidak punya tarif resmi pada rute itu dinonaktifkan. Tanpa tarif resmi, semua moda tetap boleh (harga manual). */
export default function ModaField() {
  const [ada, setAda] = useState<string[] | null>(null);
  const [nilai, setNilai] = useState("LAUT");
  useEffect(() => {
    const tujuan = document.getElementById("tujuan") as HTMLSelectElement | null;
    if (!tujuan) return;
    let batal = false;
    const baca = async () => {
      if (!tujuan.value) { setAda(null); return; }
      const m: string[] = await modaTersedia(tujuan.value).catch(() => [] as string[]);
      if (batal) return;
      setAda(m.length ? m : null);
      if (m.length) setNilai((v) => (m.includes(v) ? v : m[0]!));
    };
    tujuan.addEventListener("change", baca);
    baca();
    return () => { batal = true; tujuan.removeEventListener("change", baca); };
  }, []);
  return (
    <>
      <select id="moda" name="moda" value={nilai} onChange={(e) => setNilai(e.target.value)} aria-describedby="moda-info">
        {SEMUA.map(([k, t]) => <option key={k} value={k} disabled={ada !== null && !ada.includes(k)}>{t}{ada !== null && !ada.includes(k) ? " (tidak tersedia di rute ini)" : ""}</option>)}
      </select>
      <small id="moda-info" className="hint">{ada === null ? "Belum ada tarif resmi untuk rute ini atau tujuan belum dipilih: semua moda boleh, isi harga manual bila perlu." : `Tersedia untuk rute ini: ${SEMUA.filter(([k]) => ada.includes(k)).map(([, t]) => t.split(" ")[0]).join(", ")}.`}</small>
    </>
  );
}
