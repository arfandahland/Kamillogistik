import { z } from "zod";
import { calculateTariff } from "../tariff";
import { isValidResi, splitItem } from "../resi";
import type { Repo, RouteService } from "./repo";
import { toPublicTrack } from "./publicView";

export type Reply<T = unknown> = { status: number; body: T };

export const SERVICE_LABEL: Record<RouteService["service"], { title: string; hint: string }> = {
  PORT_TO_PORT: { title: "Sampai pelabuhan tujuan", hint: "Barang Anda ambil sendiri di pelabuhan" },
  PORT_TO_DOOR: { title: "Diantar sampai alamat", hint: "Kami antar sampai ke pintu penerima" },
  DOOR_TO_DOOR: { title: "Dijemput dan diantar", hint: "Dijemput dari alamat Anda, diantar ke alamat penerima" },
};

const BUSY: Reply = { status: 503, body: { error: "Layanan sedang sibuk. Mohon coba lagi sebentar, atau hubungi kami lewat WhatsApp." } };

/** Galat database tidak boleh bocor ke pelanggan: ubah jadi pesan ramah. */
async function safe(fn: () => Promise<Reply>): Promise<Reply> {
  try { return await fn(); } catch (e) { console.error("[layanan]", e instanceof Error ? e.message : e); return BUSY; }
}

export const handleTrack = (repo: Repo, rawResi: string) => safe(() => track(repo, rawResi));
export const handleRoutes = (repo: Repo) => safe(() => routes(repo));
export const handleQuote = (repo: Repo, input: unknown) => safe(() => quote(repo, input));

async function track(repo: Repo, rawResi: string): Promise<Reply> {
  const resi = splitItem(rawResi).resi; // kode barang (…-01) dikenali sebagai resinya
  if (!isValidResi(resi))
    return { status: 400, body: { error: "Nomor resi tidak dikenali. Contoh yang benar: KML-JKT-MKS-LJ-261112-0830-0001-NW" } };
  const s = await repo.findShipmentByResi(resi);
  if (!s) return { status: 404, body: { error: "Nomor resi tidak ditemukan. Coba periksa lagi kodenya." } };
  return { status: 200, body: toPublicTrack(s) };
}

async function routes(repo: Repo): Promise<Reply> {
  const routes = await repo.listRoutes();
  return {
    status: 200,
    body: routes.map((r) => ({
      slug: r.slug,
      mode: r.mode,
      origin: r.origin,
      dest: r.dest,
      service: r.service,
      serviceTitle: SERVICE_LABEL[r.service].title,
      serviceHint: SERVICE_LABEL[r.service].hint,
      basis: r.basis,
      unitPrice: r.unitPrice,
      minChargeable: r.minChargeable,
      etaDays: r.etaDays,
      departureNote: r.departureNote ?? null,
    })),
  };
}

const QuoteBody = z.object({
  origin: z.string().min(2).max(10),
  dest: z.string().min(2).max(10),
  service: z.enum(["PORT_TO_PORT", "PORT_TO_DOOR", "DOOR_TO_DOOR"]).optional(),
  basis: z.enum(["PER_KG", "PER_M3"]).optional(),
  mode: z.enum(["LAUT", "DARAT", "UDARA"]).optional(),
  pieces: z
    .array(
      z.object({
        weightKg: z.number().min(0).max(100_000),
        dims: z
          .object({ lCm: z.number().min(0).max(2000), wCm: z.number().min(0).max(2000), hCm: z.number().min(0).max(2000) })
          .optional(),
      }),
    )
    .min(1)
    .max(100),
});

const nf = (n: number) => n.toLocaleString("id-ID");

async function quote(repo: Repo, input: unknown): Promise<Reply> {
  const parsed = QuoteBody.safeParse(input);
  if (!parsed.success)
    return { status: 400, body: { error: "Data belum lengkap. Isi kota asal, kota tujuan, dan berat barang." } };
  const b = parsed.data;
  const route = await repo.findRoute(b.origin.toUpperCase(), b.dest.toUpperCase(), { service: b.service, basis: b.basis, mode: b.mode });
  if (!route) return { status: 404, body: { error: "Maaf, rute ini belum tersedia. Hubungi kami lewat WhatsApp untuk bantuan." } };

  const r = calculateTariff({
    pieces: b.pieces,
    service: {
      basis: route.basis,
      unitPrice: route.unitPrice,
      volumetricDivisor: route.volumetricDivisor,
      minChargeable: route.minChargeable,
      minTotal: route.minTotal,
      rounding: route.rounding,
      roundingStep: route.roundingStep,
    },
  });

  // Penjelasan dalam bahasa sehari-hari — tanpa istilah teknis.
  const explain: string[] = [];
  if (r.chargeableUnit === "kg") {
    if (r.volumetricKg > r.actualKg)
      explain.push(`Barang Anda berat aslinya ${nf(r.actualKg)} kg, tapi ukurannya besar sehingga dihitung setara ${nf(r.volumetricKg)} kg.`);
    else explain.push(`Barang Anda dihitung dari berat aslinya, ${nf(r.actualKg)} kg.`);
    if (r.chargeable > Math.max(r.actualKg, r.volumetricKg))
      explain.push(`Ada batas kirim minimal ${nf(route.minChargeable)} kg, jadi dihitung ${nf(r.chargeable)} kg.`);
    explain.push(`${nf(r.chargeable)} kg x Rp${nf(r.unitPrice)} = Rp${nf(r.total)}`);
  } else {
    explain.push(`Barang Anda dihitung dari ukurannya: ${nf(r.chargeable)} m³ (meter kubik).`);
    explain.push(`${nf(r.chargeable)} m³ x Rp${nf(r.unitPrice)} = Rp${nf(r.total)}`);
  }

  return {
    status: 200,
    body: {
      total: r.total,
      unitPrice: r.unitPrice,
      unit: r.chargeableUnit,
      chargeable: r.chargeable,
      explain,
      etaDays: route.etaDays,
      service: { code: route.service, ...SERVICE_LABEL[route.service] },
      mode: route.mode,
      route: { origin: route.origin.city, dest: route.dest.city },
      note: "Ini perkiraan. Biaya pasti dihitung setelah barang ditimbang di gudang kami.",
    },
  };
}
