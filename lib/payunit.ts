/**
 * PayUnit (https://developer.payunit.net) gateway client.
 *
 * Live checkout uses the in-app Direct Payment flow:
 *   1. POST /api/gateway/initialize
 *   2. POST /api/gateway/makepayment  → USSD / MoMo prompt on the handset
 * The learner stays on Intellex. Status is confirmed via webhook + paymentstatus.
 *
 * Env:
 *   PAYUNIT_API_USER, PAYUNIT_API_PASSWORD, PAYUNIT_API_KEY
 *   PAYUNIT_MODE        - "test" | "live" (default "test")
 *   PAYUNIT_BASE_URL / PAYUNIT_GATEWAY_URL
 *   PAYUNIT_CALLBACK_URL / APP_PUBLIC_URL - public HTTPS base for notify_url
 */

const BASE_URL =
  process.env.PAYUNIT_BASE_URL ||
  process.env.PAYUNIT_GATEWAY_URL ||
  'https://gateway.payunit.net';

export type PayOperator = 'MTN' | 'ORANGE';

export function isPayunitConfigured(): boolean {
  const user = process.env.PAYUNIT_API_USER || process.env.PAYUNIT_APP_ID;
  return Boolean(user && process.env.PAYUNIT_API_PASSWORD && process.env.PAYUNIT_API_KEY);
}

function apiUser(): string {
  return process.env.PAYUNIT_API_USER || process.env.PAYUNIT_APP_ID || '';
}

function authHeaders(): Record<string, string> {
  const auth = Buffer.from(`${apiUser()}:${process.env.PAYUNIT_API_PASSWORD || ''}`).toString('base64');
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
 * production callback URL.
 */
export function resolveCallbackBase(origin: string): string | null {
  const raw = (process.env.APP_PUBLIC_URL || origin || '').replace(/\/$/, '');
  const isLocal = raw.includes('localhost') || raw.includes('127.0.0.1');
  const base = isLocal ? process.env.PAYUNIT_CALLBACK_URL || process.env.APP_PUBLIC_URL || '' : raw;
  const clean = base.replace(/\/$/, '');
  return clean.startsWith('https://') ? clean : null;
}

export function parsePayOperator(raw: unknown): PayOperator | null {
  const s = String(raw || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '');
  if (s === 'MTN' || s === 'CM_MTNMOMO' || s === 'MTNMOMO' || s === 'MOMO') return 'MTN';
  if (s === 'ORANGE' || s === 'CM_ORANGE' || s === 'ORANGEMONEY') return 'ORANGE';
  return null;
}

/** Last 9 digits — Cameroon MoMo / Orange numbers. */
export function cleanCameroonPhone(raw: string): string {
  const digits = String(raw || '').replace(/[^0-9]/g, '');
  if (digits.startsWith('237') && digits.length >= 12) return digits.slice(-9);
  return digits.slice(-9);
}

export function isValidCameroonMomo(phone: string): boolean {
  return /^6\d{8}$/.test(phone);
}

/**
 * Orange Money transaction IDs are capped at 18 characters.
 * MTN and others use PREFIX_TIMESTAMP_RANDOM.
 */
export function generatePayUnitTransactionId(prefix = 'INTX', provider?: string) {
  const isOrange = typeof provider === 'string' && provider.toLowerCase().includes('orange');

  if (!isOrange) {
    const rand = Math.random().toString(36).slice(2, 10).toUpperCase();
    return `${prefix}_${Date.now()}_${rand}`;
  }

  const MAX_LEN = 18;
  const rawPrefix = String(prefix || 'INTX')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
  const cleanPrefix = rawPrefix ? `${rawPrefix}_` : 'INTX_';
  if (cleanPrefix.length >= MAX_LEN) return cleanPrefix.slice(0, MAX_LEN);

  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2).toUpperCase();
  const available = MAX_LEN - cleanPrefix.length;
  const tail = (ts + rand).slice(0, available);
  return `${cleanPrefix}${tail}`;
}

export type DirectPayResult = {
  success: boolean;
  status: string;
  transaction_id: string;
  message: string;
  raw?: unknown;
};

/**
 * In-app Direct Mobile Money: initialize, then trigger the handset prompt.
 * Does not return a hosted checkout URL.
 */
