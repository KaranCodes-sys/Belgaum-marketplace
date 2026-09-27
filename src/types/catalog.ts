// ── Catalog Types ──────────────────────────────────────────────────────────
// These represent the platform's master product catalog.
// Prices, availability, and stock are NOT here — they live in ShopInventory.

export type Category = {
  id: string      // e.g. "fruits", "dairy", "bakery"
  name: string    // e.g. "Fruits & Veggies"
  emoji: string
  color: string   // hex background for category tile
}

export type MasterProduct = {
  id: string          // stable ID, e.g. "fruits-1"
  categoryId: string  // FK → Category.id
  name: string
  description: string
  image: string
  defaultWeight: string   // e.g. "500 ml", "1 kg" — inventory can override
  variants: string[]      // display-only size labels, e.g. ["500 ml", "1 L"]
  tags: string[]          // curation tags: "bestseller" | "deal"
}

// ── DisplayProduct ──────────────────────────────────────────────────────────
// What the UI actually renders: a MasterProduct enriched with one ShopInventory
// entry (the closest / cheapest available source for this session).
// In Phase 1 this will be resolved per-location from multiple shops.

export type DisplayProduct = {
  // From MasterProduct
  id: string
  categoryId: string
  name: string
  description: string
  image: string
  weight: string        // from ShopInventory.weight, falls back to defaultWeight
  variants: string[]
  tags: string[]
  // From ShopInventory
  inventoryId: string
  shopId: string
  price: number
  mrp: number
  inStock: boolean
}
