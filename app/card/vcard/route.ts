import { CARD_PHOTO, getCard, toVCard } from '@/lib/card';

/** Save contact: a vCard with the card photo embedded (iOS and Android ignore photo links). */
export async function GET(req: Request) {
  let photo: string | undefined;
  try {
    const res = await fetch(new URL(CARD_PHOTO, req.url), { cache: 'force-cache' });
    if (res.ok) photo = Buffer.from(await res.arrayBuffer()).toString('base64');
  } catch {
    // The contact still saves without a photo.
  }
  return new Response(toVCard(getCard(), photo), {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': 'attachment; filename="Razeen_Iqbal.vcf"',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
