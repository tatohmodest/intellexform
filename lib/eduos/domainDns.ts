/**
 * Custom domain DNS verification helpers.
 *
 * Organizations connect a domain → Intellex shows CNAME instructions →
 * DNS is verified → domain activates. Ownership proof is required before
 * a domain is attached to an organization.
 */

import dns from 'dns/promises';
import { platformCnameTarget, normalizeHostname } from '@/lib/learn/institutionDomains';

export type DnsVerifyResult = {
  ok: boolean;
  host: string;
  expectedCname: string;
  found: string[];
  message: string;
};

/**
 * Check that `host` has a CNAME (or alias chain) pointing at Intellex.
 * Also accepts A/AAAA matching the platform target when CNAME is flattened (CDN).
 */
export async function verifyDomainDns(hostRaw: string): Promise<DnsVerifyResult> {
  const host = normalizeHostname(hostRaw);
  const expected = platformCnameTarget().toLowerCase();

  if (!host) {
    return {
      ok: false,
      host: '',
      expectedCname: expected,
      found: [],
      message: 'Invalid domain.',
    };
  }

  const found: string[] = [];

  try {
    const cnames = await dns.resolveCname(host);
    for (const c of cnames) {
      found.push(c.replace(/\.$/, '').toLowerCase());
    }
  } catch {
    // No CNAME — try resolveAny / lookup for flattened records
  }

  if (found.some((c) => c === expected || c.endsWith(`.${expected}`))) {
    return {
      ok: true,
      host,
      expectedCname: expected,
      found,
      message: 'DNS CNAME verified.',
    };
  }

  // Some providers flatten CNAME to A records. Best-effort: resolve both hosts.
  try {
    const [hostAddrs, targetAddrs] = await Promise.all([
      dns.lookup(host, { all: true }).catch(() => [] as { address: string }[]),
      dns.lookup(expected, { all: true }).catch(() => [] as { address: string }[]),
    ]);
    const hostIpList = hostAddrs.map((a) => a.address);
    const hostIpLookup: Record<string, true> = {};
    for (const ip of hostIpList) hostIpLookup[ip] = true;
    const overlap = targetAddrs.some((a) => Boolean(hostIpLookup[a.address]));
    if (overlap && hostIpList.length > 0) {
      const uniqueIps: string[] = [];
      for (const ip of hostIpList) {
        if (!uniqueIps.includes(ip)) uniqueIps.push(ip);
      }
      for (const ip of uniqueIps) found.push(`A:${ip}`);
      return {
        ok: true,
        host,
        expectedCname: expected,
        found,
        message: 'DNS appears to point at Intellex (A-record overlap with CNAME target).',
      };
    }
  } catch {
    /* ignore */
  }

  return {
    ok: false,
    host,
    expectedCname: expected,
    found,
    message: found.length
      ? `Found ${found.join(', ')} but expected CNAME to ${expected}. DNS may still be propagating.`
      : `We could not find the required DNS record yet. Add a CNAME for this host pointing to ${expected}. DNS changes can take some time to propagate.`,
  };
}

export function dnsInstructionsFor(host: string): {
  type: 'CNAME';
  name: string;
  value: string;
  ttl: string;
  host: string;
} {
  const normalized = normalizeHostname(host) || host;
  const parts = normalized.split('.');
  const name = parts.length > 2 ? parts[0] : '@';
  return {
    type: 'CNAME',
    name,
    value: platformCnameTarget(),
    ttl: 'Automatic',
    host: normalized,
  };
}
