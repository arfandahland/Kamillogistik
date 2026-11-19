import type { Metadata } from "next";
import KontenForm, { type Item } from "@/components/KontenForm";
import KontenBaris from "@/components/KontenBaris";
import MuatBawaan from "@/components/MuatBawaan";
import { requireRole } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Konten Website" };

export default async function Konten() {
  await requireRole(["SUPER_ADMIN", "KONTEN"]);
  const q = await staffRpc<Item[]>("staff_testimonials");
  const items = q.data ?? [];
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <h1>Konten website</h1>
      <p className="muted" style={{ marginTop: -6 }}>Foto dokumentasi dan testimoni yang tampil di slider beranda. Urutan dari atas ke bawah sama dengan urutan di slider. Perubahan tampil di beranda dalam beberapa menit.</p>
      {q.error && <div className="err">{q.error}</div>}
      <details className="card admnew" open={items.length === 0}>
        <summary>+ Tambah foto baru</summary>
        <KontenForm />
        <p className="hint">Foto dikecilkan otomatis. Pastikan tidak ada nomor telepon, alamat lengkap, atau data pribadi yang terlihat, dan pelanggan setuju fotonya ditayangkan.</p>
      </details>
      {items.length === 0 && !q.error && <MuatBawaan />}
      <div className="stagger">{items.map((it, i) => <KontenBaris key={it.id} item={it} first={i === 0} last={i === items.length - 1} />)}</div>
    </main>
  );
}
