/** @type {import('next').NextConfig} */
export default {
  transpilePackages: ["@kamil/core"],
  poweredByHeader: false,
  experimental: { serverActions: { bodySizeLimit: "2mb" } },
  async headers() {
    // Aplikasi tidak memanggil layanan luar dari peramban (semua lewat server), jadi connect-src cukup 'self'.
    // 'unsafe-inline' pada skrip diperlukan Next.js untuk data awal halaman; sumber skrip luar tetap tertutup.
    const csp = [
      "default-src 'self'", "script-src 'self' 'unsafe-inline'", "style-src 'self' 'unsafe-inline'", "img-src 'self' data: blob:",
      "font-src 'self'", "connect-src 'self'", "frame-ancestors 'none'", "base-uri 'self'", "form-action 'self'", "object-src 'none'", "manifest-src 'self'",
    ].join("; ");
    return [{
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
