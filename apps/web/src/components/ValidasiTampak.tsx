"use client";
import { useEffect } from "react";

/**
 * Pilihan yang disembunyikan (pencari wilayah, tombol pilihan bulat) tidak bisa menampilkan peringatan bawaan peramban,
 * sehingga tombol kirim terasa "tidak merespons". Di sini pilihan wajib yang kosong disorot, digulir ke tengah layar, dan diberi pesan merah.
 */
export default function ValidasiTampak() {
  useEffect(() => {
    let tahan = false;
    const judul = (el: HTMLElement) => {
      const id = el.getAttribute("id");
      const l = id ? document.querySelector(`label[for="${CSS.escape(id)}"]`)?.textContent?.trim() : "";
      return l || el.closest("fieldset")?.querySelector("legend")?.textContent?.trim() || "pilihan ini";
    };
    const saat = (e: Event) => {
      const el = e.target;
      const select = el instanceof HTMLSelectElement && el.classList.contains("cp-src");
      const bulat = el instanceof HTMLInputElement && el.type === "radio" && !!el.closest(".kchip, .masukopt");
      if (!select && !bulat) return;
      e.preventDefault();
      if (tahan) return; tahan = true; setTimeout(() => { tahan = false; }, 400);
      const proxy = (select ? (el as HTMLElement).nextElementSibling : (el as HTMLElement).closest("fieldset") ?? (el as HTMLElement).parentElement) as HTMLElement | null;
      if (!proxy) return;
      document.querySelectorAll(".cp-pesan").forEach((x) => x.remove());
      const p = document.createElement("p"); p.className = "err cp-pesan"; p.setAttribute("role", "alert"); p.textContent = `Pilih dulu: ${judul(el as HTMLElement)}.`;
      proxy.insertAdjacentElement("afterend", p);
      proxy.classList.add("cp-salah");
      proxy.scrollIntoView({ block: "center", behavior: "smooth" });
      const bersih = () => { proxy.classList.remove("cp-salah"); p.remove(); };
      setTimeout(bersih, 6000);
      (el as HTMLElement).addEventListener("change", bersih, { once: true });
    };
    document.addEventListener("invalid", saat, true);
    return () => document.removeEventListener("invalid", saat, true);
  }, []);
  return null;
}
