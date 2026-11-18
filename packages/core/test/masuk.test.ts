import { describe, expect, it } from "vitest";
import { nextAction, nextStatus, stagesFor, validateTransition } from "../src";

describe("dua cara barang masuk", () => {
  it("dijemput: Order baru → Sudah dijemput → Di gudang asal", () => {
    expect(nextStatus("CREATED")).toBe("PICKED_UP");
    expect(nextStatus("PICKED_UP")).toBe("AT_ORIGIN_HUB");
    expect(stagesFor("PICKUP")).toHaveLength(10);
  });
  it("diantar sendiri: langsung ke gudang asal, tanpa tahap dijemput", () => {
    expect(nextStatus("CREATED", "DROPOFF")).toBe("AT_ORIGIN_HUB");
    const s = stagesFor("DROPOFF");
    expect(s).toHaveLength(9);
    expect(s).not.toContain("PICKED_UP");
  });
  it("tombol langkah: gudang menerima barang antaran pelanggan, kurir tidak punya tugas", () => {
    expect(nextAction("WAREHOUSE", "CREATED", "DROPOFF")).toMatchObject({ kind: "advance", to: "AT_ORIGIN_HUB" });
    expect(nextAction("DRIVER", "CREATED", "DROPOFF")).toBeNull();
    expect(nextAction("DRIVER", "CREATED", "PICKUP")).toMatchObject({ to: "PICKED_UP" });
  });
  it("validasi: barang antaran sendiri tidak boleh dicatat 'dijemput'", () => {
    expect(validateTransition("CREATED", "PICKED_UP", "DRIVER", { masuk: "DROPOFF" }).ok).toBe(false);
    expect(validateTransition("CREATED", "AT_ORIGIN_HUB", "WAREHOUSE", { masuk: "DROPOFF" }).ok).toBe(true);
  });
});

import { toPublicTrack } from "../src";
describe("tampilan publik mengikuti moda dan cara masuk", () => {
  const base = { resiNo: "X", origin: { code: "JKT", name: "G", city: "Jakarta" }, dest: { code: "MKS", name: "G", city: "Makassar" } };
  it("diantar sendiri + udara: tanpa tahap dijemput, kata-katanya pesawat", () => {
    const t = toPublicTrack({ ...base, status: "IN_TRANSIT_SEA", mode: "UDARA", pickupType: "DROPOFF",
      events: [{ status: "AT_ORIGIN_HUB", at: "2026-11-18T01:00:00Z", location: "G" }, { status: "IN_TRANSIT_SEA", at: "2026-11-18T05:00:00Z", location: "G" }] } as any);
    expect(t.progress.total).toBe(8); // 9 tahap tanpa 'dijemput', tanpa 'CREATED'
    expect(t.upcoming.map((u) => u.status)).not.toContain("PICKED_UP");
    expect(t.statusLabel).toBe("Dalam penerbangan");
    expect(t.upcoming.find((u) => u.status === "ARRIVED_DEST_PORT")?.title).toBe("Tiba di bandara tujuan");
    expect(t.pickupType).toBe("DROPOFF");
  });
  it("laut + dijemput tetap seperti semula", () => {
    const t = toPublicTrack({ ...base, status: "PICKED_UP", events: [{ status: "PICKED_UP", at: "2026-11-18T01:00:00Z", location: "G" }] } as any);
    expect(t.progress.total).toBe(9);
    expect(t.statusLabel).toBe("Barang dijemput");
    expect(t.upcoming.find((u) => u.status === "IN_TRANSIT_SEA")?.title).toBe("Dalam pelayaran");
  });
});
