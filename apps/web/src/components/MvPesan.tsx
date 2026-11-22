/** Pesan berhasil atau galat di atas halaman MV (dari ?ok= dan ?e= atau galat pemuatan data). */
export default function MvPesan({ ok, e, galat }: { ok?: string; e?: string; galat?: (string | null | undefined)[] }) {
  const g = (galat ?? []).filter(Boolean) as string[];
  return (
    <>
      {ok && <div className="ok" role="status">{ok}</div>}
      {e && <div className="err" role="alert">{e}</div>}
      {g.slice(0, 1).map((m) => <div key={m} className="err" role="alert">{m}</div>)}
    </>
  );
}
