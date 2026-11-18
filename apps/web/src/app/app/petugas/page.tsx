import type { Metadata } from "next";
import { ROLE_LABEL } from "@kamil/core";
import Icon from "@/components/Icon";
import SubmitButton from "@/components/SubmitButton";
import { requireOwner } from "@/lib/auth";
import { staffRpc } from "@/lib/supabase/server";
import { tanggalWaktu } from "@/lib/brand";
import { buatPetugas, resetSandi, ubahStatusPetugas } from "../admin-actions";

export const metadata: Metadata = { title: "Petugas" };
type S = { id: string; name: string; email: string; role: string; branchName: string | null; status: string; lastLogin: string | null };
type P = { id: string; name: string; type: string; city: string; status: string };

export default async function Petugas({ searchParams }: { searchParams: Promise<{ ok?: string; e?: string }> }) {
  const me = await requireOwner(); const sp = await searchParams;
  const [s, p] = await Promise.all([staffRpc<S[]>("owner_list_staff"), staffRpc<P[]>("owner_list_partners")]);
  const branches = (p.data ?? []).filter((x) => x.status === "ACTIVE");
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <h1>Petugas</h1>
      {sp.ok && <div className="ok" role="status">{sp.ok}</div>}{sp.e && <div className="err" role="alert">{sp.e}</div>}{s.error && <div className="err">{s.error}</div>}
      <details className="card admnew" open={!!sp.e}>
        <summary><Icon name="plus" size={20} /> Tambah petugas baru</summary>
        <form action={buatPetugas}>
          <label className="f">Nama lengkap</label><input name="nama" required />
          <label className="f">Email untuk masuk</label><input name="email" type="email" inputMode="email" autoCapitalize="none" required />
          <label className="f">Peran</label>
          <select name="peran" defaultValue="DRIVER">{["DRIVER", "WAREHOUSE", "CONTAINER_DRIVER", "MITRA_POS", "HUB_MANAGER"].map((k) => <option key={k} value={k}>{ROLE_LABEL[k]}</option>)}</select>
          <label className="f">Bekerja di</label>
          <select name="cabang" defaultValue="" required><option value="" disabled>Pilih cabang atau mitra…</option>{branches.map((b) => <option key={b.id} value={b.id}>{b.name} ({b.city})</option>)}</select>
          <label className="f">Sandi sementara</label><input name="sandi" autoComplete="off" placeholder="Minimal 8, ada huruf dan angka" required />
          <p className="hint">Beri tahu sandi ini kepada petugas, lalu minta mereka menggantinya lewat menu Akun.</p>
          <SubmitButton className="btn green" style={{ marginTop: 12 }} steps={["Memeriksa data…", "Membuat akun aman…", "Menyiapkan hak akses…", "Mencatat perubahan…"]}>Buat akun petugas</SubmitButton>
        </form>
      </details>
      <div className="stagger">
        {(s.data ?? []).map((u) => (
          <details key={u.id} className="card admitem">
            <summary>
              <span className="ic"><Icon name="user" size={22} /></span>
              <span className="meta"><b>{u.name}</b><small>{ROLE_LABEL[u.role] ?? u.role}{u.branchName ? ` · ${u.branchName}` : ""}</small><small>{u.email} · {u.lastLogin ? `terakhir masuk ${tanggalWaktu(u.lastLogin)}` : "belum pernah masuk"}</small></span>
              <span className={`pill ${u.status === "ACTIVE" ? "done" : "late"}`}>{u.status === "ACTIVE" ? "Aktif" : "Nonaktif"}</span>
            </summary>
            <div className="admbody">
              <form action={resetSandi}><input type="hidden" name="id" value={u.id} /><label className="f">Ganti kata sandi petugas</label><input name="sandi" autoComplete="off" placeholder="Sandi baru, minimal 8, ada huruf dan angka" required />
                <SubmitButton className="btn ghost" style={{ marginTop: 10 }} steps={["Memeriksa sandi…", "Menyimpan sandi baru…"]}>Simpan sandi baru</SubmitButton></form>
              {u.id !== me.userId && (
                <form action={ubahStatusPetugas} style={{ marginTop: 14 }}><input type="hidden" name="id" value={u.id} /><input type="hidden" name="aktif" value={u.status === "ACTIVE" ? "0" : "1"} />
                  <SubmitButton className="btn ghost" style={u.status === "ACTIVE" ? { borderColor: "var(--danger)", color: "var(--danger)" } : undefined} steps={["Memproses…", "Mencatat perubahan…"]}>{u.status === "ACTIVE" ? "Nonaktifkan petugas ini" : "Aktifkan kembali"}</SubmitButton></form>
              )}
            </div>
          </details>
        ))}
      </div>
    </main>
  );
}
