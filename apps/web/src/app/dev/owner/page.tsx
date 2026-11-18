import { notFound } from "next/navigation";
import OwnerDashboard from "@/components/OwnerDashboard";
import StaffShell from "@/components/StaffShell";
import type { OwnerDashboard as Data } from "@kamil/core";

/** Pratinjau dashboard pemilik dengan data CONTOH. Hanya pengembangan; tidak tersedia di produksi. */
function sample(): Data {
  const daily = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(Date.UTC(2026, 9, 20 + i)); const wave = Math.round(3 + 2.2 * Math.sin(i / 3) + (i % 5 === 0 ? 3 : 0) + i / 8);
    return { d: d.toISOString().slice(0, 10), created: wave, delivered: Math.max(0, wave - 2 - (i % 3)), revenue: wave * 410_000 + (i % 4) * 90_000 };
  });
  const st = (status: any, n: number) => ({ status, n });
  return {
    generatedAt: new Date().toISOString(), days: 30,
    kpi: { totalResi: 118, aktif: 31, delivered: 84, cancelled: 3, newInPeriod: 112, newPrev: 90, deliveredInPeriod: 78, deliveredPrev: 60, revenue: 46_800_000, revenuePrev: 38_000_000, unpaid: 9_400_000, overdue: 2_100_000, avgInvoice: 418_000, avgDeliveryDays: 6.8 },
    daily, pipeline: [st("CREATED", 3), st("PICKED_UP", 2), st("AT_ORIGIN_HUB", 6), st("SORTED_INVOICED", 4), st("LOADED", 3), st("IN_TRANSIT_SEA", 8), st("ARRIVED_DEST_PORT", 1), st("AT_DEST_HUB", 2), st("OUT_FOR_DELIVERY", 2), st("DELIVERED", 84)],
    routes: [{ route: "Jakarta → Makassar", n: 68, revenue: 31_000_000 }, { route: "Makassar → Jakarta", n: 24, revenue: 9_500_000 }, { route: "Makassar → Morowali", n: 20, revenue: 6_300_000 }],
    staff: [{ name: "Sari (Gudang)", role: "WAREHOUSE", actions: 64 }, { name: "Budi (Kurir)", role: "DRIVER", actions: 51 }, { name: "Andi (Kontainer)", role: "CONTAINER_DRIVER", actions: 22 }],
    alerts: [
      { code: "OVERDUE", level: "danger", title: "Tagihan lewat jatuh tempo, belum dibayar", count: 4, amount: 2_100_000, items: [] },
      { code: "CREATED", level: "danger", title: "Belum dijemput lebih dari 24 jam", count: 2, items: [{ id: "1", resiNo: "KLX-2611-000131" }, { id: "2", resiNo: "KLX-2611-000134" }] },
      { code: "AT_ORIGIN_HUB", level: "warn", title: "Di gudang asal tapi belum ditimbang (lebih dari 48 jam)", count: 1, items: [{ id: "3", resiNo: "KLX-2611-000127" }] },
    ],
    recent: [
      { id: "1", resiNo: "KLX-JKT-MKS-LJ-261117-1415-0005-W", status: "OUT_FOR_DELIVERY", at: "2026-11-18T01:20:00Z", by: "Budi (Kurir)", location: "Gudang Makassar" },
      { id: "2", resiNo: "KLX-JKT-MKS-LJ-261116-0930-0004-M", status: "SORTED_INVOICED", at: "2026-11-18T00:50:00Z", by: "Sari (Gudang)", location: "Gudang Jakarta" },
      { id: "3", resiNo: "KLX-JKT-MKS-LJ-261115-1100-0003-U", status: "IN_TRANSIT_SEA", at: "2026-11-17T23:10:00Z", by: "Andi (Kontainer)", location: "Pelabuhan Jakarta" },
    ],
  };
}

export default function Pratinjau() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <StaffShell me={{ name: "Pak Kamil", role: "SUPER_ADMIN", branchName: null }} pending={0} forceFull>
      <OwnerDashboard initial={sample()} preview />
    </StaffShell>
  );
}
