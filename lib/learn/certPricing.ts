/** Client-safe certification plan pricing (no Mongo imports). */

export const CERT_MONTHLY_XAF = 4999;
/** Yearly = 12 × monthly with 10% off. */
export const CERT_YEARLY_XAF = Math.round(CERT_MONTHLY_XAF * 12 * 0.9);

export type CertPlan = 'monthly' | 'yearly';

export function priceForCertPlan(plan: CertPlan): number {
  return plan === 'yearly' ? CERT_YEARLY_XAF : CERT_MONTHLY_XAF;
}
