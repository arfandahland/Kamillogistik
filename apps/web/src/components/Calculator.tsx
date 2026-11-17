"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { rupiah, waLink } from "@/lib/brand";

type Route = {
  slug: string; origin: { code: string; city: string }; dest: { code: string; city: string };
  service: string; serviceTitle: string; serviceHint: string; basis: "PER_KG" | "PER_M3";
  unitPrice: number; minChargeable: number; etaDays: number;
};
type Item = { w: string; l: string; wd: string; h: string };
type Result = { total: number; explain: string[]; etaDays: number; note: string; service: { title: string }; route: { origin: string; dest: string } };

const num = (s: string) => Number(s.replace(",", ".")) || 0;
const emptyItem = (): Item => ({ w: "", l: "", wd: "", h: "" });

export default function Calculator({ routes }: { routes: Route[] }) {
  const origins = useMemo(() => [...new Map(routes.map((r) => [r.origin.code, r.origin.city])).entries()], [routes]);
  const [origin, setOrigin] = useState(origins[0]?.[0] ?? "");
  const dests = useMemo(
    () => [...new Map(routes.filter((r) => r.origin.code === origin).map((r) => [r.dest.code, r.dest.city])).entries()],
    [routes, origin],
  );
  const [dest, setDest] = useState(dests[0]?.[0] ?? "");
  const destOk = dests.some(([c]) => c === dest) ? dest : dests[0]?.[0] ?? "";
  const options = useMemo(() => routes.filter((r) => r.origin.code === origin && r.dest.code === destOk), [routes, origin, destOk]);
  const [slug, setSlug] = useState("");
  const chosen = options.find((o) => o.slug === slug) ?? options[0];
  const [items, setItems] = useState<Item[]>([emptyItem()]);
  const [showSize, setShowSize] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [res, setRes] = useState<Result | null>(null);
  const resRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (res) resRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }, [res]);

  const needSize = chosen?.basis === "PER_M3";
  const upd = (i: number, k: keyof Item, v: string) => {
    setItems((a) => a.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
    setRes(null);
  };

  async function hitung(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setRes(null);
    if (!chosen) return;
    const pieces = items.map((it) => {
      const hasSize = (showSize || needSize) && num(it.l) && num(it.wd) && num(it.h);
      return { weightKg: num(it.w), ...(hasSize ? { dims: { lCm: num(it.l), wCm: num(it.wd), hCm: num(it.h) } } : {}) };
    });
    if (needSize && pieces.some((p) => !p.dims)) return setErr("Untuk cara hitung ini, isi ukuran barang (panjang, lebar, tinggi) ya.");
    if (pieces.some((p) => p.weightKg <= 0)) return setErr("Isi berat barang dulu ya. Perkiraan juga boleh.");
    setBusy(true);
    try {
      const r = await fetch("/api/ongkir", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ origin, dest: destOk, service: chosen.service, basis: chosen.basis, pieces }),
      });
      const j = await r.json();
      if (!r.ok) setErr(j.error ?? "Maaf, ada gangguan. Coba lagi sebentar.");
      else setRes(j);
    } catch { setErr("Koneksi terputus. Periksa sinyal Anda lalu coba lagi."); }
    setBusy(false);
  }

  const basisLabel = (r: Route) => (r.basis === "PER_M3" ? "Dihitung per ukuran (m³), cocok untuk barang banyak" : "Dihitung per kilo, cocok untuk paket");

  return (
    <form onSubmit={hitung}>
      <div className="row">
        <div>
          <label className="f" htmlFor="asal">Dari kota</label>
          <select id="asal" value={origin} onChange={(e) => { setOrigin(e.target.value); setSlug(""); setRes(null); }}>
            {origins.map(([c, n]) => <option key={c} value={c}>{n}</option>)}
          </select>
        </div>
        <div>
          <label className="f" htmlFor="tujuan">Ke kota</label>
          <select id="tujuan" value={destOk} onChange={(e) => { setDest(e.target.value); setSlug(""); setRes(null); }}>
            {dests.map(([c, n]) => <option key={c} value={c}>{n}</option>)}
          </select>
        </div>
      </div>

      {options.length > 1 && (
        <>
          <label className="f">Pilih cara kirim</label>
          {options.map((o) => (
            <label key={o.slug} className={`choice ${o.slug === chosen?.slug ? "on" : ""}`}>
              <input type="radio" name="cara" checked={o.slug === chosen?.slug} onChange={() => { setSlug(o.slug); setRes(null); }} />
              <b>{o.serviceTitle} · {rupiah(o.unitPrice)}/{o.basis === "PER_M3" ? "m³" : "kg"}</b>
              <span>{o.serviceHint}. {basisLabel(o)}.</span>
            </label>
          ))}
        </>
      )}
      {chosen && options.length === 1 && (
        <p className="hint" style={{ marginTop: 10 }}>{chosen.serviceTitle}: {chosen.serviceHint}.
          {chosen.minChargeable ? ` Minimal kirim ${chosen.minChargeable} kg.` : ""}</p>
      )}

      <h3 style={{ marginTop: 20 }}>Barang Anda</h3>
      {items.map((it, i) => (
        <div key={i} className="fade" style={{ marginTop: i ? 14 : 0, paddingTop: i ? 14 : 0, borderTop: i ? "1px dashed var(--line)" : 0 }}>
          {items.length > 1 && <b>Barang {i + 1}</b>}
          <label className="f" htmlFor={`w${i}`}>Berat (kilogram)</label>
          <input id={`w${i}`} inputMode="decimal" placeholder="Contoh: 25" value={it.w} onChange={(e) => upd(i, "w", e.target.value)} />
          {(showSize || needSize) && (
            <>
              <label className="f">Ukuran barang (sentimeter){needSize ? "" : " — boleh dikosongkan"}</label>
              <div className="row">
                <input inputMode="decimal" aria-label="Panjang" placeholder="Panjang" value={it.l} onChange={(e) => upd(i, "l", e.target.value)} />
                <input inputMode="decimal" aria-label="Lebar" placeholder="Lebar" value={it.wd} onChange={(e) => upd(i, "wd", e.target.value)} />
                <input inputMode="decimal" aria-label="Tinggi" placeholder="Tinggi" value={it.h} onChange={(e) => upd(i, "h", e.target.value)} />
              </div>
            </>
          )}
          {items.length > 1 && (
            <button type="button" className="btn ghost" style={{ minHeight: 44, marginTop: 10, fontSize: 15 }}
              onClick={() => { setItems((a) => a.filter((_, j) => j !== i)); setRes(null); }}>Hapus barang ini</button>
          )}
        </div>
      ))}

      {!needSize && (
        <label className="choice" style={{ paddingLeft: 46 }}>
          <input type="checkbox" checked={showSize} onChange={(e) => setShowSize(e.target.checked)} />
          <b>Barang saya besar tapi ringan</b>
          <span>Centang untuk mengisi ukuran supaya hitungan lebih pas.</span>
        </label>
      )}
      <button type="button" className="btn ghost" style={{ marginTop: 12 }}
        onClick={() => { setItems((a) => [...a, emptyItem()]); setRes(null); }}>＋ Tambah barang lain</button>

      {err && <div className="err fade" style={{ marginTop: 14 }} role="alert">{err}</div>}
      <button className="btn" style={{ marginTop: 16 }} disabled={busy || !chosen}>
        {busy ? <span className="spin" /> : "Hitung ongkir"}
      </button>

      {res && (
        <div ref={resRef} className="card fade" style={{ marginTop: 18, background: "var(--teal-soft)" }} aria-live="polite">
          <span className="muted">Perkiraan ongkir {res.route.origin} → {res.route.dest}</span>
          <div className="price">{rupiah(res.total)}</div>
          <p className="muted" style={{ marginTop: 6 }}>{res.service.title}. Perkiraan tiba sekitar {res.etaDays} hari.</p>
          <ul style={{ paddingLeft: 20, margin: "10px 0" }}>{res.explain.map((x, i) => <li key={i}>{x}</li>)}</ul>
          <p className="hint">{res.note}</p>
          <a className="btn" style={{ marginTop: 12 }}
            href={waLink(`Halo Kamil Logistik, saya mau kirim barang ${res.route.origin} ke ${res.route.dest}. Perkiraan ongkir Rp${res.total.toLocaleString("id-ID")}. Mohon dibantu.`)}>
            💬 Pesan lewat WhatsApp
          </a>
        </div>
      )}
    </form>
  );
}
