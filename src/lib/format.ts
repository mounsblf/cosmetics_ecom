/** Formate un prix en euros. Ex : 24 → "24,00 €". */
export function formatPrice(amountEUR: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amountEUR);
}
