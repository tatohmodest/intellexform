/**
 * Platform commission on instructor earnings (Preply-style).
 *
 * - The **first paid transaction with a brand-new student is 100% platform
 *   commission** (the trial). The instructor earns nothing on it, and it is
 *   how InTelleX is paid for matching them.
 * - After that the rate slides down as the instructor builds volume with that
 *   student, so long-term relationships are rewarded.
 */

export const TRIAL_COMMISSION_RATE = 1;

export type CommissionTier = {
  /** Paid lessons/courses already completed with this student. */
  minPriorPurchases: number;
  rate: number;
  label: string;
};

/** Applied from the second transaction with the same student onwards. */
export const COMMISSION_TIERS: CommissionTier[] = [
  { minPriorPurchases: 0, rate: 0.25, label: '25% platform fee' },
  { minPriorPurchases: 5, rate: 0.2, label: '20% platform fee' },
  { minPriorPurchases: 20, rate: 0.15, label: '15% platform fee' },
  { minPriorPurchases: 50, rate: 0.1, label: '10% platform fee' },
];

export type CommissionBreakdown = {
  priceXAF: number;
  /** Fraction of the price kept by InTelleX. */
  rate: number;
  platformXAF: number;
  instructorXAF: number;
  isTrial: boolean;
  label: string;
};

/**
 * @param priceXAF        gross amount the student pays
 * @param priorPurchases  how many times this student already paid this instructor
 */
export function computeCommission(
  priceXAF: number,
  priorPurchases: number,
): CommissionBreakdown {
  const gross = Math.max(0, Math.round(priceXAF || 0));

  if (gross === 0) {
    return {
      priceXAF: 0,
      rate: 0,
      platformXAF: 0,
      instructorXAF: 0,
      isTrial: false,
      label: 'Free course',
    };
  }

  if (priorPurchases <= 0) {
    return {
      priceXAF: gross,
      rate: TRIAL_COMMISSION_RATE,
      platformXAF: gross,
      instructorXAF: 0,
      isTrial: true,
      label: 'First lesson with a new student — 100% platform commission',
    };
  }

  const tier = [...COMMISSION_TIERS]
    .reverse()
    .find((t) => priorPurchases - 1 >= t.minPriorPurchases) ?? COMMISSION_TIERS[0];

  const platformXAF = Math.round(gross * tier.rate);
  return {
    priceXAF: gross,
    rate: tier.rate,
    platformXAF,
    instructorXAF: gross - platformXAF,
    isTrial: false,
    label: tier.label,
  };
}

/** Human-readable summary for dashboards. */
export function commissionSummary(b: CommissionBreakdown): string {
  if (b.priceXAF === 0) return 'Free — no commission';
  if (b.isTrial) return 'Trial lesson — InTelleX keeps 100%';
  return `${Math.round(b.rate * 100)}% to InTelleX · ${b.instructorXAF.toLocaleString()} XAF to you`;
}
