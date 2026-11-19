import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Icon from "@/components/Icon";
import LoginForm from "@/components/LoginForm";
import Scene3D from "@/components/Scene3D";
import Waves from "@/components/Waves";
import { BRAND, waLink } from "@/lib/brand";
import { loginKeys } from "@/lib/loginGuard";
import { supabaseConfigured, supabaseServer } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Masuk Petugas", robots: { index: false } };
export const dynamic = "force-dynamic";

async function masuk(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) redirect("/masuk?e=kosong");
  const sb = await supabaseServer();
  const k = await loginKeys(email);
  // Penjaga gagal-aman: bila fungsinya tidak tersedia, login tetap berjalan seperti biasa.
  const [a, b] = await Promise.all([sb.rpc("login_guard_check", { p_key: k.byEmail }), sb.rpc("login_guard_check", { p_key: k.byIp })]);
  if (Number(a.data) > 0 || Number(b.data) > 0) redirect("/masuk?e=terkunci");
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) {
    const [x, y] = await Promise.all([sb.rpc("login_guard_fail", { p_key: k.byEmail, p_max: 5 }), sb.rpc("login_guard_fail", { p_key: k.byIp, p_max: 30 })]);
    redirect(Number(x.data) > 0 || Number(y.data) > 0 ? "/masuk?e=terkunci" : "/masuk?e=salah");
  }
  await sb.rpc("login_guard_ok", { p_key: k.byEmail });
  redirect("/app");
}

const PESAN: Record<string, string> = {
  salah: "Email atau kata sandi tidak cocok. Periksa lagi.",
  kosong: "Isi email dan kata sandi dulu ya.",
  terkunci: "Terlalu banyak percobaan yang salah. Demi keamanan, tunggu sekitar 15 menit lalu coba lagi. Lupa sandi? Hubungi pemilik.",
};

export default async function Masuk({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  const error = !supabaseConfigured ? "Layanan masuk belum diatur di server ini." : e ? PESAN[e] : undefined;
  return (
    <main className="login">
      <div className="inner loginsplit">
        <a className="loginback" href="/"><Icon name="back" size={16} /> Kembali ke beranda</a>
        <div className="loginbrand">
          <img className="logo-login" src="/logo-sm.webp" width="220" height="175" alt="Kamil Logistik" />
          <Scene3D compact />
          <div className="brandcopy">
            <h2>Satu aplikasi untuk seluruh perjalanan barang</h2>
            <p>Catat jemput, timbang, muat, sampai barang diterima. Semua tersimpan rapi dan bisa dipantau pemilik.</p>
            <ul>
              <li><Icon name="scan" /> Pindai resi dengan kamera HP</li>
              <li><Icon name="shield" /> Hak akses sesuai tugas masing-masing</li>
              <li><Icon name="clock" /> Setiap tindakan tercatat dan bisa ditelusuri</li>
            </ul>
          </div>
        </div>
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
