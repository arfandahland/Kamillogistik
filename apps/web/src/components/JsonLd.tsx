/** Data terstruktur untuk mesin pencari (JSON-LD). "<" di-escape agar aman disisipkan ke HTML. */
export default function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
