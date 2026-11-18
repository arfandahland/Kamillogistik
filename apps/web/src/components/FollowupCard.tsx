"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { FOLLOWUP_LABEL, displayPhone, followupLink, telLink, umur, type FollowupItem } from "@kamil/core";
import Icon from "./Icon";
import { tandaiDihubungi } from "@/app/app/tindak-actions";

/** Satu baris antrean tindak lanjut: siapa, kenapa, sudah berapa lama, dan tombol besar Chat / Telepon. */
export default function FollowupCard({ item, siteUrl, canMark }: { item: FollowupItem; siteUrl: string; canMark: boolean }) {
  const [done, setDone] = useState(!!item.contactedAt);
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const L = FOLLOWUP_LABEL[item.kind];
  const chat = followupLink(item, siteUrl);
  const mark = () => start(async () => { const r = await tandaiDihubungi(item.shipmentId, item.kind); if (r.ok) { setDone(true); setErr(null); } else setErr(r.error ?? "Gagal mencatat."); });
  return (
    <article className={`fcard ${item.level} ${done ? "done" : ""}`}>
      <Link href={`/app/resi/${item.shipmentId}`} className="fhead">
        <span className="fic"><Icon name={L.icon} size={22} /></span>
        <span className="fmeta">
          <b>{L.title}</b>
          <small>{item.name ?? "Tanpa nama"}{item.phone ? ` · ${displayPhone(item.phone)}` : ""}</small>
          <small className="fno">{item.resiNo} · {item.origin} → {item.dest}</small>
        </span>
        <span className="fage" title="Sudah tertahan">{item.kind === "TAGIHAN" && item.amount ? `Rp${item.amount.toLocaleString("id-ID")}` : umur(item.hours)}</span>
      </Link>
      {item.kind === "TAGIHAN" && <p className="fnote">Jatuh tempo {umur(item.hours)} lalu · {item.invoiceNo}</p>}
      {done ? (
        <p className="fdone"><Icon name="check" size={18} /> Sudah dihubungi{item.contactedAt ? "" : " barusan"}. Muncul lagi bila belum beres.</p>
      ) : chat ? (
        <div className="fact">
          <a className="btn wabtn" href={chat} target="_blank" rel="noopener noreferrer" onClick={canMark ? mark : undefined}><Icon name="chat" size={20} /> Chat</a>
          <a className="btn ghost" href={telLink(item.phone!)} onClick={canMark ? mark : undefined} aria-label="Telepon"><Icon name="phone" size={20} /> Telepon</a>
        </div>
      ) : (
        <p className="fnone"><Icon name="alert" size={18} /> Nomor HP belum ada atau tidak valid. <Link href={`/app/resi/${item.shipmentId}`}>Buka resi</Link></p>
      )}
      {canMark && !done && <button type="button" className="flink" onClick={mark} disabled={pending}>{pending ? "Mencatat…" : "Tandai sudah dihubungi"}</button>}
      {err && <p className="err" role="alert">{err}</p>}
    </article>
  );
}
