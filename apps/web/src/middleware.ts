import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Menyegarkan sesi login dan menjaga halaman /app: tanpa login → halaman masuk. */
export async function middleware(req: NextRequest) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  const toLogin = () => NextResponse.redirect(new URL("/masuk", req.url));
  if (!url || !key) return req.nextUrl.pathname.startsWith("/app") ? toLogin() : NextResponse.next();

  let res = NextResponse.next({ request: req });
  const sb = createServerClient(url, key, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (list: { name: string; value: string; options: CookieOptions }[]) => {
        list.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });
  // getClaims memeriksa tanda tangan token di server ini (tanpa perjalanan ke Supabase); bila proyek memakai kunci lama, otomatis kembali ke getUser.
  const { data } = await sb.auth.getClaims();
  const user = data?.claims ?? null;
  if (!user && req.nextUrl.pathname.startsWith("/app")) return toLogin();
  if (user && req.nextUrl.pathname === "/masuk") return NextResponse.redirect(new URL("/app", req.url));
  res.headers.set("cache-control", "private, no-store");
  return res;
}
export const config = { matcher: ["/app/:path*", "/masuk"] };
