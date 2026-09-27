/**
 * UIContext — Cross-route UI state.
 *
 * Manages:
 *   • Product modal (which product is selected for detail view)
 *   • Toast notifications
 *
 * These need to be accessible from any page without prop-drilling
 * through the router.
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { DisplayProduct } from '../types/catalog'

type UIContextValue = {
  selectedProduct: DisplayProduct | null
  openProduct: (product: DisplayProduct) => void
  closeProduct: () => void
  toast: string
  notify: (message: string) => void
}

const UIContext = createContext<UIContextValue | null>(null)

const TOAST_DURATION_MS = 1800

export function UIProvider({ children }: { children: ReactNode }) {
  const [selectedProduct, setSelectedProduct] = useState<DisplayProduct | null>(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), TOAST_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [toast])

  return (
    <UIContext.Provider
      value={{
        selectedProduct,
        openProduct:  (product) => setSelectedProduct(product),
        closeProduct: () => setSelectedProduct(null),
        toast,
        notify:       (message) => setToast(message),
      }}
    >
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used inside UIProvider')
  return ctx
}
