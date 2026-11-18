import Link from "next/link";
import type { ReactNode } from "react";
import { priceLabel, type RoutePair } from "@kamil/core";

/**
 * Panduan untuk pencarian informasional ("cara hitung ongkir cargo", "berapa lama kirim lewat laut", dst.).
 * Harga dan lama kirim diambil dari data rute asli, bukan ditulis tetap, supaya selalu sama dengan kalkulator.
 */
export type Ctx = { pairs: RoutePair[] };
export type Artikel = { slug: string; title: string; heading: string; description: string; updated: string; body: (c: Ctx) => ReactNode };

const harga = (pairs: RoutePair[], slug: string) => { const p = pairs.find((x) => x.slug === slug); return p ? priceLabel(p.minPrice) : "tarif terbaru di halaman rute"; };
const hari = (pairs: RoutePair[], slug: string) => pairs.find((x) => x.slug === slug)?.etaDays;

export const ARTIKEL: Artikel[] = [
  {
    slug: "cara-hitung-ongkir-cargo",
    title: "Cara Menghitung Ongkir Cargo: Berat Aktual vs Volume",
    heading: "Cara menghitung ongkir cargo: berat aktual atau berat volume?",
    description: "Ongkir cargo dihitung dari berat yang lebih besar antara berat timbangan dan berat volume. Pelajari rumus, contoh hitungan, dan cara menghemat biaya kirim.",
    updated: "2026-11-18",
    body: ({ pairs }) => (<>
      <p>Banyak orang kaget saat ongkir cargo lebih mahal dari perkiraan, padahal barangnya terasa ringan. Penyebabnya hampir selalu sama: yang dihitung bukan hanya berat di timbangan, tetapi juga <b>ukuran barang</b>.</p>
      <h2>Dua jenis berat</h2>
      <ul>
        <li><b>Berat aktual</b>: berat barang di timbangan gudang, dalam kilogram.</li>
        <li><b>Berat volume</b>: hasil dari ukuran kardus. Rumusnya <b>panjang × lebar × tinggi (cm) ÷ 4.000</b>.</li>
      </ul>
      <p>Ongkir memakai angka yang <b>lebih besar</b> di antara keduanya. Alasannya sederhana: barang besar yang ringan tetap memakan tempat di kontainer.</p>
      <h2>Contoh hitungan</h2>
      <p>Kardus berukuran 80 × 50 × 50 cm dengan berat 5 kg. Berat volumenya 80 × 50 × 50 ÷ 4.000 = <b>50 kg</b>. Karena 50 kg lebih besar dari 5 kg, ongkir dihitung untuk 50 kg.</p>
      <p>Sebaliknya, besi atau mesin kecil seberat 20 kg dalam kardus 40 × 30 × 20 cm punya berat volume hanya 6 kg. Yang dipakai tetap berat aktual 20 kg.</p>
      <h2>Aturan pembulatan dan minimal berat</h2>
      <ul>
        <li>Berat dibulatkan <b>ke atas</b> ke kilogram penuh. Contoh: 2,1 kg dihitung 3 kg.</li>
        <li>Sebagian rute punya <b>minimal berat</b>. Cek di halaman <Link href="/ekspedisi">rute dan tarif</Link>.</li>
        <li>Beberapa layanan dihitung per <b>meter kubik (m³)</b> untuk barang dalam jumlah besar. Rumusnya panjang × lebar × tinggi dalam meter.</li>
        <li>Biaya tambahan seperti packing kayu dihitung terpisah dan tampil jelas di invoice.</li>
      </ul>
      <h2>Tips menghemat</h2>
      <ul>
        <li>Pilih kardus yang pas dengan isinya. Rongga kosong ikut dibayar.</li>
        <li>Barang yang bisa dilepas (rak, kursi) lebih hemat bila dibongkar dan dikemas rata.</li>
        <li>Gabungkan beberapa barang kecil dalam satu kardus bila aman.</li>
      </ul>
      <p>Harga di website adalah perkiraan. Biaya pasti dihitung saat barang ditimbang di gudang dengan rumus yang sama seperti kalkulator. Coba langsung di <Link href="/ongkir">kalkulator ongkir</Link>. Contohnya, rute Jakarta ke Makassar mulai {harga(pairs, "ekspedisi-jakarta-makassar")}.</p>
    </>),
  },
  {
    slug: "berapa-lama-kirim-barang-lewat-cargo-laut",
    title: "Berapa Lama Kirim Barang Lewat Cargo Laut? Tahapannya",
    heading: "Berapa lama kirim barang lewat cargo laut? Ini tahapan dari gudang sampai tujuan",
    description: "Pengiriman cargo laut melewati beberapa tahap: jemput, gudang, muat kontainer, pelayaran, bongkar, lalu antar. Pahami kenapa butuh sekitar satu minggu.",
    updated: "2026-11-18",
    body: ({ pairs }) => (<>
      <p>Cargo laut lebih hemat dibanding udara, tetapi butuh waktu lebih lama karena melewati beberapa tahap. Berikut gambaran perjalanan satu paket dari kota asal ke kota tujuan.</p>
      <h2>10 tahap perjalanan barang</h2>
      <ol>
        <li><b>Order diterima</b>: kasir membuat resi dan Anda mendapat nomor resi.</li>
        <li><b>Barang dijemput</b> oleh kurir, atau Anda mengantar ke gerai.</li>
        <li><b>Tiba di gudang asal</b>.</li>
        <li><b>Ditimbang dan ditagih</b>: barang dipilah, diberi kode, dan ongkir pasti dihitung.</li>
        <li><b>Dimuat ke kontainer</b> dan dibawa ke pelabuhan.</li>
        <li><b>Dalam pelayaran</b>.</li>
        <li><b>Tiba di pelabuhan tujuan</b>.</li>
        <li><b>Dibongkar di gudang tujuan</b> dan dicek jumlahnya.</li>
        <li><b>Diantar</b> oleh kurir ke alamat penerima.</li>
        <li><b>Sudah diterima</b>, dengan foto dan tanda tangan penerima sebagai bukti.</li>
      </ol>
      <h2>Berapa lama totalnya?</h2>
      <p>Untuk rute Jakarta dan Makassar, perkiraan total sekitar <b>{hari(pairs, "ekspedisi-jakarta-makassar") ?? 7} hari</b>. Sebagian besar waktu ada di pelayaran dan menunggu jadwal kapal berangkat. Rute pendek seperti Makassar ke Morowali bisa jauh lebih cepat. Jadwal keberangkatan tiap rute ada di halaman <Link href="/ekspedisi">Ekspedisi</Link>.</p>
      <h2>Yang memengaruhi lama pengiriman</h2>
      <ul>
        <li>Jadwal keberangkatan kapal (ada rute yang berangkat beberapa kali seminggu).</li>
        <li>Cuaca dan kondisi pelabuhan.</li>
        <li>Alamat antar: pengiriman sampai alamat butuh waktu tambahan dibanding ambil di gudang.</li>
      </ul>
      <p>Pantau posisi barang kapan saja lewat <Link href="/lacak">Cek Resi</Link>. Setiap tahap dicatat oleh petugas yang memegang barang.</p>
    </>),
  },
  {
    slug: "cara-packing-barang-cargo-laut",
    title: "Cara Packing Barang untuk Cargo Laut Supaya Aman",
    heading: "Cara packing barang untuk cargo laut supaya tiba dengan aman",
    description: "Barang cargo laut melewati banyak tangan dan goncangan. Ikuti langkah packing ini: kardus berlapis, pengisi rongga, lakban, dan label yang jelas.",
    updated: "2026-11-18",
    body: () => (<>
      <p>Selama perjalanan, barang diangkat, ditumpuk, dan terguncang di kapal. Packing yang baik jauh lebih murah daripada mengganti barang yang rusak.</p>
      <h2>Langkah packing</h2>
      <ol>
        <li><b>Pilih kardus yang kuat</b> dan masih kaku. Untuk barang berat, pakai kardus berlapis dua (double wall).</li>
        <li><b>Lapisi barang</b> dengan bubble wrap atau kertas. Barang pecah belah dibungkus satu per satu.</li>
        <li><b>Isi semua rongga</b> dengan kertas atau busa supaya barang tidak bergeser. Tetapi jangan berlebihan, karena ukuran kardus memengaruhi ongkir.</li>
        <li><b>Rekatkan lakban</b> bentuk H: di tengah dan di kedua sisi tutup kardus.</li>
        <li><b>Beri label jelas</b>: nama dan nomor HP penerima, alamat lengkap, dan tulisan "jangan dibanting" bila perlu.</li>
        <li><b>Tutup dengan plastik</b> untuk barang yang takut basah, karena kelembapan laut cukup tinggi.</li>
      </ol>
      <h2>Barang khusus</h2>
      <ul>
        <li><b>Elektronik</b>: simpan dalam kotak asli bila ada, lalu masukkan ke kardus lagi dengan pengganjal.</li>
        <li><b>Furnitur dan barang besar</b>: pertimbangkan packing kayu. Biayanya dicatat terpisah di invoice.</li>
        <li><b>Cairan</b>: pastikan tutup rapat, bungkus plastik, dan beri tanda. Hubungi kami dulu sebelum mengirim.</li>
      </ul>
      <p>Setelah barang tiba di gudang, petugas memberi kode unik di tiap barang dan menimbangnya. Foto kondisi saat serah terima membantu bila ada pertanyaan. Lihat juga <Link href="/panduan/cara-hitung-ongkir-cargo">cara menghitung ongkir cargo</Link> supaya ukuran kardus tidak membengkakkan biaya.</p>
    </>),
  },
  {
    slug: "barang-yang-boleh-dan-tidak-boleh-dikirim-lewat-cargo",
    title: "Barang yang Boleh dan Tidak Boleh Dikirim Lewat Cargo",
    heading: "Barang yang boleh dan tidak boleh dikirim lewat cargo",
    description: "Tidak semua barang bisa dikirim lewat cargo. Kenali barang umum yang aman dan barang berbahaya atau terlarang, serta kapan Anda perlu bertanya dulu.",
    updated: "2026-11-18",
    body: () => (<>
      <p>Cargo darat dan laut dipakai bersama banyak pengirim, jadi ada aturan keselamatan. Berikut gambaran umum. Untuk kepastian barang tertentu, tanyakan dulu ke tim kami.</p>
      <h2>Umumnya bisa dikirim</h2>
      <ul>
        <li>Paket dan dokumen</li>
        <li>Pakaian, sepatu, dan perlengkapan rumah tangga</li>
        <li>Barang dagangan dalam kemasan tertutup</li>
        <li>Suku cadang dan perkakas</li>
        <li>Furnitur dan barang besar (dengan packing yang sesuai)</li>
      </ul>
      <h2>Perlu ditanyakan dulu</h2>
      <ul>
        <li>Barang mudah pecah atau bernilai tinggi</li>
        <li>Cairan, pasta, dan serbuk</li>
        <li>Baterai dan perangkat elektronik bermuatan baterai</li>
        <li>Makanan dan minuman yang punya masa simpan terbatas</li>
        <li>Obat-obatan dan produk kesehatan</li>
      </ul>
      <h2>Tidak boleh dikirim</h2>
      <ul>
        <li>Bahan peledak, petasan, dan bahan mudah terbakar</li>
        <li>Gas bertekanan dan bahan kimia berbahaya</li>
        <li>Narkotika dan barang yang dilarang hukum</li>
        <li>Senjata api dan amunisi</li>
        <li>Hewan hidup</li>
      </ul>
      <p>Pengirim bertanggung jawab atas kebenaran isi barang. Bila ragu, tanyakan lewat WhatsApp sebelum menyerahkan barang. Biaya dan estimasi bisa dicek di <Link href="/ongkir">kalkulator ongkir</Link>.</p>
    </>),
  },
  {
    slug: "cara-kirim-barang-dari-jakarta-ke-sulawesi",
    title: "Cara Kirim Barang dari Jakarta ke Sulawesi Langkah demi Langkah",
    heading: "Cara kirim barang dari Jakarta ke Sulawesi, langkah demi langkah",
    description: "Panduan kirim barang ke Makassar dan Sulawesi: hubungi tim, barang dijemput dan ditimbang, bayar lewat transfer, lalu pantau sampai diterima.",
    updated: "2026-11-18",
    body: ({ pairs }) => (<>
      <p>Mengirim barang ke Sulawesi tidak rumit bila Anda tahu urutannya. Inilah alurnya, dari mulai bertanya sampai barang diterima.</p>
      <ol>
        <li><b>Cek perkiraan ongkir</b> di <Link href="/ongkir">kalkulator</Link>. Pilih kota asal dan tujuan, isi berat dan ukuran. Misalnya Jakarta ke Makassar mulai {harga(pairs, "ekspedisi-jakarta-makassar")}.</li>
        <li><b>Hubungi tim</b> lewat WhatsApp atau datang ke gerai mitra. Sebutkan isi barang, jumlah, dan alamat penerima.</li>
        <li><b>Barang dijemput atau diantar ke gerai</b>. Kasir membuat resi dan Anda menerima nomor resi (contoh KLX-JKT-MKS-LJ-261112-0830-0001-D).</li>
        <li><b>Barang ditimbang di gudang</b>. Ongkir pasti dihitung dari berat atau ukuran sebenarnya, lalu Anda menerima <b>invoice resmi</b> yang bisa dibuka lewat tautan.</li>
        <li><b>Bayar lewat transfer atau tunai</b>. Cantumkan nomor invoice di berita transfer dan kirim bukti ke WhatsApp. Kasir mencatat setelah dana masuk.</li>
        <li><b>Pantau perjalanan</b> di <Link href="/lacak">Cek Resi</Link> kapan saja, tanpa login.</li>
        <li><b>Barang diterima</b>. Penerima menandatangani dan foto bukti terima tersimpan.</li>
      </ol>
      <h2>Yang perlu disiapkan</h2>
      <ul>
        <li>Nama, nomor HP, dan alamat penerima yang lengkap.</li>
        <li>Barang yang sudah dikemas rapi. Lihat <Link href="/panduan/cara-packing-barang-cargo-laut">cara packing untuk cargo laut</Link>.</li>
        <li>Daftar isi barang, terutama bila bernilai tinggi.</li>
      </ul>
      <p>Lihat semua rute dan tarif di halaman <Link href="/ekspedisi">Ekspedisi</Link>.</p>
    </>),
  },
  {
    slug: "cara-melacak-resi-kamil-logistik",
    title: "Cara Melacak Resi Kamil Logistik Tanpa Login",
    heading: "Cara melacak resi Kamil Logistik tanpa login",
    description: "Lacak barang cukup dengan nomor resi. Pahami arti tiap status, dari barang dijemput sampai sudah diterima, dan apa yang dilakukan bila status lama tidak berubah.",
    updated: "2026-11-18",
    body: () => (<>
      <p>Anda tidak perlu mendaftar atau masuk untuk melacak barang. Cukup siapkan nomor resi dari struk atau pesan WhatsApp.</p>
      <h2>Cara melacak</h2>
      <ol>
        <li>Buka halaman <Link href="/lacak">Cek Resi</Link>.</li>
        <li>Masukkan nomor resi, bentuknya seperti <b>KLX-JKT-MKS-LJ-261112-0830-0001-D</b>.</li>
        <li>Tekan <b>Cek posisi barang</b>. Perjalanan barang tampil berurutan lengkap dengan waktu dan lokasinya.</li>
      </ol>
      <h2>Arti tiap status</h2>
      <ul>
        <li><b>Barang dijemput</b>: kurir sudah mengambil barang.</li>
        <li><b>Tiba di gudang</b>: barang sampai di gudang kota asal.</li>
        <li><b>Ditimbang dan tagihan dibuat</b>: berat dicek dan invoice terbit.</li>
        <li><b>Menuju pelabuhan</b>: barang dimuat ke kontainer.</li>
        <li><b>Dalam pelayaran</b>: kapal sudah berangkat.</li>
        <li><b>Tiba di pelabuhan tujuan</b>: kapal sandar di kota tujuan.</li>
        <li><b>Dibongkar dan dicek</b>: barang masuk gudang tujuan.</li>
        <li><b>Sedang diantar</b>: kurir menuju alamat penerima.</li>
        <li><b>Sudah diterima</b>: barang diterima, dengan nama penerima yang disamarkan demi privasi.</li>
      </ul>
      <h2>Bila status lama tidak berubah</h2>
      <p>Status berubah saat petugas yang memegang barang mencatatnya, jadi selama pelayaran status bisa sama selama beberapa hari. Itu wajar. Bila terasa terlalu lama, tekan tombol <b>Tanya soal resi ini</b> di halaman hasil, dan tim kami akan mengecek. Bila ingin tahu perkiraan lama kirim, baca <Link href="/panduan/berapa-lama-kirim-barang-lewat-cargo-laut">tahapan pengiriman cargo laut</Link>.</p>
    </>),
  },
];
