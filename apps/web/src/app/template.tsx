/** Template dipasang ulang tiap pindah halaman, sehingga setiap halaman muncul dengan gerak halus. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page">{children}</div>;
}
