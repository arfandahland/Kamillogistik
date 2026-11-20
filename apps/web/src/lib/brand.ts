export const BRAND = {
  name: "Kamil Logistik",
  tagline: "Best Price, Best Service",
  whatsappNumber: "6285342238748",
  whatsappDisplay: "0853-4223-8748",
  // Bantuan masuk aplikasi petugas langsung ke Pemilik
  bantuanLoginNumber: "6282198606806",
  bantuanLoginDisplay: "0821-9860-6806",
  instagram: "kamil_logistik_express",
  alamat: { jalan: "Gudang Sarinah 2, Jl. Pancoran Timur II No. 4, RT 12/RW 8", kelurahan: "Cikoko", kecamatan: "Pancoran", kota: "Jakarta Selatan", provinsi: "DKI Jakarta", pos: "12770" },
  jam: "Buka 24 jam, setiap hari",
};
export const waLink = (text?: string) =>
  `https://wa.me/${BRAND.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const rupiah = (n: number) => "Rp" + n.toLocaleString("id-ID");

export function tanggalWaktu(iso: string) {
  return (
    new Date(iso).toLocaleString("id-ID", {
      timeZone: "Asia/Makassar", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    }).replace(/\./g, ":") + " WITA"
  );
}
export function tanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { timeZone: "Asia/Makassar", day: "numeric", month: "long", year: "numeric" });
}
export const waLinkBantuanLogin = (text: string) => `https://wa.me/${BRAND.bantuanLoginNumber}?text=${encodeURIComponent(text)}`;

/** "6281255550101" -> "0812-5555-0101" untuk ditampilkan. */
export const hpTampil = (p?: string | null) => {
  const d = (p ?? "").replace(/\D/g, ""); if (d.length < 9) return p ?? "";
  const lokal = d.startsWith("62") ? "0" + d.slice(2) : d;
  return lokal.replace(/^(\d{4})(\d{4})(\d+)$/, "$1-$2-$3");
};
