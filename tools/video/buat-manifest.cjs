/** Menyusun narasi/<id>.audio.json dari berkas suara/NNN.mp3 yang sudah ada. lengkap=true bila semua kalimat video itu punya suara. */
const fs = require("fs"), path = require("path"), cp = require("child_process");
const semua = JSON.parse(fs.readFileSync(path.join(__dirname, "narasi/_semua.json"), "utf8"));
const dur = (f) => parseFloat(cp.execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());
const per = {};
for (const [n, id, j, teks] of semua) { (per[id] ||= { total: 0, ada: [] }).total++; const f = path.join(__dirname, "suara", String(n).padStart(3, "0") + ".mp3"); if (fs.existsSync(f)) per[id].ada.push({ teks, file: path.relative(__dirname, f), dur: +dur(f).toFixed(2) }); }
for (const [id, v] of Object.entries(per)) { fs.writeFileSync(path.join(__dirname, "narasi", id + ".audio.json"), JSON.stringify({ lengkap: v.ada.length === v.total, klip: v.ada }, null, 1)); console.log(id.padEnd(28), `${v.ada.length}/${v.total}`, v.ada.length === v.total ? "LENGKAP" : ""); }
