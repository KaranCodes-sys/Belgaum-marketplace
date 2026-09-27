import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { DisplayProduct } from '../types/catalog'
import type { CartLine } from '../types/cart'

type CartContextValue = {
  lines: CartLine[]
  count: number
  subtotal: number
  add: (product: DisplayProduct) => void
  setQuantity: (id: string, quantity: number) => void
  remove: (id: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])

  const add = (product: DisplayProduct) => {
    if (!product.inStock) return
    setLines((current) => {
      const found = current.find((line) => line.product.id === product.id)
      return found
        ? current.map((line) =>
            line.product.id === product.id
              ? { ...line, quantity: line.quantity + 1 }
              : line,
          )
        : [...current, { product, quantity: 1 }]
    })
  }

  const setQuantity = (id: string, quantity: number) => {
    const safe = Math.max(0, Math.min(20, Number.isFinite(quantity) ? Math.floor(quantity) : 0))
    setLines((current) =>
      safe === 0
        ? current.filter((line) => line.product.id !== id)
        : current.map((line) =>
            line.product.id === id ? { ...line, quantity: safe } : line,
          ),
    )
  }

  const value = useMemo(
    () => ({
      lines,
      count:    lines.reduce((total, line) => total + line.quantity, 0),
      subtotal: lines.reduce((total, line) => total + line.product.price * line.quantity, 0),
      add,
      setQuantity,
      remove: (id: string) =>
        setLines((current) => current.filter((line) => line.product.id !== id)),
      clear: () => setLines([]),
    }),
    [lines],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
