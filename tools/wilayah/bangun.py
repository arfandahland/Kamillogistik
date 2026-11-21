#!/usr/bin/env python3
"""Membangun berkas wilayah statis (provinsi, kabupaten/kota, kecamatan, kelurahan/desa) dari paket npm idn-area-data (ODbL).
Pemakaian: npm i idn-area-data --prefix /tmp/wil && python3 tools/wilayah/bangun.py /tmp/wil/node_modules/idn-area-data/data apps/web/public/wilayah"""
import csv, json, os, sys, collections
src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
def rows(n): return list(csv.DictReader(open(os.path.join(src, n), encoding="utf-8")))
def dump(name, data): json.dump(data, open(os.path.join(out, name), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
prov = rows("provinces.csv"); dump("prov.json", [[p["code"], p["name"]] for p in prov])
kab = collections.defaultdict(list)
for r in rows("regencies.csv"): kab[r["province_code"]].append([r["code"], r["name"]])
for k, v in kab.items(): dump(f"kab-{k}.json", v)
kec = collections.defaultdict(list)
for r in rows("districts.csv"): kec[r["regency_code"]].append([r["code"], r["name"]])
for k, v in kec.items(): dump(f"kec-{k}.json", v)
desa = collections.defaultdict(list)
for r in rows("villages.csv"):
    desa[".".join(r["district_code"].split(".")[:2])].append([r["code"], r["name"], r["district_code"]])
for k, v in desa.items(): dump(f"desa-{k}.json", v)
open(os.path.join(out, "LISENSI.txt"), "w").write("Data wilayah administrasi Indonesia: paket idn-area-data (fityannugroho), Open Database License (ODbL) 1.0. https://github.com/fityannugroho/idn-area-data\n")
print("provinsi", len(prov), "kabupaten", sum(len(v) for v in kab.values()), "kecamatan", sum(len(v) for v in kec.values()), "desa", sum(len(v) for v in desa.values()))
