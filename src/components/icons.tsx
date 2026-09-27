import type { ReactNode } from 'react'

type P = { size?: number; className?: string }

const icon = (glyph: ReactNode) =>
  ({ size = 16 }: P) => (
    <span
      style={{
        fontSize: size,
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
      }}
    >
      {glyph}
    </span>
  )

export const Minus = icon('−')
export const Plus = icon('+')
export const MapPin = icon('📍')
export const Search = icon('🔍')
export const ShoppingBag = icon('🛍')
export const ArrowRight = icon('→')
export const ArrowLeft = icon('←')
export const ChevronRight = icon('›')
export const Home = icon('🏠')
export const PackageCheck = icon('🛒')
export const SlidersHorizontal = icon('⚡')
export const Truck = icon('🚚')
export const Trash2 = icon('🗑')
export const Check = icon('✓')
export const X = icon('✕')
