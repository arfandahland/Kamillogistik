import "server-only";
import bwipjs from "bwip-js/node";

/** Gambar barcode Code128 (SVG) untuk label. Isi hanya kode resi/barang buatan sistem sendiri. */
export function barcodeSvg(text: string): string {
  return bwipjs.toSVG({ bcid: "code128", text, height: 14, scale: 3, includetext: false, paddingwidth: 0, paddingheight: 0 });
}

/** Gambar QR (SVG): mudah dibaca kamera HP biasa, termasuk dari layar. */
export function qrSvg(text: string): string {
  return bwipjs.toSVG({ bcid: "qrcode", text, scale: 4, paddingwidth: 0, paddingheight: 0 });
}
