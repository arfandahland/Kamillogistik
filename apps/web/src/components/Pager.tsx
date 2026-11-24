import Link from "next/link";
import Icon from "./Icon";
import { hrefHalaman, nomorHalaman, type Halaman } from "@/lib/halaman";

/**
 * Pembagi halaman seragam untuk semua daftar. Tersembunyi bila datanya muat di satu halaman.
 * `params` berisi saringan yang sedang aktif, supaya berpindah halaman tidak menghapus saringan.
 */
export default function Pager({ h, path, params = {}, satuan = "data", param = "hal" }: { h: Pick<Halaman<unknown>, "p" | "halaman" | "total" | "dari" | "sampai">; path: string; params?: Record<string, string | undefined | null>; satuan?: string; param?: string }) {
  if (h.halaman <= 1) return null;
  const ke = (n: number) => hrefHalaman(path, params, n, param);
  return (
    <nav className="pager" aria-label="Halaman">
      <p className="pager-info" role="status">Menampilkan <b>{h.dari}–{h.sampai}</b> dari {h.total} {satuan}</p>
      <div className="pager-baris">
        {h.p > 1 ? <Link href={ke(h.p - 1)} className="pager-nav" rel="prev"><Icon name="back" size={16} /><span>Sebelumnya</span></Link> : <span className="pager-nav off" aria-disabled="true"><Icon name="back" size={16} /><span>Sebelumnya</span></span>}
        <ol className="pager-nomor">
          {nomorHalaman(h.p, h.halaman).map((n, i) => n === null
            ? <li key={`t${i}`} aria-hidden>…</li>
            : <li key={n}><Link href={ke(n)} className={n === h.p ? "on" : ""} aria-current={n === h.p ? "page" : undefined} aria-label={`Halaman ${n}`}>{n}</Link></li>)}
        </ol>
        {h.p < h.halaman ? <Link href={ke(h.p + 1)} className="pager-nav" rel="next"><span>Selanjutnya</span><Icon name="arrow" size={16} /></Link> : <span className="pager-nav off" aria-disabled="true"><span>Selanjutnya</span><Icon name="arrow" size={16} /></span>}
      </div>
    </nav>
  );
}
