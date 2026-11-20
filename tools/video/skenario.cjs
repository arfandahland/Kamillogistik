/** Daftar video tutorial. Tiap skenario merekam aplikasi asli dengan keterangan bahasa Indonesia. */
const RESI = process.env.RESI_DEMO || "";
const AKUN = { kasir: ["kasir@uji.id", "Test1234"], kurir: ["kurir@uji.id", "Test1234"], gudang: ["gudang@uji.id", "Test1234"], manajer: ["manajer@uji.id", "Test1234"], sopir: ["sopir@uji.id", "Test1234"], hrd: ["hrd@uji.id", "Test1234"], owner: ["owner@uji.id", "Test1234"] };
const pilihTeks = async (page, sel, teks) => { const v = await page.evaluate(([s, t]) => { const o = [...document.querySelector(s).options].find((x) => x.textContent.includes(t)); return o ? o.value : null; }, [sel, teks]); return v; };

/** Tur dashboard: menyorot kartu satu per satu. */
const tur = (judulKartu) => async (t) => {
  await t.buka("/app", 1200);
  const kartu = t.page.locator(".hubcard");
  const n = await kartu.count();
  for (let i = 0; i < Math.min(n, judulKartu.length); i++) await t.sorot(kartu.nth(i), judulKartu[i], 2600);
};

const tur2 = (pasang, teks) => async (t) => {
  for (let i = 0; i < teks.length; i++) { const el = t.page.locator(pasang).nth(i); if (await el.count()) await t.sorot(el, teks[i], 2500); }
};

