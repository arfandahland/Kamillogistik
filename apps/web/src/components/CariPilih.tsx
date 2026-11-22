"use client";
import { useEffect } from "react";

/**
 * Pencarian kata kunci untuk SEMUA pilihan panjang (tujuan, wilayah, pegawai, pelanggan, dst) di seluruh aplikasi.
 * Pilihan asli (<select>) tetap ada dan tetap dikirim bersama form, jadi tidak ada kode form yang perlu diubah.
 * Dipasang sekali di layout: setiap <select> dengan banyak pilihan (atau berpenanda data-cari) mendapat tombol pencari.
 * Matikan untuk satu pilihan dengan data-nocari.
 */
const MAKS_CHIP = 8;
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();

type Item = { i: number; text: string; key: string; group: string; disabled: boolean };

export default function CariPilih() {
  useEffect(() => {
    const aktif = new Map<HTMLSelectElement, { btn: HTMLButtonElement; teks: string }>();
    const chipSinkron = new Map<HTMLSelectElement, () => void>();
    let panel: HTMLDivElement | null = null;
    let tutupPanel: (() => void) | null = null;

    const labelTeks = (sel: HTMLSelectElement) => {
      const o = sel.options[sel.selectedIndex];
      return o && o.value !== "" ? o.text : (sel.querySelector("option[value='']")?.textContent ?? "Pilih…");
    };
    const judul = (sel: HTMLSelectElement) => (sel.id && document.querySelector(`label[for="${CSS.escape(sel.id)}"]`)?.textContent?.trim()) || sel.getAttribute("aria-label") || "Pilih";

    function ambil(sel: HTMLSelectElement): Item[] {
      const out: Item[] = [];
      [...sel.children].forEach((c) => {
        const grp = c instanceof HTMLOptGroupElement ? c.label : "";
        const opts = c instanceof HTMLOptGroupElement ? [...c.children] : [c];
        opts.forEach((o) => { if (o instanceof HTMLOptionElement) out.push({ i: o.index, text: o.text, key: norm(`${o.text} ${grp}`), group: grp, disabled: o.disabled && o.value === "" ? false : o.disabled }); });
      });
      return out;
    }

    function buka(sel: HTMLSelectElement) {
      tutupPanel?.();
      const items = ambil(sel).filter((x) => !(sel.options[x.i]!.value === "" && sel.options[x.i]!.disabled));
      const ov = document.createElement("div"); ov.className = "cp-ov"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-label", judul(sel));
      ov.innerHTML = `<div class="cp-sheet"><div class="cp-head"><b></b><button type="button" class="cp-x" aria-label="Tutup">×</button></div><input class="cp-q" type="search" inputmode="search" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Ketik kata kunci, misalnya nama kota" aria-label="Cari"><div class="cp-n"></div><ul class="cp-list" role="listbox"></ul></div>`;
      (ov.querySelector(".cp-head b") as HTMLElement).textContent = judul(sel);
      const q = ov.querySelector(".cp-q") as HTMLInputElement, ul = ov.querySelector(".cp-list") as HTMLUListElement, n = ov.querySelector(".cp-n") as HTMLElement;
      let hasil: Item[] = items, aktifIdx = Math.max(0, hasil.findIndex((x) => x.i === sel.selectedIndex));
      const pilih = (it: Item) => {
        if (it.disabled) return;
        const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value")!.set!;
        setter.call(sel, sel.options[it.i]!.value);
        sel.dispatchEvent(new Event("input", { bubbles: true })); sel.dispatchEvent(new Event("change", { bubbles: true }));
        tutup(); sinkron(sel);
      };
      const gambar = () => {
        const kata = norm(q.value).split(" ").filter(Boolean);
        hasil = items.filter((x) => kata.every((k) => x.key.includes(k)));
        if (aktifIdx >= hasil.length) aktifIdx = 0;
        n.textContent = kata.length ? (hasil.length ? `${hasil.length} hasil` : "") : `${items.length} pilihan. Ketik untuk mencari.`;
        ul.innerHTML = "";
        if (!hasil.length) { const li = document.createElement("li"); li.className = "cp-kosong"; li.textContent = "Tidak ditemukan. Coba kata kunci lain, misalnya sebagian nama saja."; ul.appendChild(li); return; }
        let g = "";
        hasil.slice(0, 300).forEach((it, k) => {
          if (it.group && it.group !== g) { g = it.group; const h = document.createElement("li"); h.className = "cp-g"; h.textContent = g; ul.appendChild(h); }
          const li = document.createElement("li"); li.setAttribute("role", "option"); li.className = "cp-o" + (k === aktifIdx ? " on" : "") + (it.i === sel.selectedIndex ? " cur" : "") + (it.disabled ? " dis" : "");
          li.textContent = it.text; li.addEventListener("click", () => pilih(it)); ul.appendChild(li);
        });
        ul.querySelector(".on")?.scrollIntoView({ block: "nearest" });
      };
      const tutup = () => { document.removeEventListener("keydown", tombol, true); ov.remove(); document.body.classList.remove("cp-lock"); panel = null; tutupPanel = null; aktif.get(sel)?.btn.focus({ preventScroll: true }); };
      const tombol = (e: KeyboardEvent) => {
        if (e.key === "Escape") { e.preventDefault(); tutup(); }
        else if (e.key === "ArrowDown") { e.preventDefault(); aktifIdx = Math.min(hasil.length - 1, aktifIdx + 1); gambar(); }
        else if (e.key === "ArrowUp") { e.preventDefault(); aktifIdx = Math.max(0, aktifIdx - 1); gambar(); }
        else if (e.key === "Enter" && document.activeElement === q) { e.preventDefault(); if (hasil[aktifIdx]) pilih(hasil[aktifIdx]!); }
      };
      q.addEventListener("input", () => { aktifIdx = 0; gambar(); });
      ov.addEventListener("click", (e) => { if (e.target === ov) tutup(); });
      (ov.querySelector(".cp-x") as HTMLElement).addEventListener("click", tutup);
      document.addEventListener("keydown", tombol, true);
      document.body.appendChild(ov); document.body.classList.add("cp-lock"); panel = ov; tutupPanel = tutup;
      gambar(); q.focus({ preventScroll: true });
    }

    function sinkron(sel: HTMLSelectElement) {
      const a = aktif.get(sel); if (!a) return;
      const cs = chipSinkron.get(sel); if (cs) { cs(); return; }
      const t = labelTeks(sel); if (t !== a.teks) { a.teks = t; a.btn.querySelector("span")!.textContent = t; }
      const kosong = sel.value === ""; a.btn.classList.toggle("kosong", kosong); a.btn.disabled = sel.disabled;
      a.btn.setAttribute("aria-invalid", sel.required && kosong ? "false" : "false");
    }

    function pasangChip(sel: HTMLSelectElement) {
      const grup = document.createElement("div"); grup.className = "cp-chips"; grup.setAttribute("role", "radiogroup");
      grup.setAttribute("aria-label", judul(sel));
      const tombol: HTMLButtonElement[] = [];
      [...sel.options].forEach((o, i) => {
        if (o.value === "") return;
        const b = document.createElement("button"); b.type = "button"; b.className = "cp-chip"; b.textContent = o.text; b.setAttribute("role", "radio");
        b.addEventListener("click", () => {
          const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value")!.set!;
          setter.call(sel, o.value); sel.dispatchEvent(new Event("input", { bubbles: true })); sel.dispatchEvent(new Event("change", { bubbles: true })); sinkronChip();
        });
        (b as HTMLButtonElement & { _i?: number })._i = i; tombol.push(b); grup.appendChild(b);
      });
      const sinkronChip = () => tombol.forEach((b) => { const on = sel.selectedIndex === (b as HTMLButtonElement & { _i?: number })._i && sel.value !== ""; b.classList.toggle("on", on); b.setAttribute("aria-checked", on ? "true" : "false"); b.disabled = sel.disabled || sel.options[(b as HTMLButtonElement & { _i?: number })._i ?? 0]?.disabled === true; });
      sel.classList.add("cp-src"); sel.tabIndex = -1; sel.setAttribute("aria-hidden", "true");
      sel.insertAdjacentElement("afterend", grup);
      const btn = grup as unknown as HTMLButtonElement;
      aktif.set(sel, { btn, teks: "" });
      sinkronChip(); sel.addEventListener("change", sinkronChip);
      chipSinkron.set(sel, sinkronChip);
    }

    function pasang(sel: HTMLSelectElement) {
      if (aktif.has(sel) || sel.multiple || sel.hasAttribute("data-nocari") || sel.closest("[data-nocari]")) return;
      const nyata = [...sel.options].filter((o) => o.value !== "").length;
      if (nyata < 2 && !sel.hasAttribute("data-cari")) return;
      if (nyata <= MAKS_CHIP && !sel.hasAttribute("data-cari")) { pasangChip(sel); return; }
      const btn = document.createElement("button"); btn.type = "button"; btn.className = "cp-btn"; btn.innerHTML = "<span></span><i aria-hidden='true'></i>";
      const lbl = judul(sel); btn.setAttribute("aria-label", `${lbl}. Ketuk untuk mencari`); btn.setAttribute("aria-haspopup", "dialog");
      btn.addEventListener("click", () => buka(sel));
      sel.classList.add("cp-src"); sel.tabIndex = -1; sel.setAttribute("aria-hidden", "true");
      sel.insertAdjacentElement("afterend", btn);
      aktif.set(sel, { btn, teks: "\u0000" }); sinkron(sel);
      sel.addEventListener("change", () => sinkron(sel));
      sel.addEventListener("focus", () => { if (!panel && document.activeElement === sel) buka(sel); });
    }

    function pindai() {
      document.querySelectorAll("select").forEach((s) => pasang(s as HTMLSelectElement));
      aktif.forEach((a, sel) => { if (!sel.isConnected) { a.btn.remove(); aktif.delete(sel); } else sinkron(sel); });
    }
    // Mulai setelah halaman selesai dimuat dan di-hidrasi, supaya tidak mengganggu React (galat 418).
    let mo: MutationObserver | null = null; let t = 0; let mulai = 0; let batal = false;
    const jalan = () => {
      if (batal) return;
      pindai();
      mo = new MutationObserver(() => pindai());
      mo.observe(document.body, { childList: true, subtree: true });
      t = window.setInterval(() => aktif.forEach((_, sel) => sinkron(sel)), 500);
    };
    const tunda = () => { mulai = window.setTimeout(jalan, 1200); };
    if (document.readyState === "complete") tunda(); else window.addEventListener("load", tunda, { once: true });
    const klikLabel = (e: MouseEvent) => {
      const l = (e.target as HTMLElement).closest?.("label[for]") as HTMLLabelElement | null; if (!l) return;
      const sel = document.getElementById(l.htmlFor); if (sel instanceof HTMLSelectElement && aktif.has(sel)) { e.preventDefault(); buka(sel); }
    };
    document.addEventListener("click", klikLabel);
    return () => { batal = true; window.clearTimeout(mulai); window.removeEventListener("load", tunda); mo?.disconnect(); window.clearInterval(t); document.removeEventListener("click", klikLabel); tutupPanel?.(); aktif.forEach((a, sel) => { a.btn.remove(); sel.classList.remove("cp-src"); }); };
  }, []);
  return null;
}
