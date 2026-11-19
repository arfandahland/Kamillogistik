"use client";

/** Galat tak terduga: tampilkan pesan sopan dan tombol coba lagi (tanpa membuka detail teknis). */
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="wrap section stack" style={{ textAlign: "center", minHeight: "60vh", alignContent: "center" }}>
      <h1 style={{ margin: 0 }}>Maaf, ada gangguan</h1>
      <p className="muted" style={{ margin: 0 }}>Halaman ini belum bisa dibuka sekarang. Coba muat ulang, atau kembali ke beranda.</p>
      <div style={{ display: "grid", gap: 10, maxWidth: 360, margin: "8px auto 0", width: "100%" }}>
        <button className="btn" onClick={() => reset()}>Coba lagi</button>
        <a className="btn ghost" href="/">Ke beranda</a>
      </div>
    </main>
  );
}
