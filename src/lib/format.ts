/** Formate un prix en dirhams marocains (MAD). Ex : 290 → "290 MAD". */
export function formatPrice(amountMAD: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(amountMAD)} MAD`;
}
