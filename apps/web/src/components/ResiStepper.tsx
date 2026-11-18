"use client";
import { useEffect, useRef } from "react";
import { stagesFor, statusLabel, type AnyStatus } from "@kamil/core";
import Icon from "./Icon";

const SHORT: Record<string, string> = {
  CREATED: "Order", PICKED_UP: "Dijemput", AT_ORIGIN_HUB: "Gudang", SORTED_INVOICED: "Ditimbang", LOADED: "Dimuat",
  IN_TRANSIT_SEA: "Berlayar", ARRIVED_DEST_PORT: "Sandar", AT_DEST_HUB: "Gudang tujuan", OUT_FOR_DELIVERY: "Diantar", DELIVERED: "Diterima",
};
const SHORT_MODA = { UDARA: { IN_TRANSIT_SEA: "Terbang", ARRIVED_DEST_PORT: "Mendarat" }, DARAT: { IN_TRANSIT_SEA: "Jalan", ARRIVED_DEST_PORT: "Tiba" }, LAUT: {} } as const;
const ICON: Record<string, string> = {
  CREATED: "plus", PICKED_UP: "truck", AT_ORIGIN_HUB: "home", SORTED_INVOICED: "scale", LOADED: "box",
  IN_TRANSIT_SEA: "ship", ARRIVED_DEST_PORT: "pin", AT_DEST_HUB: "home", OUT_FOR_DELIVERY: "truck", DELIVERED: "check",
};

/** Penanda tahap: kapan pun terlihat barang sudah sampai tahap berapa dan sisa berapa lagi. */
export default function ResiStepper({ status, masuk = "PICKUP", mode = "LAUT" }: { status: AnyStatus; masuk?: "PICKUP" | "DROPOFF"; mode?: "LAUT" | "DARAT" | "UDARA" }) {
  const stages = stagesFor(masuk);
  const cur = (stages as readonly string[]).indexOf(status);
  const total = stages.length;
  const cancelled = status === "CANCELLED" || status === "EXCEPTION";
  const track = useRef<HTMLDivElement>(null);

  // Geser otomatis agar tahap aktif selalu terlihat (hanya di dalam penanda, halaman tidak ikut bergulir).
  useEffect(() => {
    const el = track.current?.querySelector<HTMLElement>(".sstep.now");
    if (el && track.current) track.current.scrollTo({ left: el.offsetLeft - track.current.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
  }, [status]);

  return (
    <div className="stepper" aria-label={`Tahap ${cur + 1} dari ${total}`}>
      <div className="strack" role="list" ref={track}>
        {stages.map((s, i) => {
          const st = cancelled ? "todo" : i < cur ? "done" : i === cur ? "now" : "todo";
          return (
            <div key={s} role="listitem" className={`sstep ${st}`} style={{ ["--i" as string]: i }}>
              <span className="snode"><Icon name={st === "done" ? "check" : ICON[s]!} size={16} /></span>
              <small>{(SHORT_MODA[mode] as Record<string, string>)[s] ?? SHORT[s]}</small>
            </div>
          );
        })}
      </div>
      <p className="scap">{cancelled ? statusLabel(status, mode) : <>Tahap <b>{cur + 1}</b> dari {total}: <b>{statusLabel(status, mode)}</b>{cur < total - 1 ? ` · sisa ${total - 1 - cur} tahap lagi` : " · selesai"}</>}</p>
    </div>
  );
}
