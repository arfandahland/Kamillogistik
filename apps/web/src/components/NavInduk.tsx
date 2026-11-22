"use client";
import { createContext, useContext, type ReactNode } from "react";

/** Daftar menu utama peran ini dan halaman induk bagi halaman turunan (dipakai BackLink). */
const Ctx = createContext<{ tabs: string[]; induk: string }>({ tabs: [], induk: "/app" });
export function NavIndukProvider({ tabs, induk, children }: { tabs: string[]; induk: string; children: ReactNode }) {
  return <Ctx.Provider value={{ tabs, induk }}>{children}</Ctx.Provider>;
}
export const useNavInduk = () => useContext(Ctx);
