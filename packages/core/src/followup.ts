import { chatLink } from "./phone";

export type FollowupKind = "JEMPUT" | "ANTAR" | "TIBA" | "KURIR" | "MASALAH" | "TAGIHAN";
export type FollowupItem = {
  shipmentId: string; resiNo: string; kind: FollowupKind; party: "sender" | "receiver"; name: string | null; phone: string | null;
  hours: number; level: "warn" | "danger"; amount: number | null; invoiceNo: string | null; token: string | null;
  origin: string; dest: string; status: string; contactedAt: string | null;
};

export const FOLLOWUP_LABEL: Record<FollowupKind, { title: string; hint: string; icon: string }> = {
  JEMPUT: { title: "Belum dijemput", hint: "Hubungi pengirim, atur jam jemput", icon: "truck" },
  ANTAR: { title: "Belum diantar ke gudang", hint: "Ingatkan pengirim membawa barang", icon: "home" },
  TIBA: { title: "Di gudang tujuan, belum diantar", hint: "Hubungi penerima, atur waktu antar", icon: "box" },
  KURIR: { title: "Sedang diantar terlalu lama", hint: "Pastikan penerima siap menerima", icon: "pin" },
  MASALAH: { title: "Barang bermasalah", hint: "Kabari penerima soal kendalanya", icon: "alert" },
  TAGIHAN: { title: "Tagihan jatuh tempo", hint: "Ingatkan pembayaran lewat transfer atau tunai", icon: "cash" },
};

/** "5 jam", "2 hari": umur tertahan dalam bahasa awam. */
export function umur(hours: number): string {
  if (hours < 1) return "baru saja";
  if (hours < 48) return `${Math.floor(hours)} jam`;
  return `${Math.floor(hours / 24)} hari`;
}

const rp = (n: number) => "Rp" + n.toLocaleString("id-ID");

/** Pesan WhatsApp siap kirim. Petugas boleh mengubahnya sebelum mengirim. */
export function followupMessage(i: FollowupItem, siteUrl: string): string {
  const n = i.name?.trim() || "Bapak/Ibu";
  const lacak = `${siteUrl}/lacak/${i.resiNo}`;
  switch (i.kind) {
    case "JEMPUT": return `Halo ${n}, kami dari Kamil Logistik. Resi ${i.resiNo} sudah dibuat dan kurir kami akan menjemput barang Anda. Boleh konfirmasi alamat dan jam yang pas? Terima kasih.`;
    case "ANTAR": return `Halo ${n}, kami dari Kamil Logistik. Resi ${i.resiNo} sudah dibuat, tetapi barangnya belum kami terima di gudang. Kapan barang akan diantar? Terima kasih.`;
    case "TIBA": return `Halo ${n}, paket ${i.resiNo} sudah tiba di gudang Kamil Logistik ${i.dest}. Kami akan antar ke alamat Anda. Kapan waktu yang pas untuk menerima? Pantau di ${lacak}`;
    case "KURIR": return `Halo ${n}, kurir Kamil Logistik sedang mengantar paket ${i.resiNo} ke alamat Anda. Mohon siap menerima. Terima kasih.`;
    case "MASALAH": return `Halo ${n}, ada kendala pada paket ${i.resiNo}. Tim Kamil Logistik sedang menanganinya dan akan menjelaskan lebih lanjut. Mohon maaf atas ketidaknyamanannya.`;
    case "TAGIHAN": return `Halo ${n}, kami dari Kamil Logistik. Pengingat tagihan ${i.invoiceNo ?? ""} untuk resi ${i.resiNo}${i.amount ? ` sebesar ${rp(i.amount)}` : ""} sudah jatuh tempo. Lihat rincian dan rekening: ${siteUrl}/invoice/${i.token ?? ""}. Terima kasih.`;
  }
}

export const followupLink = (i: FollowupItem, siteUrl: string) => (i.phone ? chatLink(i.phone, followupMessage(i, siteUrl)) : null);
