import type { Metadata } from "next";
import VideoDaftar from "@/components/VideoDaftar";
import { getMe } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Video Panduan" };

const PETA: Record<string, string> = { SUPER_ADMIN: "owner", HUB_MANAGER: "manajer", MITRA_POS: "kasir", DRIVER: "kurir", WAREHOUSE: "gudang", CONTAINER_DRIVER: "sopir", HRD: "hrd", KONTEN: "konten" };

export default async function VideoPanduan() {
  const me = (await getMe()).data;
  const awal = me ? PETA[me.role] : undefined;
  return (
    <main className="wrap narrow stack" style={{ paddingTop: 8 }}>
      <h1>Video panduan</h1>
      <p className="muted" style={{ marginTop: -6 }}>Video untuk peran Anda ada di paling atas. Video baru diunduh saat diputar.</p>
      <VideoDaftar awal={awal} />
    </main>
  );
}
