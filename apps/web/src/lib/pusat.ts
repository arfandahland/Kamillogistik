/** Kelompok fitur per peran. Tiap kelompok menjadi satu tombol di menu bawah (HP) dan satu bagian bertajuk di menu samping (komputer). */
export type Aksi = { t: string; href: string };
/** mode: "halaman" (bawaan), "laci" (panel kaca dari bawah dengan pilihan cepat), atau "kartu" (kartu kaca ringkasan di tengah layar). */
export type PusatItem = { href: string; icon: string; t: string; d: string; mode?: "laci" | "kartu"; aksi?: Aksi[] };
/** `tab` kosong berarti kelompok tidak punya tombol bawah (hanya muncul di menu samping). */
export type PusatGrup = { slug: string; tab: string; judul: string; ket: string; icon: string; items: PusatItem[] };

/** Menu yang punya pilihan cepat: sentuhan membuka laci kaca dari bawah, dengan tombol "Buka halaman penuh" ke halaman aslinya. Semua tautan adalah halaman dan filter yang sudah ada. */
const LACI: Record<string, { mode: "laci" | "kartu"; aksi?: Aksi[] }> = {
  "/app/manifest": { mode: "laci", aksi: [{ t: "Sedang diisi", href: "/app/manifest?s=OPEN" }, { t: "Siap berangkat", href: "/app/manifest?s=SEALED" }, { t: "Di perjalanan", href: "/app/manifest?s=IN_TRANSIT" }, { t: "Sudah tiba", href: "/app/manifest?s=ARRIVED" }, { t: "Selesai", href: "/app/manifest?s=UNLOADED" }] },
  "/app/mv": { mode: "laci", aksi: [{ t: "Alokasi dan HPP", href: "/app/mv/alokasi" }, { t: "Pantau darat", href: "/app/mv/tracking?m=DARAT" }, { t: "Pantau laut", href: "/app/mv/tracking?m=LAUT" }, { t: "Pantau udara", href: "/app/mv/tracking?m=UDARA" }, { t: "Kiriman vendor", href: "/app/mv/kiriman" }, { t: "SJ balik", href: "/app/mv/sj" }, { t: "Penjualan per cabang", href: "/app/mv/penjualan" }] },
  "/app/tindak-lanjut": { mode: "laci", aksi: [{ t: "Belum dijemput", href: "/app/tindak-lanjut?k=JEMPUT" }, { t: "Belum diantar ke gudang", href: "/app/tindak-lanjut?k=ANTAR" }, { t: "Di gudang tujuan, belum diantar", href: "/app/tindak-lanjut?k=TIBA" }, { t: "Sedang diantar terlalu lama", href: "/app/tindak-lanjut?k=KURIR" }, { t: "Barang bermasalah", href: "/app/tindak-lanjut?k=MASALAH" }, { t: "Tagihan jatuh tempo", href: "/app/tindak-lanjut?k=TAGIHAN" }] },
  "/app/klaim": { mode: "laci", aksi: [{ t: "Baru", href: "/app/klaim?s=BARU" }, { t: "Diproses", href: "/app/klaim?s=DIPROSES" }, { t: "Menunggu bukti", href: "/app/klaim?s=MENUNGGU_BUKTI" }, { t: "Selesai", href: "/app/klaim?s=SELESAI" }, { t: "Ditolak", href: "/app/klaim?s=DITOLAK" }] },
  "/app/jemput": { mode: "laci", aksi: [{ t: "Baru", href: "/app/jemput?s=BARU" }, { t: "Sudah dihubungi", href: "/app/jemput?s=DIHUBUNGI" }, { t: "Dijadwalkan", href: "/app/jemput?s=DIJADWALKAN" }, { t: "Selesai dijemput", href: "/app/jemput?s=SELESAI" }, { t: "Batal", href: "/app/jemput?s=BATAL" }] },
  "/app/kendala": { mode: "laci", aksi: [{ t: "Terbuka", href: "/app/kendala" }, { t: "Selesai", href: "/app/kendala?s=selesai" }] },
  "/app/ringkasan": { mode: "kartu" },
};
const G = (slug: string, tab: string, judul: string, ket: string, icon: string, items: PusatItem[]): PusatGrup => ({ slug, tab, judul, ket, icon, items: items.map((i) => ({ ...i, ...(LACI[i.href] ?? {}) })) });
const AKUN = G("akun", "", "Akun saya", "Data diri, kata sandi, dan bantuan.", "user", [{ href: "/app/akun", icon: "user", t: "Akun dan panduan", d: "Profil, ganti kata sandi, panduan penggunaan, dan keluar." }]);
const CARI: PusatItem = { href: "/app/cari", icon: "search", t: "Cari resi", d: "Ketik nomor resi atau nama pengirim dan penerima." };
const SERAH: PusatItem = { href: "/app/serah", icon: "swap", t: "Serah terima", d: "Terima atau serahkan barang ke petugas lain dengan tombol konfirmasi." };
const DIHUBUNGI: PusatItem = { href: "/app/tindak-lanjut", icon: "chat", t: "Perlu dihubungi", d: "Pelanggan yang menunggu kabar: belum dijemput, belum diantar, atau tagihan jatuh tempo." };
const JEMPUT: PusatItem = { href: "/app/jemput", icon: "box", t: "Pesanan jemput", d: "Pesanan penjemputan dari website: hubungi pelanggan dan atur jadwalnya." };
const KLAIM: PusatItem = { href: "/app/klaim", icon: "shield", t: "Klaim dan keluhan", d: "Laporan barang rusak, hilang, atau keluhan layanan beserta usulan penyelesaiannya." };
const KENDALA: PusatItem = { href: "/app/kendala", icon: "alert", t: "Kendala pengiriman", d: "Salah sortir, barang rusak, gagal kirim, retur, dan barang ditahan." };
const MANIFEST: PusatItem = { href: "/app/manifest", icon: "layers", t: "Manifest muatan", d: "Daftar muatan satu kontainer: siapkan, segel, serahkan, dan bongkar." };
const TIMBANG: PusatItem = { href: "/app/timbang", icon: "scale", t: "Timbang barang", d: "Pindai barcode tiap barang, isi berat dan ukurannya." };
const ARUS: PusatItem = { href: "/app/arus", icon: "ship", t: "Barang masuk dan keluar", d: "Pisahkan barang yang masuk, ada di sini, keluar, dan selesai di cabang Anda." };
const SORTIR: PusatItem = { href: "/app/sortir", icon: "flip", t: "Sortir tujuan akhir", d: "Resi dikelompokkan per kabupaten atau kota tujuan akhir." };

