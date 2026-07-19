// Redondea a 2 decimales antes de mostrar un monto — evita que restas/sumas
// de punto flotante en JS produzcan valores como 252.89999999999998.
const round2 = (amount: number): number => Math.round((amount + Number.EPSILON) * 100) / 100;

export const formatPrice = (amount: number, currency?: string | null): string =>
  `${currency || "Bs"} ${round2(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
