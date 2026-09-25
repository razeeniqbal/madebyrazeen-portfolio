import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '../../../../keystatic.config';
import { keystaticReady } from '@/lib/keystatic-env';

// Until the GitHub App is set up (docs/v2/ADMIN-AND-CHAT.md), the admin API answers 503
// instead of failing the whole production build.
const notConfigured = () => Response.json({ error: 'Admin not configured' }, { status: 503 });

const handlers = keystaticReady ? makeRouteHandler({ config }) : { GET: notConfigured, POST: notConfigured };

export const GET = handlers.GET;
export const POST = handlers.POST;
