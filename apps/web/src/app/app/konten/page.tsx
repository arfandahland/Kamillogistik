import type { Metadata } from "next";
import { KontenDash, type KontenData } from "@/components/PeranDashboard";
import KontenForm, { type Item } from "@/components/KontenForm";
import KontenBaris from "@/components/KontenBaris";
import MuatBawaan from "@/components/MuatBawaan";
import { requireRole } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import BackLink from "@/components/BackLink";

export const metadata: Metadata = { title: "Konten Website" };

export default async function Konten() {
  await requireRole(["SUPER_ADMIN", "KONTEN"]);
  const [q, ds] = await Promise.all([staffRpc<Item[]>("staff_testimonials"), staffRpc<KontenData>("konten_dashboard")]);
  const items = q.data ?? [];
  return (
    <main className="wrap stack" style={{ paddingTop: 8 }}>
      <BackLink />
      <div className="pghead"><div><h1>Konten website</h1>
      <p className="muted">Foto dokumentasi dan testimoni yang tampil di slider beranda. Urutan dari atas ke bawah sama dengan urutan di slider. Perubahan tampil di beranda dalam beberapa menit.</p></div></div>
      {ds.data && <KontenDash d={ds.data} />}
      {q.error && <div className="err">{q.error}</div>}
      <details className="card admnew" open={items.length === 0}>
        <summary>+ Tambah foto baru</summary>
        <KontenForm />
        <p className="hint">Foto dikecilkan otomatis. Pastikan tidak ada nomor telepon, alamat lengkap, atau data pribadi yang terlihat, dan pelanggan setuju fotonya ditayangkan.</p>
      </details>
      {items.length === 0 && !q.error && <MuatBawaan />}
      <div className="stagger kolist">{items.map((it, i) => <KontenBaris key={it.id} item={it} first={i === 0} last={i === items.length - 1} />)}</div>
    </main>
  );
}
