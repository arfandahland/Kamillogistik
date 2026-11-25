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
  const [aktif, usulan, belum, sj, kir_] = await Promise.all([
    staffRpc<Vendor[]>("mv_vendor_list", { p_status: "AKTIF" }),
    staffRpc<Vendor[]>("mv_vendor_list", { p_status: "BELUM_VERIFIKASI" }),
    staffRpc<unknown[]>("mv_alloc_list", { p_status: "BELUM", p_limit: 200 }),
    finance ? Promise.resolve({ data: null, error: null }) : staffRpc<{ items: SJ[]; terlambat: number }>("mv_sj_list"),
    finance || me.role === "OWNER" ? Promise.resolve({ data: null, error: null }) : staffRpc<{ belumDibaca: number }>("mv_vendor_inbox", { p_only_unread: true, p_limit: 1 }),
  ]);
  const nBelum = (belum.data ?? []).length;
  const galat = aktif.error ?? belum.error ?? (finance ? null : sj.error);
  const kir2 = kir_.data?.belumDibaca ? `${kir_.data.belumDibaca} kiriman belum dibaca. Foto dan laporan vendor lewat link khusus, tanpa akun.` : "Foto dan laporan vendor lewat link khusus, tanpa akun."
  const kota = me.branchName ?? "";
  const kir = (m: string, t: string, d: string) => ({ href: `/app/mv/tracking?m=${m}`, icon: m === "UDARA" ? "plane" : m === "LAUT" ? "ship" : "truck", t, d });
  const WIL = "Sumatera, Jawa, Bali, NTB dan NTT, Kalimantan, dan Sulawesi Utara.";
  // MV kota: kerja harian untuk kiriman keluar dari cabangnya sendiri
  const menuMV = [
    kir("DARAT", "Kiriman darat", `Per wilayah: ${WIL} Lengkap dengan penjualan, modal (HPP), dan margin.`),
    kir("LAUT", "Kiriman laut", `Per wilayah: ${WIL}`),
    kir("UDARA", "Kiriman udara", `Per wilayah: ${WIL}`),
    { href: "/app/mv/alokasi", icon: "truck", t: "Alokasi dan HPP", d: "Pilih vendor atau armada internal untuk tiap resi dan isi HPP (modal). HPP langsung terhitung ke margin penjualan." },
    { href: "/app/mv/penjualan", icon: "chart", t: "Penjualan dan margin", d: "Penjualan, modal (HPP), dan margin cabang Anda. Penjualan cabang lain hanya angka tagihan." },
    { href: "/app/mv/kiriman", icon: "image", t: "Kiriman vendor", d: kir2 },
    { href: "/app/mv/sj", icon: "file", t: "SJ balik", d: "Pantau surat jalan yang harus kembali, terima, dan serahkan ke Finance." },
    { href: "/app/mv/udara", icon: "layers", t: "Manifest udara", d: "Unggah daftar manifest udara (CSV atau PDF) dan cek kecocokan nomor resinya." },
    { href: "/app/mv/vendor", icon: "users", t: "Vendor", d: "Daftar vendor dan rutenya. Vendor baru yang Anda catat diverifikasi MV Master." },
  ];
  // MV Master: pengawas pusat, bukan pekerjaan harian kota
  const menuMaster = [
    { href: "/app/mv/vendor?s=DIUSULKAN", icon: "shield", t: "Verifikasi vendor", d: "Vendor yang dicatat MV tiap kota menunggu Anda tandai Terverifikasi, lengkapi rutenya, atau nonaktifkan." },
    { href: "/app/mv/vendor", icon: "users", t: "Master vendor dan pembayaran", d: "Semua vendor semua kota, tagihan vendor, dan pembayaran HPP ke vendor." },
    { href: "/app/mv/penjualan?b=1", icon: "chart", t: "Bandingkan antar kota", d: "Penjualan, modal (HPP), dan margin Jakarta, Makassar, dan Surabaya berdampingan." },
    { href: "/app/mv/alokasi", icon: "truck", t: "Alokasi semua kota", d: "Pantau alokasi dan HPP semua kota. Hanya Anda yang bisa membuka kunci HPP yang sudah dicocokkan Finance." },
    { href: "/app/mv/tracking?m=DARAT", icon: "pin", t: "Kiriman semua kota", d: "Darat, laut, dan udara per wilayah, bisa disaring per kota." },
    { href: "/app/mv/sj", icon: "file", t: "SJ balik semua kota", d: "Surat jalan balik yang terlambat di kota mana pun." },
  ];
  const menuFinance = [
    { href: "/app/mv/vendor", icon: "users", t: "Vendor dan tagihan vendor", d: "Daftar vendor dan pembayaran HPP." },
    { href: "/app/mv/alokasi", icon: "truck", t: "Alokasi dan HPP", d: "HPP tiap resi untuk dicocokkan dan dikunci." },
    { href: "/app/mv/penjualan", icon: "chart", t: "Penjualan dan margin", d: "Penjualan, modal, dan margin tiap kota." },
    { href: "/app/keuangan/sj", icon: "file", t: "SJ dari MV", d: "Surat jalan balik yang sudah diserahkan MV ke Finance." },
  ];
  const menu = finance ? menuFinance : master ? menuMaster : menuMV;
  const judul = master ? "MV Master (pusat)" : finance ? "Divisi MV" : `Divisi MV ${kota}`.trim();
  const sub = master ? "Mengawasi semua kota: verifikasi vendor, pembayaran vendor, dan perbandingan margin. Pekerjaan harian dikerjakan MV tiap kota."
    : finance ? "Vendor, HPP, dan penjualan untuk pencocokan keuangan."
    : `Kiriman keluar dari ${kota || "cabang Anda"}: pilih vendor, isi HPP, dan pantau penjualan serta margin.`;
  return (
    <main className="wrap stack" style={{ paddingTop: 8 }}>
      <div className="pghead"><div><h1>{judul}</h1><p className="muted">{sub}</p></div></div>
      <MvPesan ok={sp.ok} e={sp.e} galat={[galat]} />
      <StatRow items={[
        { ikon: "truck", n: aktif.data ? aktif.data.length : "-", label: "Vendor aktif", href: "/app/mv/vendor?s=AKTIF" },
        { ikon: "clock", n: usulan.data ? usulan.data.length : "-", label: "Vendor belum diverifikasi", sub: master ? "Perlu Anda verifikasi" : "Diverifikasi MV Master", warm: true, href: "/app/mv/vendor?s=DIUSULKAN" },
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
