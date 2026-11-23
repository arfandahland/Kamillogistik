## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. When the answer is under a Markdown heading, `graphify section "<heading>"` prints that section's text, so the .md need not be opened. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.

## Agen desain UI/UX

Untuk merapikan tampilan (tata letak HP dan komputer, form, kartu angka, pembagian fitur per peran), gunakan agen `ui-ux-designer` (`.claude/agents/ui-ux-designer.md`). Agen ini mengikuti Tema Malam Kamil (lihat di bawah); ia bekerja dari tangkapan layar nyata dan memakai komponen tata letak yang sudah ada di `apps/web/src/app/globals.css`.

## Skill UI/UX Pro Max
Skill `ui-ux-pro-max` (MIT, dari github.com/nextlevelbuilder/ui-ux-pro-max-skill) terpasang di `.claude/skills/ui-ux-pro-max`. Pakai untuk panduan susunan, UX, grafik, dan aksesibilitas (`python3 -I .claude/skills/ui-ux-pro-max/scripts/search.py "<kata kunci>" --domain ux`). Palet dan font dari rekomendasi skill TIDAK dipakai; warna proyek mengikuti Tema Malam Kamil. Prinsip menu bawah: tiap tombol punya satu fungsi; jumlah tombol bebas (6 sampai 8 boleh) asal jelas di HP dan rapi di komputer; statistik tampil sebagai kartu atau grafik (bukan dropdown).

## Tema Malam Kamil (arahan pemilik, 23 Nov 2026)
Aplikasi petugas (`/app`) memakai tema gelap bergradien teal dari warna logo, kartu kaca, menu bawah melayang dengan tombol tengah (Pindai) menonjol, tombol utama aqua; oranye hanya untuk peringatan. Ini menggantikan aturan lama "tema warna tidak boleh diubah". Gaya ada di akhir `apps/web/src/app/globals.css` (bagian TEMA MALAM KAMIL, berlaku lewat `body:has(.appshell)`). Website publik belum memakai tema ini. Jangan menambah warna baru di luar token tema.
