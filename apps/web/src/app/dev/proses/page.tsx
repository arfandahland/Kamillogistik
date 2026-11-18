import { notFound } from "next/navigation";
import ResiStepper from "@/components/ResiStepper";
import SubmitButton from "@/components/SubmitButton";

/** Uji animasi proses (hanya pengembangan). */
async function lambat() {
  "use server";
  await new Promise((r) => setTimeout(r, 4500));
}

export default function Proses() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className="wrap section stack">
      <div className="card"><h2>Tahap 4 dari 10</h2><ResiStepper status="SORTED_INVOICED" /></div>
      <div className="card"><h2>Hampir selesai</h2><ResiStepper status="OUT_FOR_DELIVERY" /></div>
      <div className="card"><h2>Selesai</h2><ResiStepper status="DELIVERED" /></div>
      <form action={lambat} className="card">
        <h2>Uji tombol bertahap</h2>
        <SubmitButton steps={["Memeriksa berat dan ukuran…", "Menghitung tarif…", "Membuat tagihan…", "Mencatat riwayat…"]}>Hitung dan buat tagihan</SubmitButton>
      </form>
    </main>
  );
}
