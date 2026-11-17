-- Keamanan: kunci semua tabel. Tanpa kebijakan = tidak ada akses langsung dari internet.
-- Aplikasi hanya mengakses lewat fungsi aman (003) atau koneksi server.
DO $$
DECLARE t text;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;

ALTER FUNCTION public.set_updated_at() SET search_path = '';
ALTER FUNCTION public.forbid_mutation() SET search_path = '';
