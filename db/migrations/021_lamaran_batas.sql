-- 021: Batas lamaran lebih ketat (melindungi penyimpanan dari kiriman massal) dan HRD bisa menghapus lamaran.
DO $$
DECLARE d text;
BEGIN
  d := pg_get_functiondef('public.public_apply(text,text,text,text,text,text,text,text,text,text,text)'::regprocedure);
  d := replace(d, 'length(p_cv_data) > 1500000', 'length(p_cv_data) > 1100000');
  d := replace(d, 'Maksimal sekitar 1 MB', 'Maksimal sekitar 800 KB');
  d := replace(d, '>= 150', '>= 80');
  EXECUTE d;
END $$;

CREATE OR REPLACE FUNCTION public.staff_application_delete(p_id uuid) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HRD']);
  DELETE FROM public.job_applications WHERE id = p_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Lamaran tidak ditemukan.'; END IF;
  PERFORM public.log_audit('application_delete', 'job_applications', p_id, NULL, NULL);
  RETURN jsonb_build_object('ok', true);
END $$;
REVOKE ALL ON FUNCTION public.staff_application_delete(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.staff_application_delete(uuid) TO authenticated;
-- pastikan hak fungsi hasil penggantian tetap hanya untuk pengunjung/petugas yang berhak
REVOKE ALL ON FUNCTION public.public_apply(text,text,text,text,text,text,text,text,text,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_apply(text,text,text,text,text,text,text,text,text,text,text) TO anon, authenticated;
