import type { Metadata } from "next";
import { requireOwner } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Catatan Aktivitas" };
const NAMA: Record<string, string> = {
  owner_create_staff: "Membuat akun petugas", owner_set_user_status: "Mengubah status akun", owner_set_password: "Mengganti sandi petugas", application_set: "Mengubah status lamaran",
  testimonial_save: "Menyimpan foto website", testimonial_delete: "Menghapus foto website", create_shipment: "Membuat resi", invite_staff: "Mengundang petugas",
};
type Row = { id: string; action: string; entity: string; who: string | null; at: string };

export default async function Catatan() {
  await requireOwner();
  const q = await staffRpc<Row[]>("owner_audit", { p_limit: 150 });
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <h1>Catatan aktivitas</h1>
      <p className="muted" style={{ marginTop: -6 }}>Jejak perubahan penting: siapa, melakukan apa, dan kapan. Catatan ini tidak bisa diubah atau dihapus siapa pun.</p>
      {q.error && <div className="err">{q.error}</div>}
      <div className="card stack" style={{ gap: 0 }}>
        {(q.data ?? []).map((r) => (
          <div key={r.id} style={{ padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
            <b>{NAMA[r.action] ?? r.action.replace(/_/g, " ")}</b>
            <div className="muted">{r.who ?? "Sistem"} · {new Date(r.at).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Makassar" })}</div>
          </div>
        ))}
        {(q.data ?? []).length === 0 && !q.error && <p className="muted">Belum ada catatan.</p>}
      </div>
    </main>
  );
}
