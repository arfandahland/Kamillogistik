-- 055: Sinkron otomatis alokasi MV dengan kerja gudang. Saat manifest berangkat (resi jadi IN_TRANSIT_SEA) alokasi laut/udara ikut BERANGKAT;
-- saat resi diterima penerima (DELIVERED) alokasi ikut TIBA, sehingga batas SJ balik mulai berjalan tanpa MV mengetik ulang.
CREATE OR REPLACE FUNCTION public._alokasi_ikut_resi() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NEW.status = 'IN_TRANSIT_SEA' THEN
    UPDATE public.shipment_allocations SET status = 'BERANGKAT', updated_at = now()
     WHERE shipment_id = NEW.id AND mode IN ('LAUT','UDARA') AND status IN ('DRAFT','VENDOR_DIPILIH','HPP_DIISI');
  ELSIF NEW.status = 'DELIVERED' THEN
    UPDATE public.shipment_allocations SET status = 'TIBA', updated_at = now()
     WHERE shipment_id = NEW.id AND status IN ('VENDOR_DIPILIH','HPP_DIISI','BERANGKAT');
  END IF;
  RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public._alokasi_ikut_resi() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS alokasi_ikut_resi ON public.shipments;
CREATE TRIGGER alokasi_ikut_resi AFTER UPDATE OF status ON public.shipments FOR EACH ROW WHEN (OLD.status IS DISTINCT FROM NEW.status) EXECUTE FUNCTION public._alokasi_ikut_resi();
