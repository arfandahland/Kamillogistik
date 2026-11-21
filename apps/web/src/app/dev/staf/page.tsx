import { notFound } from "next/navigation";
import StaffShell from "@/components/StaffShell";
import StaffHome, { type Row } from "@/components/StaffHome";

/** Pratinjau tampilan dengan data contoh. HANYA untuk pengembangan; tidak tersedia di produksi. */
export default function Pratinjau() {
  if (process.env.NODE_ENV === "production") notFound();
  const rows: Row[] = [
    { id: "1", resiNo: "KML-JKT-MKS-LJ-261114-1015-0002-ML", status: "IN_TRANSIT_SEA", origin: "Jakarta", dest: "Makassar", senderName: "Andi", receiverName: "Budi S.", createdAt: "2026-11-10T08:15:00Z", mine: false },
    { id: "2", resiNo: "KML-SUB-MKS-LA-261118-0700-0001-JP", status: "CREATED", origin: "Surabaya", dest: "Makassar", senderName: "Ani", receiverName: "Siti R.", createdAt: "2026-11-17T07:00:00Z", mine: false },
    { id: "3", resiNo: "KML-MKS-MRW-DJ-261118-0910-0001-UD", status: "AT_ORIGIN_HUB", origin: "Makassar", dest: "Morowali", senderName: "Eko", receiverName: "Andi P.", createdAt: "2026-11-16T09:30:00Z", mine: true },
    { id: "4", resiNo: "KML-JKT-MKS-LJ-261112-0830-0001-NW", status: "DELIVERED", origin: "Jakarta", dest: "Makassar", senderName: "Dewi", receiverName: "Rina T.", createdAt: "2026-11-09T09:30:00Z", mine: false },
  ];
  return (
    <StaffShell me={{ name: "Pak Kamil", role: "SUPER_ADMIN", branchName: null }} pending={2} forceFull>
      <StaffHome rows={rows} stats={{ aktif: 12, menunggu: 2, selesai: 1, dipegang: 1 }} tab="aktif" q="" canCreate
        pending={[{ id: "h1", shipmentId: "1", resiNo: "KML-JKT-MKS-LJ-261114-1015-0002-ML", fromName: "Budi (Kurir)" }, { id: "h2", shipmentId: "2", resiNo: "KML-SUB-MKS-LA-261118-0700-0001-JP", fromName: "Sari (Gudang)" }]} />
    </StaffShell>
  );
}
