import { redirect } from "next/navigation";

/** Dulu satu halaman panjang; kini tiap kelompok punya tombol sendiri di menu bawah. */
export default function Kelola() {
  redirect("/app/pusat?g=operasional");
}
