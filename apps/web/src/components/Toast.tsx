"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Icon from "./Icon";

type T = { id: number; tipe: "ok" | "err"; teks: string };
type Api = { ok: (teks: string) => void; err: (teks: string) => void };
const Ctx = createContext<Api>({ ok: () => {}, err: () => {} });
export const useToast = () => useContext(Ctx);

/** Notifikasi balon: muncul dari atas, hilang sendiri, bisa ditutup. Dipasang sekali di layout publik. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [list, setList] = useState<T[]>([]);
  const n = useRef(0);
  const tutup = useCallback((id: number) => setList((l) => l.filter((x) => x.id !== id)), []);
  const dorong = useCallback((tipe: T["tipe"], teks: string) => {
    const id = ++n.current; setList((l) => [...l.slice(-2), { id, tipe, teks }]);
    setTimeout(() => tutup(id), tipe === "err" ? 7000 : 5500);
  }, [tutup]);
  const api = useRef<Api>({ ok: (t) => dorong("ok", t), err: (t) => dorong("err", t) });
  useEffect(() => { api.current.ok = (t) => dorong("ok", t); api.current.err = (t) => dorong("err", t); }, [dorong]);
  return (
    <Ctx.Provider value={api.current}>
      {children}
      <div className="toasts" aria-live="polite">
        {list.map((t) => (
          <div key={t.id} className={`toast ${t.tipe}`} role={t.tipe === "err" ? "alert" : "status"}>
            <span className="tic"><Icon name={t.tipe === "ok" ? "check" : "alert"} size={20} /></span>
            <span className="ttx">{t.teks}</span>
            <button type="button" aria-label="Tutup pemberitahuan" onClick={() => tutup(t.id)}><Icon name="close" size={18} /></button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
