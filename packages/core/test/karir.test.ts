import { describe, expect, it } from "vitest";
import { POSISI, posisiDari, pesanKeHrd, pesanKePelamar, waHrdLink, HRD_WA } from "../src";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("karir", () => {
  it("ada 12 posisi dengan slug unik", () => {
    expect(POSISI).toHaveLength(12);
    expect(new Set(POSISI.map((p) => p.slug)).size).toBe(12);
  });
  it("slug sama dengan daftar di migrasi database", () => {
    const sql = readFileSync(resolve(__dirname, "../../../db/migrations/019_lamaran.sql"), "utf8");
    for (const p of POSISI) expect(sql).toContain(`'${p.slug}'`);
  });
  it("hanya driver yang butuh SIM", () => {
    expect(POSISI.filter((p) => p.butuhSim).map((p) => p.slug)).toEqual(["driver-sim-a", "driver-sim-b"]);
    expect(posisiDari("nope")).toBeUndefined();
  });
  it("tautan WhatsApp ke HRD memakai nomor HRD dan teks terkodekan", () => {
    const u = waHrdLink(pesanKeHrd(" Budi Santoso ", "Admin Sales", "KRR-261119-AB12"));
    expect(u.startsWith(`https://wa.me/${HRD_WA}?text=`)).toBe(true);
    expect(decodeURIComponent(u)).toContain("saya Budi Santoso baru mengirim lamaran untuk posisi Admin Sales");
    expect(pesanKePelamar("Budi Santoso", "Admin Sales", "KRR-1")).toMatch(/^Halo Budi,/);
  });
});
