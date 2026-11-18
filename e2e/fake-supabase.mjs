/**
 * Tiruan layanan Supabase untuk uji E2E lokal: login (GoTrue) + panggilan fungsi (PostgREST).
 * Memakai Postgres lokal yang memuat SEMUA migrasi asli, jadi fungsi, hak akses, dan aturan bisnisnya identik dengan produksi.
 * Hanya untuk pengujian. Tidak pernah dipakai di produksi.
 */
import fs from "node:fs";
import http from "node:http";
import { fileURLToPath } from "node:url";
import pg from "pg";

const here = fileURLToPath(new URL(".", import.meta.url));
const dbName = process.env.E2E_DB || fs.readFileSync(`${here}.dbname`, "utf8").trim();
const pool = new pg.Pool({ host: "127.0.0.1", user: "postgres", password: "pg", database: dbName, max: 6 });
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const jwt = (u) => `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ sub: u.id, email: u.email, aud: "authenticated", role: "authenticated", iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600 })}.fake`;
const subOf = (h) => { try { const t = (h || "").replace(/^Bearer\s+/i, ""); const p = JSON.parse(Buffer.from(t.split(".")[1] || "", "base64url").toString()); return p.sub || null; } catch { return null; } };
const userJson = (u) => ({ id: u.id, aud: "authenticated", role: "authenticated", email: u.email, email_confirmed_at: new Date().toISOString(), phone: "", app_metadata: { provider: "email", providers: ["email"] }, user_metadata: {}, identities: [], created_at: u.created_at, updated_at: u.updated_at });
const session = (u) => ({ access_token: jwt(u), token_type: "bearer", expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, refresh_token: u.id, user: userJson(u) });

const read = (req) => new Promise((r) => { let s = ""; req.on("data", (c) => (s += c)); req.on("end", () => { try { r(s ? JSON.parse(s) : {}); } catch { r({}); } }); });
const send = (res, code, body) => { res.writeHead(code, { "content-type": "application/json" }); res.end(body === undefined ? "" : JSON.stringify(body)); };

async function userByCreds(email, password) {
  const r = await pool.query(`SELECT * FROM auth.users WHERE lower(email)=lower($1) AND encrypted_password = extensions.crypt($2, encrypted_password) AND (banned_until IS NULL OR banned_until < now())`, [email, password]);
  return r.rows[0];
}
const userById = async (id) => (await pool.query("SELECT * FROM auth.users WHERE id=$1 AND (banned_until IS NULL OR banned_until < now())", [id])).rows[0];

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x"); const p = url.pathname;
  try {
    if (p === "/auth/v1/token" && req.method === "POST") {
      const b = await read(req); const gt = url.searchParams.get("grant_type");
      const u = gt === "password" ? await userByCreds(b.email ?? "", b.password ?? "") : gt === "refresh_token" ? await userById(b.refresh_token) : null;
      if (!u) return send(res, 400, { code: 400, error_code: "invalid_credentials", msg: "Invalid login credentials", error: "invalid_grant", error_description: "Invalid login credentials" });
      await pool.query("UPDATE auth.users SET last_sign_in_at = now() WHERE id=$1", [u.id]);
      return send(res, 200, session(u));
    }
    if (p === "/auth/v1/user") {
      const id = subOf(req.headers.authorization); const u = id && (await userById(id));
      if (!u) return send(res, 401, { code: 401, msg: "invalid JWT" });
      if (req.method === "PUT") { const b = await read(req); if (b.password) await pool.query("UPDATE auth.users SET encrypted_password = extensions.crypt($1, extensions.gen_salt('bf')) WHERE id=$2", [b.password, id]); }
      return send(res, 200, userJson(u));
    }
    if (p === "/auth/v1/logout") return send(res, 204);
    const m = p.match(/^\/rest\/v1\/rpc\/([a-z_0-9]+)$/);
    if (m && req.method === "POST") {
      const args = await read(req); const sub = subOf(req.headers.authorization);
      const keys = Object.keys(args);
      const vals = keys.map((k) => (args[k] !== null && typeof args[k] === "object" ? JSON.stringify(args[k]) : args[k]));
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        await client.query(`SET LOCAL ROLE ${sub ? "authenticated" : "anon"}`);
        await client.query("SELECT set_config('request.jwt.claim.sub', $1, true)", [sub || ""]);
        const r = await client.query(`SELECT public.${m[1]}(${keys.map((k, i) => `${k} => $${i + 1}`).join(", ")}) AS r`, vals);
        await client.query("COMMIT");
        return send(res, 200, r.rows[0]?.r ?? null);
      } catch (e) {
        await client.query("ROLLBACK").catch(() => {});
        const code = e.code === "42501" ? 403 : e.code === "42883" ? 404 : 400;
        return send(res, code, { code: e.code, message: e.message, details: null, hint: null });
      } finally { client.release(); }
    }
    send(res, 404, { message: "tidak ada" });
  } catch (e) { send(res, 500, { message: String(e) }); }
}).listen(54321, "127.0.0.1", () => console.log(`tiruan Supabase siap di :54321 (database ${dbName})`));
