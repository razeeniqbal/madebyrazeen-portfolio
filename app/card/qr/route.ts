import QRCode from 'qrcode';
import { CARD_URL } from '@/lib/card';

/**
 * The card's QR code as an SVG (print quality, for slides, name tags or an NFC card's artwork).
 * ?download=1 saves it as a file.
 */
export async function GET(req: Request) {
  const svg = await QRCode.toString(CARD_URL, { type: 'svg', errorCorrectionLevel: 'M', margin: 2, color: { dark: '#0b0b0b', light: '#ffffff' } });
  const download = new URL(req.url).searchParams.has('download');
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
      ...(download && { 'Content-Disposition': 'attachment; filename="Razeen_Iqbal_card_QR.svg"' }),
    },
  });
}
