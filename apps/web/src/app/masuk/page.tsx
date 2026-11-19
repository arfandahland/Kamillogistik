import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Icon from "@/components/Icon";
import LoginForm from "@/components/LoginForm";
import LoginHelp from "@/components/LoginHelp";
import Scene3D from "@/components/Scene3D";
import Waves from "@/components/Waves";
import { BRAND, waLink } from "@/lib/brand";
import { loginKeys } from "@/lib/loginGuard";
import { SITE_URL } from "@/lib/site";
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

async function masukGoogle() {
  "use server";
  const sb = await supabaseServer();
  const { data, error } = await sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${SITE_URL}/auth/callback`, queryParams: { prompt: "select_account" } } });
  if (error || !data?.url) redirect("/masuk?e=google");
  redirect(data.url);
}

const PESAN: Record<string, string> = {
  google: "Masuk dengan Google belum berhasil. Coba lagi, atau masuk dengan email dan kata sandi.",
  "google-belum": "Akun Google ini belum terdaftar sebagai petugas. Minta pemilik mendaftarkan alamat Gmail Anda, atau masuk dengan email dan kata sandi.",
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
          {process.env.GOOGLE_LOGIN === "1" && (
            <form action={masukGoogle} className="gform">
              <div className="gor"><span>atau</span></div>
              <button className="gbtn" type="submit">
                <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/><path fill="#FBBC05" d="M10.5 28.7a14.500 14.500 0 0 1 0-9.400l-7.900-6.100a24 24 0 0 0 0 21.600l7.900-6.100z"/><path fill="#34A853" d="M24 48c6.500 0 11.900-2.100 15.900-5.800l-7.500-5.800c-2.100 1.400-4.800 2.300-8.400 2.300-6.300 0-11.600-4.100-13.500-9.800l-7.900 6.100C6.500 42.600 14.600 48 24 48z"/></svg>
                Masuk dengan Google
              </button>
              <p className="hint ghint">Hanya untuk alamat Gmail yang sudah didaftarkan pemilik.</p>
            </form>
          )}
          <div className="secrow">
            <div><Icon name="shield" /> Sambungan terenkripsi</div>
            <div><Icon name="check" /> Semua tindakan tercatat</div>
          </div>
          <LoginHelp sarankan={e === "terkunci" ? "terkunci" : e === "salah" ? "salah" : e === "google-belum" ? "baru" : undefined} />
        </div>
      </div>
      <Waves />
    </main>
  );
}
