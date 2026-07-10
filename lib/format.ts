export function formatXAF(amount: number): string {
  return `${new Intl.NumberFormat('en-US').format(Math.round(amount))} XAF`;
}

export function formatUSD(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
