"use client";
import { useState } from "react";
import Icon from "./Icon";
import SubmitButton from "./SubmitButton";

function Submit() {
  return (
    <SubmitButton className="btn shine" style={{ marginTop: 6 }} steps={["Memeriksa email dan sandi…", "Menyiapkan sesi aman…", "Membuka aplikasi…"]}>
      Masuk <Icon name="arrow" size={20} strokeWidth={2.6} />
    </SubmitButton>
  );
}

export default function LoginForm({ action, error }: { action: (fd: FormData) => void | Promise<void>; error?: string }) {
  const [show, setShow] = useState(false);
  const [caps, setCaps] = useState(false);
  return (
    <form action={action} autoComplete="on" noValidate={false}>
      {error && <div className="err" role="alert"><Icon name="alert" /> {error}</div>}
      <div className="gfield">
        <Icon name="mail" className="lead" />
        <input id="email" name="email" type="email" placeholder=" " autoComplete="username" inputMode="email" autoCapitalize="none" spellCheck={false} required />
        <label htmlFor="email">Email</label>
      </div>
      <div className="gfield">
        <Icon name="lock" className="lead" />
        <input id="password" name="password" type={show ? "text" : "password"} placeholder=" " autoComplete="current-password" required
          onKeyUp={(e) => setCaps(e.getModifierState?.("CapsLock") ?? false)} onBlur={() => setCaps(false)} />
        <label htmlFor="password">Kata sandi</label>
        <button type="button" className="eye" aria-label={show ? "Sembunyikan kata sandi" : "Lihat kata sandi"} onClick={() => setShow((v) => !v)}>
          <Icon name={show ? "eyeoff" : "eye"} size={22} />
        </button>
      </div>
      {caps && <div className="caps" role="status"><Icon name="alert" /> Caps Lock menyala. Huruf besar dan kecil dianggap berbeda.</div>}
      <Submit />
    </form>
  );
}
