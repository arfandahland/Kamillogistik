import type { PricingBasis } from "../tariff";
import type { AnyStatus, ShipmentStatus } from "../status";

export type Place = { code: string; name: string; city: string };

export type RouteService = {
  id: string;
  slug: string;
  origin: Place;
  dest: Place;
  mode: "LAUT" | "DARAT" | "UDARA";
  service: "PORT_TO_PORT" | "PORT_TO_DOOR" | "DOOR_TO_DOOR";
  rounding?: "ceil" | "round" | "none";
  roundingStep?: number;
  basis: PricingBasis;
  unitPrice: number;
  volumetricDivisor: number;
  minChargeable: number;
  minTotal?: number;
  etaDays: number;
  /** Catatan jadwal keberangkatan (mis. "Keberangkatan 2x seminggu"). */
  departureNote?: string;
};

export type TrackEvent = {
  status: ShipmentStatus;
  at: string; // ISO, waktu server
  location?: string;
  note?: string;
  // Data internal — TIDAK boleh keluar lewat API publik (PRD §3):
  internal?: { userId: string; driverName: string; lat?: number; lng?: number };
};

export type ShipmentRecord = {
  resiNo: string;
  origin: Place;
  dest: Place;
  status: AnyStatus;
  etaAt?: string;
  vesselName?: string;
  pod?: { receiverName: string; photoUrl: string; signatureUrl: string; signedAt: string };
  invoiceTotal?: number; // data keuangan: tidak ditampilkan publik
  events: TrackEvent[];
};

export interface Repo {
  findShipmentByResi(resi: string): Promise<ShipmentRecord | null>;
  listRoutes(): Promise<RouteService[]>;
  findRoute(originCode: string, destCode: string, opts?: { service?: string; basis?: string }): Promise<RouteService | null>;
}
