export default function Loading() {
  return (
    <main className="wrap stack" aria-busy="true" aria-label="Memuat">
      <div className="stats" style={{ marginTop: 16 }}><div className="skel" style={{ height: 112 }} /><div className="skel" style={{ height: 112 }} /></div>
      <div className="skel" style={{ height: 58 }} />
      {[0, 1, 2].map((i) => <div key={i} className="skel" style={{ height: 96 }} />)}
    </main>
  );
}
