/**
 * Minimal PayUnit (https://payunit.net) gateway client.
 *
 * Reads credentials from the environment. When they are not configured the app
 * falls back to a local mock checkout so the full purchase flow can still be
 * exercised end-to-end in development.
 *
 * Required env vars for live payments:
 *   PAYUNIT_API_USER      — API user
 *   PAYUNIT_API_PASSWORD  — API password
 *   PAYUNIT_API_KEY       — x-api-key / API token
 *   PAYUNIT_MODE          — "test" or "live" (defaults to "test")
 *   PAYUNIT_BASE_URL      — optional override (defaults to https://api.payunit.net)
 */

const BASE_URL = process.env.PAYUNIT_BASE_URL || 'https://api.payunit.net';

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

export interface InitializeOpts {
  amount: number;
  currency: string;
  transactionId: string;
  returnUrl: string;
  notifyUrl: string;
  name: string;
  description: string;
}

export async function initializePayment(opts: InitializeOpts): Promise<{ transactionUrl: string }> {
  const res = await fetch(`${BASE_URL}/api/gateway/initialize`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      total_amount: opts.amount,
      currency: opts.currency,
      transaction_id: opts.transactionId,
      return_url: opts.returnUrl,
      notify_url: opts.notifyUrl,
      payment_country: 'CM',
      name: opts.name,
      description: opts.description,
    }),
    cache: 'no-store',
  });

  const data = await res.json().catch(() => ({}));
  const url =
    data?.data?.transaction_url ||
    data?.data?.t_url ||
    data?.transaction_url ||
    data?.t_url;

  if (!res.ok || !url) {
    throw new Error(`PayUnit initialize failed: ${res.status} ${JSON.stringify(data)}`);
  }
  return { transactionUrl: url };
}

/** Returns a normalized status: 'SUCCESS' | 'FAILED' | 'PENDING'. */
export async function getPaymentStatus(transactionId: string): Promise<'SUCCESS' | 'FAILED' | 'PENDING'> {
  const res = await fetch(`${BASE_URL}/api/gateway/paymentstatus/${transactionId}`, {
    method: 'GET',
    headers: authHeaders(),
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  const raw = String(
    data?.data?.transaction_status ??
      data?.data?.status ??
      data?.transaction_status ??
      data?.status ??
      'PENDING',
  ).toUpperCase();

  if (['SUCCESS', 'SUCCESSFUL', 'SUCCESSFULL', 'COMPLETED', 'PAID', 'OK'].includes(raw)) return 'SUCCESS';
  if (['FAILED', 'FAILURE', 'CANCELLED', 'CANCELED', 'DECLINED', 'ERROR'].includes(raw)) return 'FAILED';
  return 'PENDING';
}
