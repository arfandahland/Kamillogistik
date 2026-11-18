import { describe, expect, it } from "vitest";
import { nextAction, STATUS_LABEL, ROLE_LABEL } from "../src";

describe("tombol langkah berikutnya", () => {
  it("kurir menjemput order baru", () => {
    const a = nextAction("DRIVER", "CREATED");
    expect(a).toMatchObject({ kind: "advance", to: "PICKED_UP", label: "Barang sudah saya jemput" });
  });
  it("petugas gudang: terima → timbang", () => {
    expect(nextAction("WAREHOUSE", "PICKED_UP")).toMatchObject({ kind: "advance", to: "AT_ORIGIN_HUB" });
    expect(nextAction("WAREHOUSE", "AT_ORIGIN_HUB")).toEqual({ kind: "measure" });
  });
  it("kurir antar → bukti terima", () => {
    expect(nextAction("DRIVER", "AT_DEST_HUB")).toMatchObject({ to: "OUT_FOR_DELIVERY" });
    expect(nextAction("DRIVER", "OUT_FOR_DELIVERY")).toEqual({ kind: "pod" });
  });
  it("bukan giliran peran ini → tidak ada tombol", () => {
    expect(nextAction("MITRA_POS", "CREATED")).toBeNull();
    expect(nextAction("DRIVER", "PICKED_UP")).toBeNull();
    expect(nextAction("WAREHOUSE", "DELIVERED")).toBeNull();
    expect(nextAction("DRIVER", "CANCELLED")).toBeNull();
  });
  it("semua teks awam, tanpa istilah teknis", () => {
    const all = Object.values(STATUS_LABEL).concat(Object.values(ROLE_LABEL)).join(" ");
    expect(all).not.toMatch(/hub|manifest|invoice|scan|handover|POD|API/i);
  });
});
