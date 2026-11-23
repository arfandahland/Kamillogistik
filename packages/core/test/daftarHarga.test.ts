import { describe, expect, it } from "vitest";
import { createSeedRepo } from "../src/service/seed";
import { handleQuote } from "../src/service/handlers";
import { DAFTAR_HARGA, cariHarga, cariHargaBalik, kodeHarga } from "../src/service/daftarHarga";

describe("daftar harga sementara (hanya cek ongkir)", () => {
  it("88 baris dan kode tujuan unik", () => {
    expect(DAFTAR_HARGA).toHaveLength(88);
    expect(new Set(DAFTAR_HARGA.map((h) => `${h.asal}|${kodeHarga(h)}`)).size).toBe(88);
    expect(DAFTAR_HARGA.every((h) => h.rate > 0 && (h.minKg === 50 || h.minKg === 100) && /^\d+-\d+$/.test(h.eta))).toBe(true);
  });
  it("Jakarta ke Maros: Rp3.000 per kg, minimal 50 kg", async () => {
    const h = DAFTAR_HARGA.find((x) => x.asal === "JKT" && x.kota === "Maros")!;
    const r = await handleQuote(createSeedRepo(), { origin: "JKT", dest: kodeHarga(h), pieces: [{ weightKg: 20 }] });
    expect(r.status).toBe(200);
    const b = r.body as any;
    expect(b.total).toBe(150_000);          // 20 kg dinaikkan ke 50 kg x 3.000
    expect(b.etaText).toBe("4 sampai 6 hari");
    expect(b.catatan.length).toBeGreaterThan(3);
  });
  it("berat di atas minimal mengikuti berat asli tanpa pembulatan", async () => {
    const h = DAFTAR_HARGA.find((x) => x.asal === "JKT" && x.kota === "Palu")!;
    const b = (await handleQuote(createSeedRepo(), { origin: "JKT", dest: kodeHarga(h), pieces: [{ weightKg: 51 }] })).body as any;
    expect(b.total).toBe(255_000);
  });
  it("minimal 100 kg untuk Selayar dan Makassar ke Papua memakai asal Makassar", async () => {
    const s = DAFTAR_HARGA.find((x) => x.kota === "Selayar")!;
    expect(((await handleQuote(createSeedRepo(), { origin: "JKT", dest: kodeHarga(s), pieces: [{ weightKg: 60 }] })).body as any).total).toBe(700_000);
    const j = DAFTAR_HARGA.find((x) => x.kota === "Jayapura")!;
    expect(cariHarga("MKS", kodeHarga(j))?.rate).toBe(7000);
    expect(cariHarga("JKT", kodeHarga(j))).toBeUndefined();   // asal harus cocok
  });
  it("arah sebaliknya: Palu ke Jakarta dan Jayapura ke Makassar memakai tarif yang sama dengan catatan konfirmasi", async () => {
    const palu = DAFTAR_HARGA.find((x) => x.asal === "JKT" && x.kota === "Palu")!;
    const r = await handleQuote(createSeedRepo(), { origin: kodeHarga(palu), dest: "JKT", pieces: [{ weightKg: 60 }] });
    const b = r.body as any;
    expect(r.status).toBe(200);
    expect(b.total).toBe(300_000);
    expect(b.route).toEqual({ origin: "Palu", dest: "Jakarta" });
    expect(b.catatan[0]).toMatch(/arah sebaliknya/i);
    const jay = DAFTAR_HARGA.find((x) => x.kota === "Jayapura")!;
    expect(((await handleQuote(createSeedRepo(), { origin: kodeHarga(jay), dest: "MKS", pieces: [{ weightKg: 10 }] })).body as any).total).toBe(350_000);
    expect(cariHargaBalik(kodeHarga(jay), "JKT")).toBeUndefined();   // tujuan harus asal yang cocok
  });
});
