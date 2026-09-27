import { ProductCard } from './ProductCard'
import type { DisplayProduct } from '../types/catalog'

type Props = {
  items: DisplayProduct[]
  loading?: boolean
  onOpen: (product: DisplayProduct) => void
  onAdded: (message: string) => void
}

export function ProductGrid({ items, loading, onOpen, onAdded }: Props) {
  return (
    <div className="product-grid">
      {loading
        ? Array.from({ length: 6 }, (_, i) => <div className="skeleton" key={i} />)
        : items.map((product) => (
            <ProductCard key={product.id} product={product} onOpen={onOpen} onAdded={onAdded} />
          ))}
    </div>
  )
}
