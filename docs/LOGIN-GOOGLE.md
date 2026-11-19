# Login dengan Gmail (Google)

Kode sudah siap. Tombol **Masuk dengan Google** baru tampil setelah langkah 1 sampai 4 selesai dan variabel `GOOGLE_LOGIN=1` dipasang di Vercel.

Aturan keamanannya: hanya alamat Gmail yang **sudah didaftarkan Pemilik** di menu Petugas yang bisa masuk. Orang lain yang mencoba akan langsung dikeluarkan.

## 1. Buat kunci di Google Cloud
1. Buka console.cloud.google.com, buat proyek baru (nama bebas, mis. "Kamil Logistik").
2. Menu **APIs & Services → OAuth consent screen**: pilih *External*, isi nama aplikasi "Kamil Logistik", email bantuan, dan domain `kamillogistik.com`. Simpan.
3. Menu **Credentials → Create credentials → OAuth client ID**, jenis *Web application*.
4. Pada **Authorized redirect URIs** isi persis: `https://vnrjtkbobknslbsghmdw.supabase.co/auth/v1/callback`
5. Simpan, lalu salin **Client ID** dan **Client secret**.

## 2. Aktifkan di Supabase
Supabase → proyek `vnrjtkbobknslbsghmdw` → **Authentication → Sign In / Providers → Google**: nyalakan, tempel Client ID dan Client secret, simpan.

## 3. Alamat kembali
Supabase → **Authentication → URL Configuration**:
- Site URL: `https://kamillogistik.com`
- Redirect URLs: tambahkan `https://kamillogistik.com/auth/callback`

## 4. Matikan pendaftaran bebas (penting)
Supabase → **Authentication → Sign In / Providers**: matikan **Allow new users to sign up**. Akun petugas dibuat Pemilik lewat aplikasi, jadi ini tidak mengganggu, dan membuat orang asing tidak bisa membuat akun lewat Google.

## 5. Nyalakan tombol
Vercel → proyek `web` → Environment Variables: `GOOGLE_LOGIN` = `1` (Production), lalu deploy ulang. (Asisten bisa memasangnya bila diminta.)

## Cara pakai
- Pemilik membuat akun petugas dengan **email Gmail petugas** itu (menu Petugas). Petugas boleh tetap memakai sandi, atau menekan **Masuk dengan Google**.
- Akun yang emailnya sama otomatis tersambung.
- Gmail yang belum didaftarkan melihat pesan "belum terdaftar sebagai petugas" dengan tombol bantuan WhatsApp.
