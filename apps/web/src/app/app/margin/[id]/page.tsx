import type { Metadata } from "next";
import Link from "next/link";
import BiayaManifest from "@/components/BiayaManifest";
import { requireRole } from "@/lib/auth";
import BackLink from "@/components/BackLink";

export const metadata: Metadata = { title: "Biaya Manifest" };

export default async function MarginManifest({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ e?: string; ok?: string }> }) {
  await requireRole(["SUPER_ADMIN", "OWNER", "FINANCE"]);
  const { id } = await params; const sp = await searchParams;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return <main className="wrap narrow stack"><div className="err">Manifest tidak valid.</div></main>;
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <BackLink href="/app/margin" ke="daftar margin" />
      <p style={{ margin: 0 }}><Link href="/app/margin">← Margin</Link></p>
      <h1>Biaya manifest</h1>
      {sp.ok && <div className="ok" role="status">{sp.ok}</div>}{sp.e && <div className="err" role="alert">{sp.e}</div>}
      <BiayaManifest manifestId={id} kembali={`/app/margin/${id}`} />
    </main>
  );
}
