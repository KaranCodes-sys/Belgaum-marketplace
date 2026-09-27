// ── Cart Types ──────────────────────────────────────────────────────────────
// CartLine embeds a DisplayProduct (master product + resolved inventory data).
// In Phase 1, this will be refactored to embed inventoryId + shopId directly.

import type { DisplayProduct } from './catalog'

export type CartLine = {
  product: DisplayProduct
  quantity: number
}
