/**
 * LoopingBinary OAuth 2.0 client ("Sign in with LoopingBinary").
 *
 * Flow (authorization code):
 *  1. Redirect the browser to  https://auth.loopingbinary.com/oauth/authorize
 *  2. LoopingBinary redirects back to  {LB_OAUTH_REDIRECT_URI}?code=...&state=...
 *  3. We exchange the code at  POST https://auth.loopingbinary.com/api/oauth/token
 *  4. We fetch the profile at  GET https://auth.loopingbinary.com/api/oauth/userinfo
 */

const AUTHORIZE_URL =
  process.env.LB_OAUTH_AUTHORIZE_URL ||
  'https://auth.loopingbinary.com/oauth/authorize';
const TOKEN_URL =
  process.env.LB_OAUTH_TOKEN_URL ||
  'https://auth.loopingbinary.com/api/oauth/token';
const USERINFO_URL =
  process.env.LB_OAUTH_USERINFO_URL ||
  'https://auth.loopingbinary.com/api/oauth/userinfo';

export const OAUTH_STATE_COOKIE = 'lb_oauth_state';

export function isOAuthConfigured(): boolean {
  return Boolean(
    process.env.LB_OAUTH_CLIENT_ID && process.env.LB_OAUTH_CLIENT_SECRET,
  );
}

function clientId(): string {
  const id = process.env.LB_OAUTH_CLIENT_ID;
  if (!id) throw new Error('LB_OAUTH_CLIENT_ID is not set');
  return id;
}

function clientSecret(): string {
  const s = process.env.LB_OAUTH_CLIENT_SECRET;
  if (!s) throw new Error('LB_OAUTH_CLIENT_SECRET is not set');
  return s;
}

export function redirectUri(requestOrigin?: string): string {
  if (process.env.LB_OAUTH_REDIRECT_URI) return process.env.LB_OAUTH_REDIRECT_URI;
  return `${requestOrigin ?? 'https://intellex.loopingbinary.com'}/oauth/callback`;
}

/** Build the browser redirect URL that starts the OAuth dance. */
export function buildAuthorizeUrl(opts: {
  state: string;
  requestOrigin?: string;
  /** 'signup' hints the auth server to show the create-account screen first. */
  intent?: 'login' | 'signup';
}): string {
  const url = new URL(AUTHORIZE_URL);
  url.searchParams.set('client_id', clientId());
  url.searchParams.set('redirect_uri', redirectUri(opts.requestOrigin));
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid profile email');
  url.searchParams.set('state', opts.state);
  if (opts.intent === 'signup') url.searchParams.set('prompt', 'create');
  return url.toString();
}

export interface LBTokenResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  refresh_token?: string;
  id_token?: string;
  scope?: string;
}

export async function exchangeCodeForToken(
  code: string,
  requestOrigin?: string,
): Promise<LBTokenResponse> {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri(requestOrigin),
      client_id: clientId(),
      client_secret: clientSecret(),
    }),
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) {
    throw new Error(
      data.error_description || data.error || `Token exchange failed (${res.status})`,
    );
  }
  return data as LBTokenResponse;
}

export interface LBProfile {
  /** Stable LoopingBinary account id. */
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
  [key: string]: unknown;
}

export async function fetchUserInfo(accessToken: string): Promise<LBProfile> {
  const res = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      data.error_description || data.error || `Userinfo failed (${res.status})`,
    );
  }
  // Normalise across possible field names from the LB auth server.
  const sub = String(data.sub ?? data.id ?? data.user_id ?? data.uid ?? '');
  if (!sub) throw new Error('Userinfo response missing a user id');
  return {
    ...data,
    sub,
    email: data.email ?? data.email_address ?? undefined,
    name:
      data.name ??
      data.full_name ??
      data.username ??
      (data.given_name ? `${data.given_name} ${data.family_name ?? ''}`.trim() : undefined),
    picture: data.picture ?? data.avatar_url ?? data.avatar ?? undefined,
  };
}
