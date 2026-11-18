export default function Loading() {
  return (
    <main className="wrap stack" style={{ paddingTop: 24 }} aria-busy="true" aria-label="Memuat">
      <div className="skel" style={{ height: 150 }} />
      <div className="skel" style={{ height: 70 }} />
      <div className="skel" style={{ height: 220 }} />
    </main>
  );
}
