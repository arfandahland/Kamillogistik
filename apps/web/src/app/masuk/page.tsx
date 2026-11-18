import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { supabaseConfigured, supabaseServer } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Masuk Petugas", robots: { index: false } };
export const dynamic = "force-dynamic";

async function masuk(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) redirect("/masuk?e=kosong");
  const sb = await supabaseServer();
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) redirect("/masuk?e=salah");
  redirect("/app");
}

export default async function Masuk({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  return (
    <main className="wrap section">
      <div className="card">
        <h1>Masuk petugas</h1>
        <p className="muted">Khusus karyawan dan mitra Kamil Logistik.</p>
        {!supabaseConfigured && <div className="err">Layanan masuk belum diatur di server ini.</div>}
        {e === "salah" && <div className="err" role="alert">Email atau kata sandi salah. Coba lagi.</div>}
        {e === "kosong" && <div className="err" role="alert">Isi email dan kata sandi dulu ya.</div>}
        <form action={masuk}>
          <label className="f" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="username" inputMode="email" required />
          <label className="f" htmlFor="password">Kata sandi</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />
          <button className="btn green" style={{ marginTop: 18 }}>Masuk</button>
        </form>
        <p className="hint" style={{ marginTop: 14 }}>Lupa kata sandi? Hubungi pemilik.</p>
      </div>
    </main>
  );
}
