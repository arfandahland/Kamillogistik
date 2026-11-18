import { STATUS_LABEL } from "./staffText";
import type { AnyStatus } from "../status";

export type OwnerDashboard = {
  generatedAt: string;
  days: number;
  kpi: {
    totalResi: number; aktif: number; delivered: number; cancelled: number;
    newInPeriod: number; newPrev: number; deliveredInPeriod: number; deliveredPrev: number;
    revenue: number; revenuePrev: number; unpaid: number; overdue: number; avgInvoice: number; avgDeliveryDays: number | null;
  };
  daily: { d: string; created: number; delivered: number; revenue: number }[];
  pipeline: { status: AnyStatus; n: number }[];
  routes: { route: string; n: number; revenue: number }[];
  staff: { name: string; role: string; actions: number }[];
  alerts: { code: string; level: "warn" | "danger"; title: string; count: number; amount?: number; items: { id: string; resiNo: string }[] }[];
  recent: { id: string; resiNo: string; status: AnyStatus; at: string; by: string | null; location: string | null }[];
};

const idr = (n: number) => "Rp" + Math.round(n).toLocaleString("id-ID");

/** Selisih persen dibanding periode lalu. null bila tidak ada pembanding (periode lalu 0). */
export function percentChange(now: number, prev: number): number | null {
  if (prev <= 0) return null;
  return Math.round(((now - prev) / prev) * 100);
}

/** Rupiah ringkas untuk kartu: 1,2 jt, 350 rb, 2,4 M. */
export function rupiahRingkas(n: number): string {
  const a = Math.abs(n);
  const f = (v: number, s: string) => `${n < 0 ? "-" : ""}Rp${(Math.round(v * 10) / 10).toLocaleString("id-ID")} ${s}`;
  if (a >= 1_000_000_000) return f(a / 1_000_000_000, "M");
  if (a >= 1_000_000) return f(a / 1_000_000, "jt");
  if (a >= 10_000) return f(a / 1_000, "rb");
  return idr(n);
}

export type Insight = { tone: "good" | "warn" | "info"; text: string };

/**
 * Diagnosis otomatis dalam bahasa awam. Hanya menyimpulkan dari angka nyata;
 * tidak mengarang pembanding bila datanya belum ada.
 */
export function buildInsights(d: OwnerDashboard): Insight[] {
  const k = d.kpi, out: Insight[] = [];
  if (k.totalResi === 0) {
    return [{ tone: "info", text: "Belum ada resi. Begitu resi pertama dibuat, grafik dan kesimpulan di sini akan hidup sendiri." }];
  }
  const dn = percentChange(k.newInPeriod, k.newPrev);
  if (dn === null) out.push({ tone: "info", text: `Ada ${k.newInPeriod} resi baru dalam ${d.days} hari terakhir. Belum ada periode sebelumnya untuk dibandingkan.` });
  else if (dn > 0) out.push({ tone: "good", text: `Resi baru naik ${dn}% dibanding ${d.days} hari sebelumnya (${k.newPrev} → ${k.newInPeriod}).` });
  else if (dn < 0) out.push({ tone: "warn", text: `Resi baru turun ${Math.abs(dn)}% dibanding ${d.days} hari sebelumnya (${k.newPrev} → ${k.newInPeriod}).` });
  else out.push({ tone: "info", text: `Jumlah resi baru sama dengan ${d.days} hari sebelumnya (${k.newInPeriod}).` });

  const dr = percentChange(k.revenue, k.revenuePrev);
  if (k.revenue > 0 && dr !== null) out.push({ tone: dr >= 0 ? "good" : "warn", text: `Pendapatan ${dr >= 0 ? "naik" : "turun"} ${Math.abs(dr)}% menjadi ${idr(k.revenue)}.` });
  else if (k.revenue > 0) out.push({ tone: "info", text: `Pendapatan ${d.days} hari terakhir ${idr(k.revenue)}, rata-rata ${idr(k.avgInvoice)} per resi.` });

  const top = d.routes[0];
  if (top && top.n > 0) out.push({ tone: "info", text: `Rute terlaris: ${top.route} (${top.n} resi${top.revenue > 0 ? `, ${idr(top.revenue)}` : ""}).` });

  const stuck = d.pipeline.filter((p) => p.status !== "DELIVERED" && p.status !== "CANCELLED").sort((a, b) => b.n - a.n)[0];
  if (stuck && stuck.n >= 2) out.push({ tone: "info", text: `Barang paling banyak berada di tahap "${STATUS_LABEL[stuck.status]}": ${stuck.n} resi.` });

  if (k.avgDeliveryDays !== null) out.push({ tone: "info", text: `Rata-rata barang sampai dalam ${k.avgDeliveryDays.toLocaleString("id-ID")} hari sejak resi dibuat.` });

  if (k.overdue > 0) out.push({ tone: "warn", text: `${idr(k.overdue)} tagihan sudah lewat jatuh tempo. Total belum dibayar ${idr(k.unpaid)}.` });
  else if (k.unpaid > 0) out.push({ tone: "info", text: `Total tagihan belum dibayar ${idr(k.unpaid)}, belum ada yang lewat jatuh tempo.` });

  const bad = d.alerts.filter((a) => a.level === "danger").reduce((s, a) => s + a.count, 0);
  if (bad > 0) out.push({ tone: "warn", text: `${bad} hal perlu ditindak segera. Lihat daftar "Perlu perhatian".` });
  else if (d.alerts.length === 0) out.push({ tone: "good", text: "Tidak ada resi yang macet. Semua bergerak sesuai waktu." });
  return out;
}
