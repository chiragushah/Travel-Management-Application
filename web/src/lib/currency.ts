export function formatMoneyFromCents(amountCents: number, currency: string = 'USD'): string {
  const amount = (amountCents ?? 0) / 100;
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}
