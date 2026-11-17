-- Data awal jaringan + tarif (dari materi promosi Kamil Logistik, Nov 2026).
-- Ubah tarif = ubah data di sini / lewat admin, bukan kode program.
INSERT INTO branches_partners (type, code, name, city, lat, lng) VALUES
  ('HUB','JKT','Gudang Jakarta','Jakarta',-6.2088,106.8456),
  ('HUB','SUB','Gudang Surabaya','Surabaya',-7.2575,112.7521),
  ('HUB','MKS','Gudang Makassar','Makassar',-5.1477,119.4327),
  ('HUB','MRW','Morowali','Morowali',-2.8600,121.9100)
ON CONFLICT (code) DO NOTHING;

INSERT INTO routes_services (origin_id, dest_id, mode, service, pricing_basis, unit_price, min_chargeable, rounding, rounding_step, eta_days, slug)
SELECT o.id, d.id, v.mode, v.service, v.basis, v.price, v.minc, v.rounding, v.step, v.eta, v.slug
FROM (VALUES
 ('JKT','MKS','LAUT','PORT_TO_DOOR','PER_KG',2500,0,'ceil',1,7,'jakarta-makassar-port-to-door-kg'),
 ('JKT','MKS','LAUT','PORT_TO_DOOR','PER_M3',500000,0,'ceil',0.01,7,'jakarta-makassar-port-to-door-m3'),
 ('JKT','MKS','LAUT','PORT_TO_PORT','PER_M3',400000,0,'ceil',0.01,7,'jakarta-makassar-port-to-port-m3'),
 ('MKS','JKT','LAUT','PORT_TO_DOOR','PER_KG',2500,20,'ceil',1,7,'makassar-jakarta-port-to-door'),
 ('MKS','MRW','DARAT','DOOR_TO_DOOR','PER_KG',2000,30,'ceil',1,2,'makassar-morowali-door-to-door')
) AS v(o,d,mode,service,basis,price,minc,rounding,step,eta,slug)
JOIN branches_partners o ON o.code = v.o
JOIN branches_partners d ON d.code = v.d
ON CONFLICT DO NOTHING;