export const PERAN_PUSAT = ["MITRA_POS", "DEPO", "HUB_MANAGER", "WAREHOUSE", "DRIVER", "CONTAINER_DRIVER", "CS_SALES", "FINANCE", "HRD", "MV", "MV_MASTER", "SUPER_ADMIN", "OWNER"];

/** Daftar halaman Pemilik dan Super Admin. */
const KELOLA: Record<string, PusatItem> = Object.fromEntries([
  { href: "/app/ringkasan", icon: "sparkle", t: "Ringkasan harian", d: "Resi baru, terkirim, uang masuk, masalah, dan kinerja tiap mitra. Bisa dibagikan ke WhatsApp." },
  { href: "/app/peta", icon: "pin", t: "Peta pantauan", d: "Posisi muatan antar kota, muatan yang terlambat, dan kota yang tertahan." },
  MANIFEST,
  { href: "/app/mv", icon: "truck", t: "Divisi MV", d: "Alokasi pengiriman keluar, HPP, pemantauan, dan dokumen tiap divisi." },
  DIHUBUNGI, KENDALA, JEMPUT, KLAIM,
  { href: "/app/keuangan", icon: "cash", t: "Keuangan", d: "Uang masuk, piutang, umur piutang, dan riwayat pembayaran." },
  { href: "/app/keuangan/belum-ditagih", icon: "file", t: "Resi belum ditagih", d: "Resi dari Kasir yang belum punya invoice. Buat invoice, retail bayar sebelum diantar, rekanan tempo setelah hard copy." },
  { href: "/app/tagihan", icon: "file", t: "Semua tagihan", d: "Cari invoice, catat pembayaran, cetak, dan kirim ke pelanggan." },
  { href: "/app/margin", icon: "tag", t: "Margin manifest dan rute", d: "Pendapatan dikurangi biaya kapal, armada, dan pelabuhan per manifest dan per rute." },
  { href: "/app/keuangan/komisi", icon: "bank", t: "Komisi mitra", d: "Ongkir dan komisi tiap mitra pada periode yang dipilih." },
  { href: "/app/laporan", icon: "chart", t: "Laporan lengkap", d: "Omzet, piutang, rute, kinerja mitra, jemput dan klaim per periode. Unduh Excel untuk pembukuan." },
  { href: "/app/petugas", icon: "user", t: "Petugas", d: "Buat akun, ganti sandi, atau nonaktifkan kurir, gudang, kasir, MV, dan lainnya." },
  { href: "/app/keuangan/input-absen", icon: "clock", t: "Input absensi", d: "Masukkan jam masuk dan pulang karyawan yang lupa absen, per cabang dan tanggal." },
  { href: "/app/keuangan/kehadiran", icon: "clock", t: "Rekap kehadiran", d: "Hadir, terlambat, tanpa absen pulang, dan di luar lokasi per cabang, langsung dari absensi karyawan." },
  { href: "/app/karyawan", icon: "user", t: "Karyawan dan absensi", d: "Data karyawan per cabang beserta kode dan PIN absen. Dikelola HRD." },
  { href: "/app/absen/qr", icon: "qr", t: "QR absensi", d: "Cetak satu QR resmi untuk semua cabang. Karyawan scan lalu isi kode dan PIN." },
  { href: "/app/pegawai", icon: "users", t: "Kepegawaian", d: "Dokumen dan masa berlakunya, shift, absensi, cuti dan izin, serta rekap kerja untuk penggajian." },
  { href: "/app/mitra", icon: "store", t: "Mitra dan cabang", d: "Daftarkan gerai mitra, gudang, rekanan, dan pelabuhan beserta komisinya." },
  { href: "/app/korporat", icon: "building", t: "Pelanggan korporat", d: "Perusahaan langganan: tempo bayar, batas kredit, tarif khusus, dan rekap tagihan." },
  { href: "/app/calon-mitra", icon: "send", t: "Calon mitra", d: "Pendaftar mitra dari website: hubungi, survei, dan catat statusnya." },
  { href: "/app/rekrutmen", icon: "eye", t: "Dashboard rekrutmen", d: "Pelamar masuk, alur seleksi, waktu respon, dan buka tutup lowongan per posisi." },
  { href: "/app/lamaran", icon: "copy", t: "Lamaran kerja", d: "Pelamar dari halaman karir: baca CV, hubungi lewat WhatsApp, dan catat statusnya." },
  { href: "/app/tarif", icon: "calc", t: "Tarif dan rute", d: "Ubah harga, minimal berat, dan jadwal. Website langsung memakai harga baru." },
  { href: "/app/tarif/riwayat", icon: "clock", t: "Riwayat harga", d: "Siapa mengubah harga, kapan, dari berapa ke berapa." },
  { href: "/app/konten", icon: "image", t: "Konten website", d: "Unggah dan atur foto dokumentasi dan testimoni yang tampil di beranda." },
  { href: "/app/pengaturan", icon: "sliders", t: "Pengaturan dan rekening", d: "Data perusahaan dan rekening bank yang tampil di invoice." },
  { href: "/app/catatan", icon: "list", t: "Catatan aktivitas", d: "Siapa mengubah apa dan kapan: akun, tarif, lamaran, konten." },
  CARI,
].map((i) => [i.href, i]));
const K = (...h: string[]) => h.map((x) => KELOLA[x]!).filter(Boolean);
/** Halaman yang hanya boleh diubah Super Admin; Pemilik hanya memantau. */
const HANYA_ADMIN = ["/app/mitra", "/app/petugas", "/app/tarif", "/app/pengaturan", "/app/korporat", "/app/calon-mitra", "/app/rekrutmen", "/app/lamaran", "/app/konten", "/app/jemput", "/app/klaim"];

