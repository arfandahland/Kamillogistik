import { cache } from "react";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { handleTrack } from "@kamil/core";
import { repo } from "@/lib/repo";
import { publicRpc } from "@/lib/publicRpc";

const MAKS_TIDAK_KETEMU = 40; // per 15 menit per alamat IP

const kunciIp = async () => {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? h.get("x-real-ip") ?? "tak-dikenal").split(",")[0]!.trim();
  return createHash("sha256").update(`t|${ip}`).digest("hex");
};

/**
 * Pelacakan resi dengan penjaga tebak-tebakan: pencarian yang TIDAK ketemu dihitung per alamat IP.
 * Setelah terlalu banyak (orang menebak nomor resi), pencarian dikunci sementara. Pengguna biasa tidak terpengaruh.
 * Gagal-aman: bila penjaga tidak tersedia, pelacakan tetap berjalan.
 * Dibungkus cache() supaya satu permintaan halaman hanya dihitung sekali.
 */
export const lacakDenganJaga = cache(async (resi: string): Promise<ReturnType<typeof handleTrack> extends Promise<infer R> ? R : never> => {
  const key = await kunciIp();
  const lock = await publicRpc<number>("login_guard_check", { p_key: key });
  if (Number(lock) > 0) return { status: 429, body: { error: "Terlalu banyak pencarian yang tidak ditemukan. Tunggu sekitar 15 menit, atau hubungi kami lewat WhatsApp." } } as never;
  const r = await handleTrack(repo, resi);
  if (r.status === 404) await publicRpc("login_guard_fail", { p_key: key, p_max: MAKS_TIDAK_KETEMU });
  return r;
});
