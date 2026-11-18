import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Ganti Kata Sandi" };

async function ganti(fd: FormData) {
  "use server";
  const a = String(fd.get("baru") ?? "");
  const b = String(fd.get("ulang") ?? "");
  if (a.length < 8) redirect("/app/sandi?e=" + encodeURIComponent("Kata sandi minimal 8 huruf atau angka."));
  if (a !== b) redirect("/app/sandi?e=" + encodeURIComponent("Kedua isian kata sandi tidak sama. Ketik ulang dengan teliti."));
  const sb = await supabaseServer();
  const { error } = await sb.auth.updateUser({ password: a });
  if (error) redirect("/app/sandi?e=" + encodeURIComponent("Belum bisa diganti. Coba kata sandi yang lebih sulit ditebak."));
  redirect("/app/sandi?ok=1");
}

export default async function Sandi({ searchParams }: { searchParams: Promise<{ e?: string; ok?: string }> }) {
  const sp = await searchParams;
  return (
    <main className="wrap narrow section">
      <form className="card" action={ganti}>
        <h1>Ganti kata sandi</h1>
        {sp.ok && <div className="ok" role="status">Kata sandi sudah diganti. Gunakan yang baru saat masuk berikutnya.</div>}
        {sp.e && <div className="err" role="alert">{sp.e}</div>}
        <label className="f" htmlFor="baru">Kata sandi baru</label>
        <input id="baru" name="baru" type="password" autoComplete="new-password" minLength={8} required />
        <label className="f" htmlFor="ulang">Ketik sekali lagi</label>
        <input id="ulang" name="ulang" type="password" autoComplete="new-password" minLength={8} required />
        <p className="hint">Minimal 8 huruf atau angka. Jangan beri tahu siapa pun, termasuk atasan.</p>
        <button className="btn green" style={{ marginTop: 16 }}>Simpan kata sandi baru</button>
        <Link href="/app" className="btn ghost" style={{ marginTop: 10 }}>← Kembali</Link>
      </form>
    </main>
  );
}
