// ── Shop Types ──────────────────────────────────────────────────────────────
// Represents local participating shops and their per-product inventory.
// Even though this data is static in the prototype, the shape mirrors
// how a real backend would model it.

export type ShopType =
  | 'grocery'
  | 'fruits_veggies'
  | 'bakery'
  | 'pharmacy'
  | 'meat'
  | 'dairy'
  | 'cosmetics'
  | 'electronics'
  | 'general'

export type Shop = {
  id: string
  name: string
  type: ShopType
  tagline: string
  address: string
  lat: number
  lng: number
  rating: number
  isOpen: boolean
  deliveryTimeMinutes: number
  minOrderAmount: number
  deliveryFee: number
}

// ── ShopInventory ───────────────────────────────────────────────────────────
// The link between a Shop and a MasterProduct.
// One MasterProduct can be stocked by multiple shops simultaneously.
//
// The shopkeeper sets their own selling price.
// The customer-facing price is derived from this via pricing.ts.

export type ShopInventory = {
  id: string
  shopId: string    // FK → Shop.id
  productId: string // FK → MasterProduct.id
  price: number     // shopkeeper's selling price (INR) — fed into calculateCustomerPrice()
  inStock: boolean
}
