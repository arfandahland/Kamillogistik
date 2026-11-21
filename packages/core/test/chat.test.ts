import { describe, expect, it } from "vitest";
import { createSeedRepo, jawab, toPublicTrack, type ChatCtx, type ChatDeps } from "../src";

const repo = createSeedRepo();
const deps: ChatDeps = {
  routes: () => repo.listRoutes(),
  track: async (r) => { const s = await repo.findShipmentByResi(r); return s ? toPublicTrack(s) : null; },
  waLink: (t) => `https://wa.me/6285342238748?text=${encodeURIComponent(t)}`,
};
const tanya = (m: string, c?: ChatCtx) => jawab(deps, m, c);

describe("asisten tanya-jawab", () => {
  it("menghitung ongkir dari kalimat biasa (dan sama dengan kalkulator)", async () => {
    const r = await tanya("ongkir jakarta ke makassar 25 kg");
    expect(r.text).toContain("Rp62.500");            // 25 kg x Rp2.500
    expect(r.text).toMatch(/Jakarta → Makassar/);
    expect(r.actions?.[0]?.href).toBe("/ongkir?dari=JKT&ke=MKS");
  });
  it("menghormati minimal kirim (Makassar → Jakarta minimal 20 kg)", async () => {
    const r = await tanya("berapa harga makassar ke jakarta 10 kg");
    expect(r.text).toContain("Rp50.000");            // dibulatkan ke minimal 20 kg x 2.500
  });
  it("memakai ukuran bila barang besar (80x50x50 cm, 5 kg → 50 kg)", async () => {
    const r = await tanya("tarif jakarta ke makassar 80x50x50 cm berat 5 kg");
    expect(r.text).toContain("Rp125.000");
    expect(r.text).toMatch(/dihitung dari ukuran/);
  });
  it("menanyakan data yang kurang lalu melengkapi dari jawaban berikutnya", async () => {
    const a = await tanya("mau tanya ongkir");
    expect(a.ctx?.intent).toBe("ongkir");
    const b = await tanya("dari jakarta ke makassar", a.ctx);
    expect(b.text).toMatch(/Berapa kg/);
    const c = await tanya("25", b.ctx);
    expect(c.text).toContain("Rp62.500");
  });
  it("mengenali singkatan kota (JKT, MKS) dan urutan asal-tujuan", async () => {
    const r = await tanya("jkt ke mks 40kg");
    expect(r.text).toContain("Rp100.000");
  });
  it("rute yang tidak ada dijawab jujur dan diarahkan ke tim", async () => {
    const r = await tanya("ongkir jakarta ke morowali 10 kg");
    expect(r.text).toMatch(/belum tersedia/);
    expect(r.actions?.[0]?.href).toContain("wa.me");
  });
  it("melacak resi yang ada di dalam kalimat", async () => {
    const kode = (await repo.listRoutes(), "KLX-JKT-MKS-LJ-261114-1015-0002-" + "");
    const demo = await (async () => { for (const r of ["KLX-JKT-MKS-LJ-261112-0830-0001"]) return r; })();
    void kode; void demo;
    const dikenal = (await import("../src")).formatResi({ origin: "JKT", dest: "MKS", moda: "LAUT", masuk: "PICKUP", at: new Date(Date.UTC(2026, 10, 12, 0, 30)), seq: 1 });
    const r = await tanya(`tolong cek resi ${dikenal.toLowerCase()} dong`);
    expect(r.text).toMatch(/Status:/);
    expect(r.actions?.[0]?.href).toContain("/lacak/");
  });
  it("resi dengan salah ketik ditolak dengan penjelasan", async () => {
    const r = await tanya("cek KML-JKT-MKS-LJ-261112-0830-0001-AA");
    expect(r.text).toMatch(/tidak valid|belum ditemukan/);
  });
  it("menjawab topik bisnis singkat: jemput, bayar, volumetrik, larangan, mitra, korporat", async () => {
    expect((await tanya("bisa dijemput nggak?")).text).toMatch(/Dijemput.*Diantar sendiri/s);
    expect((await tanya("bayarnya gimana")).text).toMatch(/transfer/);
    expect((await tanya("cara hitung volumetrik")).text).toMatch(/÷ 4000/);
    expect((await tanya("barang apa yang tidak boleh dikirim")).text).toMatch(/Tidak boleh/);
    expect((await tanya("saya mau jadi mitra")).actions?.[0]?.href).toContain("wa.me");
    expect((await tanya("kami perusahaan, ada tempo bayar?")).text).toMatch(/tempo/i);
  });
  it("pertanyaan di luar bisnis: jawaban sopan + serahkan ke tim, tanpa mengarang", async () => {
    const r = await tanya("siapa presiden indonesia sekarang");
    expect(r.text).toMatch(/belum paham/);
    expect(r.actions?.[0]?.href).toContain("wa.me");
  });
  it("tidak pernah mengembalikan HTML mentah dari masukan pengguna", async () => {
    const r = await tanya("<script>alert(1)</script> ongkir");
    expect(r.text).not.toMatch(/<script/i);
  });
});

describe("kota dengan nama mirip", () => {
  const mk = async (oc: string, oy: string, dc: string, dy: string, price: number) => {
    const base = (await repo.listRoutes()).find((r) => r.basis === "PER_KG")!;
    return { ...base, origin: { ...base.origin, code: oc, city: oy, name: oy }, dest: { ...base.dest, code: dc, city: dy, name: dy }, unitPrice: price, minChargeable: 50, minTotal: undefined, slug: `${oc}-${dc}`.toLowerCase() };
  };
  const mkDeps = async (): Promise<ChatDeps> => { const rs = [await mk("JKT", "Jakarta", "BNE", "Bone", 4500), await mk("JKT", "Jakarta", "BNB", "Bone Bolango", 7500), await mk("JKT", "Jakarta", "MDO", "Manado", 6000)]; return { ...deps, routes: async () => rs }; };
  it("'Bone Bolango' tidak salah dikira 'Bone' dan menjawab harga yang benar", async () => {
    const r = await jawab(await mkDeps(), "ongkir dari Jakarta ke Bone Bolango 60 kg");
    expect(r.text).toContain("Bone Bolango"); expect(r.text).toContain("450.000"); // 60 kg x 7.500
  });
  it("'Bone' saja tetap Bone", async () => {
    const r = await jawab(await mkDeps(), "ongkir jakarta ke bone 60 kg");
    expect(r.text).toContain("Bone"); expect(r.text).not.toContain("Bolango"); expect(r.text).toContain("270.000"); // 60 x 4.500
  });
  it("kata biasa tidak dikira kode kota", async () => {
    const r = await jawab(await mkDeps(), "bau barang saya apa boleh dikirim");
    expect(r.text).not.toContain("Rp");
  });
});
