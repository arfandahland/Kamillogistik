/** @type {import('next').NextConfig} */
export default {
  transpilePackages: ["@kamil/core"],
  poweredByHeader: false,
  experimental: { serverActions: { bodySizeLimit: "2mb" } },
  async headers() {
    // Aplikasi tidak memanggil layanan luar dari peramban (semua lewat server). Satu-satunya pengecualian adalah
    // Google Tag Manager dan Google Analytics, yang hanya dimuat di halaman publik (lihat components/GoogleTag.tsx).
    // 'unsafe-inline' pada skrip diperlukan Next.js untuk data awal halaman; sumber skrip luar lainnya tetap tertutup.
    const GOOGLE_SCRIPT = "https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com";
    const GOOGLE_IMG = "https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.g.doubleclick.net https://www.google.com";
    const GOOGLE_CONNECT = "https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.g.doubleclick.net https://www.google.com";
    const csp = [
      "default-src 'self'", `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'"} ${GOOGLE_SCRIPT}`, "style-src 'self' 'unsafe-inline'", `img-src 'self' data: blob: ${GOOGLE_IMG}`,
      "font-src 'self'", `connect-src 'self' ${GOOGLE_CONNECT}`, "frame-src https://www.googletagmanager.com", "frame-ancestors 'none'", "base-uri 'self'", "form-action 'self'", "object-src 'none'", "manifest-src 'self'", "worker-src 'self'",
    ].join("; ");
    return [
    { source: "/sw.js", headers: [{ key: "Cache-Control", value: "no-cache, no-store, must-revalidate" }, { key: "Service-Worker-Allowed", value: "/" }, { key: "Content-Type", value: "application/javascript; charset=utf-8" }] },
    {
      source: "/(.*)",
      headers: [
        { key: "Content-Security-Policy", value: csp },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(self), geolocation=(self), microphone=()" },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      ],
    }];
  },
};
