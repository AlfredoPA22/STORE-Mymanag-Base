export const formatPrice = (amount: number, currency?: string | null): string =>
  `${currency || "Bs"} ${amount.toFixed(2)}`;
