import type { Metadata } from "next";
import { STATUS_LABEL } from "@kamil/core";
import { requireRole } from "@/lib/auth";
import SubmitButton from "@/components/SubmitButton";
import { koreksiStatus } from "./actions";
import BackLink from "@/components/BackLink";

export const metadata: Metadata = { title: "Koreksi Data" };
export const dynamic = "force-dynamic";
const STATUS = ["CREATED", "PICKED_UP", "AT_ORIGIN_HUB", "SORTED_INVOICED", "LOADED", "IN_TRANSIT_SEA", "ARRIVED_DEST_PORT", "AT_DEST_HUB", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "EXCEPTION"] as const;

/** Konsol koreksi Super Admin: memperbaiki status resi yang salah. Alasan wajib; tercatat di riwayat resi dan catatan aktivitas. */
export default async function Koreksi({ searchParams }: { searchParams: Promise<{ e?: string; ok?: string }> }) {
  await requireRole(["SUPER_ADMIN"]);
  const sp = await searchParams;
  return (
    <main className="wrap narrow section stack">
      <BackLink />
      <h1>Koreksi data</h1>
      <p className="muted" style={{ margin: 0 }}>Hanya untuk memperbaiki kesalahan, misalnya resi tertutup padahal barang belum sampai. Setiap koreksi mencatat siapa, kapan, dan alasannya, dan tampak di riwayat resi.</p>
      {sp.ok && <div className="ok" role="status">{sp.ok}</div>}
      {sp.e && <div className="err" role="alert">{sp.e}</div>}
      <form action={koreksiStatus} className="card stack">
        <label className="f" htmlFor="kr-kode">Nomor resi</label>
        <input id="kr-kode" name="kode" required autoCapitalize="characters" autoComplete="off" placeholder="KML-JKT-MKS-…" />
        <label className="f" htmlFor="kr-status">Ubah status menjadi</label>
        <select id="kr-status" name="status" required defaultValue="">
          <option value="" disabled>Pilih status…</option>
          {STATUS.map((k) => <option key={k} value={k}>{(STATUS_LABEL as Record<string, string>)[k] ?? k}</option>)}
        </select>
        <label className="f" htmlFor="kr-alasan">Alasan koreksi (wajib, minimal 10 huruf)</label>
        <textarea id="kr-alasan" name="alasan" required minLength={10} maxLength={500} />
        <SubmitButton steps={["Memeriksa resi…", "Mencatat koreksi…"]}>Koreksi status</SubmitButton>
      </form>
    </main>
  );
}
