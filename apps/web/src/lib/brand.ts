export const BRAND = {
  name: "Kamil Logistik",
  tagline: "Best Price, Best Service",
  whatsappNumber: "6285342238748",
  whatsappDisplay: "0853-4223-8748",
  instagram: "kamillogistik.id",
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
