import Memuat from "@/components/Memuat";

export default function Loading() {
  return (
    <main className="wrap stack" aria-busy="true" aria-label="Memuat">
      <Memuat teks="Memuat data" />
      <div className="stats"><div className="skel" style={{ height: 96 }} /><div className="skel" style={{ height: 96 }} /></div>
      {[0, 1].map((i) => <div key={i} className="skel" style={{ height: 84 }} />)}
    </main>
  );
}
