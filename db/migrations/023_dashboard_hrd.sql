-- 023: Dashboard rekrutmen untuk HRD/Pemilik + buka/tutup lowongan per posisi.
CREATE TABLE IF NOT EXISTS public.job_position_state (
  slug text PRIMARY KEY,
  open boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.job_position_state ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.job_position_state FROM PUBLIC, anon, authenticated;

-- Pengunjung hanya perlu tahu posisi mana yang ditutup.
CREATE OR REPLACE FUNCTION public.public_closed_positions() RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT coalesce(jsonb_agg(slug ORDER BY slug), '[]'::jsonb) FROM public.job_position_state WHERE NOT open;
$$;

CREATE OR REPLACE FUNCTION public.staff_position_set(p_slug text, p_open boolean) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HRD']);
  IF p_slug <> ALL (ARRAY['admin-sales','admin-operasional','admin-gudang','sales-b2b','sales-retail','sales-rekanan','purchasing','procurement','manajemen-vendor','staf-gudang','driver-sim-a','driver-sim-b']) THEN RAISE EXCEPTION 'Posisi tidak dikenal.'; END IF;
  INSERT INTO public.job_position_state(slug, open, updated_at) VALUES (p_slug, coalesce(p_open, true), now())
  ON CONFLICT (slug) DO UPDATE SET open = EXCLUDED.open, updated_at = now();
  PERFORM public.log_audit('position_set', 'job_position_state', NULL, NULL, jsonb_build_object('slug', p_slug, 'open', p_open));
  RETURN jsonb_build_object('ok', true);
END $$;

CREATE OR REPLACE FUNCTION public.hrd_dashboard() RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE now_ts timestamptz := now();
BEGIN
  PERFORM public.require_role(ARRAY['SUPER_ADMIN','HRD']);
  RETURN jsonb_build_object(
    'total', (SELECT count(*) FROM public.job_applications),
    'counts', (SELECT coalesce(jsonb_object_agg(status, n), '{}'::jsonb) FROM (SELECT status, count(*) n FROM public.job_applications GROUP BY status) c),
    'last7', (SELECT count(*) FROM public.job_applications WHERE created_at > now_ts - interval '7 days'),
    'prev7', (SELECT count(*) FROM public.job_applications WHERE created_at > now_ts - interval '14 days' AND created_at <= now_ts - interval '7 days'),
    'hiredMonth', (SELECT count(*) FROM public.job_applications WHERE status = 'DITERIMA' AND date_trunc('month', updated_at AT TIME ZONE 'Asia/Jakarta') = date_trunc('month', now_ts AT TIME ZONE 'Asia/Jakarta')),
    'avgResponseHours', (SELECT round((avg(extract(epoch FROM (updated_at - created_at)) / 3600))::numeric, 1) FROM public.job_applications WHERE status <> 'BARU' AND created_at > now_ts - interval '60 days'),
    'daily', (SELECT coalesce(jsonb_agg(jsonb_build_object('d', to_char(g.d, 'YYYY-MM-DD'), 'n', coalesce(x.n, 0)) ORDER BY g.d), '[]'::jsonb)
              FROM generate_series((now_ts AT TIME ZONE 'Asia/Jakarta')::date - 13, (now_ts AT TIME ZONE 'Asia/Jakarta')::date, interval '1 day') g(d)
              LEFT JOIN (SELECT (created_at AT TIME ZONE 'Asia/Jakarta')::date d, count(*) n FROM public.job_applications GROUP BY 1) x ON x.d = g.d::date),
    'perPosition', coalesce((SELECT jsonb_agg(jsonb_build_object('position', p.position, 'total', p.total, 'baru', p.baru, 'wawancara', p.wawancara, 'diterima', p.diterima, 'open', coalesce(s.open, true)) ORDER BY p.total DESC, p.position)
              FROM (SELECT position, count(*) total, count(*) FILTER (WHERE status = 'BARU') baru, count(*) FILTER (WHERE status = 'WAWANCARA') wawancara, count(*) FILTER (WHERE status = 'DITERIMA') diterima FROM public.job_applications GROUP BY position) p
              LEFT JOIN public.job_position_state s ON s.slug = p.position), '[]'::jsonb),
    'closed', (SELECT coalesce(jsonb_agg(slug), '[]'::jsonb) FROM public.job_position_state WHERE NOT open),
    'needsAction', coalesce((SELECT jsonb_agg(jsonb_build_object('id', a.id, 'code', a.code, 'name', a.name, 'position', a.position, 'phone', a.phone, 'createdAt', a.created_at, 'hours', floor(extract(epoch FROM (now_ts - a.created_at)) / 3600)) ORDER BY a.created_at)
              FROM (SELECT * FROM public.job_applications WHERE status = 'BARU' AND created_at < now_ts - interval '24 hours' ORDER BY created_at LIMIT 15) a), '[]'::jsonb)
  );
END $$;

DO $$
DECLARE d text;
BEGIN
  d := pg_get_functiondef('public.public_apply(text,text,text,text,text,text,text,text,text,text,text)'::regprocedure);
  d := replace(d, E'  nm := btrim(coalesce(p_name, \'\'));', E'  IF EXISTS (SELECT 1 FROM public.job_position_state WHERE slug = p_position AND NOT open) THEN RAISE EXCEPTION \'Lowongan ini sedang ditutup. Silakan pilih posisi lain atau coba lagi nanti.\'; END IF;\n  nm := btrim(coalesce(p_name, \'\'));');
  IF d NOT LIKE '%sedang ditutup%' THEN RAISE EXCEPTION 'penggantian fungsi gagal'; END IF;
  EXECUTE d;
END $$;

DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY['public_closed_positions()','staff_position_set(text,boolean)','hrd_dashboard()','public_apply(text,text,text,text,text,text,text,text,text,text,text)'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon, authenticated', f);
  END LOOP;
  GRANT EXECUTE ON FUNCTION public.public_closed_positions(), public.public_apply(text,text,text,text,text,text,text,text,text,text,text) TO anon, authenticated;
  GRANT EXECUTE ON FUNCTION public.staff_position_set(text,boolean), public.hrd_dashboard() TO authenticated;
END $$;
