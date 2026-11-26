-- 090: Moda yang tersedia pada master tarif untuk rute cabang saya ke satu tujuan. Dipakai form Buat resi baru untuk menonaktifkan moda yang tidak dilayani.
-- Daftar kosong berarti belum ada tarif resmi: Kasir tetap boleh memilih moda apa pun dengan harga manual.
CREATE OR REPLACE FUNCTION public.route_modes(p_dest uuid) RETURNS text[]
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','MITRA_POS','DEPO']);
  RETURN coalesce((SELECT array_agg(DISTINCT r.mode ORDER BY r.mode) FROM public.routes_services r
                   WHERE r.dest_id = p_dest AND (public.my_role() = 'SUPER_ADMIN' OR r.origin_id = public.my_branch())), ARRAY[]::text[]);
END $$;
REVOKE ALL ON FUNCTION public.route_modes(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.route_modes(uuid) TO authenticated;
