import type { Repo, RouteService, ShipmentRecord, Place, TrackEvent } from "./repo";
import type { ShipmentStatus } from "../status";
import { SHIPMENT_STATUSES } from "../status";

const JKT: Place = { code: "JKT", name: "Hub Jakarta", city: "Jakarta" };
const SUB: Place = { code: "SUB", name: "Hub Surabaya", city: "Surabaya" };
const MKS: Place = { code: "MKS", name: "Gudang Makassar", city: "Makassar" };

const MRW: Place = { code: "MRW", name: "Morowali", city: "Morowali" };

// Tarif dari materi promosi Kamil Logistik (Nov 2026). Perlu dikonfirmasi di Fase 0:
//  - Port-to-Port Jakarta->Makassar tertulis Rp400.000/m3 di satu poster dan Rp380.000/CBM di poster lain.
//  - Min. berat Jakarta->Makassar (per kg) belum tertulis.
export const DEMO_ROUTES: RouteService[] = [
  { id: "r1", slug: "jakarta-makassar-port-to-door-kg", origin: JKT, dest: MKS, mode: "LAUT", service: "PORT_TO_DOOR",
    basis: "PER_KG", unitPrice: 2500, volumetricDivisor: 4000, minChargeable: 0, etaDays: 7 },
  { id: "r2", slug: "jakarta-makassar-port-to-door-m3", origin: JKT, dest: MKS, mode: "LAUT", service: "PORT_TO_DOOR",
    basis: "PER_M3", unitPrice: 500_000, volumetricDivisor: 4000, minChargeable: 0, rounding: "ceil", roundingStep: 0.01, etaDays: 7 },
  { id: "r3", slug: "jakarta-makassar-port-to-port-m3", origin: JKT, dest: MKS, mode: "LAUT", service: "PORT_TO_PORT",
    basis: "PER_M3", unitPrice: 400_000, volumetricDivisor: 4000, minChargeable: 0, rounding: "ceil", roundingStep: 0.01, etaDays: 7 },
  { id: "r4", slug: "makassar-jakarta-port-to-door", origin: MKS, dest: JKT, mode: "LAUT", service: "PORT_TO_DOOR",
    basis: "PER_KG", unitPrice: 2500, volumetricDivisor: 4000, minChargeable: 20, etaDays: 7 },
  { id: "r5", slug: "makassar-morowali-door-to-door", origin: MKS, dest: MRW, mode: "DARAT", service: "DOOR_TO_DOOR",
    basis: "PER_KG", unitPrice: 2000, volumetricDivisor: 4000, minChargeable: 30, etaDays: 2 },
];

function ev(status: ShipmentStatus, at: string, location: string, note?: string): TrackEvent {
  return { status, at, location, note, internal: { userId: "u-demo", driverName: "Rahasia Driver", lat: -6.2, lng: 106.8 } };
}

const TIMES = [
  "2026-11-10T08:15:00Z", "2026-11-10T11:40:00Z", "2026-11-10T15:05:00Z", "2026-11-11T07:30:00Z",
  "2026-11-11T20:00:00Z", "2026-11-16T05:20:00Z", "2026-11-16T09:10:00Z", "2026-11-17T07:45:00Z", "2026-11-17T13:30:00Z",
];
const LOCS = ["Jakarta", "Gudang Jakarta", "Gudang Jakarta", "Pelabuhan Jakarta", "Dalam pelayaran", "Pelabuhan Makassar", "Gudang Makassar", "Makassar", "Makassar"];

function buildEvents(upTo: number): TrackEvent[] {
  return SHIPMENT_STATUSES.slice(1, upTo + 1).map((s, i) => ev(s, TIMES[i]!, LOCS[i]!));
}

export const DEMO_SHIPMENTS: ShipmentRecord[] = [
  {
    resiNo: "KLX-2611-000123", origin: JKT, dest: MKS, status: "DELIVERED",
    vesselName: "KM Contoh Nusantara", invoiceTotal: 1_250_000,
    pod: { receiverName: "Budi S.", photoUrl: "demo://foto", signatureUrl: "demo://ttd", signedAt: TIMES[8]! },
    events: buildEvents(9),
  },
  {
    resiNo: "KLX-2611-000124", origin: JKT, dest: MKS, status: "IN_TRANSIT_SEA",
    etaAt: "2026-11-21T00:00:00Z", vesselName: "KM Contoh Nusantara", invoiceTotal: 480_000,
    events: buildEvents(5),
  },
  { resiNo: "KLX-2611-000125", origin: SUB, dest: MKS, status: "CREATED", invoiceTotal: 0, events: [] },
];

export function createSeedRepo(): Repo {
  return {
    async findShipmentByResi(resi) {
      return DEMO_SHIPMENTS.find((s) => s.resiNo === resi) ?? null;
    },
    async listRoutes() {
      return DEMO_ROUTES;
    },
    async findRoute(o, d, opts) {
      return DEMO_ROUTES.find((r) => r.origin.code === o && r.dest.code === d
        && (!opts?.service || r.service === opts.service) && (!opts?.basis || r.basis === opts.basis)) ?? null;
    },
  };
}