module.exports = [
  { id: "hitung-ongkir", peran: "publik", judul: "Cara menghitung ongkir", ringkas: "Pilih kota asal dan tujuan, isi berat barang, ongkir langsung tampil.", jumlahLangkah: 6,
    langkah: async (t) => {
      await t.kartu("Tutorial", "Menghitung ongkir", "Tanpa daftar, tanpa login. Hanya 1 menit.", 2400);
      await t.buka("/ongkir", 900);
      await t.kata("Buka halaman Hitung ongkir", 1400);
      const v1 = await pilihTeks(t.page, "#asal", "Jakarta"); if (v1) await t.pilih(t.page.locator("#asal"), v1, "Pilih kota asal barang");
      const v2 = await pilihTeks(t.page, "#tujuan", "Makassar"); if (v2) await t.pilih(t.page.locator("#tujuan"), v2, "Pilih kota tujuan");
      await t.isi(t.page.locator("#w0"), "25", "Isi berat barang dalam kilogram");
      await t.klik(t.page.locator("button.btn:has-text('Hitung')").first(), "Tekan tombol Hitung ongkir", { tungguSetelah: 1800 });
      await t.gulir(380, "Ongkir dan perkiraan lama kirim tampil di sini", 2400);
      await t.kartu("Selesai", "Mudah, bukan?", "Mau dijemput? Buka menu Pesan jemput.", 2400);
    } },
  { id: "cek-resi", peran: "publik", judul: "Cara melacak barang dengan nomor resi", ringkas: "Ketik nomor resi, lihat posisi barang dan riwayat perjalanannya.", jumlahLangkah: 5,
    langkah: async (t) => {
      await t.kartu("Tutorial", "Melacak barang", "Nomor resi ada di struk atau pesan WhatsApp dari kami.", 2600);
      await t.buka("/lacak", 900);
      await t.kata("Buka halaman Cek resi", 1400);
      await t.isi(t.page.locator("#resi"), RESI || "KLX-JKT-MKS-LJ-261112-0830-0001-RH", "Ketik nomor resi Anda");
      await t.klik(t.page.locator("button.btn:has-text('Cek posisi')"), "Tekan Cek posisi barang", { tungguSetelah: 2200 });
      await t.gulir(420, "Lihat tahap perjalanan: dari dijemput sampai diterima", 2600);
      await t.kata("Ada masalah? Tekan Laporkan masalah barang ini", 2200);
      await t.kartu("Selesai", "Pantau kapan saja", "Gratis, tanpa login, 24 jam.", 2400);
    } },
  { id: "pesan-jemput", peran: "publik", judul: "Cara memesan jemput barang", ringkas: "Isi formulir singkat, kurir menjemput ke alamat Anda.", jumlahLangkah: 8,
    langkah: async (t) => {
      await t.kartu("Tutorial", "Pesan jemput barang", "Kurir datang ke rumah atau kantor Anda.", 2500);
      await t.buka("/jemput", 900);
      await t.kata("Buka halaman Pesan jemput", 1400);
      await t.pilih(t.page.locator("#layanan"), "DARAT", "Pilih jenis layanan");
      await t.isi(t.page.locator("#nama"), "Rina Maharani", "Isi nama Anda");
      await t.isi(t.page.locator("#hp"), "0812 7788 4455", "Isi nomor WhatsApp aktif");
      await t.isi(t.page.locator("#kota"), "Makassar", "Kota penjemputan");
      await t.isi(t.page.locator("#alamat"), "Jl. Perintis Kemerdekaan No. 21, dekat apotek", "Alamat jemput selengkapnya");
      await t.isi(t.page.locator("#tujuan"), "Jayapura", "Kota tujuan");
      await t.isi(t.page.locator("#barang"), "3 kardus pakaian", "Jelaskan barang yang dikirim");
      await t.klik(t.page.locator("form button.btn"), "Tekan Pesan jemput sekarang", { tungguSetelah: 2200 });
      await t.kata("Kode pesanan muncul. Tim kami menghubungi lewat WhatsApp", 2600);
      await t.kartu("Selesai", "Pesanan terkirim", "Gratis memesan. Ongkir dihitung setelah barang ditimbang.", 2400);
    } },
  { id: "klaim-keluhan", peran: "publik", judul: "Cara melaporkan barang rusak atau hilang", ringkas: "Laporkan masalah kiriman, tim after sales menghubungi lewat WhatsApp.", jumlahLangkah: 7,
    langkah: async (t) => {
      await t.kartu("Tutorial", "Klaim dan keluhan", "Barang rusak, hilang, atau terlambat? Laporkan di sini.", 2600);
      await t.buka("/klaim", 900);
      await t.kata("Buka halaman Klaim dan keluhan", 1400);
      await t.pilih(t.page.locator("#jenis"), "RUSAK", "Pilih jenis masalahnya");
      await t.isi(t.page.locator("#resi"), RESI || "KLX-JKT-MKS-LJ-261112-0830-0001-RH", "Isi nomor resi jika ada");
      await t.isi(t.page.locator("#nama"), "Siti Nurhaliza", "Isi nama Anda");
      await t.isi(t.page.locator("#hp"), "0813 5566 9900", "Isi nomor WhatsApp aktif");
      await t.isi(t.page.locator("#cerita"), "Kardus basah dan isinya pecah saat tiba.", "Ceritakan kejadiannya");
      await t.klik(t.page.locator("form button.btn"), "Tekan Kirim laporan", { tungguSetelah: 2200 });
      await t.kata("Simpan kode laporan, lalu hubungi after sales lewat tombol WhatsApp", 2600);
      await t.kartu("Selesai", "Laporan diterima", "Kami tidak pernah memungut biaya untuk memproses laporan.", 2400);
    } },
  { id: "lamar-kerja", peran: "publik", judul: "Cara melamar kerja di Kamil Logistik", ringkas: "Pilih posisi, isi data, unggah CV dari HP.", jumlahLangkah: 5,
    langkah: async (t) => {
      await t.kartu("Tutorial", "Melamar kerja", "Semua bisa dari HP, tanpa datang dulu.", 2400);
      await t.buka("/karir", 900);
      await t.kata("Buka halaman Karir", 1400);
      await t.klik(t.page.locator(".jobrow summary").nth(1), "Ketuk posisi yang diminati", { tungguSetelah: 1400 });
      await t.klik(t.page.locator(".jobrow[open] a.btn").first(), "Tekan Lamar posisi ini", { tungguSetelah: 1600 });
      await t.sorot(t.page.locator(".mdlbox").first(), "Isi data diri, lalu unggah CV (PDF atau foto)", 3200);
      await t.kartu("Selesai", "Kami hubungi lewat WhatsApp", "Tidak ada biaya apa pun dalam proses rekrutmen.", 2600);
    } },
  { id: "jadi-mitra", peran: "publik", judul: "Cara mendaftar jadi mitra", ringkas: "Punya gerai atau gudang? Daftar jadi mitra dan dapat komisi per resi.", jumlahLangkah: 5,
    langkah: async (t) => {
      await t.kartu("Tutorial", "Jadi mitra Kamil Logistik", "Gerai, gudang, atau rekanan angkutan.", 2500);
      await t.buka("/mitra", 900);
      await t.kata("Buka halaman Jadi mitra", 1400);
      await t.gulir(520, "Baca keuntungan menjadi mitra", 2000);
      const tombol = t.page.locator("a.btn, button.btn").filter({ hasText: /Daftar/ }).first();
      await t.klik(tombol, "Tekan Daftar jadi mitra", { tungguSetelah: 1500 });
      await t.sorot(t.page.locator(".mdlbox").first(), "Isi jenis kemitraan, nama usaha, dan nomor WhatsApp", 3200);
      await t.kartu("Selesai", "Tim kami survei lokasi", "Tidak ada biaya pendaftaran.", 2400);
    } },
  { id: "kasir-buat-resi", peran: "kasir", judul: "Kasir: membuat resi baru", ringkas: "Pilih rute, isi pengirim dan penerima, resi langsung jadi.", jumlahLangkah: 9, masuk: AKUN.kasir,
    langkah: async (t) => {
      await t.kartu("Tutorial kasir", "Membuat resi baru", "Dari terima barang sampai resi siap dicetak.", 2500);
      await t.buka("/app", 900);
      await t.klik(t.page.locator("a[href='/app/baru']").first(), "Tekan Buat resi baru", { tungguSetelah: 1400 });
      const v = await pilihTeks(t.page, "#rute", "Jakarta → Makassar · Diantar sampai alamat"); if (v) await t.pilih(t.page.locator("#rute"), v, "Pilih rute pengiriman");
      await t.isi(t.page.locator("#pengirim"), "Toko Bangunan Sumber Rejeki", "Isi nama pengirim");
      await t.isi(t.page.locator("#hp_pengirim"), "081234567890", "Isi nomor HP pengirim");
      await t.isi(t.page.locator("#penerima"), "Pak Syamsul", "Isi nama penerima");
      await t.isi(t.page.locator("#hp_penerima"), "082233445566", "Isi nomor HP penerima");
      await t.isi(t.page.locator("#alamat"), "Jl. Pettarani No. 5, Makassar", "Isi alamat penerima");
      await t.isi(t.page.locator("#jumlah"), "2", "Jumlah barang atau koli");
      await t.klik(t.page.getByRole("button", { name: "Buat resi" }), "Tekan Buat resi", { tungguSetelah: 2600 });
      await t.kata("Resi jadi. Kirim lewat WhatsApp atau cetak label barcode", 2600);
      await t.kartu("Selesai", "Resi siap dipakai", "Tempel label di barang, lalu serahkan ke kurir.", 2400);
    } },
  { id: "dashboard-kasir", peran: "kasir", judul: "Kasir: membaca dashboard", ringkas: "Kas hari ini, piutang, resi perlu ditimbang, dan pelanggan langganan.", jumlahLangkah: 5, masuk: AKUN.kasir,
    langkah: async (t) => {
      await t.kartu("Tutorial kasir", "Dashboard kasir", "Semua yang perlu Anda pantau hari ini.", 2400);
      await tur(["Kas hari ini: tunai dan transfer. Kirim setoran ke Pemilik lewat WhatsApp", "Ringkasan bulan ini dan komisi", "Piutang cabang dan yang lewat jatuh tempo", "Resi yang perlu ditimbang", "Pelanggan langganan, ketuk Chat untuk menyapa"])(t);
      await t.kartu("Selesai", "Tutup shift dengan rapi", "Kirim setoran setiap sore.", 2400);
    } },
  { id: "dashboard-manajer-gudang", peran: "manajer", judul: "Manajer gudang: membaca dashboard", ringkas: "Papan gudang, barang mengendap, agenda manifest, kinerja tim, dan laporan shift.", jumlahLangkah: 6, masuk: AKUN.manajer,
    langkah: async (t) => {
      await t.kartu("Tutorial manajer gudang", "Dashboard gudang", "Satu layar untuk mengendalikan gudang.", 2500);
      await tur(["Papan gudang: isi gudang per tahap dan beratnya", "Target hari ini dibanding rata-rata 7 hari", "Barang mengendap lebih 24 jam. Ketuk ikon chat untuk menghubungi penerima", "Agenda manifest berangkat dan tiba", "Selisih manifest yang belum selesai", "Serah terima yang macet lebih 4 jam"])(t);
      await t.kartu("Selesai", "Lapor akhir shift", "Tekan Kirim ringkasan ke Pemilik di bagian bawah.", 2600);
    } },
  { id: "dashboard-staf-gudang", peran: "gudang", judul: "Staf gudang: membaca dashboard", ringkas: "Isi gudang, antrean timbang, manifest yang disiapkan, dan hasil kerja hari ini.", jumlahLangkah: 4, masuk: AKUN.gudang,
    langkah: async (t) => {
      await t.kartu("Tutorial staf gudang", "Dashboard staf gudang", "Tahu apa yang dikerjakan lebih dulu.", 2400);
      await tur(["Isi gudang dan antrean", "Antrean timbang, yang paling lama tertulis merah", "Manifest yang sedang disiapkan", "Hasil kerja Anda hari ini"])(t);
      await t.kartu("Selesai", "Pindai setiap barang", "Gunakan tombol Pindai di bawah layar.", 2400);
    } },
  { id: "dashboard-kurir", peran: "kurir", judul: "Kurir: membaca dashboard dan mengantar barang", ringkas: "Barang yang dibawa, tombol peta dan chat penerima, serta hitungan hari ini.", jumlahLangkah: 4, masuk: AKUN.kurir,
    langkah: async (t) => {
      await t.kartu("Tutorial kurir", "Dashboard kurir", "Barang di tangan Anda, lengkap dengan alamat.", 2400);
      await tur(["Barang yang saya bawa. Ketuk ikon peta atau chat", "Barang yang menunggu Anda terima", "Hitungan dijemput dan diantar hari ini", "Ringkasan 7 hari terakhir"])(t);
      await t.kartu("Selesai", "Bukti terima wajib", "Foto barang dan tanda tangan penerima di layar.", 2600);
    } },
  { id: "dashboard-sopir", peran: "sopir", judul: "Sopir kontainer: muatan dan manifest", ringkas: "Muatan yang dibawa, segel, jadwal berangkat dan tiba.", jumlahLangkah: 3, masuk: AKUN.sopir,
    langkah: async (t) => {
      await t.kartu("Tutorial sopir", "Dashboard sopir", "Muatan Anda, lengkap dengan segel dan jadwal.", 2400);
      await tur(["Muatan saya: nomor segel, kontainer, jadwal berangkat dan tiba", "Manifest yang menunggu Anda terima", "Riwayat perjalanan"])(t);
      await t.kartu("Selesai", "Terima dan serahkan lewat aplikasi", "Setiap serah terima tercatat.", 2400);
    } },
  { id: "dashboard-pemilik", peran: "owner", judul: "Pemilik: memantau bisnis dari HP", ringkas: "Pusat peringatan, proyeksi omzet, perbandingan cabang, dan pelanggan teratas.", jumlahLangkah: 6, masuk: AKUN.owner,
    langkah: async (t) => {
      await t.kartu("Tutorial Pemilik", "Memantau bisnis", "Hanya memantau, semua data langsung dari lapangan.", 2500);
      await tur(["Pusat peringatan: semua yang perlu perhatian, ketuk untuk membuka", "Proyeksi omzet bulan ini dan target bulanan", "Perbandingan cabang dan mitra 30 hari", "Pelanggan teratas dan yang lama tidak kirim", "Kepuasan pelanggan", "Kesehatan sistem"])(t);
      await t.kartu("Selesai", "Pantau kapan saja", "Dari HP, di mana saja.", 2400);
    } },
  { id: "laporan-ekspor", peran: "owner", judul: "Pemilik: laporan lengkap dan unduh Excel", ringkas: "Pilih periode, baca laporan, unduh CSV untuk pembukuan.", jumlahLangkah: 5, masuk: AKUN.owner,
    langkah: async (t) => {
      await t.kartu("Tutorial Pemilik", "Laporan dan Excel", "Untuk pembukuan dan rapat bulanan.", 2400);
      await t.buka("/app/laporan", 1200);
      await t.kata("Buka Kelola, lalu Laporan lengkap", 1600);
      await t.klik(t.page.locator("a.fchip", { hasText: "Bulan ini" }), "Pilih periode, misalnya Bulan ini", { tungguSetelah: 1800 });
      await t.gulir(520, "Baca ringkasan keuangan dan operasional", 2400);
      await t.gulir(900, "Grafik rute, cabang, dan komisi", 2400);
      await t.gulir(1500, "Gulir ke bawah untuk Unduh Excel (CSV)", 2600);
      await t.kartu("Selesai", "Satu ketukan, satu berkas", "Setiap unduhan tercatat di catatan aktivitas.", 2400);
    } },
  { id: "hrd-lamaran", peran: "hrd", judul: "HRD: mengelola pelamar kerja", ringkas: "Dashboard rekrutmen, baca CV, hubungi pelamar, dan atur status seleksi.", jumlahLangkah: 5, masuk: AKUN.hrd,
    langkah: async (t) => {
      await t.kartu("Tutorial HRD", "Mengelola pelamar", "Dari lamaran masuk sampai diterima.", 2500);
      await t.buka("/app/rekrutmen", 1200);
      await t.kata("Dashboard rekrutmen: ringkasan pelamar dan alur seleksi", 2600);
      await t.gulir(520, "Pelamar yang perlu segera dihubungi tampil di sini", 2400);
      await t.gulir(900, "Buka atau tutup lowongan dengan satu ketukan", 2400);
      await t.buka("/app/lamaran", 1200);
      await t.kata("Menu Lamaran: ketuk pelamar, baca CV, lalu tekan Chat", 2800);
      await t.kata("Ubah status: Dihubungi, Wawancara, Diterima, atau Tidak lolos", 2600);
      await t.kartu("Selesai", "Unduh Excel kapan saja", "Tombol Unduh Excel ada di atas daftar lamaran.", 2400);
    } },
];
