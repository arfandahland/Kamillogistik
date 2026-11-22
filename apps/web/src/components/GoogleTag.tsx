"use client";
import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Halaman yang tidak boleh dikirim ke alat statistik: memuat nomor resi atau tautan pribadi. */
const PRIVAT = /^\/(lacak\/|portal|invoice|app|masuk|auth|api|dev)/;

declare global { interface Window { dataLayer?: Record<string, unknown>[] } }

/**
 * Google Tag Manager untuk halaman publik. ID kontainer (GTM-XXXX) dibaca di server dari variabel GTM_ID,
 * jadi tanpa variabel itu tidak ada satu pun skrip luar yang dimuat. Peristiwa penting (klik WhatsApp, hitung ongkir,
 * cek resi, kirim formulir) didorong ke dataLayer agar bisa dijadikan pemicu dan konversi di Tag Manager / Analytics.
 */
export default function GoogleTag({ id }: { id: string }) {
  const path = usePathname() || "/";
  const boleh = !PRIVAT.test(path);

  useEffect(() => {
    if (!boleh) return;
    const push = (o: Record<string, unknown>) => { (window.dataLayer = window.dataLayer || []).push(o); };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a) return;
      const h = a.getAttribute("href") || "";
      if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(h)) push({ event: "klik_whatsapp", halaman: location.pathname });
      else if (h.startsWith("/ongkir")) push({ event: "klik_hitung_ongkir", halaman: location.pathname });
      else if (h.startsWith("/lacak")) push({ event: "klik_cek_resi", halaman: location.pathname });
      else if (h.startsWith("/mitra")) push({ event: "klik_jadi_mitra", halaman: location.pathname });
      else if (h.startsWith("/jemput")) push({ event: "klik_minta_jemput", halaman: location.pathname });
    };
    const onSubmit = (e: Event) => {
      const f = e.target as HTMLFormElement | null;
      push({ event: "kirim_formulir", halaman: location.pathname, formulir: f?.getAttribute("aria-label") || f?.id || f?.className?.split(" ")[0] || "formulir" });
    };
    document.addEventListener("click", onClick);
    document.addEventListener("submit", onSubmit, true);
    return () => { document.removeEventListener("click", onClick); document.removeEventListener("submit", onSubmit, true); };
  }, [boleh]);

  if (!boleh) return null;
  return (
    <>
      <Script id="gtm-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});`}</Script>
      <Script id="gtm-load" strategy="afterInteractive" src={`https://www.googletagmanager.com/gtm.js?id=${id}`} />
      <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${id}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} title="Google Tag Manager" /></noscript>
    </>
  );
}