export async function makeDirectPayment(options: {
  amount: number;
  transactionId: string;
  phoneNumber: string;
  paymentOperator: PayOperator;
  returnUrl: string;
  notifyUrl: string;
  description?: string;
}): Promise<DirectPayResult> {
  if (!isPayunitConfigured()) {
    return {
      success: false,
      status: 'FAILED',
      transaction_id: options.transactionId,
      message: 'PayUnit is not configured.',
    };
  }

  const phone = cleanCameroonPhone(options.phoneNumber);
  if (!isValidCameroonMomo(phone)) {
    return {
      success: false,
      status: 'FAILED',
      transaction_id: options.transactionId,
      message: 'Enter a valid Cameroon mobile number (9 digits, starting with 6).',
    };
  }

  const gatewayCode = options.paymentOperator === 'ORANGE' ? 'CM_ORANGE' : 'CM_MTNMOMO';
  const amount = Math.round(options.amount);
  const user = apiUser();

  try {
    const initRes = await fetch(`${BASE_URL}/api/gateway/initialize`, {
      method: 'POST',
      headers: authHeaders(),
      cache: 'no-store',
      body: JSON.stringify({
        total_amount: amount,
        currency: 'XAF',
        transaction_id: options.transactionId,
        return_url: options.returnUrl,
        notify_url: options.notifyUrl,
        app_id: user,
        description: options.description || 'InTelleX payment',
      }),
    });
    const initData = (await initRes.json().catch(() => ({}))) as Record<string, unknown>;
    const initStatus = String(initData.status || '').toUpperCase();
    if (!initRes.ok || initStatus === 'FAILED' || initStatus === 'ERROR') {
      const msg =
        String(initData.message || initData.error || '').trim() ||
        `PayUnit initialize failed (${initRes.status})`;
      console.error('PayUnit initialize failed:', initRes.status, initData);
      return {
        success: false,
        status: 'FAILED',
        transaction_id: options.transactionId,
        message: msg,
        raw: initData,
      };
    }

    const payRes = await fetch(`${BASE_URL}/api/gateway/makepayment`, {
      method: 'POST',
      headers: authHeaders(),
      cache: 'no-store',
      body: JSON.stringify({
        gateway: gatewayCode,
        amount,
        transaction_id: options.transactionId,
        phone_number: phone,
        currency: 'XAF',
        paymentType: 'button',
        return_url: options.returnUrl,
        notify_url: options.notifyUrl,
      }),
    });
    const payData = (await payRes.json().catch(() => ({}))) as Record<string, unknown>;
    const nested = (payData.data && typeof payData.data === 'object' ? payData.data : payData) as Record<
      string,
      unknown
    >;
    const statusCode = Number(payData.statusCode ?? payRes.status);
    const statusText = String(payData.status || nested.status || '').toUpperCase();
    const ok =
      payRes.ok &&
      statusText !== 'FAILED' &&
      statusText !== 'ERROR' &&
      (statusText === 'SUCCESS' || statusCode === 200 || statusText === 'PENDING' || payRes.status === 200);

    if (!ok) {
      const msg =
        String(payData.message || payData.error || nested.message || '').trim() ||
        `PayUnit could not send the ${options.paymentOperator} prompt.`;
      console.error('PayUnit makepayment failed:', payRes.status, payData);
      return {
        success: false,
        status: 'FAILED',
        transaction_id: options.transactionId,
        message: msg,
        raw: payData,
      };
    }

    return {
      success: true,
      status: String(nested.payment_status || nested.transaction_status || 'PENDING'),
      transaction_id: String(nested.transaction_id || options.transactionId),
      message:
        String(payData.message || '').trim() ||
        `Approve the payment on your ${options.paymentOperator === 'ORANGE' ? 'Orange Money' : 'MTN MoMo'} phone.`,
      raw: payData,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Could not reach PayUnit.';
    console.error('PayUnit direct pay exception:', msg);
    return {
      success: false,
      status: 'FAILED',
      transaction_id: options.transactionId,
      message: msg,
    };
  }
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

/** Hosted checkout (unused by the live UI; kept for compatibility). */
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
    data?.data?.redirect || data?.data?.paymentUrl || data?.redirect || data?.paymentUrl;

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
    d?.transaction_status ?? d?.payment_status ?? d?.status ?? (p as Record<string, unknown>)?.status ?? 'PENDING',
  ).toUpperCase();
  if (['SUCCESS', 'SUCCESSFUL', 'SUCCESSFULL', 'COMPLETED', 'COMPLETE', 'PAID', 'CONFIRMED', 'OK'].includes(raw)) {
    return 'SUCCESS';
  }
  if (['FAILED', 'FAILURE', 'CANCELLED', 'CANCELED', 'DECLINED', 'ERROR'].includes(raw)) return 'FAILED';
  return 'PENDING';
}

export function isPayUnitTransactionSuccessful(statusPayload: unknown): boolean {
  return normalizeStatus(statusPayload) === 'SUCCESS';
}

/** Best-effort extraction of a transaction id from a webhook payload. */
export function extractTransactionId(payload: unknown): string | null {
  const p = payload as Record<string, unknown> | null;
  const d = (p?.data ?? p) as Record<string, unknown> | undefined;
  const candidates = [
    d?.transaction_id,
    d?.transactionId,
    d?.transaction,
    d?.t_id,
    d?.reference,
    p?.transaction_id,
    p?.transactionId,
    p?.transaction,
    p?.reference,
  ];
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c.trim();
    if (typeof c === 'number') return String(c);
  }
  return null;
}
