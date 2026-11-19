/**
 * Fakta resmi perusahaan, diambil dari Company Profile Kamil Logistik 2026-2027.
 * Satu sumber untuk halaman Tentang, Kontak, footer, dan data terstruktur (SEO). Jangan menambah klaim yang tidak ada di profil.
 */
export const PERUSAHAAN = {
  merek: "Kamil Logistik",
  namaHukum: "CV Kamil Logistik Express Sulawesi",
  bentuk: "Persekutuan Komanditer (CV)",
  tahunBerdiri: 2020,
  tanggalAkta: "2020-08-03",
  aktaTeks: "Akta Pendirian Nomor 01 tanggal 3 Agustus 2020, notaris Andi Mallombasi AT, S.H., M.Kn.",
  slogan: "Best Price, Best Service",
  tagline: "Pengiriman barang seluruh Nusantara",
  email: "cvkamillogistikexpresssulawesi@gmail.com",
  wa: [{ nomor: "6285342238748", tampil: "0853-4223-8748" }, { nomor: "6282123057322", tampil: "0821-2305-7322" }],
  facebook: "https://facebook.com/kamillogistikekspress.id",
  direksi: [
    { nama: "Andi Khusnul Khatimah, S.K.M.", jabatan: "Direktur Utama" },
    { nama: "Prasetya Adimakayasa, S.H.", jabatan: "Founder" },
  ],
  kantor: [
    { kota: "Jakarta", nama: "Gudang Sarinah", jalan: "Jl. Pancoran Timur II No. 4", wilayah: "Cikoko, Pancoran, Jakarta Selatan", pos: "12770", provinsi: "DKI Jakarta", lat: -6.2468, lng: 106.8525 },
    { kota: "Makassar", nama: "Pergudangan Tamalanrea", jalan: "Jl. Ir. Sutami No. A2/6, RT 001/RW 06", wilayah: "Parang Loe, Tamalanrea, Kota Makassar", pos: "90244", provinsi: "Sulawesi Selatan", lat: -5.1146, lng: 119.5166 },
    { kota: "Surabaya", nama: "Kantor Cabang Surabaya", jalan: "Jl. Kalimas Baru 1 Blok C-5 No. 29", wilayah: "Perak Utara, Pabean Cantian, Surabaya", pos: "60165", provinsi: "Jawa Timur", lat: -7.2287, lng: 112.7344 },
  ],
  jangkauan: ["Seluruh Sulawesi", "Maluku", "Papua (Jayapura)", "Seluruh Kalimantan", "Jabodetabek", "Semarang", "Surabaya", "Medan", "Pekanbaru", "Palembang"],
  visi: "Menjadi perusahaan logistik terkemuka yang memberikan solusi inovatif, cepat, dan handal, serta mendukung pertumbuhan ekonomi dengan memperkuat konektivitas global dan lokal.",
  misi: ["Memberikan layanan berkualitas tinggi", "Mengadopsi teknologi modern yang mendukung keberlanjutan", "Membangun hubungan yang kuat", "Memberdayakan SDM berkualitas", "Meningkatkan jangkauan dan inovasi", "Berkomitmen menjaga kepercayaan konsumen"],
  profil: "Kamil Logistik adalah perusahaan logistik yang hadir untuk memberikan solusi pengiriman dan manajemen rantai pasok bagi pelanggan di seluruh Indonesia. Kami berkomitmen memastikan setiap proses pengiriman dilakukan dengan efisiensi, kecepatan, dan keamanan tinggi.",
} as const;

export const alamatLengkap = (k: (typeof PERUSAHAAN.kantor)[number]) => `${k.jalan}, ${k.wilayah} ${k.pos}, ${k.provinsi}`;
export const petaUrl = (k: (typeof PERUSAHAAN.kantor)[number]) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${k.nama}, ${alamatLengkap(k)}`)}`;
