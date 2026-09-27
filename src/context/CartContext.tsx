import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Product } from '../types'

export type CartLine = { product: Product; quantity: number }

type CartContextValue = {
  lines: CartLine[]
  count: number
  subtotal: number
  add: (product: Product) => void
  setQuantity: (id: string, quantity: number) => void
  remove: (id: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])

  const add = (product: Product) => {
    if (!product.inStock) return
    setLines((current) => {
      const found = current.find((line) => line.product.id === product.id)
      return found
        ? current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line)
        : [...current, { product, quantity: 1 }]
    })
  }

  const setQuantity = (id: string, quantity: number) => {
    const safeQuantity = Math.max(0, Math.min(20, Number.isFinite(quantity) ? Math.floor(quantity) : 0))
    setLines((current) => safeQuantity === 0
      ? current.filter((line) => line.product.id !== id)
      : current.map((line) => line.product.id === id ? { ...line, quantity: safeQuantity } : line))
  }

  const value = useMemo(() => ({
    lines,
    count: lines.reduce((total, line) => total + line.quantity, 0),
    subtotal: lines.reduce((total, line) => total + line.product.price * line.quantity, 0),
    add,
    setQuantity,
    remove: (id: string) => setLines((current) => current.filter((line) => line.product.id !== id)),
    clear: () => setLines([]),
  }), [lines])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}
