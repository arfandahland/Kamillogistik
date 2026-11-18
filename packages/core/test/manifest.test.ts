import { describe, expect, it } from "vitest";
import { isManifestCode, nextAction, parseManifest, resiCheck } from "../src";

function buat(body: string) { return `${body}-${resiCheck(body)}`; }

describe("kode manifest", () => {
  it("mengurai kode manifest yang valid", () => {
    const k = buat("MNF-MKS-JKT-L-261118-1432-01");
    expect(parseManifest(k)).toMatchObject({ kode: k, origin: "MKS", dest: "JKT", moda: "LAUT", seq: 1 });
    expect(parseManifest(k.toLowerCase().replace(/-/g, " "))?.kode).toBe(k);
  });
  it("menolak salah ketik dan kode resi biasa", () => {
    const k = buat("MNF-MKS-JKT-U-261118-1432-02");
    expect(parseManifest(k.replace("-02-", "-03-"))).toBeNull();
    expect(parseManifest("KLX-MKS-JKT-LJ-261118-1432-0007-P")).toBeNull();
    expect(isManifestCode(k)).toBe(true);
    expect(isManifestCode("KLX-MKS-JKT-LJ-261118-1432-0007-P")).toBe(false);
  });
  it("langkah muat sampai bongkar mengarah ke manifest, bukan tombol per resi", () => {
    expect(nextAction("WAREHOUSE", "SORTED_INVOICED")).toMatchObject({ kind: "manifest" });
    expect(nextAction("CONTAINER_DRIVER", "LOADED")).toMatchObject({ kind: "manifest" });
    expect(nextAction("CONTAINER_DRIVER", "IN_TRANSIT_SEA")).toMatchObject({ kind: "manifest" });
    expect(nextAction("WAREHOUSE", "ARRIVED_DEST_PORT")).toMatchObject({ kind: "manifest" });
    expect(nextAction("DRIVER", "AT_DEST_HUB")).toMatchObject({ kind: "advance", to: "OUT_FOR_DELIVERY" });
  });
});
