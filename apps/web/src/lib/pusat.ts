/** "Pusat": halaman kelompok fitur untuk tombol menu bawah. Satu tombol, semua fitur sejenis terkumpul rapi. */
export type PusatItem = { href: string; icon: string; t: string; d: string };
export type PusatGrup = { judul: string; ket: string; icon: string; items: PusatItem[] };

const AKUN: PusatGrup = { judul: "Akun saya", ket: "Data diri, kata sandi, dan bantuan.", icon: "user", items: [{ href: "/app/akun", icon: "user", t: "Akun dan panduan", d: "Profil, ganti kata sandi, panduan penggunaan, dan keluar." }] };
const CARI: PusatItem = { href: "/app/cari", icon: "search", t: "Cari resi", d: "Ketik nomor resi atau nama pengirim dan penerima." };
const PINDAI: PusatItem = { href: "/app/pindai", icon: "scan", t: "Pindai barcode", d: "Arahkan kamera ke label barang untuk membuka resinya." };
const SERAH: PusatItem = { href: "/app/serah", icon: "swap", t: "Serah terima", d: "Terima atau serahkan barang ke petugas lain dengan tombol konfirmasi." };
const DIHUBUNGI: PusatItem = { href: "/app/tindak-lanjut", icon: "chat", t: "Perlu dihubungi", d: "Pelanggan yang menunggu kabar: belum dijemput, belum diantar, atau tagihan jatuh tempo." };
const JEMPUT: PusatItem = { href: "/app/jemput", icon: "truck", t: "Pesanan jemput", d: "Pesanan penjemputan dari website: hubungi pelanggan dan atur jadwalnya." };
const KENDALA: PusatItem = { href: "/app/kendala", icon: "alert", t: "Kendala pengiriman", d: "Salah sortir, barang rusak, gagal kirim, retur, dan barang ditahan." };
const MANIFEST: PusatItem = { href: "/app/manifest", icon: "layers", t: "Manifest muatan", d: "Daftar muatan satu kontainer: siapkan, segel, serahkan, dan bongkar." };
const TIMBANG: PusatItem = { href: "/app/timbang", icon: "scale", t: "Timbang barang", d: "Pindai barcode tiap barang, isi berat dan ukurannya." };
const SORTIR: PusatItem = { href: "/app/sortir", icon: "layers", t: "Sortir tujuan akhir", d: "Resi dikelompokkan per kabupaten atau kota tujuan akhir." };
const TAGIHAN: PusatItem = { href: "/app/tagihan", icon: "file", t: "Tagihan dan invoice", d: "Cari invoice, catat pembayaran, cetak, dan kirim ke pelanggan." };

export const PERAN_PUSAT = ["MITRA_POS", "HUB_MANAGER", "WAREHOUSE", "DRIVER", "CONTAINER_DRIVER", "CS_SALES", "FINANCE", "HRD", "MV", "MV_MASTER"];

