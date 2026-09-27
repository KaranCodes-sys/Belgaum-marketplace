// ── Order Types ─────────────────────────────────────────────────────────────
// Represents a placed order. Currently mock/local only (no backend).

import type { CartLine } from './cart'

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'packed'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'

export type Order = {
  id: string
  lines: CartLine[]
  address: string         // simplified for prototype; use Address type in Phase 2
  paymentMethod: string
  subtotal: number
  deliveryFee: number
  handlingFee: number
  total: number
  status: OrderStatus
  placedAt: string        // ISO timestamp
  shopId?: string         // optional for now; required in Phase 1
}