export function grupPusat(role: string): { judul: string; sapa: string; grup: PusatGrup[] } {
  switch (role) {
    case "SUPER_ADMIN": case "OWNER": {
      const grup = [
        G("operasional", "Operasi", "Operasional harian", "Pantau muatan, pelanggan, dan masalah.", "truck", K("/app/ringkasan", "/app/peta", "/app/manifest", "/app/mv", "/app/tindak-lanjut", "/app/kendala", "/app/jemput", "/app/klaim", "/app/cari")),
        G("uang", "Uang", "Uang dan laporan", "Pemasukan, piutang, margin, dan komisi.", "cash", K("/app/keuangan", "/app/keuangan/belum-ditagih", "/app/tagihan", "/app/margin", "/app/keuangan/komisi", "/app/keuangan/input-absen", "/app/keuangan/kehadiran", "/app/laporan")),
        G("orang", "Orang", "Orang dan mitra", "Petugas, pegawai, mitra, pelanggan, dan rekrutmen.", "users", K("/app/petugas", "/app/karyawan", "/app/pegawai", "/app/absen/qr", "/app/mitra", "/app/korporat", "/app/calon-mitra", "/app/rekrutmen", "/app/lamaran")),
        G("sistem", "Sistem", "Harga, website, dan sistem", "Tarif, konten, pengaturan, dan catatan aktivitas.", "sliders", K("/app/tarif", "/app/tarif/riwayat", "/app/konten", "/app/pengaturan", "/app/catatan")),
        AKUN,
      ].map((g) => (role === "OWNER" ? { ...g, items: g.items.filter((i) => !HANYA_ADMIN.includes(i.href)) } : g)).filter((g) => g.items.length > 0);
      return { judul: "Kelola bisnis", sapa: "Semua pengaturan dikelompokkan menurut pekerjaannya. Setiap perubahan tercatat permanen.", grup };
    }
    case "MITRA_POS": return { judul: "Pusat Kasir", sapa: "Semua alat Kasir, dikelompokkan menurut pekerjaannya.", grup: [
      G("kontak", "Kontak", "Pelanggan", "Jaga hubungan dan jawab pertanyaan.", "users", [DIHUBUNGI, JEMPUT, CARI]),
      G("muatan", "Muatan", "Manifest dan arus barang", "Susun manifest dan pantau barang masuk dan keluar.", "layers", [MANIFEST, ARUS]), AKUN] };
    case "DEPO": return { judul: "Pusat Depo", sapa: "Terima barang, buat resi cepat, dan susun manifest di depo Anda.", grup: [
      G("muatan", "Muatan", "Manifest dan arus barang", "Susun manifest dan pantau barang masuk dan keluar.", "layers", [MANIFEST, ARUS, CARI]), AKUN] };
    case "HUB_MANAGER": return { judul: "Pusat Gudang", sapa: "Muatan, masalah, dan pelanggan cabang Anda.", grup: [
      G("gudang", "Gudang", "Muatan dan barang", "Penimbangan, sortir, dan pencarian.", "layers", [TIMBANG, SORTIR, CARI]),
      G("masalah", "Masalah", "Masalah dan pelanggan", "Yang perlu ditindaklanjuti hari ini.", "alert", [KENDALA, DIHUBUNGI, JEMPUT]), AKUN] };
    case "WAREHOUSE": return { judul: "Pusat Gudang", sapa: "Kerja harian petugas gudang.", grup: [
      G("gudang", "Gudang", "Kerja gudang", "Sortir dan pencarian barang.", "box", [SORTIR, CARI]),
      G("masalah", "Masalah", "Masalah dan pelanggan", "Laporkan dan pantau.", "alert", [KENDALA, DIHUBUNGI]), AKUN] };
    case "DRIVER": return { judul: "Pusat Kurir", sapa: "Tugas jemput dan antar Anda.", grup: [
      G("lain", "Lainnya", "Alat bantu", "Cari resi dan akun.", "grid", [CARI]), AKUN] };
    case "CONTAINER_DRIVER": return { judul: "Pusat Sopir", sapa: "Muatan yang Anda bawa.", grup: [
      G("lain", "Lainnya", "Alat bantu", "Cari resi dan akun.", "grid", [CARI]), AKUN] };
    case "CS_SALES": return { judul: "Pusat Layanan Pelanggan", sapa: "Pelanggan, pesanan, dan keluhan.", grup: [
      G("layanan", "Layanan", "Pelanggan", "Hubungi dan cari resi.", "users", [DIHUBUNGI, CARI]), AKUN] };
    case "FINANCE": return { judul: "Pusat Keuangan", sapa: "Uang masuk, tagihan, biaya, dan laporan.", grup: [
      G("dokumen", "Dokumen", "Komisi dan dokumen", "Komisi mitra dan surat jalan balik dari MV.", "file", [{ href: "/app/keuangan/belum-ditagih", icon: "file", t: "Resi belum ditagih", d: "Buat invoice dari resi Kasir. Retail bayar sebelum diantar, rekanan tempo setelah hard copy." }, { href: "/app/keuangan/input-absen", icon: "clock", t: "Input absensi", d: "Masukkan jam masuk dan pulang karyawan yang lupa absen, per cabang dan tanggal." }, { href: "/app/keuangan/komisi", icon: "bank", t: "Komisi mitra", d: "Ongkir dan komisi tiap mitra pada periode yang dipilih." }, { href: "/app/keuangan/sj", icon: "file", t: "SJ balik dari MV", d: "Surat jalan yang sudah diserahkan MV beserta tanda terimanya." }, { href: "/app/absen/qr", icon: "qr", t: "QR absensi", d: "Cetak QR resmi untuk semua cabang. Karyawan scan lalu isi kode dan PIN." }, { href: "/app/karyawan", icon: "user", t: "Data karyawan", d: "Daftar karyawan per cabang dan kode pegawai (dikelola HRD)." }, CARI]), AKUN] };
    case "HRD": return { judul: "Pusat HRD", sapa: "Rekrutmen dan kepegawaian.", grup: [
      G("pegawai", "Atur", "Kepegawaian", "Data dan jadwal pegawai.", "user", [{ href: "/app/karyawan", icon: "users", t: "Karyawan dan absensi", d: "Tambah karyawan per cabang, buat kode dan PIN absen, koreksi absen." }, { href: "/app/absen/qr", icon: "qr", t: "QR absensi", d: "Cetak QR resmi untuk semua cabang." }, { href: "/app/karyawan/cabang", icon: "sliders", t: "Pengaturan absen cabang", d: "Jam masuk, toleransi, radius lokasi, dan kewajiban selfie." }, { href: "/app/keuangan/kehadiran", icon: "chart", t: "Rekap kehadiran", d: "Kehadiran per cabang yang juga terbaca Finance." }, { href: "/app/pegawai?t=daftar", icon: "user", t: "Daftar pegawai", d: "Pegawai aktif dan status absen hari ini." }, { href: "/app/pegawai?t=dokumen", icon: "file", t: "Dokumen pegawai", d: "SIM, KTP, dan kontrak beserta masa berlakunya." }, { href: "/app/pegawai?t=shift", icon: "clock", t: "Shift", d: "Atur shift pagi, siang, malam, atau libur." }, { href: "/app/pegawai?t=cuti", icon: "shield", t: "Cuti dan izin", d: "Setujui atau tolak pengajuan." }, { href: "/app/pegawai?t=rekap", icon: "chart", t: "Rekap kerja", d: "Rekap per tanggal untuk penggajian, unduh CSV." }]), AKUN] };
    case "MV": case "MV_MASTER": return { judul: "Pusat MV", sapa: "Vendor, penjualan, dan pencarian.", grup: [
      G("lain", "Lainnya", "Vendor dan penjualan", "Catatan vendor, manifest udara, dan angka penjualan.", "chart", [{ href: "/app/mv/kiriman", icon: "image", t: "Kiriman vendor", d: "Foto dan laporan dari vendor lewat link khusus, tanpa akun." }, { href: "/app/mv/vendor", icon: "users", t: "Vendor", d: "Catat vendor dan rutenya. Vendor yang sudah dicatat tersimpan otomatis." }, { href: "/app/mv/udara", icon: "plane", t: "Manifest udara", d: "Unggah dan periksa manifest udara." }, { href: "/app/mv/penjualan", icon: "chart", t: "Penjualan per cabang", d: "Dikelompokkan per cabang dan moda, dengan saring cepat." }, CARI]), AKUN] };
    default: return { judul: "Pusat", sapa: "", grup: [AKUN] };
  }
}

/** Tombol bawah dari kelompok: satu tombol per kelompok yang punya label. `klaim` = halaman yang sudah punya tombol sendiri. */
export function tabsGrup(role: string, klaim: string[] = []) {
  const dipakai = new Set(klaim);
  return grupPusat(role).grup.filter((g) => g.tab).map((g) => {
    const also = g.items.map((i) => i.href.split("?")[0]!).filter((h) => !dipakai.has(h));
    also.forEach((h) => dipakai.add(h));
    return { href: `/app/pusat?g=${g.slug}`, label: g.tab, icon: g.icon, grup: g.slug, also };
  });
}
