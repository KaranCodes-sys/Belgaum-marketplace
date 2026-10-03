// ── Catalog Types ──────────────────────────────────────────────────────────
// These represent the platform's master product catalog.
// MRP is platform-level. The selling price lives in ShopInventory.

export type Category = {
  id: string      // e.g. "fruits", "dairy", "bakery"
  name: string    // e.g. "Fruits & Veggies"
  emoji: string
  color: string   // hex background for category tile
}

// ── MasterProduct ───────────────────────────────────────────────────────────
// The platform-owned definition of a product.
// Names, descriptions, images, unit labels, and MRP are set by the platform.
// The selling price is NOT here — it is set per-shop in ShopInventory.

export type MasterProduct = {
  id: string          // stable ID, e.g. "fruits-1"
  categoryId: string  // FK → Category.id
  name: string
  description: string
  image: string
  unit: string        // e.g. "500 ml", "1 kg" — display label for the default quantity
  variants: string[]  // display-only size labels, e.g. ["500 ml", "1 L"]
  tags: string[]      // curation tags: "bestseller" | "deal"
  mrp: number         // maximum retail price (INR) — platform-enforced ceiling
}

// ── DisplayProduct ──────────────────────────────────────────────────────────
// What the UI actually renders: master catalog fields + resolved pricing.
// The customer NEVER sees shop names, shop prices, or shop-specific fields.
//
// price = calculateCustomerPrice(shopInventory.price)  ← from pricing.ts
// mrp   = masterProduct.mrp

export type DisplayProduct = {
  // From MasterProduct
  id: string
  categoryId: string
  name: string
  description: string
  image: string
  unit: string
  variants: string[]
  tags: string[]
  mrp: number
  // Resolved from ShopInventory + pricing.ts
  price: number   // customer-facing price (shop price + platform fees)
  inStock: boolean
}
