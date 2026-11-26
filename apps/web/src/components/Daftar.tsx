"use client";
import { Children, cloneElement, isValidElement, useEffect, useMemo, useRef, useState, type ReactElement, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import Icon from "./Icon";
import Pager from "./Pager";
import { halamanDari, UKURAN_HALAMAN } from "@/lib/halaman";

/**
 * Daftar pintar untuk SEMUA akun. Isi daftar dirender di server; di sini ditambahkan:
 * - kolom cari pintar (kata dipisah spasi, semua kata harus ada; awali tanda minus untuk mengecualikan; angka dicocokkan tanpa titik, koma, dan strip),
 * - saringan pintar otomatis dari label status pada tiap baris (mis. Lunas, Belum lunas), lengkap dengan jumlah,
 * - penghitung hasil, tombol hapus saringan, dan nomor halaman yang ikut menyesuaikan hasil.
 * Keadaan cari dan saringan tersimpan di alamat (cari, st, hal) supaya bisa dibagikan dan tidak hilang saat dimuat ulang.
 */
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim();
const digit = (s: string) => s.replace(/[.\-,\s/()+]/g, "");
const AMBANG_CARI = 6;   // kolom cari baru muncul bila baris cukup banyak
const MAKS_SARING = 8;   // saringan status ditampilkan bila ragamnya 2 sampai 8

export default function Daftar({ items, p, path, params = {}, kelas = "", tag = "div", satuan = "data", ukuran = UKURAN_HALAMAN, param = "hal", tanpaCari = false }: {
  items: ReactNode[]; p?: string; path: string; params?: Record<string, string | undefined | null>; kelas?: string; tag?: "div" | "ul"; satuan?: string; ukuran?: number; param?: string; tanpaCari?: boolean;
}) {
  const T = tag;
  const sp = useSearchParams();
  const awalQ = sp.get("cari") ?? "", awalSt = sp.get("st") ?? "", awalHal = sp.get(param) ?? p;
  const [q, setQ] = useState(awalQ);
  const [st, setSt] = useState(awalSt);
  const [hal, setHal] = useState<string | undefined>(awalHal ?? undefined);
  const wadah = useRef<HTMLElement | null>(null);
  const [teks, setTeks] = useState<string[] | null>(null);
  const [label, setLabel] = useState<string[]>([]);

  const daftar = useMemo(() => Children.toArray(items), [items]);
  const bisaCari = !tanpaCari && daftar.length >= AMBANG_CARI;

  // Ambil teks dan label status tiap baris dari tampilan yang sudah dirender (tanpa perlu data tambahan dari tiap halaman).
  useEffect(() => {
    const el = wadah.current; if (!el) return;
    const kids = Array.from(el.children) as HTMLElement[];
    setTeks(kids.map((k) => norm(k.textContent ?? "")));
    setLabel(kids.map((k) => (k.querySelector(".pill, .stp, .badge") as HTMLElement | null)?.textContent?.trim() ?? ""));
  }, [daftar]);

  const kata = useMemo(() => norm(q).split(" ").filter(Boolean), [q]);
  const cocok = useMemo(() => {
    if (!teks) return daftar.map(() => true);
    return daftar.map((_, i) => {
      const t = teks[i] ?? "", td = digit(t);
      if (st && label[i] !== st) return false;
      return kata.every((w) => (w.startsWith("-") && w.length > 1 ? !t.includes(w.slice(1)) : t.includes(w) || (/^\d[\d.\-,]*$/.test(w) && td.includes(digit(w)))));
    });
  }, [teks, label, daftar, kata, st]);

  const ragam = useMemo(() => {
    const m = new Map<string, number>();
    label.forEach((l, i) => { if (l && (teks ? kata.every((w) => (w.startsWith("-") ? !(teks[i] ?? "").includes(w.slice(1)) : (teks[i] ?? "").includes(w) || digit(teks[i] ?? "").includes(digit(w)))) : true)) m.set(l, (m.get(l) ?? 0) + 1); });
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [label, teks, kata]);
  const tampilSaring = bisaCari && ragam.length >= 2 && ragam.length <= MAKS_SARING;

  const idx = useMemo(() => cocok.map((c, i) => (c ? i : -1)).filter((i) => i >= 0), [cocok]);
  const h = halamanDari(idx, hal, ukuran);
  const tampil = new Set(h.tampil);

  const simpan = (nq: string, nst: string, nhal?: string) => {
    const u = new URL(window.location.href);
    nq ? u.searchParams.set("cari", nq) : u.searchParams.delete("cari");
    nst ? u.searchParams.set("st", nst) : u.searchParams.delete("st");
    nhal && nhal !== "1" ? u.searchParams.set(param, nhal) : u.searchParams.delete(param);
    window.history.replaceState(null, "", u.toString());
  };
  const ubahQ = (v: string) => { setQ(v); setHal(undefined); simpan(v, st); };
  const ubahSt = (v: string) => { const n = st === v ? "" : v; setSt(n); setHal(undefined); simpan(q, n); };
  const reset = () => { setQ(""); setSt(""); setHal(undefined); simpan("", ""); };
  const aktif = !!(q || st);

  const isi = daftar.map((it, i) => {
    const sembunyi = !tampil.has(i);
    if (isValidElement(it) && typeof it.type === "string") return cloneElement(it as ReactElement<{ hidden?: boolean }>, { hidden: sembunyi || undefined });
    return <div key={i} className="dp-w" hidden={sembunyi}>{it}</div>;
  });

  return (
    <>
      {bisaCari && (
        <div className="dp-bar" role="search">
          <div className="dp-cari">
            <Icon name="search" size={18} />
            <input type="search" value={q} onChange={(e) => ubahQ(e.target.value)} placeholder={`Cari ${satuan}: nama, nomor, kota, status…`} aria-label={`Cari ${satuan}`} enterKeyHint="search" autoComplete="off" />
            {q && <button type="button" className="dp-x" onClick={() => ubahQ("")} aria-label="Hapus pencarian">×</button>}
          </div>
          {tampilSaring && (
            <div className="dp-chips" role="group" aria-label="Saringan status">
              {ragam.map(([l, n]) => <button key={l} type="button" className={`dp-chip ${st === l ? "on" : ""}`} aria-pressed={st === l} onClick={() => ubahSt(l)}>{l}<b>{n}</b></button>)}
            </div>
          )}
          <p className="dp-info" role="status" aria-live="polite">
            {aktif ? <>Menampilkan <b>{idx.length}</b> dari {daftar.length} {satuan}</> : <>{daftar.length} {satuan}</>}
            {aktif && <button type="button" className="dp-reset" onClick={reset}>Hapus saringan</button>}
          </p>
        </div>
      )}
      {idx.length === 0 && daftar.length > 0 && teks && (
        <div className="card dp-kosong"><b>Tidak ada {satuan} yang cocok</b><p className="muted" style={{ margin: "4px 0 8px" }}>Coba kata lain atau hapus saringan.</p><button type="button" className="btn ghost sm" onClick={reset}>Hapus saringan</button></div>
      )}
      <T className={kelas} ref={wadah as never}>{isi}</T>
      <Pager h={h} path={path} params={{ ...params, cari: q || undefined, st: st || undefined }} satuan={satuan} param={param} />
    </>
  );
}
