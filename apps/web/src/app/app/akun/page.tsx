import type { Metadata } from "next";
import Link from "next/link";
import { PERAN_KETERANGAN, ROLE_LABEL } from "@kamil/core";
import Icon from "@/components/Icon";
import { staffRpc } from "@/lib/supabase/server";
import AbsenKartu from "@/components/AbsenKartu";
import SubmitButton from "@/components/SubmitButton";
import TombolPanduan from "@/components/TombolPanduan";
import { keluar } from "../actions";
import { ubahProfil } from "./actions";

export const metadata: Metadata = { title: "Akun Saya" };

type Profil = { userId: string; name: string; email: string | null; phone: string | null; role: string; branchName: string | null; branchCity: string | null;
  status: string; createdAt: string; lastSignIn: string | null };

const tgl = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("id-ID", { timeZone: "Asia/Makassar", day: "numeric", month: "long", year: "numeric" }) : "-");
const tglJam = (iso: string | null) => (iso ? new Date(iso).toLocaleString("id-ID", { timeZone: "Asia/Makassar", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).replace(".", ":") + " WITA" : "Belum tercatat");
const hpTampil = (p: string | null) => (p ? ("0" + p.replace(/^62/, "")).replace(/(\d{4})(?=\d)/g, "$1 ") : "");
const inisial = (n: string) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((x) => x[0]!.toUpperCase()).join("");

export default async function Akun({ searchParams }: { searchParams: Promise<{ e?: string; ok?: string }> }) {
  const sp = await searchParams;
  const { data: me, error } = await staffRpc<Profil>("my_profile");
  const absen = me && !["SUPER_ADMIN", "OWNER"].includes(me.role);
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <div className="pghead"><div><h1>Akun saya</h1><p className="muted">Data diri, kontak, dan keamanan akun Anda.</p></div></div>
      {sp.ok && <div className="ok" role="status">{sp.ok}</div>}
      {(sp.e || error) && <div className="err" role="alert">{sp.e || error}</div>}
      {me && (
        <>
          <section className="card akunid" aria-label="Identitas">
            <span className="avatar akunav" aria-hidden="true">{inisial(me.name) || "?"}</span>
            <div className="akunnama">
              <h2>{me.name}</h2>
              <div className="chips wrapc">
                <span className="pill done">{ROLE_LABEL[me.role] ?? me.role}</span>
                <span className="pill">{me.branchName ? `${me.branchName}${me.branchCity ? ` · ${me.branchCity}` : ""}` : "Semua cabang"}</span>
                <span className={`pill ${me.status === "ACTIVE" ? "" : "late"}`}>{me.status === "ACTIVE" ? "Aktif" : "Nonaktif"}</span>
              </div>
            </div>
          </section>

          <div className="akungrid">
            <section className="card" aria-labelledby="h-data">
              <h2 className="cardh" id="h-data">Data akun</h2>
              <dl className="infogrid">
                <div><dt>Email</dt><dd>{me.email ?? "-"}{me.email && <small>Ganti email lewat Admin pusat.</small>}</dd></div>
                <div><dt>WhatsApp</dt><dd>{me.phone ? hpTampil(me.phone) : "Belum diisi"}</dd></div>
                <div><dt>Peran</dt><dd>{ROLE_LABEL[me.role] ?? me.role}{PERAN_KETERANGAN[me.role] && <small>{PERAN_KETERANGAN[me.role]}</small>}</dd></div>
                <div><dt>Cabang</dt><dd>{me.branchName ?? "Semua cabang"}</dd></div>
                <div><dt>Bergabung</dt><dd>{tgl(me.createdAt)}</dd></div>
                <div><dt>Masuk terakhir</dt><dd>{tglJam(me.lastSignIn)}</dd></div>
              </dl>
            </section>

            <form action={ubahProfil} className="card akunform" aria-labelledby="h-ubah">
              <h2 className="cardh" id="h-ubah">Ubah profil</h2>
              <div className="rbf"><label className="f" htmlFor="akun-nama">Nama lengkap</label>
                <input id="akun-nama" name="nama" defaultValue={me.name} required minLength={2} maxLength={80} autoComplete="name" /></div>
              <div className="rbf"><label className="f" htmlFor="akun-hp">Nomor WhatsApp</label>
                <input id="akun-hp" name="hp" type="tel" inputMode="tel" defaultValue={hpTampil(me.phone)} placeholder="0812 3456 7890" autoComplete="tel" />
                <p className="hint">Dipakai tim untuk menghubungi Anda.</p></div>
              <SubmitButton className="btn green" steps={["Menyimpan profil…"]}>Simpan profil</SubmitButton>
            </form>
          </div>

          {absen && <AbsenKartu />}

          <section className="card" aria-labelledby="h-aman">
            <h2 className="cardh" id="h-aman">Keamanan dan bantuan</h2>
            <div className="akunaksi">
              <TombolPanduan />
              <Link href="/app/sandi" className="btn ghost"><Icon name="key" size={20} /> Ganti kata sandi</Link>
              <form action={keluar}><button className="btn ghost" style={{ borderColor: "var(--danger)", color: "var(--danger)" }}><Icon name="out" size={20} /> Keluar</button></form>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
