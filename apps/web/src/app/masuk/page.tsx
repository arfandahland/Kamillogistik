import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Icon from "@/components/Icon";
import LoginForm from "@/components/LoginForm";
import Scene3D from "@/components/Scene3D";
import Waves from "@/components/Waves";
import { BRAND, waLink } from "@/lib/brand";
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

const PESAN: Record<string, string> = {
  salah: "Email atau kata sandi tidak cocok. Periksa lagi.",
  kosong: "Isi email dan kata sandi dulu ya.",
};

export default async function Masuk({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  const error = !supabaseConfigured ? "Layanan masuk belum diatur di server ini." : e ? PESAN[e] : undefined;
  return (
    <main className="login">
      <div className="inner">
        <img className="logo-login" src="/logo-sm.png" alt="Kamil Logistik" />
        <Scene3D compact />
        <div className="glass">
          <h1>Selamat datang kembali</h1>
          <p className="sub">Masuk untuk mengelola pengiriman hari ini.</p>
          <LoginForm action={masuk} error={error} />
          <div className="secrow">
            <div><Icon name="shield" /> Sambungan terenkripsi</div>
            <div><Icon name="check" /> Semua tindakan tercatat</div>
          </div>
          <div className="foot">
            <a href={waLink("Halo, saya lupa kata sandi aplikasi petugas Kamil Logistik.")}>Lupa kata sandi?</a>
            <a href={waLink("Halo, saya butuh bantuan masuk ke aplikasi petugas.")}>Bantuan {BRAND.whatsappDisplay}</a>
          </div>
        </div>
      </div>
      <Waves />
    </main>
  );
}
