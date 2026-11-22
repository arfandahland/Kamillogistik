/** Halaman layanan (/layanan/[slug]). Daftar layanan bersumber dari Company Profile; isi penjelasan bersifat umum dan tidak memuat harga atau janji waktu. */
export type Layanan = {
  slug: string; judul: string; kategori: "Laut" | "Udara" | "Darat" | "Khusus" | "Bisnis"; icon: string; ringkas: string; judulSeo: string; deskSeo: string;
  intro: string[]; daftarJudul: string; daftar: string[]; tips: string[]; faq: { q: string; a: string }[]; pesanWa: string; kata: string[];
};

const LANGKAH_UMUM = [
  { t: "Hubungi tim", d: "Ceritakan barang, asal, tujuan, dan jadwal yang Anda inginkan lewat WhatsApp." },
  { t: "Terima penawaran", d: "Kami menghitung biaya dan jadwal yang sesuai, lengkap dengan keterangan yang belum termasuk." },
  { t: "Barang dijemput atau diantar", d: "Barang diperiksa, difoto, dan dicatat. Anda menerima nomor resi." },
  { t: "Pantau sampai tiba", d: "Lacak posisi barang kapan saja lewat nomor resi, tanpa perlu login." },
];
export { LANGKAH_UMUM };

export const LAYANAN: Layanan[] = [
  {
    slug: "cargo-laut", judul: "Pengiriman Cargo Laut", kategori: "Laut", icon: "ship",
    ringkas: "Cargo kering, cair, kontainer, oversize, mudah rusak, dan barang berbahaya lewat laut.",
    judulSeo: "Jasa Pengiriman Cargo Laut ke Seluruh Indonesia: Jakarta, Makassar, Surabaya", deskSeo: "Jasa cargo laut Kamil Logistik: dry cargo, liquid cargo, container, oversize, perishable, dan hazardous cargo ke seluruh Indonesia, dari Jawa hingga Sulawesi, Maluku, dan Papua. Tarif jelas, resi bisa dilacak.",
    intro: ["Cargo laut cocok untuk barang berat atau dalam jumlah banyak yang tidak mengejar kecepatan. Biayanya lebih hemat dibanding udara, dan kapasitasnya besar.", "Kamil Logistik melayani pengiriman laut dari Jakarta dan Makassar ke berbagai kota di Sulawesi, Maluku, dan Papua, termasuk barang dengan penanganan khusus."],
    daftarJudul: "Jenis cargo laut yang kami layani", daftar: ["Dry cargo (barang kering umum)", "Liquid cargo (barang cair)", "Container cargo (kontainer)", "Oversize cargo dan heavy equipment cargo", "Perishable cargo (barang mudah rusak atau butuh penanganan cepat)", "Hazardous cargo (barang berbahaya, dengan aturan khusus)"],
    tips: ["Kemas dengan kardus berlapis atau kayu untuk barang berat, karena perjalanan laut melewati banyak bongkar muat.", "Beri label nama dan kota tujuan yang jelas pada tiap kemasan.", "Barang berbahaya atau mudah rusak wajib dikonsultasikan lebih dulu ke tim kami."],
    faq: [{ q: "Berapa biaya cargo laut?", a: "Biaya dihitung per kilo atau per meter kubik tergantung jenis layanan dan rute. Lihat tarif per rute di halaman Rute dan tarif, atau hitung sendiri di kalkulator ongkir." }, { q: "Apakah barang berbahaya bisa dikirim?", a: "Bisa untuk jenis tertentu dengan aturan khusus. Hubungi tim kami sebelum menyiapkan barang agar kemasan dan dokumennya sesuai." }, { q: "Bagaimana memantau barang?", a: "Setiap resi bisa dilacak di halaman Cek resi tanpa login." }],
    pesanWa: "Halo Kamil Logistik, saya mau tanya pengiriman cargo laut.", kata: ["cargo laut", "ekspedisi laut", "kirim barang lewat laut", "container cargo"],
  },
  {
    slug: "cargo-udara", judul: "Pengiriman Cargo Udara", kategori: "Udara", icon: "plane",
    ringkas: "One day, same day, regular, dan hand carry untuk barang yang butuh cepat.",
    judulSeo: "Jasa Kirim Barang Lewat Udara: One Day, Same Day, Regular, Hand Carry", deskSeo: "Cargo udara Kamil Logistik: one day service, same day service, regular service, dan hand carry untuk barang mendesak ke seluruh Indonesia.",
    intro: ["Cargo udara dipilih saat waktu lebih penting dari biaya: dokumen, suku cadang, barang bernilai tinggi, atau pesanan mendesak.", "Perhitungan biaya udara memakai berat yang lebih besar antara berat aktual dan berat volume, sehingga kemasan yang padat lebih hemat."],
    daftarJudul: "Pilihan layanan udara", daftar: ["One day service", "Same day service", "Regular service", "Hand carry service"],
    tips: ["Padatkan kemasan agar berat volume tidak jauh lebih besar dari berat aktual.", "Siapkan data penerima lengkap dengan nomor yang bisa dihubungi.", "Tanyakan batas ukuran dan berat per kemasan sebelum barang disiapkan."],
    faq: [{ q: "Mana yang lebih cepat, same day atau one day?", a: "Same day diprioritaskan tiba pada hari yang sama bila rute dan jadwal memungkinkan, one day pada hari berikutnya. Ketersediaan bergantung rute, jadi konfirmasikan ke tim kami." }, { q: "Apa itu hand carry?", a: "Barang dibawa langsung oleh petugas dalam perjalanan, cocok untuk barang kecil yang sangat penting." }, { q: "Bagaimana menghitung biaya udara?", a: "Dari berat yang lebih besar antara berat aktual dan berat volume. Pelajari rumusnya di panduan menghitung ongkir cargo." }],
    pesanWa: "Halo Kamil Logistik, saya mau tanya pengiriman cargo udara.", kata: ["cargo udara", "kirim barang lewat pesawat", "same day", "hand carry"],
  },
  {
    slug: "cargo-darat", judul: "Pengiriman Cargo Darat (FTL dan LTL)", kategori: "Darat", icon: "truck",
    ringkas: "Truk penuh (FTL), muatan gabungan (LTL), dan jasa mover.",
    judulSeo: "Ekspedisi Cargo Darat: FTL, LTL, dan Mover | Kamil Logistik", deskSeo: "Cargo darat Kamil Logistik: Full Truck Load (FTL), Less than Truck Load (LTL), dan mover untuk pengiriman antar kota.",
    intro: ["Pengiriman darat fleksibel untuk antar kota di pulau yang sama dan sebagai penyambung dari dan ke pelabuhan.", "Untuk muatan besar Anda bisa memesan satu truk penuh (FTL). Untuk muatan lebih kecil, barang digabung dengan muatan lain (LTL) sehingga biaya lebih terjangkau."],
    daftarJudul: "Layanan darat", daftar: ["Full Truck Load (FTL): satu truk untuk satu pelanggan", "Less than Truck Load (LTL): muatan gabungan", "Mover: bantuan pemindahan dan pengangkutan"],
    tips: ["Pilih FTL bila muatan memenuhi sebagian besar bak truk atau butuh jadwal pasti.", "Pilih LTL bila muatan sedikit dan tidak mendesak.", "Sebutkan akses lokasi bongkar muat (lebar jalan, jam operasional)."],
    faq: [{ q: "Kapan memilih FTL dan kapan LTL?", a: "FTL untuk muatan besar atau jadwal khusus. LTL untuk muatan kecil yang digabung dengan pengirim lain agar lebih hemat." }, { q: "Apakah bisa dijemput?", a: "Bisa. Tim kami dapat menjemput barang di alamat Anda sesuai area layanan." }, { q: "Apakah ada layanan mover?", a: "Ada. Mover membantu pemindahan dan pengangkutan barang yang berat atau besar." }],
    pesanWa: "Halo Kamil Logistik, saya mau tanya pengiriman cargo darat (FTL/LTL).", kata: ["ekspedisi darat", "FTL", "LTL", "sewa truk"],
  },
  {
    slug: "cargo-logistik-bisnis", judul: "Cargo Logistik untuk Bisnis", kategori: "Bisnis", icon: "building",
    ringkas: "Pesan kendaraan penuh (FTL) untuk kebutuhan ekspedisi bisnis dalam jumlah besar.",
    judulSeo: "Ekspedisi untuk Perusahaan dan Bisnis: Kirim Cargo Jumlah Besar", deskSeo: "Solusi ekspedisi bisnis Kamil Logistik: pesan kendaraan FTL untuk muatan besar, tarif khusus, dan pelacakan resi untuk perusahaan.",
    intro: ["Kamil Logistik mengakomodasi sebagian besar kebutuhan ekspedisi bisnis dengan pemesanan kendaraan penuh (FTL) untuk muatan dalam jumlah besar.", "Untuk pelanggan perusahaan tersedia tempo pembayaran, tarif khusus per rute, dan rekap tagihan, sesuai kesepakatan."],
    daftarJudul: "Yang didapat pelanggan bisnis", daftar: ["Pemesanan kendaraan FTL untuk muatan besar", "Tarif khusus per rute sesuai kesepakatan", "Tempo pembayaran dan rekap tagihan", "Portal pelacakan untuk melihat resi dan tagihan"],
    tips: ["Siapkan perkiraan volume pengiriman per bulan agar penawaran tepat.", "Tetapkan satu penanggung jawab di sisi perusahaan untuk koordinasi.", "Minta jadwal rutin bila pengiriman berulang."],
    faq: [{ q: "Apakah ada tarif khusus perusahaan?", a: "Ada, dibahas sesuai rute dan volume." }, { q: "Bagaimana pembayarannya?", a: "Pembayaran dengan transfer atau tunai. Untuk pelanggan korporat tersedia tempo sesuai kesepakatan." }, { q: "Apakah bisa memantau semua kiriman sekaligus?", a: "Bisa lewat portal korporat yang menampilkan resi dan tagihan perusahaan Anda." }],
    pesanWa: "Halo Kamil Logistik, perusahaan kami butuh penawaran ekspedisi untuk muatan besar.", kata: ["ekspedisi perusahaan", "kirim barang B2B", "FTL besar"],
  },
  {
    slug: "kirim-kendaraan", judul: "Kirim Kendaraan: Motor, Mobil, Truk, Bus", kategori: "Khusus", icon: "truck",
    ringkas: "Mobil pribadi dan klasik, motor, truk, bus, termasuk kendaraan perusahaan dan tambang.",
    judulSeo: "Jasa Kirim Motor dan Mobil Antar Pulau ke Seluruh Indonesia", deskSeo: "Kirim kendaraan lewat Kamil Logistik: mobil pribadi, mobil klasik, motor, truk, dan bus. Aman, terdokumentasi, bisa dilacak.",
    intro: ["Kami melayani pengiriman kendaraan, baik kendaraan pribadi, kendaraan perusahaan atau lembaga, maupun kendaraan tambang.", "Kondisi kendaraan didokumentasikan dengan foto saat diterima sehingga ada bukti yang sama bagi pengirim dan penerima."],
    daftarJudul: "Kendaraan yang bisa dikirim", daftar: ["Mobil pribadi dan mobil klasik", "Motor", "Truk dan bus", "Kendaraan perusahaan atau lembaga", "Kendaraan tambang"],
    tips: ["Bersihkan kendaraan dan keluarkan barang pribadi dari dalamnya.", "Foto kondisi kendaraan dari semua sisi sebelum diserahkan.", "Tanyakan dokumen yang diminta untuk jenis kendaraan Anda sebelum hari pengiriman."],
    faq: [{ q: "Dokumen apa yang disiapkan?", a: "Umumnya salinan identitas pemilik dan dokumen kendaraan. Persyaratan pastinya kami konfirmasi saat Anda menghubungi tim." }, { q: "Apakah kendaraan difoto saat diterima?", a: "Ya. Pemeriksaan fisik dan foto dicatat di sistem sebagai bukti kondisi." }, { q: "Berapa lama pengirimannya?", a: "Bergantung rute dan jadwal keberangkatan. Tanyakan estimasi untuk rute Anda lewat WhatsApp." }],
    pesanWa: "Halo Kamil Logistik, saya mau tanya kirim kendaraan (motor/mobil).", kata: ["kirim motor antar pulau", "kirim mobil", "ekspedisi kendaraan"],
  },
  {
    slug: "kirim-alat-berat", judul: "Kirim Alat Berat", kategori: "Khusus", icon: "box",
    ringkas: "Excavator, bulldozer, crane, forklift, traktor, dan mesin berukuran besar.",
    judulSeo: "Jasa Pengiriman Alat Berat: Excavator, Bulldozer, Crane, Forklift", deskSeo: "Kirim alat berat dan mesin besar lewat Kamil Logistik untuk konstruksi, pertambangan, pertanian, dan industri. Oversize cargo dengan dokumentasi lengkap.",
    intro: ["Alat berat dan mesin berukuran besar digunakan di konstruksi, pertambangan, pertanian, dan industri lain. Pengirimannya butuh perencanaan muatan dan penanganan khusus.", "Kami melayani pengiriman oversize cargo dan heavy equipment cargo dengan pencatatan kondisi sebelum dan sesudah pengiriman."],
    daftarJudul: "Alat berat yang dilayani", daftar: ["Excavator", "Bulldozer", "Crane", "Forklift", "Traktor", "Mesin dan peralatan berukuran besar lainnya"],
    tips: ["Siapkan data dimensi dan berat unit yang akurat.", "Informasikan lokasi muat dan bongkar, termasuk akses alat berat ke lokasi.", "Konfirmasikan jadwal sejak jauh hari karena perencanaan muatan butuh waktu."],
    faq: [{ q: "Informasi apa yang dibutuhkan untuk penawaran?", a: "Jenis unit, dimensi, berat, lokasi muat, dan lokasi bongkar." }, { q: "Apakah termasuk bongkar muat?", a: "Biaya bongkar muat dibahas dalam penawaran, karena bergantung lokasi dan alat yang dibutuhkan." }, { q: "Apakah bisa untuk banyak unit sekaligus?", a: "Bisa. Sebutkan jumlah unit agar kami menyiapkan armada yang sesuai." }],
    pesanWa: "Halo Kamil Logistik, saya mau tanya kirim alat berat.", kata: ["kirim alat berat", "ekspedisi excavator", "oversize cargo"],
  },
  {
    slug: "sewa-kontainer", judul: "Penyewaan Kontainer (LCL dan FCL)", kategori: "Khusus", icon: "layers",
    ringkas: "Kontainer 20 feet dan 40 feet, muatan penuh (FCL) atau gabungan (LCL).",
    judulSeo: "Sewa Kontainer 20 Feet dan 40 Feet: LCL dan FCL | Kamil Logistik", deskSeo: "Penyewaan kontainer LCL dan FCL ukuran 20 feet dan 40 feet untuk pengiriman barang dalam jumlah besar bersama Kamil Logistik.",
    intro: ["Kami menyediakan solusi kontainer berbagai jenis dan ukuran, mulai dari kontainer 20 feet dan 40 feet.", "FCL (Full Container Load) untuk satu kontainer penuh milik satu pengirim. LCL (Less than Container Load) bila muatan Anda tidak memenuhi satu kontainer dan digabung dengan muatan lain."],
    daftarJudul: "Pilihan kontainer", daftar: ["Kontainer 20 feet", "Kontainer 40 feet", "FCL: muatan penuh satu pengirim", "LCL: muatan gabungan"],
    tips: ["Hitung perkiraan volume muatan dalam meter kubik sebelum memilih ukuran.", "Pilih LCL untuk muatan kecil agar tidak membayar ruang kosong.", "Susun muatan agar stabil dan tidak mudah bergeser selama pelayaran."],
    faq: [{ q: "Apa beda LCL dan FCL?", a: "FCL memakai satu kontainer penuh untuk satu pengirim, LCL menggabungkan muatan beberapa pengirim dalam satu kontainer." }, { q: "Ukuran apa yang tersedia?", a: "Kontainer 20 feet dan 40 feet." }, { q: "Bagaimana memilih ukuran?", a: "Berdasarkan volume dan berat muatan. Tim kami membantu menghitungnya." }],
    pesanWa: "Halo Kamil Logistik, saya mau tanya sewa kontainer (LCL/FCL).", kata: ["sewa kontainer", "LCL FCL", "kontainer 20 feet 40 feet"],
  },
  {
    slug: "pindahan-relokasi", judul: "Jasa Pindahan dan Relokasi", kategori: "Khusus", icon: "home",
    ringkas: "Pindahan rumah, apartemen atau kosan, toko, kantor, dan gudang, dalam kota, luar kota, atau antar pulau.",
    judulSeo: "Jasa Pindahan Rumah, Kantor, dan Toko Antar Kota dan Antar Pulau", deskSeo: "Jasa pindahan dan relokasi Kamil Logistik: rumah, apartemen, kosan, toko, kantor, dan gudang, dalam kota maupun luar pulau.",
    intro: ["Pindahan bisa mencakup rumah, apartemen atau kosan, toko, kantor, hingga gudang, baik pindahan luar kota maupun luar pulau.", "Dengan jaringan darat dan laut, barang pindahan Anda diangkut, dikirim, dan dilacak dalam satu layanan."],
    daftarJudul: "Jenis pindahan", daftar: ["Rumah", "Apartemen dan kosan", "Toko", "Kantor", "Gudang", "Pindahan luar kota dan luar pulau"],
    tips: ["Buat daftar barang dan beri nomor pada setiap dus.", "Bungkus barang pecah belah dengan bantalan dan beri tanda jelas.", "Pisahkan barang bernilai tinggi dan dokumen penting untuk dibawa sendiri."],
    faq: [{ q: "Apakah bisa pindahan antar pulau?", a: "Bisa, memakai kombinasi angkutan darat dan laut." }, { q: "Bagaimana menentukan biayanya?", a: "Dari volume dan berat barang, jarak, serta layanan tambahan seperti pengepakan. Kirim daftar barang agar kami menghitung penawarannya." }, { q: "Apakah barang bisa dilacak?", a: "Ya, setiap resi bisa dilacak." }],
    pesanWa: "Halo Kamil Logistik, saya mau tanya jasa pindahan.", kata: ["jasa pindahan", "pindahan antar pulau", "relokasi kantor"],
  },
  {
    slug: "pergudangan", judul: "Pergudangan dan Pengelolaan Inventaris", kategori: "Bisnis", icon: "layers",
    ringkas: "Pergudangan modern dengan pengelolaan inventaris yang terintegrasi.",
    judulSeo: "Jasa Pergudangan dan Pengelolaan Inventaris: Jakarta, Makassar, Surabaya", deskSeo: "Pergudangan modern dengan pengelolaan inventaris terintegrasi di Jakarta, Makassar, dan Surabaya bersama Kamil Logistik.",
    intro: ["Kamil Logistik menyediakan pergudangan modern dengan pengelolaan inventaris yang terintegrasi, yang menyambung langsung ke pengiriman darat, laut, dan udara.", "Kami memiliki gudang dan kantor di Jakarta, Makassar, dan Surabaya."],
    daftarJudul: "Yang dapat dilakukan", daftar: ["Penyimpanan barang sebelum atau sesudah pengiriman", "Pencatatan keluar masuk barang", "Penyambungan ke pengiriman darat, laut, dan udara", "Pemeriksaan dan dokumentasi foto kondisi barang"],
    tips: ["Berikan daftar SKU dan jumlah barang saat serah terima.", "Tentukan jadwal pengambilan rutin agar rencana ruang tepat.", "Tanyakan syarat khusus untuk barang yang butuh perlakuan tertentu."],
    faq: [{ q: "Di mana lokasi gudang?", a: "Di Jakarta (Gudang Sarinah), Makassar (Pergudangan Tamalanrea), dan Surabaya." }, { q: "Apakah gudang tersambung dengan pengiriman?", a: "Ya, barang dari gudang dapat langsung dikirim lewat darat, laut, atau udara." }, { q: "Bagaimana memantau stok?", a: "Pencatatan keluar masuk barang dilakukan oleh tim gudang. Format laporannya dibahas sesuai kebutuhan Anda." }],
    pesanWa: "Halo Kamil Logistik, saya mau tanya layanan pergudangan.", kata: ["jasa pergudangan", "sewa gudang", "warehouse"],
  },
  {
    slug: "konsultasi-logistik", judul: "Konsultasi Logistik dan Kemitraan Agen", kategori: "Bisnis", icon: "chat",
    ringkas: "Perencanaan dan pengelolaan sistem logistik untuk organisasi, termasuk pendampingan kemitraan agen.",
    judulSeo: "Konsultan Logistik Domestik: Perencanaan, Sistem, dan Kemitraan Agen", deskSeo: "Konsultasi logistik domestik Kamil Logistik: perencanaan, pengelolaan sistem logistik, dan pendampingan layanan kemitraan agen untuk perusahaan dan organisasi.",
    intro: ["Layanan konsultasi mencakup perencanaan dan pengelolaan sistem logistik untuk organisasi atau perusahaan.", "Kami juga mendampingi pihak yang ingin membuka layanan kemitraan agen, mulai dari pemilihan jenis layanan sampai alur kerja harian."],
    daftarJudul: "Cakupan konsultasi", daftar: ["Perencanaan alur logistik domestik", "Pengelolaan sistem logistik perusahaan", "Pemilihan moda darat, laut, dan udara", "Pendampingan layanan kemitraan agen"],
    tips: ["Siapkan gambaran pola kirim Anda: asal, tujuan, volume, dan frekuensi.", "Sebutkan kendala yang paling sering terjadi, misalnya keterlambatan atau kerusakan.", "Tentukan target biaya dan waktu agar rekomendasi terukur."],
    faq: [{ q: "Untuk siapa konsultasi ini?", a: "Perusahaan, organisasi, dan calon agen yang ingin merapikan atau membangun alur logistik." }, { q: "Apakah ada kemitraan agen?", a: "Ada. Lihat halaman Jadi mitra untuk manfaat dan cara bergabungnya." }, { q: "Bagaimana memulainya?", a: "Hubungi kami lewat WhatsApp dan ceritakan kebutuhan Anda." }],
    pesanWa: "Halo Kamil Logistik, saya mau konsultasi logistik.", kata: ["konsultan logistik", "kemitraan agen ekspedisi", "sistem logistik"],
  },
];
export const layananDari = (slug: string) => LAYANAN.find((l) => l.slug === slug);
export const KATEGORI_LAYANAN = ["Laut", "Udara", "Darat", "Khusus", "Bisnis"] as const;
