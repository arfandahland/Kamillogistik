import { SHIPMENT_STATUSES, type AnyStatus } from "@kamil/core";

/** Ikon, warna, dan kemajuan untuk tiap status (supaya daftar mudah dipindai dengan mata). */
export function statusMeta(s: AnyStatus): { icon: string; tone: "" | "warm" | "blue"; pill: string; pct: number } {
  const idx = Math.max(0, (SHIPMENT_STATUSES as readonly string[]).indexOf(s));
  const pct = s === "DELIVERED" ? 100 : s === "CANCELLED" ? 0 : Math.round(((idx + 1) / SHIPMENT_STATUSES.length) * 100);
  if (s === "CREATED") return { icon: "plus", tone: "warm", pill: "new", pct };
  if (s === "IN_TRANSIT_SEA" || s === "LOADED" || s === "ARRIVED_DEST_PORT") return { icon: "ship", tone: "blue", pill: "sea", pct };
  if (s === "OUT_FOR_DELIVERY" || s === "PICKED_UP") return { icon: "truck", tone: "", pill: "", pct };
  if (s === "DELIVERED") return { icon: "check", tone: "", pill: "done", pct };
  return { icon: "box", tone: "", pill: "", pct };
}

export function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "K";
}
export function sapaan(d = new Date()) {
  const h = Number(new Intl.DateTimeFormat("id-ID", { hour: "numeric", hour12: false, timeZone: "Asia/Makassar" }).format(d));
  return h < 11 ? "Selamat pagi" : h < 15 ? "Selamat siang" : h < 18 ? "Selamat sore" : "Selamat malam";
}
