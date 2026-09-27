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
// One MasterProduct can exist in multiple shops at different prices.

export type ShopInventory = {
  inventoryId: string
  shopId: string          // FK → Shop.id
  masterProductId: string // FK → MasterProduct.id
  price: number           // selling price at this shop
  mrp: number             // maximum retail price at this shop
  inStock: boolean
  weight: string          // can override MasterProduct.defaultWeight
}
