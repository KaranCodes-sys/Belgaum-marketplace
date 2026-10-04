/**
 * ShopContext — Tracks the active shop when the user is in Shop Mode.
 *
 * This context is intentionally minimal. The shopId is derived from the
 * URL param (/shop/:shopId) and passed explicitly. Components that need
 * shop-specific data should read shopId from here rather than from random
 * globals or repeated URL parsing.
 *
 * This does NOT affect the normal product-first shopping experience.
 * When a user browses Home → Category → Product, this context is unused.
 */

import { createContext, useContext, useState, type ReactNode } from 'react'

type ShopContextValue = {
  /** The shopId currently being browsed, or null when not in shop mode. */
  activeShopId: string | null
  setActiveShopId: (id: string | null) => void
}

const ShopContext = createContext<ShopContextValue | null>(null)

export function ShopProvider({ children }: { children: ReactNode }) {
  const [activeShopId, setActiveShopId] = useState<string | null>(null)

  return (
    <ShopContext.Provider value={{ activeShopId, setActiveShopId }}>
      {children}
    </ShopContext.Provider>
  )
}

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop must be used inside ShopProvider')
  return ctx
}
