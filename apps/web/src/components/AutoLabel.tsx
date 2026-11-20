"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

let urut = 0;
/**
 * Menghubungkan setiap label bertipe "label.f" ke kolom isian yang tepat di sebelahnya, supaya pembaca layar dan
 * pengisian otomatis tahu fungsi kolom itu. Berjalan ringan di halaman petugas (satu pengamat DOM, ditunda 150 ms).
 */
export default function AutoLabel() {
  const path = usePathname();
  useEffect(() => {
    const jalan = () => {
      document.querySelectorAll<HTMLLabelElement>("label.f:not([for])").forEach((l) => {
        if (l.querySelector("input,select,textarea")) return;
        const n = l.nextElementSibling; if (!n) return;
        const c = n.matches("input,select,textarea") ? n : n.querySelector("input:not([type=hidden]),select,textarea");
        if (!c || (c as HTMLInputElement).type === "radio" || (c as HTMLInputElement).type === "checkbox") return;
        if (!c.id) c.id = `al-${++urut}`;
        l.htmlFor = c.id;
      });
    };
    jalan();
    let t: ReturnType<typeof setTimeout> | undefined;
    const mo = new MutationObserver(() => { clearTimeout(t); t = setTimeout(jalan, 150); });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { clearTimeout(t); mo.disconnect(); };
  }, [path]);
  return null;
}
