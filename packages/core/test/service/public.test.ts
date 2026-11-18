import { describe, expect, it } from "vitest";
import { handleQuote, handleRoutes, handleTrack } from "../../src/service/handlers";
import { createSeedRepo } from "../../src/service/seed";
import { maskName } from "../../src/service/publicView";

const repo = createSeedRepo();
const quote = (o: unknown) => handleQuote(repo, o);

describe("handleTrack", () => {
  it("resi sudah sampai: 9 tahap lengkap + bukti terima ringkas", async () => {
    const r = await handleTrack(repo, "KLX-JKT-MKS-LJ-261112-0830-0001-RH");
    const j = r.body as any;
    expect(r.status).toBe(200);
    expect(j.status).toBe("DELIVERED");
    expect(j.history).toHaveLength(9);
    expect(j.upcoming).toHaveLength(0);
    expect(j.pod.receiverName).toBe("Budi S.");
  });
  it("resi dalam pelayaran: sisa tahap + perkiraan tiba (huruf kecil dinormalkan)", async () => {
    const j = (await handleTrack(repo, "klx-jkt-mks-lj-261114-1015-0002-ny")).body as any;
    expect(j.history).toHaveLength(5);
    expect(j.upcoming.map((u: any) => u.status)).toEqual(["ARRIVED_DEST_PORT", "AT_DEST_HUB", "OUT_FOR_DELIVERY", "DELIVERED"]);
    expect(j.eta).toBe("2026-11-21T00:00:00Z");
  });
  it("TIDAK membocorkan data pribadi petugas, GPS, atau keuangan (PRD §3)", async () => {
    const body = JSON.stringify((await handleTrack(repo, "KLX-JKT-MKS-LJ-261112-0830-0001-RH")).body);
    for (const bad of ["Rahasia Driver", "driverName", "userId", "lat", "lng", "invoiceTotal", "1250000", "photoUrl", "signatureUrl", "demo://"])
      expect(body).not.toContain(bad);
  });
  it("pesan galat berbahasa awam", async () => {
    const a = await handleTrack(repo, "abc");
    const b = await handleTrack(repo, "KLX-JKT-MKS-LJ-261118-1400-0998-ST");
    expect(a.status).toBe(400);
    expect(b.status).toBe(404);
    expect(JSON.stringify([a.body, b.body])).toMatch(/Nomor resi/);
  });
});

describe("handleQuote", () => {
  it("ukuran besar → dihitung setara berat lebih besar, dengan penjelasan", async () => {
    const r = await quote({ origin: "jkt", dest: "mks", pieces: [{ weightKg: 5, dims: { lCm: 80, wCm: 50, hCm: 50 } }] });
    const j = r.body as any;
    expect(r.status).toBe(200);
    expect(j.total).toBe(50 * 2500);
    expect(j.explain.join(" ")).toMatch(/setara 50 kg/);
  });
  it("minimal kirim Makassar→Jakarta 20 kg", async () => {
    const j = (await quote({ origin: "MKS", dest: "JKT", pieces: [{ weightKg: 5 }] })).body as any;
    expect(j.chargeable).toBe(20);
    expect(j.total).toBe(50_000);
    expect(j.explain.join(" ")).toMatch(/minimal 20 kg/);
  });
  it("Makassar→Morowali minimal 30 kg @ Rp2.000", async () => {
    const j = (await quote({ origin: "MKS", dest: "MRW", pieces: [{ weightKg: 10 }] })).body as any;
    expect(j.total).toBe(60_000);
  });
  it("open space per m³: 400rb vs 500rb", async () => {
    const pieces = [{ weightKg: 100, dims: { lCm: 100, wCm: 100, hCm: 100 } }];
    const a = (await quote({ origin: "JKT", dest: "MKS", service: "PORT_TO_PORT", basis: "PER_M3", pieces })).body as any;
    const b = (await quote({ origin: "JKT", dest: "MKS", service: "PORT_TO_DOOR", basis: "PER_M3", pieces })).body as any;
    expect(a.total).toBe(400_000);
    expect(b.total).toBe(500_000);
  });
  it("rute tak ada / input salah → pesan ramah", async () => {
    expect((await quote({ origin: "JKT", dest: "XXX", pieces: [{ weightKg: 1 }] })).status).toBe(404);
    expect((await quote({ origin: "JKT", dest: "MKS", pieces: [] })).status).toBe(400);
    expect((await quote({ origin: "JKT", dest: "MKS", pieces: [{ weightKg: -5 }] })).status).toBe(400);
  });
});

describe("lainnya", () => {
  it("daftar rute memuat label awam", async () => {
    const r = (await handleRoutes(repo)).body as any[];
    expect(r.length).toBeGreaterThan(3);
    expect(r[0].serviceTitle).toBeTruthy();
  });
  it("maskName", () => {
    expect(maskName("Budi Santoso")).toBe("Budi S.");
  });
});
