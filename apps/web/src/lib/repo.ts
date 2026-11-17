import { createSeedRepo, createSupabaseRepo } from "@kamil/core";

/**
 * Satu-satunya tempat yang menentukan sumber data.
 * - Ada SUPABASE_URL + SUPABASE_PUBLISHABLE_KEY  -> data sungguhan dari Supabase.
 * - Tidak ada                                    -> data contoh (untuk pengembangan lokal).
 * Kunci "publishable" memang dirancang publik; keamanan dijaga di database (lihat db/migrations/002-003).
 */
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_PUBLISHABLE_KEY;

export const repo = url && key ? createSupabaseRepo({ url, publishableKey: key }) : createSeedRepo();
export const usingRealData = Boolean(url && key);
