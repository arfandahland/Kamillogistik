import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/app",
    name: "Kamil Logistik Express",
    short_name: "Kamil",
    description: "Kirim barang murah ke seluruh Indonesia, pantau posisinya, dan kelola pekerjaan petugas dari satu aplikasi.",
    start_url: "/app?sumber=pwa",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "portrait",
    lang: "id",
    dir: "ltr",
    categories: ["business", "logistics", "productivity"],
    background_color: "#05261f",
    theme_color: "#072f29",
    prefer_related_applications: false,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Lacak resi", short_name: "Lacak", description: "Cek posisi barang dengan nomor resi", url: "/lacak", icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }] },
      { name: "Resi baru", short_name: "Resi baru", description: "Buat resi pengiriman (Kasir)", url: "/app/baru", icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }] },
      { name: "Pindai barang", short_name: "Pindai", description: "Pindai barcode atau QR resi", url: "/app/pindai", icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }] },
      { name: "Hitung ongkir", short_name: "Ongkir", description: "Hitung ongkos kirim", url: "/ongkir", icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }] },
    ],
  };
}
