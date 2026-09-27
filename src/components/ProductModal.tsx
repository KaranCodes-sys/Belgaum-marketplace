import { useState } from 'react'
import { ArrowLeft, Check, Minus, Plus, X } from './icons'
import type { DisplayProduct } from '../types/catalog'
import { useCart } from '../context/CartContext'
import { ProductCard } from './ProductCard'
import { getDisplayProducts } from '../services/catalog'

type Props = {
  product: DisplayProduct
  close: () => void
  notify: (message: string) => void
}

export function ProductModal({ product, close, notify }: Props) {
  const [variant, setVariant] = useState(0)
  const { lines, add, setQuantity } = useCart()
  const quantity = lines.find((l) => l.product.id === product.id)?.quantity ?? 0

  const related = getDisplayProducts()
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 3)

  const addItem = () => { add(product); notify(`${product.name} added to cart`) }
  const variantPrice = variant ? product.price * 2 : product.price
  const variantMrp   = variant ? product.mrp   * 2 : product.mrp

  return (
    <div className="modal-wrap" role="presentation" onMouseDown={close}>
      <section
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="back close-modal" onClick={close} aria-label="Close product details">
          <X />
        </button>
        <img src={product.image} alt={product.name} />
        <div className="modal-body">
          <span className="pill">10 MINS</span>
          <h2>{product.name}</h2>
          <p className="weight">{product.weight}</p>
          <div className="modal-price">
            ₹{variantPrice} <del>₹{variantMrp}</del>{' '}
            <em>{Math.round((1 - product.price / product.mrp) * 100)}% OFF</em>
          </div>
          <p className="desc">{product.description}</p>
          <h4>Choose a size</h4>
          <div className="variants">
            {product.variants.map((v, i) => (
              <button
                key={v}
                className={variant === i ? 'chosen' : ''}
                onClick={() => setVariant(i)}
              >
                {v}<b>₹{i ? product.price * 2 : product.price}</b>
              </button>
            ))}
          </div>
          {quantity ? (
            <div className="modal-step">
              <button onClick={() => setQuantity(product.id, quantity - 1)} aria-label="Decrease quantity"><Minus /></button>
              <b>{quantity} in cart</b>
              <button onClick={addItem} aria-label="Increase quantity"><Plus /></button>
            </div>
          ) : (
            <button className="wide-add" onClick={addItem}>
              Add to cart <span>₹{variantPrice}</span>
            </button>
          )}
          <h3>You might also like</h3>
          <div className="related">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} onOpen={() => {}} onAdded={notify} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
