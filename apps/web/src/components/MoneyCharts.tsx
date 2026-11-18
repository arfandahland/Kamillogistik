"use client";
// Pembungkus grafik berformat rupiah. Fungsi format tidak boleh dikirim dari halaman server ke komponen klien,
// jadi format ringkas rupiah dipasang di sini (sisi klien).
import { rupiahRingkas } from "@kamil/core";
import { AreaChart, CountUp, HBars } from "@/components/Charts";

export const MoneyCount = ({ value }: { value: number }) => <CountUp value={value} format={rupiahRingkas} />;
export const MoneyArea = (p: Omit<React.ComponentProps<typeof AreaChart>, "fmt">) => <AreaChart {...p} fmt={rupiahRingkas} />;
export const MoneyHBars = (p: Omit<React.ComponentProps<typeof HBars>, "fmt">) => <HBars {...p} fmt={rupiahRingkas} />;