export function grupPusat(role: string): { judul: string; sapa: string; grup: PusatGrup[] } {
  switch (role) {
    case "MITRA_POS": return { judul: "Pusat Kasir", sapa: "Semua alat Kasir, dikelompokkan menurut pekerjaannya.", grup: [
      { judul: "Buat dan urus resi", ket: "Mulai dari sini setiap ada barang baru.", icon: "plus", items: [{ href: "/app/baru", icon: "plus", t: "Resi baru", d: "Isi data pengirim, penerima, barang, jadwal, dan pembayaran. Label dicetak setelahnya." }, CARI, PINDAI, SERAH, SORTIR] },
      { judul: "Pelanggan", ket: "Jaga hubungan dan jawab pertanyaan.", icon: "users", items: [DIHUBUNGI, JEMPUT] },
      { judul: "Uang", ket: "Invoice, pembayaran, dan setoran.", icon: "cash", items: [TAGIHAN] }, AKUN] };
    case "HUB_MANAGER": return { judul: "Pusat Gudang", sapa: "Muatan, masalah, dan pelanggan cabang Anda.", grup: [
      { judul: "Muatan dan barang", ket: "Manifest, serah terima, dan penimbangan.", icon: "layers", items: [MANIFEST, SERAH, PINDAI, TIMBANG, SORTIR, CARI] },
      { judul: "Masalah dan pelanggan", ket: "Yang perlu ditindaklanjuti hari ini.", icon: "alert", items: [KENDALA, DIHUBUNGI, JEMPUT] }, AKUN] };
    case "WAREHOUSE": return { judul: "Pusat Gudang", sapa: "Kerja harian petugas gudang.", grup: [
      { judul: "Kerja gudang", ket: "Terima, timbang, dan muat barang.", icon: "box", items: [TIMBANG, PINDAI, SERAH, MANIFEST, SORTIR, CARI] },
      { judul: "Masalah dan pelanggan", ket: "Laporkan dan pantau.", icon: "alert", items: [KENDALA, DIHUBUNGI] }, AKUN] };
    case "DRIVER": return { judul: "Pusat Kurir", sapa: "Tugas jemput dan antar Anda.", grup: [
      { judul: "Tugas saya", ket: "Terima, pindai, dan serahkan barang.", icon: "truck", items: [SERAH, PINDAI, CARI] }, AKUN] };
    case "CONTAINER_DRIVER": return { judul: "Pusat Sopir", sapa: "Muatan yang Anda bawa.", grup: [
      { judul: "Muatan saya", ket: "Terima manifest, berangkat, tiba, dan serahkan.", icon: "ship", items: [MANIFEST, SERAH, PINDAI, CARI] }, AKUN] };
    case "CS_SALES": return { judul: "Pusat Layanan Pelanggan", sapa: "Pelanggan, pesanan, dan keluhan.", grup: [
      { judul: "Pelanggan", ket: "Hubungi dan tindak lanjuti.", icon: "users", items: [DIHUBUNGI, JEMPUT, { href: "/app/klaim", icon: "shield", t: "Klaim dan keluhan", d: "Laporan barang rusak, hilang, atau keluhan layanan beserta usulan penyelesaiannya." }] },
      { judul: "Cari", ket: "Temukan resi dengan cepat.", icon: "search", items: [CARI] }, AKUN] };
    case "FINANCE": return { judul: "Pusat Keuangan", sapa: "Uang masuk, tagihan, biaya, dan laporan.", grup: [
      { judul: "Uang dan tagihan", ket: "Pembayaran dan piutang.", icon: "cash", items: [{ href: "/app/keuangan", icon: "cash", t: "Keuangan", d: "Uang masuk, piutang, umur piutang, dan riwayat pembayaran." }, TAGIHAN, { href: "/app/keuangan/komisi", icon: "users", t: "Komisi mitra", d: "Ongkir dan komisi tiap mitra pada periode yang dipilih." }] },
      { judul: "Biaya dan laporan", ket: "Margin dan angka untuk pembukuan.", icon: "chart", items: [{ href: "/app/margin", icon: "tag", t: "Margin manifest dan rute", d: "Pendapatan dikurangi biaya kapal, armada, dan pelabuhan." }, { href: "/app/laporan", icon: "chart", t: "Laporan lengkap", d: "Omzet, piutang, rute, dan kinerja mitra. Unduh Excel." }] },
      { judul: "Dokumen dari MV", ket: "Surat jalan balik dan tanda terima.", icon: "file", items: [{ href: "/app/keuangan/sj", icon: "file", t: "SJ balik dari MV", d: "Surat jalan yang sudah diserahkan MV beserta tanda terimanya." }, CARI] }, AKUN] };
    case "HRD": return { judul: "Pusat HRD", sapa: "Rekrutmen dan kepegawaian.", grup: [
      { judul: "Rekrutmen", ket: "Dari pelamar sampai diterima.", icon: "users", items: [{ href: "/app/rekrutmen", icon: "chart", t: "Dashboard rekrutmen", d: "Pelamar masuk, alur seleksi, dan buka tutup lowongan." }, { href: "/app/lamaran", icon: "users", t: "Lamaran kerja", d: "Baca CV, hubungi lewat WhatsApp, dan catat statusnya." }] },
      { judul: "Kepegawaian", ket: "Data dan jadwal pegawai.", icon: "user", items: [{ href: "/app/pegawai?t=daftar", icon: "user", t: "Daftar pegawai", d: "Pegawai aktif dan status absen hari ini." }, { href: "/app/pegawai?t=dokumen", icon: "file", t: "Dokumen pegawai", d: "SIM, KTP, dan kontrak beserta masa berlakunya." }, { href: "/app/pegawai?t=shift", icon: "clock", t: "Shift", d: "Atur shift pagi, siang, malam, atau libur." }, { href: "/app/pegawai?t=cuti", icon: "shield", t: "Cuti dan izin", d: "Setujui atau tolak pengajuan." }, { href: "/app/pegawai?t=rekap", icon: "chart", t: "Rekap kerja", d: "Rekap per tanggal untuk penggajian, unduh CSV." }] }, AKUN] };
    case "MV": case "MV_MASTER": return { judul: "Pusat MV", sapa: "Vendor, alokasi, pemantauan, dan dokumen.", grup: [
      { judul: "Vendor dan alokasi", ket: "Siapa yang mengangkut dan berapa biayanya.", icon: "truck", items: [{ href: "/app/mv/vendor", icon: "users", t: "Vendor", d: "Catat vendor dan rutenya. Vendor yang sudah dicatat tersimpan otomatis." }, { href: "/app/mv/alokasi", icon: "truck", t: "Alokasi dan HPP", d: "Pilih vendor atau armada internal dan isi HPP tiap resi." }] },
      { judul: "Pantau dan dokumen", ket: "Posisi barang dan bukti.", icon: "pin", items: [{ href: "/app/mv/tracking", icon: "pin", t: "Pantau per wilayah", d: "Posisi resi darat, laut, dan udara menurut wilayah." }, { href: "/app/mv/sj", icon: "file", t: "SJ balik dan tanda terima", d: "Pantau batas waktu, terima SJ, dan serahkan ke Finance." }, { href: "/app/mv/udara", icon: "plane", t: "Manifest udara", d: "Unggah dan periksa manifest udara." }] },
      { judul: "Penjualan", ket: "Angka penjualan per cabang.", icon: "chart", items: [{ href: "/app/mv/penjualan", icon: "chart", t: "Penjualan per cabang", d: "Dikelompokkan per cabang dan moda, dengan saring cepat." }, CARI] }, AKUN] };
    default: return { judul: "Pusat", sapa: "", grup: [AKUN] };
  }
}
