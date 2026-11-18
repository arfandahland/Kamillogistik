import { createHash } from "node:crypto";
import { headers } from "next/headers";

const hash = (s: string) => createHash("sha256").update(s).digest("hex");

/**
 * Kunci penjaga percobaan masuk. Dikunci per KOMBINASI email + alamat IP (dan per IP secara longgar),
 * bukan per email saja, supaya orang lain tidak bisa mengunci akun Pemilik dari tempat berbeda.
 */
export async function loginKeys(email: string) {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? h.get("x-real-ip") ?? "tak-dikenal").split(",")[0]!.trim();
  return { byEmail: hash(`e|${email.toLowerCase()}|${ip}`), byIp: hash(`i|${ip}`) };
}
