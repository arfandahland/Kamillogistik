import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Icon from "@/components/Icon";
import MenuKaca, { type RingkasanHari } from "@/components/MenuKaca";
import { requireRole } from "@/lib/auth";
import { grupPusat, PERAN_PUSAT } from "@/lib/pusat";
import { staffRpc, getPending } from "@/lib/supabase/server";
import { rupiah } from "@/lib/brand";

export const metadata: Metadata = { title: "Pusat Kerja" };
type Hari = { day: { created: number; delivered: number; billed: number; received: number; problems: number }; pending: { stuck: number; unpaid: number } };

/** Isi satu kelompok fitur. Tiap kelompok punya tombol sendiri di menu bawah (`?g=`). Hanya tampilan: tautan dan halaman tujuan tetap yang lama. */
export default async function Pusat({ searchParams }: { searchParams: Promise<{ g?: string }> }) {
  const me = await requireRole(PERAN_PUSAT);
  const { judul, sapa, grup } = grupPusat(me.role);
  const g = (await searchParams).g;
  const pilih = grup.find((x) => x.slug === g);
  if (!pilih) redirect(`/app/pusat?g=${(grup.find((x) => x.tab) ?? grup[0]!).slug}`);
  // "Cari resi" menjadi kolom pencarian di bawah judul, bukan baris menu.
  const adaCari = pilih.items.some((i) => i.href === "/app/cari");
  const items = pilih.items.filter((i) => i.href !== "/app/cari");

  let ringkasan: RingkasanHari | null = null;
  if (items.some((i) => i.href === "/app/ringkasan") && (me.role === "SUPER_ADMIN" || me.role === "OWNER")) {
    const tgl = new Date(Date.now() + 8 * 3600_000).toISOString().slice(0, 10);
    const r = await staffRpc<Hari>("owner_daily_summary", { p_date: tgl });
    const d = r.data;
    if (d) {
      const judulTgl = new Date(tgl + "T00:00:00Z").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
      const teks = `Ringkasan Kamil Logistik, ${judulTgl}\n• Resi baru: ${d.day.created}\n• Sudah diterima pelanggan: ${d.day.delivered}\n• Ongkir ditagih: ${rupiah(d.day.billed)}\n• Uang masuk: ${rupiah(d.day.received)}\n• Barang bermasalah: ${d.day.problems}\n• Tertahan 24 jam+: ${d.pending.stuck}\n• Piutang belum lunas: ${rupiah(d.pending.unpaid)}`;
      ringkasan = { tanggal: judulTgl, angka: [{ l: "Resi baru", v: String(d.day.created) }, { l: "Sudah diterima", v: String(d.day.delivered) }, { l: "Ongkir ditagih", v: rupiah(d.day.billed) }, { l: "Uang masuk", v: rupiah(d.day.received) }], wa: `https://wa.me/?text=${encodeURIComponent(teks)}` };
    }
  }

  // Kartu angka ringkas di atas menu (hanya membaca data yang sudah ada).
  type Angka = { ikon: string; n: number; l: string; href: string; warm?: boolean };
  const angka: Angka[] = [];
  const adaKontak = items.some((i) => i.href.startsWith("/app/tindak-lanjut"));
  const adaSerah = items.some((i) => i.href.startsWith("/app/serah"));
  const adaKendala = items.some((i) => i.href.startsWith("/app/kendala"));
  const [fu, pend, kas, kn] = await Promise.all([
    adaKontak ? staffRpc<{ count: number }>("followup_queue", { p_only_count: true }) : null,
    adaSerah ? getPending() : null,
    adaKontak && me.role === "MITRA_POS" ? staffRpc<{ jemputBaru: number }>("kasir_dashboard") : null,
    adaKendala ? staffRpc<number>("issue_count") : null,
  ]);
  if (fu?.data) angka.push({ ikon: "chat", n: Number(fu.data.count ?? 0), l: "Perlu dihubungi", href: "/app/tindak-lanjut", warm: Number(fu.data.count ?? 0) > 0 });
  if (kas?.data) angka.push({ ikon: "truck", n: Number(kas.data.jemputBaru ?? 0), l: "Jemput baru", href: "/app/jemput", warm: Number(kas.data.jemputBaru ?? 0) > 0 });
  if (pend?.data) angka.push({ ikon: "swap", n: pend.data.length, l: "Menunggu diterima", href: "/app/serah", warm: pend.data.length > 0 });
  if (kn?.data != null) angka.push({ ikon: "alert", n: Number(kn.data), l: "Kendala terbuka", href: "/app/kendala", warm: Number(kn.data) > 0 });

  const lencana: Record<string, number> = {};
  for (const a of angka) lencana[a.href] = a.n;

  return (
    <main className="wrap stack gl-halaman" style={{ paddingTop: 8 }}>
      <p className="overline">{judul}</p>
      {grup.filter((x) => x.tab).length > 1 && (
        <nav className="dp-chips" aria-label="Kelompok menu" style={{ marginBottom: 4 }}>
          {grup.filter((x) => x.tab).map((x) => <Link key={x.slug} href={`/app/pusat?g=${x.slug}`} className={`dp-chip ${x.slug === pilih.slug ? "on" : ""}`} aria-current={x.slug === pilih.slug ? "page" : undefined}>{x.tab}</Link>)}
        </nav>
      )}
      <h1 style={{ marginTop: -6 }}>{pilih.judul}</h1>
      <p className="muted" style={{ marginTop: -6 }}>{pilih.ket || sapa}</p>
      {adaCari && (
        <form action="/app/cari" role="search" className="gl-cari">
          <Icon name="search" size={20} className="ico" />
          <input name="q" placeholder="Cari resi, nama, atau nomor HP" aria-label="Cari resi" enterKeyHint="search" autoComplete="off" />
          <button className="btn sm">Cari</button>
        </form>
      )}
      <MenuKaca items={items} ringkasan={ringkasan} lencana={lencana} />
    </main>
  );
}
