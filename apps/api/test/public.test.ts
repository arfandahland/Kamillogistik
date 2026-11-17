import { describe, expect, it } from "vitest";
import { buildApp } from "../src/app";
import { createSeedRepo } from "../src/seed";
import { maskName } from "../src/publicView";

const app = buildApp(createSeedRepo(), { rateLimitMax: 1000 });

describe("GET /v1/public/track/:resi", () => {
  it("resi DELIVERED: 9 tahap lengkap + e-POD ringkas", async () => {
    const r = await app.inject("/v1/public/track/KLX-2611-000123");
    expect(r.statusCode).toBe(200);
    const j = r.json();
    expect(j.status).toBe("DELIVERED");
    expect(j.history).toHaveLength(9);
    expect(j.upcoming).toHaveLength(0);
    expect(j.progress).toEqual({ done: 9, total: 9 });
    expect(j.pod.receiverName).toBe("Budi S.");
  });

  it("resi dalam pelayaran: sisa tahap tampil sebagai upcoming + ETA", async () => {
    const j = (await app.inject("/v1/public/track/klx-2611-000124")).json(); // huruf kecil dinormalkan
    expect(j.status).toBe("IN_TRANSIT_SEA");
    expect(j.history).toHaveLength(5);
    expect(j.upcoming.map((u: any) => u.status)).toEqual(["ARRIVED_DEST_PORT", "AT_DEST_HUB", "OUT_FOR_DELIVERY", "DELIVERED"]);
    expect(j.eta).toBe("2026-11-21T00:00:00Z");
  });

  it("TIDAK membocorkan data pribadi petugas, GPS, atau keuangan (PRD §3)", async () => {
    const body = (await app.inject("/v1/public/track/KLX-2611-000123")).body;
    for (const forbidden of ["Rahasia Driver", "driverName", "userId", "lat", "lng", "invoiceTotal", "1250000", "photoUrl", "signatureUrl", "demo://"]) {
      expect(body).not.toContain(forbidden);
    }
  });

  it("400 untuk format salah, 404 untuk resi tak dikenal", async () => {
    expect((await app.inject("/v1/public/track/abc")).statusCode).toBe(400);
    expect((await app.inject("/v1/public/track/KLX-2611-999999")).statusCode).toBe(404);
  });
});

describe("POST /v1/public/quote", () => {
  const post = (payload: unknown) => app.inject({ method: "POST", url: "/v1/public/quote", payload: payload as any });

  it("menghitung estimasi memakai mesin tarif (volumetrik > aktual)", async () => {
    const r = await post({ origin: "jkt", dest: "mks", pieces: [{ weightKg: 5, dims: { lCm: 80, wCm: 50, hCm: 50 } }] });
    expect(r.statusCode).toBe(200);
    const j = r.json();
    expect(j.estimate).toBe(true);
    expect(j.volumetricKg).toBe(50);
    expect(j.total).toBe(50 * 2500); // Rp2.500/kg port-to-door
  });

  it("minimum berat Makassar->Jakarta 20 kg berlaku", async () => {
    const j = (await post({ origin: "MKS", dest: "JKT", pieces: [{ weightKg: 5 }] })).json();
    expect(j.chargeable).toBe(20);
    expect(j.total).toBe(50_000);
  });

  it("Makassar->Morowali door-to-door min 30 kg @ Rp2.000", async () => {
    const j = (await post({ origin: "MKS", dest: "MRW", pieces: [{ weightKg: 10 }] })).json();
    expect(j.chargeable).toBe(30);
    expect(j.total).toBe(60_000);
  });

  it("open space per m3: port-to-port 400rb vs port-to-door 500rb", async () => {
    const pieces = [{ weightKg: 100, dims: { lCm: 100, wCm: 100, hCm: 100 } }]; // 1 m3
    const p2p = (await post({ origin: "JKT", dest: "MKS", service: "PORT_TO_PORT", basis: "PER_M3", pieces })).json();
    const p2d = (await post({ origin: "JKT", dest: "MKS", service: "PORT_TO_DOOR", basis: "PER_M3", pieces })).json();
    expect(p2p.total).toBe(400_000);
    expect(p2d.total).toBe(500_000);
  });

  it("404 rute tak tersedia, 400 input salah", async () => {
    expect((await post({ origin: "JKT", dest: "XXX", pieces: [{ weightKg: 1 }] })).statusCode).toBe(404);
    expect((await post({ origin: "JKT", dest: "MKS", pieces: [] })).statusCode).toBe(400);
    expect((await post({ origin: "JKT", dest: "MKS", pieces: [{ weightKg: -5 }] })).statusCode).toBe(400);
  });
});

describe("rate limit", () => {
  it("membatasi permintaan berlebih", async () => {
    const a = buildApp(createSeedRepo(), { rateLimitMax: 3 });
    const codes: number[] = [];
    for (let i = 0; i < 5; i++) codes.push((await a.inject("/v1/public/routes")).statusCode);
    expect(codes).toContain(429);
  });
});

describe("maskName", () => {
  it("menyamarkan nama belakang", () => {
    expect(maskName("Budi Santoso")).toBe("Budi S.");
    expect(maskName("Siti")).toBe("Siti");
  });
});
