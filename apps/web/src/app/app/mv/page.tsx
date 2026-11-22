import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import StatRow from "@/components/StatRow";
import MvPesan from "@/components/MvPesan";
import { requireRole } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import { MV_BACA, type SJ, type Vendor } from "@/lib/mv";

export const metadata: Metadata = { title: "Divisi MV" };

export default async function BerandaMV({ searchParams }: { searchParams: Promise<{ ok?: string; e?: string }> }) {
  const me = await requireRole(MV_BACA); const sp = await searchParams;
  const finance = me.role === "FINANCE", master = me.role === "SUPER_ADMIN" || me.role === "MV_MASTER";
  const [aktif, usulan, belum, sj] = await Promise.all([
    staffRpc<Vendor[]>("mv_vendor_list", { p_status: "AKTIF" }),
    staffRpc<Vendor[]>("mv_vendor_list", { p_status: "DIUSULKAN" }),
    staffRpc<unknown[]>("mv_alloc_list", { p_status: "BELUM", p_limit: 200 }),
    finance ? Promise.resolve({ data: null, error: null }) : staffRpc<{ items: SJ[]; terlambat: number }>("mv_sj_list"),
  ]);
  const nBelum = (belum.data ?? []).length;
  const galat = aktif.error ?? belum.error ?? (finance ? null : sj.error);
  const menu = [
    { href: "/app/mv/vendor", icon: "users", t: "Vendor", d: "Daftar mitra pengangkut, rute layanannya, dan usulan vendor baru." },
    { href: "/app/mv/alokasi", icon: "truck", t: "Alokasi dan HPP", d: "Pilih vendor atau armada internal untuk tiap resi, isi HPP, dan unggah foto dokumen." },
    { href: "/app/mv/tracking?m=DARAT", icon: "truck", t: "Pemantauan darat", d: "Resi darat ke Sumatera, Jawa Tengah, Jawa Timur, Bali, NTB, dan NTT." },
    { href: "/app/mv/tracking?m=UDARA", icon: "plane", t: "Pemantauan udara", d: "Resi udara ke seluruh Kalimantan." },
    { href: "/app/mv/tracking?m=LAUT", icon: "ship", t: "Pemantauan laut", d: "Resi laut ke Kalimantan dan Sulawesi Utara." },
    finance ? { href: "/app/keuangan/sj", icon: "file", t: "SJ dari MV", d: "Surat jalan balik yang sudah diserahkan MV ke Finance." }
      : { href: "/app/mv/sj", icon: "file", t: "SJ balik", d: "Pantau surat jalan yang harus kembali, terima, dan serahkan ke Finance." },
    { href: "/app/mv/udara", icon: "layers", t: "Manifest udara", d: "Unggah daftar manifest udara (CSV atau PDF) dan cek kecocokan nomor resinya." },
    { href: "/app/mv/penjualan", icon: "chart", t: "Penjualan per cabang", d: "Jumlah resi dan tagihan tiap cabang, dibandingkan per moda dan wilayah." },
  ];
  return (
    <main className="wrap stack" style={{ paddingTop: 8 }}>
      <div className="pghead"><div><h1>Divisi MV</h1><p className="muted">Mengatur vendor pengangkut, biaya angkut (HPP), dan surat jalan balik untuk setiap pengiriman.</p></div></div>
      <MvPesan ok={sp.ok} e={sp.e} galat={[galat]} />
      <StatRow items={[
        { ikon: "truck", n: aktif.data ? aktif.data.length : "-", label: "Vendor aktif", href: "/app/mv/vendor?s=AKTIF" },
        { ikon: "clock", n: usulan.data ? usulan.data.length : "-", label: "Usulan vendor menunggu", sub: master ? "Perlu Anda verifikasi" : "Diverifikasi MV Master", warm: true, href: "/app/mv/vendor?s=DIUSULKAN" },
        { ikon: "alert", n: belum.data ? (nBelum >= 200 ? "200+" : nBelum) : "-", label: "Resi belum diberi vendor", warm: true, href: "/app/mv/alokasi?st=BELUM" },
        { ikon: "file", n: finance ? "-" : sj.data ? sj.data.terlambat : "-", label: "SJ terlambat", warm: true, href: finance ? "/app/keuangan/sj" : "/app/mv/sj?st=TERLAMBAT" },
      ]} />
      <div className="admgrid stagger">
        {menu.map((i) => (
          <Link key={i.t} href={i.href} className="card lift admcard">
            <span className="ic"><Icon name={i.icon} size={26} /></span>
            <span><b>{i.t}</b><small>{i.d}</small></span>
            <Icon name="arrow" size={20} />
          </Link>
        ))}
      </div>
    </main>
  );
}
