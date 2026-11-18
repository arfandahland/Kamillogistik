import { createSeedRepo, createSupabaseRepo } from "@kamil/core";

/**
 * Satu-satunya tempat yang menentukan sumber data.
 * - Ada SUPABASE_URL + SUPABASE_PUBLISHABLE_KEY  -> data sungguhan dari Supabase.
 * - Tidak ada                                    -> data contoh (untuk pengembangan lokal).
 * Kunci "publishable" memang dirancang publik; keamanan dijaga di database (lihat db/migrations).
 */
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_PUBLISHABLE_KEY;

/** Data yang harus selalu segar (lacak resi, hitung ongkir). */
export const repo = url && key ? createSupabaseRepo({ url, publishableKey: key }) : createSeedRepo();
/** Data publik yang aman disimpan sementara (daftar rute untuk halaman SEO). */
export const publicRepo = url && key ? createSupabaseRepo({ url, publishableKey: key, fetchCache: "default" }) : createSeedRepo();
export const usingRealData = Boolean(url && key);
