import Memuat from "@/components/Memuat";

export default function Loading() {
  return (
    <main className="wrap stack" style={{ paddingTop: 24 }} aria-busy="true" aria-label="Memuat">
      <Memuat />
      <div className="skel" style={{ height: 120 }} />
      <div className="skel" style={{ height: 160 }} />
    </main>
  );
}
