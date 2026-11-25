\set ON_ERROR_STOP on
-- 073: Admin depo (DEPO) membuat resi cepat dan menyusun manifest di cabangnya, tanpa akses keuangan.
RESET ROLE;
SELECT set_config('t.jkt', (SELECT id::text FROM public.branches_partners WHERE code = 'JKT'), false),
       set_config('t.sub', (SELECT id::text FROM public.branches_partners WHERE code = 'SUB'), false);
SELECT t.as_user('00000000-0000-0000-0000-000000000001');
SELECT t.fails($$select public.owner_create_staff('depo.tanpa@uji.id','Depo Tanpa Cabang','DEPO',NULL,'Sandi1234')$$, 'Pilih cabang');
DO $$ BEGIN
  PERFORM set_config('t.depo', (public.owner_create_staff('depo.sub@uji.id','Admin Depo Surabaya','DEPO',current_setting('t.sub')::uuid,'Sandi1234'))->>'userId', false);
END $$;
SELECT t.as_user(current_setting('t.depo')::uuid);
DO $$ DECLARE r jsonb; m jsonb; BEGIN
  r := public.create_shipment_full(current_setting('t.jkt')::uuid,'LAUT','Pengirim Depo','0811','Penerima Jakarta','0822','Jl. Sudirman No. 1, Jakarta','{"province":"DKI Jakarta","regency":"Kota Jakarta Pusat","district":"Tanah Abang","village":"Bendungan Hilir","code":"31.71.01.1001"}'::jsonb, 1, NULL, NULL, 'DROPOFF', NULL, NULL, NULL,
    '{"contents":"Sparepart","extra":{"suratJalanKembali":false,"caraBayar":"TRANSFER"}}'::jsonb);
  PERFORM set_config('t.rd', r->>'id', false);
  ASSERT (r->>'resiNo') LIKE 'KML-SUB-JKT-%', 'resi dibuat dari depo: ' || (r->>'resiNo');
  m := public.manifest_create('JKT', 'LAUT', NULL, NULL, NULL, NULL, 'manifest depo');
  PERFORM set_config('t.md', m->>'id', false);
  ASSERT (public.manifest_get((m->>'id')::uuid)) IS NOT NULL, 'manifest terbaca oleh pembuatnya';
  ASSERT jsonb_array_length(public.manifest_list(NULL, 20)) >= 1, 'manifest tampil di daftar depo';
END $$;
-- Admin depo tidak boleh menyentuh keuangan
SELECT t.fails($$select public.invoice_issue(current_setting('t.rd')::uuid, 'KG', 30, 2000, '[]'::jsonb, 7, NULL)$$, 'izin');
SELECT t.fails($$select public.owner_create_staff('x.hrd@uji.id','X','HRD',NULL,'Sandi1234')$$, 'izin');
-- 078: Admin depo boleh membatalkan resi buatannya sendiri
DO $$ BEGIN
  PERFORM public.shipment_cancel(current_setting('t.rd')::uuid, 'Salah input saat uji');
END $$;
