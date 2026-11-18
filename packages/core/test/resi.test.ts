import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { explainResi, formatResi, isValidResi, normalizeResi, parseResi, resiCheck, splitItem, witaParts } from "../src";

const CASES: { body: string; check: string }[] = JSON.parse(readFileSync(new URL("../../../db/test/resi-cases.json", import.meta.url), "utf8"));

describe("kode resi yang bisa dibaca", () => {
  it("huruf pemeriksa sama dengan daftar kasus bersama (dipakai juga oleh SQL)", () => {
    for (const c of CASES) expect(resiCheck(c.body), c.body).toBe(c.check);
  });
  it("membuat kode: asal, tujuan, moda, cara masuk, tanggal, jam WITA, urutan", () => {
    // 06.32 UTC = 14.32 WITA
    const r = formatResi({ origin: "MKS", dest: "JKT", moda: "LAUT", masuk: "PICKUP", at: new Date(Date.UTC(2026, 10, 18, 6, 32)), seq: 7 });
    expect(r.startsWith("KLX-MKS-JKT-LJ-261118-1432-0007-")).toBe(true);
    expect(isValidResi(r)).toBe(true);
  });
  it("zona waktu WITA: lewat tengah malam UTC jadi hari berikutnya", () => {
    expect(witaParts(new Date(Date.UTC(2026, 10, 18, 17, 0)))).toMatchObject({ dd: "19", hh: "01", mi: "00" });
  });
  it("mengurai kode dan menjelaskan artinya", () => {
    const r = formatResi({ origin: "JKT", dest: "MKS", moda: "UDARA", masuk: "DROPOFF", at: new Date(Date.UTC(2026, 10, 18, 1, 5)), seq: 123 });
    const p = parseResi(r)!;
    expect(p).toMatchObject({ origin: "JKT", dest: "MKS", moda: "UDARA", masuk: "DROPOFF", seq: 123, item: null, jam: { hh: 9, mi: 5 }, tanggal: { yy: 26, mm: 11, dd: 18 } });
    const arti = explainResi(p, (c) => ({ JKT: "Jakarta", MKS: "Makassar" } as Record<string, string>)[c] ?? c);
    expect(arti.map((a) => a.arti)).toEqual(expect.arrayContaining(["Asal: Jakarta", "Tujuan: Makassar", "Udara · Diantar sendiri ke gudang", "Jam 09.05 WITA", "Urutan ke-123 hari itu"]));
  });
  it("salah ketik satu karakter ketahuan", () => {
    const r = formatResi({ origin: "MKS", dest: "JKT", moda: "LAUT", masuk: "PICKUP", at: new Date(Date.UTC(2026, 10, 18, 6, 32)), seq: 7 });
    const salah = r.replace("0007", "0008");
    expect(isValidResi(salah)).toBe(false);
    expect(isValidResi("abc")).toBe(false);
    expect(isValidResi("KLX-2611-000123")).toBe(false); // format lama tidak dipakai lagi
  });
  it("kode barang (…-01) diurai terpisah dari kode resi", () => {
    const r = formatResi({ origin: "MKS", dest: "JKT", moda: "LAUT", masuk: "PICKUP", at: new Date(Date.UTC(2026, 10, 18, 6, 32)), seq: 7 });
    expect(splitItem(`${r}-02`)).toEqual({ resi: r, item: 2 });
    expect(splitItem(r)).toEqual({ resi: r, item: null });
  });
  it("merapikan ketikan: huruf kecil, spasi, titik, dan tanpa tanda hubung", () => {
    const r = formatResi({ origin: "MKS", dest: "JKT", moda: "LAUT", masuk: "PICKUP", at: new Date(Date.UTC(2026, 10, 18, 6, 32)), seq: 7 });
    expect(normalizeResi(r.toLowerCase())).toBe(r);
    expect(normalizeResi(r.replace(/-/g, " "))).toBe(r);
    expect(normalizeResi(r.replace(/-/g, ""))).toBe(r);
    expect(normalizeResi(`  ${r.replace(/-/g, ".")}  `)).toBe(r);
    expect(isValidResi(r.replace(/-/g, ""))).toBe(true);
  });
  it("urutan di atas 9999 tetap valid (5 digit)", () => {
    const r = formatResi({ origin: "JKT", dest: "MKS", moda: "LAUT", masuk: "DROPOFF", at: new Date(Date.UTC(2026, 11, 31, 4, 0)), seq: 10000 });
    expect(r).toContain("-10000-");
    expect(isValidResi(r)).toBe(true);
  });
});

describe("huruf pemeriksa menangkap SEMUA salah ketik satu karakter", () => {
  it("ganti satu karakter di mana pun dengan karakter lain (0-9, A-Z): selalu ketahuan", () => {
    const bodies = ["KLX-MKS-JKT-LJ-261118-1432-0007", "KLX-JKT-MKS-UA-270101-0905-10000", "MNF-SUB-MRW-D-261231-2359-12"];
    const set = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (const body of bodies) {
      const asli = resiCheck(body);
      for (let i = 0; i < body.length; i++) {
        if (body[i] === "-") continue;
        for (const ch of set) {
          if (ch === body[i]) continue;
          const salah = body.slice(0, i) + ch + body.slice(i + 1);
          expect(resiCheck(salah), `${body} posisi ${i} -> ${ch}`).not.toBe(asli);
        }
      }
    }
  });
});
