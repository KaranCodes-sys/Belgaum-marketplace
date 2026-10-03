import { Minus, Plus } from './icons'
import type { DisplayProduct } from '../types/catalog'
import { useCart } from '../context/CartContext'

type Props = {
  product: DisplayProduct
  onOpen: (product: DisplayProduct) => void
  onAdded?: (message: string) => void
}

export function ProductCard({ product, onOpen, onAdded }: Props) {
  const { lines, add, setQuantity } = useCart()
  const line     = lines.find((item) => item.product.id === product.id)
  const discount = Math.round((1 - product.price / product.mrp) * 100)
  const addItem  = () => { add(product); onAdded?.(`${product.name} added to cart`) }

  return (
    <article className="product-card">
      <button className="product-image" aria-label={`View ${product.name}`} onClick={() => onOpen(product)}>
        <img src={product.image} alt={product.name} loading="lazy" />
        {discount >= 3 && <span>{discount}% OFF</span>}
      </button>
      <button className="product-name" onClick={() => onOpen(product)}>{product.name}</button>
      <p className="weight">{product.unit}</p>
      <div className="price-row"><b>₹{product.price}</b><del>₹{product.mrp}</del></div>
      {!product.inStock ? (
        <span className="sold-out">Out of stock</span>
      ) : line ? (
        <div className="stepper" aria-label={`${product.name} quantity`}>
          <button aria-label={`Remove one ${product.name}`} onClick={() => setQuantity(product.id, line.quantity - 1)}><Minus size={14} /></button>
          <b>{line.quantity}</b>
          <button aria-label={`Add one ${product.name}`} onClick={addItem}><Plus size={14} /></button>
        </div>
      ) : (
        <button className="add-btn" onClick={addItem}>ADD <Plus size={14} /></button>
      )}
    </article>
  )
}
