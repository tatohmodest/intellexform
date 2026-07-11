/**
 * PayUnit (https://developer.payunit.net) gateway client, modelled on the
 * production-proven Junior Dev integration:
 *   - uses the hosted `checkout/initialize` flow (returns `data.redirect`)
 *   - callbacks must be public HTTPS (PayUnit's CloudFront blocks localhost)
 *   - the success page trusts the redirect and confirms the order
 *
 * Env:
 *   PAYUNIT_API_USER, PAYUNIT_API_PASSWORD, PAYUNIT_API_KEY  — credentials
 *   PAYUNIT_MODE        — "test" | "live" (default "test")
 *   PAYUNIT_BASE_URL    — optional override for the PayUnit gateway host
 *   PAYUNIT_CALLBACK_URL / APP_PUBLIC_URL — public HTTPS base for callbacks
 */

// Public, documented PayUnit gateway host (developer.payunit.net).
const BASE_URL = process.env.PAYUNIT_BASE_URL || 'https://gateway.payunit.net'; // pragma: allowlist secret

export function isPayunitConfigured(): boolean {
  return Boolean(
    process.env.PAYUNIT_API_USER &&
      process.env.PAYUNIT_API_PASSWORD &&
      process.env.PAYUNIT_API_KEY,
  );
}

function authHeaders(): Record<string, string> {
  const auth = Buffer.from(
    `${process.env.PAYUNIT_API_USER}:${process.env.PAYUNIT_API_PASSWORD}`,
  ).toString('base64');
  return {
    'Content-Type': 'application/json',
    Authorization: `Basic ${auth}`,
    'x-api-key': process.env.PAYUNIT_API_KEY || '',
    mode: process.env.PAYUNIT_MODE || 'test',
  };
}

/**
 * Resolve the public base URL used for PayUnit callbacks. PayUnit rejects
 * non-HTTPS / localhost URLs, so on localhost we fall back to the configured
 * production callback URL (matching the Junior Dev approach).
 */
export function resolveCallbackBase(origin: string): string | null {
  const raw = (process.env.APP_PUBLIC_URL || origin || '').replace(/\/$/, '');
  const isLocal = raw.includes('localhost') || raw.includes('127.0.0.1');
  const base = isLocal ? (process.env.PAYUNIT_CALLBACK_URL || process.env.APP_PUBLIC_URL || '') : raw;
  const clean = base.replace(/\/$/, '');
  return clean.startsWith('https://') ? clean : null;
}

export interface CheckoutOpts {
  amount: number;
  currency: string;
  transactionId: string;
  successUrl: string;
  cancelUrl: string;
  notifyUrl: string;
  productName: string;
  productImage?: string;
  about?: string;
  meta?: Record<string, unknown>;
}

/** Initialize a hosted PayUnit checkout; returns the redirect (payment) URL. */
export async function initializeCheckout(opts: CheckoutOpts): Promise<{ redirectUrl: string }> {
  const res = await fetch(`${BASE_URL}/api/gateway/checkout/initialize`, {
    method: 'POST',
    headers: authHeaders(),
    cache: 'no-store',
    body: JSON.stringify({
      cancel_url: opts.cancelUrl,
      success_url: opts.successUrl,
      notify_url: opts.notifyUrl,
      return_url: opts.notifyUrl,
      currency: opts.currency,
      mode: 'payment',
      transaction_id: opts.transactionId,
      total_amount: opts.amount,
      items: [
        {
          price_description: { unit_amount: opts.amount },
          product_description: {
            name: opts.productName,
            image_url: opts.productImage || 'https://picsum.photos/seed/intellex/240/160',
            about_product: opts.about || opts.productName,
          },
          quantity: 1,
        },
      ],
      meta: { phone_number_collection: false, address_collection: false, ...(opts.meta || {}) },
    }),
  });

  const data = await res.json().catch(() => ({}));
  const url =
    data?.data?.redirect ||
    data?.data?.paymentUrl ||
    data?.redirect ||
    data?.paymentUrl;

  if (!res.ok || !url) {
    throw new Error(`PayUnit checkout initialize failed: ${res.status} ${JSON.stringify(data).slice(0, 400)}`);
  }
  return { redirectUrl: url };
}

/** Returns a normalized status: 'SUCCESS' | 'FAILED' | 'PENDING'. */
export async function getPaymentStatus(transactionId: string): Promise<'SUCCESS' | 'FAILED' | 'PENDING'> {
  const res = await fetch(`${BASE_URL}/api/gateway/paymentstatus/${transactionId}`, {
    method: 'GET',
    headers: authHeaders(),
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  return normalizeStatus(data);
}

export function normalizeStatus(payload: unknown): 'SUCCESS' | 'FAILED' | 'PENDING' {
  const p = payload as Record<string, unknown> | null;
  const d = (p?.data ?? p) as Record<string, unknown> | undefined;
  const raw = String(
    d?.transaction_status ?? d?.status ?? (p as Record<string, unknown>)?.status ?? 'PENDING',
  ).toUpperCase();
  if (['SUCCESS', 'SUCCESSFUL', 'SUCCESSFULL', 'COMPLETED', 'PAID', 'OK'].includes(raw)) return 'SUCCESS';
  if (['FAILED', 'FAILURE', 'CANCELLED', 'CANCELED', 'DECLINED', 'ERROR'].includes(raw)) return 'FAILED';
  return 'PENDING';
}

/** Best-effort extraction of a transaction id from a webhook payload. */
export function extractTransactionId(payload: unknown): string | null {
  const p = payload as Record<string, unknown> | null;
  const d = (p?.data ?? p) as Record<string, unknown> | undefined;
  const id =
    d?.transaction_id ?? d?.transactionId ?? d?.transaction ?? p?.transaction_id ?? p?.transactionId;
  return id ? String(id) : null;
}
