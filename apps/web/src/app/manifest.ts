import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kamil Logistik", short_name: "Kamil", description: "Kirim barang murah ke seluruh Sulawesi dan pantau posisinya.",
    start_url: "/app", scope: "/", display: "standalone", orientation: "portrait", lang: "id",
    background_color: "#05261f", theme_color: "#072f29",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
