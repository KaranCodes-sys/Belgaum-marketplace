/**
 * pricing.ts — Centralized customer price calculation (Phase 1).
 *
 * The shopkeeper submits a shop price.
 * The customer sees a platform-calculated price derived from that shop price
 * plus any platform fees.
 *
 * All fee configuration lives here. Do NOT spread fee logic across components.
 *
 * Fee structure is NOT yet finalised — adjust PLATFORM_FEES as decided.
 */

// ── Fee configuration (centralised) ───────────────────────────────────────

export const PLATFORM_FEES = {
  /**
   * Flat per-item fee added on top of the shop price (INR).
   * Set to 0 until the fee structure is decided.
   */
  flatFeePerItem: 0,

  /**
   * Percentage markup on the shop price (0–1).
   * e.g. 0.05 = 5% markup. Set to 0 until finalised.
   */
  markupPercent: 0,
} as const

// ── Customer price calculator ──────────────────────────────────────────────

/**
 * Returns the final customer-facing price for a product.
 *
 * @param shopPrice  The shopkeeper's selling price (INR)
 * @param fees       Override fees (defaults to PLATFORM_FEES)
 * @returns          The price shown to the customer (INR, rounded to nearest integer)
 *
 * Usage:
 *   calculateCustomerPrice(29)   // → 29 (until fees are configured)
 *   calculateCustomerPrice(29, { flatFeePerItem: 2, markupPercent: 0.05 }) // → 32
 */
export function calculateCustomerPrice(
  shopPrice: number,
  fees: typeof PLATFORM_FEES = PLATFORM_FEES,
): number {
  const withMarkup = shopPrice * (1 + fees.markupPercent)
  return Math.round(withMarkup + fees.flatFeePerItem)
}
