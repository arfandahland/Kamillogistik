import type { Metadata } from "next";
import StaffShell from "@/components/StaffShell";
import { getMe, getPending } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Aplikasi Petugas", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const [me, pend] = await Promise.all([getMe(), getPending()]);
  if (!me.data) {
    return (
      <main className="wrap section"><div className="card">
        <h2>Akun belum terdaftar</h2>
        <p className="muted">Email Anda berhasil masuk, tetapi belum didaftarkan sebagai petugas. Hubungi pemilik untuk didaftarkan.</p>
      </div></main>
    );
  }
  return <StaffShell me={me.data} pending={(pend.data ?? []).length}>{children}</StaffShell>;
}
