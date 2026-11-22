import Link from "next/link";
import type { ReactNode } from "react";
import { priceLabel, wilayahSlug, type RoutePair } from "@kamil/core";

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
        <li><b>Barang dijemput atau diantar ke gerai</b>. Kasir membuat resi dan Anda menerima nomor resi (contoh KML-JKT-MKS-LJ-261112-0830-0001-NW).</li>
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
        <li>Masukkan nomor resi, bentuknya seperti <b>KML-JKT-MKS-LJ-261112-0830-0001-NW</b>.</li>
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
  {
    slug: "ekspedisi-jakarta-makassar-lewat-laut",
    title: "Ekspedisi Jakarta ke Makassar Lewat Laut: Biaya dan Lama Kirim",
    heading: "Ekspedisi Jakarta ke Makassar lewat laut: biaya, lama kirim, dan cara memilih",
    description: "Panduan mengirim barang dari Jakarta ke Makassar lewat cargo laut: perkiraan biaya per kilo, minimal berat, lama pengiriman, dan hal yang perlu dibandingkan sebelum memilih ekspedisi.",
    updated: "2026-11-19",
    body: ({ pairs }) => (<>
      <p>Jakarta ke Makassar adalah salah satu jalur cargo laut tersibuk ke Indonesia Timur. Karena banyak pilihan ekspedisi, harga dan syaratnya sering berbeda-beda. Berikut yang perlu Anda bandingkan.</p>
      <h2>Berapa biayanya?</h2>
      <p>Di Kamil Logistik, tarif Jakarta ke Makassar mulai <b>{harga(pairs, "ekspedisi-jakarta-makassar")}</b>, dengan perkiraan waktu sekitar <b>{hari(pairs, "ekspedisi-jakarta-makassar") ?? "beberapa"} hari</b>. Angka ini selalu mengikuti <Link href="/ekspedisi-jakarta-makassar">halaman rute Jakarta ke Makassar</Link>, jadi tidak perlu menebak. Ingin mencoba sendiri? Pakai <Link href="/ongkir?dari=JKT&ke=MKS">kalkulator ongkir</Link>.</p>
      <h2>Lima hal yang perlu dibandingkan</h2>
      <ol>
        <li><b>Minimal berat.</b> Ada ekspedisi yang menetapkan minimal 10 kg, ada yang 30 kg atau lebih. Pengiriman kecil bisa terasa mahal bila minimalnya tinggi.</li>
        <li><b>Cara hitung berat.</b> Pastikan memakai berat aktual atau berat volume mana yang lebih besar, dan tanyakan pembaginya. Di sini 4.000 untuk laut dan darat. Pelajari <Link href="/panduan/cara-hitung-ongkir-cargo">caranya</Link>.</li>
        <li><b>Sampai mana barang diantar.</b> Sampai pelabuhan, sampai alamat, atau dijemput dan diantar. Harga yang sama bisa berarti layanan yang berbeda.</li>
        <li><b>Yang belum termasuk.</b> Asuransi, pajak, dan bongkar muat di lokasi sering dihitung terpisah. Tanyakan sebelum setuju.</li>
        <li><b>Pelacakan.</b> Pilih ekspedisi yang memberi nomor resi dan bisa dilacak tanpa harus bertanya ke admin.</li>
      </ol>
      <h2>Alur pengiriman</h2>
      <p>Barang dijemput kurir atau diantar sendiri ke gudang, diperiksa dan ditimbang, dimuat ke kontainer, berlayar, dibongkar di Makassar, lalu diantar ke penerima dengan bukti terima berupa foto dan tanda tangan. Setiap tahap bisa dipantau lewat <Link href="/lacak">cek resi</Link>.</p>
      <h2>Tips agar biaya pas</h2>
      <ul>
        <li>Gunakan kardus yang pas dengan isi. Rongga kosong ikut dihitung. Lihat <Link href="/panduan/cara-packing-barang-cargo-laut">cara packing barang untuk cargo laut</Link>.</li>
        <li>Kirim dalam satu pengiriman bila memungkinkan, karena minimal berat berlaku per pengiriman.</li>
        <li>Untuk jumlah besar atau rutin, tanyakan harga khusus lewat WhatsApp.</li>
      </ul>
    </>),
  },
  {
    slug: "kirim-barang-ke-papua-dan-maluku-dari-makassar",
    title: "Kirim Barang ke Papua dan Maluku dari Makassar: Tarif dan Estimasi",
    heading: "Kirim barang ke Papua dan Maluku dari Makassar: tarif, estimasi, dan tips",
    description: "Cara mengirim barang cargo dari Makassar ke Papua dan Maluku: daftar kota tujuan, tarif per kilo, perkiraan lama kirim, minimal berat, dan tips agar barang aman.",
    updated: "2026-11-19",
    body: ({ pairs }) => {
      const tujuan = pairs.filter((p) => p.originCode === "MKS" && ["papua", "maluku", "maluku-utara"].includes(wilayahSlug(p.destCity) ?? ""));
      return (<>
        <p>Makassar adalah pintu gerbang Indonesia Timur, sehingga banyak pengiriman ke Papua dan Maluku berangkat dari sini. Karena jaraknya jauh dan jadwal kapal tidak sesering di Jawa, perencanaan sangat berpengaruh pada biaya dan waktu.</p>
        <h2>Kota tujuan dari Makassar</h2>
        {tujuan.length > 0 ? (
          <ul>{tujuan.map((p) => <li key={p.slug}><Link href={`/${p.slug}`}>{p.destCity}</Link>: {priceLabel(p.minPrice)}{p.minPrice.minChargeable ? `, minimal ${p.minPrice.minChargeable} kg` : ""}{p.etaDays ? `, sekitar ${p.etaDays} hari` : ""}</li>)}</ul>
        ) : <p>Daftar tujuan terbaru ada di <Link href="/ekspedisi">halaman rute</Link>.</p>}
        <p>Lihat juga ringkasan <Link href="/ekspedisi-ke-papua">ekspedisi ke Papua</Link>, <Link href="/ekspedisi-ke-maluku">Maluku</Link>, dan <Link href="/ekspedisi-ke-maluku-utara">Maluku Utara</Link>.</p>
        <h2>Hal yang perlu disiapkan</h2>
        <ul>
          <li><b>Estimasi bukan jaminan.</b> Waktu tempuh bergantung jadwal dan cuaca laut. Beri jeda waktu yang cukup bila barang dibutuhkan untuk acara atau proyek.</li>
          <li><b>Layanan sampai pelabuhan.</b> Untuk sebagian tujuan, tarif berlaku sampai pelabuhan tujuan. Tanyakan pengambilan atau pengantaran selanjutnya.</li>
          <li><b>Packing lebih kuat.</b> Perjalanan panjang dan beberapa kali bongkar muat membuat kemasan perlu lebih rapat dan kokoh. Baca <Link href="/panduan/cara-packing-barang-cargo-laut">panduan packing</Link>.</li>
          <li><b>Data penerima lengkap.</b> Nama, nomor HP aktif, dan alamat jelas mempercepat pengambilan di tujuan.</li>
        </ul>
        <h2>Cara kirim</h2>
        <p>Hubungi kami lewat WhatsApp, sebutkan kota tujuan dan berat perkiraan. Barang dijemput atau diantar ke gudang, ditimbang, lalu Anda menerima invoice dan nomor resi untuk <Link href="/lacak">dilacak</Link>.</p>
      </>);
    },
  },
  {
    slug: "door-to-door-port-to-door-atau-port-to-port",
    title: "Door to Door, Port to Door, atau Port to Port: Pilih yang Mana?",
    heading: "Door to door, port to door, atau port to port: apa bedanya dan mana yang pas?",
    description: "Penjelasan tiga jenis layanan cargo: door to door, port to door, dan port to port, plus perbedaan barang dijemput kurir dan diantar sendiri ke gudang.",
    updated: "2026-11-19",
    body: () => (<>
      <p>Saat melihat daftar harga cargo, Anda akan menemukan istilah yang membingungkan. Padahal intinya hanya soal: <b>dari mana</b> barang diambil dan <b>sampai mana</b> barang diantar.</p>
      <h2>Tiga jenis layanan</h2>
      <ul>
        <li><b>Port to port (sampai pelabuhan tujuan).</b> Barang dibawa sampai pelabuhan di kota tujuan. Penerima mengambil sendiri atau mengurus pengantaran lanjutan. Biasanya paling murah.</li>
        <li><b>Port to door (diantar sampai alamat).</b> Barang diantar sampai alamat penerima. Ini yang paling umum untuk pengiriman antarkota.</li>
        <li><b>Door to door (dijemput dan diantar).</b> Kurir menjemput di alamat pengirim, lalu mengantar sampai alamat penerima. Paling praktis.</li>
      </ul>
      <h2>Dijemput atau diantar sendiri?</h2>
      <p>Terlepas dari jenis layanan, Anda bisa memilih cara barang masuk: <b>dijemput kurir</b> ke alamat Anda, atau <b>diantar sendiri</b> ke gudang. Barang yang diantar sendiri melewati satu tahap lebih sedikit, dan petugas gudang langsung memeriksa dan mencatatnya di depan Anda.</p>
      <h2>Mana yang pas?</h2>
      <ul>
        <li>Barang banyak dan Anda punya kendaraan: <b>antar sendiri</b> ke gudang bisa lebih hemat waktu.</li>
        <li>Barang besar atau Anda tidak sempat: pilih <b>dijemput</b>.</li>
        <li>Penerima memiliki armada sendiri di pelabuhan: <b>port to port</b> bisa menekan biaya.</li>
      </ul>
      <p>Cek jenis layanan yang tersedia di <Link href="/ekspedisi">halaman rute</Link>. Setiap pilihan tertulis jelas di kalkulator.</p>
    </>),
  },
  {
    slug: "kirim-barang-online-shop-umkm-ke-sulawesi",
    title: "Kirim Barang Online Shop dan UMKM ke Sulawesi: Panduan Praktis",
    heading: "Kirim barang online shop dan UMKM ke Sulawesi: panduan praktis agar murah dan aman",
    description: "Tips pelaku online shop dan UMKM mengirim stok atau pesanan dalam jumlah banyak ke Sulawesi lewat cargo: hitung biaya per paket, packing, resi, dan layanan korporat.",
    updated: "2026-11-19",
    body: ({ pairs }) => (<>
      <p>Pengiriman ke Sulawesi lewat cargo umumnya jauh lebih murah per kilo dibanding kurir paket, terutama untuk stok dalam jumlah banyak. Berikut cara memanfaatkannya.</p>
      <h2>Kirim stok ke gudang tujuan, bukan paket satuan</h2>
      <p>Untuk reseller atau toko dengan gudang di Makassar atau kota lain, mengirim stok sekaligus lewat cargo lalu mengirimkan pesanan lokal biasanya lebih hemat. Contohnya Jakarta ke Makassar mulai {harga(pairs, "ekspedisi-jakarta-makassar")}. Hitung dulu di <Link href="/ongkir">kalkulator ongkir</Link>.</p>
      <h2>Rapikan kemasan</h2>
      <ul>
        <li>Seragamkan ukuran kardus supaya mudah disusun dan dihitung.</li>
        <li>Pakai pengisi untuk barang pecah belah, dan segel kardus berlapis.</li>
        <li>Tulis nama dan nomor HP penerima di luar kardus. Baca <Link href="/panduan/cara-packing-barang-cargo-laut">panduan packing</Link>.</li>
      </ul>
      <h2>Pantau semua kiriman</h2>
      <p>Setiap pengiriman punya nomor resi dan barcode di label. Anda dan pembeli atau penerima bisa <Link href="/lacak">melacaknya</Link> tanpa login.</p>
      <h2>Pengiriman rutin? Pakai layanan perusahaan</h2>
      <p>Bila Anda mengirim rutin, tanyakan layanan untuk perusahaan: tempo pembayaran, batas kredit, tarif khusus per rute, dan portal untuk melihat resi dan tagihan sendiri. Hubungi kami lewat WhatsApp untuk pengajuan.</p>
      <h2>Catatan biaya</h2>
      <p>Tarif belum termasuk asuransi, pajak yang berlaku, serta bongkar muat di lokasi. Lihat <Link href="/syarat">syarat dan ketentuan</Link> untuk rincian.</p>
    </>),
  },
  {
    slug: "cara-membaca-kode-resi-kamil-logistik",
    title: "Cara Membaca Kode Resi Kamil Logistik (KML-…)",
    heading: "Cara membaca kode resi Kamil Logistik: arti setiap bagian",
    description: "Kode resi Kamil Logistik bisa dibaca manusia: kota asal, tujuan, jalur, cara barang masuk, tanggal, jam, urutan, dan huruf pemeriksa. Contoh dan cara mengeceknya.",
    updated: "2026-11-19",
    body: () => (<>
      <p>Nomor resi Kamil Logistik dirancang agar mudah dibaca oleh pelanggan dan petugas. Contohnya: <code>KML-MKS-JKT-LJ-261118-1432-0007-UC</code>.</p>
      <h2>Arti tiap bagian</h2>
      <ul>
        <li><b>KML</b>: tanda Kamil Logistik (resi lama berawalan KLX tetap sah).</li>
        <li><b>MKS</b>: kode kota asal (di contoh, Makassar).</li>
        <li><b>JKT</b>: kode kota tujuan (Jakarta).</li>
        <li><b>LJ</b>: dua huruf. Huruf pertama adalah jalur: <b>L</b> laut, <b>U</b> udara, <b>D</b> darat. Huruf kedua adalah cara barang masuk: <b>J</b> dijemput kurir, <b>A</b> diantar sendiri ke gudang.</li>
        <li><b>261118</b>: tanggal pembuatan resi (tahun-bulan-hari, yaitu 18 November 2026).</li>
        <li><b>1432</b>: jam pembuatan (14.32 WITA).</li>
        <li><b>0007</b>: nomor urut resi pada hari itu di kota asal.</li>
        <li><b>VP</b>: dua huruf pemeriksa. Bila ada satu karakter yang salah ketik, sistem langsung tahu kode itu tidak valid.</li>
      </ul>
      <p>Setiap barang dalam satu resi punya kode sendiri dengan tambahan <code>-01</code>, <code>-02</code>, dan seterusnya, yang tercetak sebagai barcode dan QR di label.</p>
      <h2>Cara melacak</h2>
      <p>Masukkan kode lengkap di <Link href="/lacak">halaman cek resi</Link>, atau pindai QR di struk dengan kamera HP. Huruf kecil dan spasi tidak masalah, sistem merapikannya otomatis.</p>
      <p>Bila kode tidak ditemukan, periksa lagi dua huruf terakhir dan nomor urutnya. Masih bingung? Tekan tombol bantuan di pojok kanan bawah dan pilih Chat WhatsApp.</p>
    </>),
  },
  {
    slug: "jadi-mitra-ekspedisi-kamil-logistik",
    title: "Jadi Mitra Ekspedisi Kamil Logistik: Cara Bergabung",
    heading: "Jadi mitra ekspedisi Kamil Logistik: apa yang didapat dan cara bergabung",
    description: "Punya gerai, gudang, atau toko di kota tujuan? Pelajari cara menjadi mitra Kamil Logistik: akun resmi, aplikasi buat resi dan invoice dari HP, dan pantauan dari pusat.",
    updated: "2026-11-19",
    body: () => (<>
      <p>Kamil Logistik bekerja sama dengan mitra resmi di berbagai kota. Mitra menjadi titik terima dan antar barang di kotanya, memakai aplikasi yang sama dengan seluruh jaringan.</p>
      <h2>Yang didapat mitra</h2>
      <ul>
        <li><b>Akun resmi</b> yang dibuat oleh admin pusat, lengkap dengan peran yang sesuai (kasir, gudang, atau kurir).</li>
        <li><b>Aplikasi di HP</b> untuk membuat resi, mencetak label, menimbang, menerbitkan invoice, dan mencatat pembayaran.</li>
        <li><b>Harga yang sama di seluruh jaringan.</b> Tarif diatur terpusat, jadi pelanggan melihat harga yang sama di mana pun.</li>
        <li><b>Daftar pelanggan yang perlu dihubungi</b>, dengan tombol chat WhatsApp yang pesannya sudah terisi.</li>
        <li><b>Laporan</b> resi dan komisi sesuai kesepakatan.</li>
      </ul>
      <h2>Yang diharapkan dari mitra</h2>
      <ul>
        <li>Tempat yang bisa menyimpan barang dengan aman.</li>
        <li>Petugas yang mau mencatat setiap tahap di aplikasi, termasuk foto dan kondisi barang.</li>
        <li>Pelayanan yang ramah dan tepat waktu kepada pelanggan.</li>
      </ul>
      <h2>Cara bergabung</h2>
      <p>Hubungi tim kami lewat WhatsApp dan ceritakan kota, jenis usaha, dan lokasi Anda. Setelah disetujui, admin pusat membuatkan akun petugas dan mendampingi cara memakai aplikasi. Lihat juga <Link href="/tentang">tentang Kamil Logistik</Link>.</p>
    </>),
  },
  {
    slug: "cara-kirim-motor-dan-mobil-antar-pulau",
    title: "Cara Kirim Motor dan Mobil Antar Pulau: Persiapan dan Dokumen",
    heading: "Cara kirim motor dan mobil antar pulau: persiapan, dokumen, dan hal yang perlu dicek",
    description: "Panduan mengirim motor atau mobil antar pulau lewat ekspedisi: persiapan kendaraan, foto kondisi, dokumen, bahan bakar, dan cara memantau pengirimannya.",
    updated: "2026-11-21",
    body: () => (<>
      <p>Mengirim kendaraan lewat ekspedisi lebih praktis daripada membawanya sendiri, terutama untuk pindah kota atau pulau. Supaya prosesnya lancar dan tidak ada sengketa kondisi, siapkan hal-hal berikut sebelum kendaraan diserahkan.</p>
      <h2>Persiapan kendaraan</h2>
      <ul>
        <li><b>Bersihkan kendaraan</b> dan keluarkan semua barang pribadi dari dalamnya. Barang di dalam kabin sebaiknya tidak ikut dikirim.</li>
        <li><b>Foto dari semua sisi</b>: depan, belakang, kiri, kanan, atap, panel dalam, dan angka kilometer. Foto ini bukti kondisi awal.</li>
        <li>Catat <b>goresan atau penyok yang sudah ada</b> dan tunjukkan pada petugas saat serah terima.</li>
        <li>Isi bahan bakar secukupnya saja. Umumnya kendaraan dikirim dengan tangki hampir kosong, tanyakan aturan pastinya ke petugas.</li>
        <li>Cabut atau amankan aksesori yang mudah lepas, misalnya spion tambahan, box, atau kamera.</li>
      </ul>
      <h2>Dokumen yang biasanya diminta</h2>
      <p>Umumnya salinan identitas pemilik dan dokumen kendaraan. Persyaratan pastinya dikonfirmasi tim saat Anda menghubungi kami, karena bisa berbeda untuk motor, mobil pribadi, dan kendaraan perusahaan.</p>
      <h2>Saat serah terima</h2>
      <ol>
        <li>Petugas memeriksa dan memotret kondisi kendaraan bersama Anda.</li>
        <li>Anda menerima <b>nomor resi</b> yang bisa dilacak kapan saja di halaman <Link href="/lacak">Cek resi</Link>.</li>
        <li>Setiap perpindahan tangan tercatat di aplikasi, lengkap dengan foto kondisi.</li>
      </ol>
      <h2>Saat kendaraan tiba</h2>
      <p>Periksa kendaraan dan bandingkan dengan foto awal sebelum menandatangani bukti terima. Bila ada kerusakan, sampaikan saat itu juga dan laporkan lewat halaman <Link href="/klaim">Klaim dan keluhan</Link> agar bisa dicocokkan dengan foto kondisi yang tersimpan.</p>
      <p>Kebutuhan lengkap ada di halaman layanan <Link href="/layanan/kirim-kendaraan">kirim kendaraan</Link>. Untuk meminta dijemput, gunakan <Link href="/jemput">Pesan jemput</Link>.</p>
    </>),
  },
  {
    slug: "cara-kirim-alat-berat-antar-pulau",
    title: "Cara Kirim Alat Berat Antar Pulau: Yang Perlu Disiapkan",
    heading: "Cara kirim alat berat antar pulau: ukuran, berat, dan persiapan di lokasi",
    description: "Panduan mengirim alat berat (excavator, loader, genset, dan sejenisnya): data yang perlu disiapkan, hitungan ukuran dan berat, serta persiapan muat dan bongkar.",
    updated: "2026-11-21",
    body: () => (<>
      <p>Alat berat termasuk muatan khusus: ukurannya besar, bobotnya tinggi, dan butuh cara muat serta bongkar yang berbeda dari cargo biasa. Semakin lengkap data yang Anda siapkan di awal, semakin cepat tim dapat memberi gambaran biaya dan jadwal.</p>
      <h2>Data yang perlu disiapkan</h2>
      <ul>
        <li><b>Jenis dan merek</b> alat, misalnya excavator, loader, genset, atau compressor.</li>
        <li><b>Ukuran</b>: panjang, lebar, dan tinggi dalam keadaan siap kirim.</li>
        <li><b>Berat</b> sesuai spesifikasi pabrik atau hasil timbangan.</li>
        <li><b>Alamat muat dan alamat tujuan</b>, termasuk kondisi akses jalan (lebar, tanjakan, jembatan).</li>
        <li>Foto alat dari beberapa sisi.</li>
      </ul>
      <h2>Persiapan sebelum muat</h2>
      <ul>
        <li>Bersihkan alat dari tanah dan material, dan pastikan <b>tidak ada kebocoran</b> oli atau bahan bakar.</li>
        <li>Lipat atau lepas bagian yang bisa dilepas (misalnya bucket atau boom) bila disarankan petugas.</li>
        <li>Kunci bagian yang bergerak, dan catat kondisi awal dengan foto.</li>
        <li>Pastikan ada <b>akses dan ruang</b> bagi kendaraan pengangkut di lokasi muat.</li>
      </ul>
      <h2>Mengapa ukuran dan berat sangat penting</h2>
      <p>Ukuran menentukan jenis angkutan (truk, trailer, atau kontainer jenis tertentu) dan cara muat. Berat menentukan peralatan angkat yang dibutuhkan. Data yang keliru bisa membuat jadwal mundur dan biaya berubah, jadi sebutkan apa adanya.</p>
      <h2>Di tempat tujuan</h2>
      <p>Siapkan lokasi bongkar yang rata dan cukup luas. Periksa alat bersama petugas dan bandingkan dengan foto awal sebelum menandatangani bukti terima.</p>
      <p>Lihat layanan <Link href="/layanan/kirim-alat-berat">kirim alat berat</Link> dan hitung berat volume barang di <Link href="/alat/berat-volumetrik">kalkulator berat volume</Link>. Biaya pasti ditentukan tim setelah data lengkap, hubungi lewat <Link href="/kontak">halaman Kontak</Link>.</p>
    </>),
  },
  {
    slug: "lcl-atau-fcl-kirim-lewat-kontainer",
    title: "LCL atau FCL? Memilih Cara Kirim Lewat Kontainer",
    heading: "LCL atau FCL: mana yang lebih hemat untuk kirim barang lewat kontainer?",
    description: "Perbedaan LCL (kontainer gabungan) dan FCL (kontainer penuh): kapan memilih masing-masing, kelebihan, kekurangan, dan cara menentukan yang paling hemat.",
    updated: "2026-11-21",
    body: () => (<>
      <p>Saat mengirim barang dalam jumlah besar lewat laut, Anda akan bertemu dua istilah: <b>LCL</b> dan <b>FCL</b>. Memahami perbedaannya membantu menghemat biaya dan waktu.</p>
      <h2>Apa itu LCL?</h2>
      <p><b>LCL (Less than Container Load)</b> berarti barang Anda berbagi kontainer dengan barang pelanggan lain. Anda hanya membayar ruang yang dipakai, biasanya dihitung berdasarkan berat atau volume.</p>
      <h2>Apa itu FCL?</h2>
      <p><b>FCL (Full Container Load)</b> berarti Anda menyewa satu kontainer penuh untuk barang sendiri, berapa pun isinya.</p>
      <h2>Perbandingan singkat</h2>
      <ul>
        <li><b>Biaya</b>: LCL cocok untuk muatan kecil sampai menengah. FCL lebih hemat per unit bila isi kontainer sudah banyak.</li>
        <li><b>Keamanan</b>: FCL disegel dan hanya berisi barang Anda. LCL digabung dengan barang lain.</li>
        <li><b>Waktu</b>: LCL kadang menunggu kontainer terisi dulu. FCL bisa berangkat sesuai jadwal Anda.</li>
        <li><b>Penanganan</b>: FCL biasanya lebih sedikit dipindah-pindah, sehingga risiko lecet lebih kecil.</li>
      </ul>
      <h2>Cara memilih</h2>
      <ol>
        <li>Hitung <b>total volume dan berat</b> barang Anda lebih dulu (lihat <Link href="/alat/berat-volumetrik">kalkulator berat volume</Link>).</li>
        <li>Bila muatan hanya sebagian kecil kontainer, LCL biasanya lebih hemat.</li>
        <li>Bila muatan sudah memenuhi sebagian besar kontainer, minta perbandingan biaya FCL.</li>
        <li>Pertimbangkan nilai dan kerapuhan barang. Barang bernilai tinggi atau mudah rusak lebih aman di FCL.</li>
      </ol>
      <p>Kamil Logistik melayani sewa kontainer sesuai kebutuhan, lihat <Link href="/layanan/sewa-kontainer">penyewaan kontainer (LCL dan FCL)</Link>. Tarif per rute ada di <Link href="/ekspedisi">rute dan tarif</Link>, dan tim siap membantu menghitung pilihan terbaik lewat <Link href="/kontak">halaman Kontak</Link>.</p>
    </>),
  },
  {
    slug: "ekspedisi-murah-ke-seluruh-indonesia",
    title: "Ekspedisi Murah ke Seluruh Indonesia: Cara Memilih Jasa Cargo",
    heading: "Ekspedisi murah ke seluruh Indonesia: cara memilih jasa cargo yang tepat",
    description: "Cara memilih jasa ekspedisi dan cargo murah untuk kirim barang antar pulau ke seluruh Indonesia: bandingkan tarif, estimasi, pelacakan resi, dan keamanan barang.",
    updated: "2026-11-22",
    body: () => (<>
      <p>Mengirim barang antar pulau berbeda dengan kirim dalam satu kota. Jaraknya jauh, rutenya bisa lewat darat, laut, atau udara, dan harganya sangat bergantung pada cara menghitungnya. Berikut hal yang perlu Anda bandingkan sebelum memilih jasa ekspedisi.</p>
      <h2>1. Tarif yang transparan</h2>
      <p>Pilih ekspedisi yang menjelaskan cara hitungnya: per kilogram atau per meter kubik, serta mana yang dipakai bila beratnya berbeda dengan ukurannya. Di Kamil Logistik, Anda bisa <Link href="/ongkir">menghitung ongkir sendiri</Link> tanpa daftar akun.</p>
      <h2>2. Pilihan darat, laut, dan udara</h2>
      <p>Cargo laut hemat untuk barang berat dan banyak, cargo udara untuk yang mendesak, dan cargo darat untuk antar kota di satu pulau. Lihat <Link href="/layanan">semua layanan</Link> untuk mencocokkan kebutuhan Anda.</p>
      <h2>3. Resi yang bisa dilacak</h2>
      <p>Barang yang menyeberang pulau butuh pemantauan. Pastikan ada nomor resi dan halaman <Link href="/lacak">cek resi</Link> yang bisa dibuka kapan saja, serta tim yang menjawab bila ada kendala.</p>
      <h2>4. Jaringan gudang dan jangkauan</h2>
      <p>Jaringan gudang yang jelas mengurangi risiko barang tertahan. Kamil Logistik memiliki gudang di Jakarta, Makassar, dan Surabaya, dan melayani pengiriman ke seluruh Indonesia. Untuk tujuan yang belum tercantum di <Link href="/ekspedisi">daftar rute</Link>, tanyakan langsung lewat WhatsApp.</p>
      <h2>5. Kemasan dan jenis barang</h2>
      <p>Baca <Link href="/panduan/cara-packing-barang-cargo-laut">panduan packing</Link> dan <Link href="/panduan/barang-yang-boleh-dan-tidak-boleh-dikirim-lewat-cargo">daftar barang yang boleh dikirim</Link> agar barang aman sampai tujuan.</p>
      <h2>Catatan</h2>
      <p>Tarif belum termasuk asuransi, pajak yang berlaku, serta bongkar muat di lokasi. Lihat <Link href="/syarat">syarat dan ketentuan</Link>.</p>
    </>),
  },
  {
    slug: "kirim-barang-ke-kalimantan-dan-sumatera",
    title: "Kirim Barang ke Kalimantan dan Sumatera: Panduan Cargo Antar Pulau",
    heading: "Kirim barang ke Kalimantan dan Sumatera: panduan cargo antar pulau",
    description: "Panduan kirim barang ke Kalimantan, Sumatera, dan Jawa lewat cargo: pilihan darat, laut, udara, cara hitung ongkir, packing, dan melacak resi.",
    updated: "2026-11-22",
    body: () => (<>
      <p>Pengiriman ke Kalimantan dan Sumatera umumnya melewati laut, sehingga cara menghitung dan mengemas barang sangat menentukan biaya dan keamanannya.</p>
      <h2>Langkah singkat</h2>
      <ol>
        <li>Hitung perkiraan biaya di <Link href="/ongkir">kalkulator ongkir</Link>. Untuk tujuan yang belum tercantum, hubungi tim lewat WhatsApp.</li>
        <li>Siapkan kemasan yang kuat dan tulis nama serta nomor HP penerima.</li>
        <li>Barang dijemput atau diantar ke gudang, lalu ditimbang. Berat pasti menentukan biaya akhir.</li>
        <li>Simpan nomor resi dan <Link href="/lacak">pantau posisi barang</Link> sampai diterima.</li>
      </ol>
      <h2>Darat, laut, atau udara?</h2>
      <p>Barang berat dan banyak lebih hemat lewat laut. Barang mendesak atau bernilai tinggi lebih cocok lewat udara. Pelajari <Link href="/panduan/berapa-lama-kirim-barang-lewat-cargo-laut">lama pengiriman cargo laut</Link> agar jadwal Anda tepat.</p>
      <h2>Kendaraan dan barang besar</h2>
      <p>Untuk motor, mobil, atau alat berat, baca <Link href="/panduan/cara-kirim-motor-dan-mobil-antar-pulau">kirim motor dan mobil antar pulau</Link> dan <Link href="/panduan/cara-kirim-alat-berat-antar-pulau">kirim alat berat</Link>.</p>
    </>),
  },
  {
    slug: "cara-kirim-barang-antar-pulau-dari-jawa",
    title: "Cara Kirim Barang Antar Pulau dari Jawa: Jakarta dan Surabaya",
    heading: "Cara kirim barang antar pulau dari Jawa lewat Jakarta dan Surabaya",
    description: "Kirim barang dari Jakarta atau Surabaya ke luar Jawa: Sulawesi, Kalimantan, Sumatera, Maluku, dan Papua. Alur, biaya, packing, dan pelacakan resi.",
    updated: "2026-11-22",
    body: () => (<>
      <p>Jakarta dan Surabaya adalah pintu keluar utama barang dari Jawa ke pulau lain. Kamil Logistik memiliki gudang di kedua kota ini, serta di Makassar, sehingga barang dapat dihubungkan ke berbagai pulau.</p>
      <h2>Alur pengiriman</h2>
      <ol>
        <li><b>Hubungi atau minta jemput.</b> Gunakan <Link href="/jemput">pesan jemput online</Link> atau antar sendiri ke gudang.</li>
        <li><b>Barang ditimbang.</b> Per barang, sehingga berat tertagih jelas.</li>
        <li><b>Resi dan invoice diterbitkan.</b> Anda menerima nomor resi untuk dilacak.</li>
        <li><b>Diangkut lewat laut atau udara</b> sesuai layanan yang dipilih, lalu sampai di gudang tujuan.</li>
        <li><b>Diantar atau diambil</b> sesuai pilihan door-to-door atau port-to-port. Baca <Link href="/panduan/door-to-door-port-to-door-atau-port-to-port">perbedaannya</Link>.</li>
      </ol>
      <h2>Mulai dari mana?</h2>
      <p>Lihat <Link href="/ekspedisi">rute dan tarif</Link>, atau langsung <Link href="/ongkir">hitung ongkir</Link>. Pengiriman rutin untuk toko online dibahas di <Link href="/panduan/kirim-barang-online-shop-umkm-ke-sulawesi">panduan UMKM</Link>.</p>
    </>),
  },
];
