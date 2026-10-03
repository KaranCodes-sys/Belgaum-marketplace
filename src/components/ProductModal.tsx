import { useState } from 'react'
import { X, Minus, Plus } from './icons'
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
    .slice(0, 4)

  const addItem = () => { add(product); notify(product.name + ' added to cart') }

  const variantPrice = variant ? product.price * 2 : product.price
  const variantMrp   = variant ? product.mrp   * 2 : product.mrp
  const discount     = Math.round((1 - product.price / product.mrp) * 100)

  return (
    <div className="modal-wrap" role="presentation" onMouseDown={close}>
      <section
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Image area */}
        <div className="modal-img-wrap">
          <img src={product.image} alt={product.name} />
          <button
            className="close-modal"
            onClick={close}
            aria-label="Close product details"
          >
            <X />
          </button>
        </div>

        {/* Content */}
        <div className="modal-body">

          {/* Discount badge — only when meaningful */}
          {discount >= 3 && <span className="pill">{discount}% OFF</span>}

          {/* Name */}
          <h2>{product.name}</h2>

          {/* Unit */}
          <p className="weight">{product.unit}</p>

          {/* Price block */}
          <div className="modal-price-block">
            <span className="modal-price">
              {'\u20B9'}{variantPrice}
            </span>
            {variantMrp > variantPrice && (
              <del className="modal-price-mrp">{'\u20B9'}{variantMrp}</del>
            )}
            {discount >= 3 && (
              <span className="modal-discount-tag">{discount}% off</span>
            )}
          </div>

          {/* Variant selector */}
          {product.variants.length > 1 && (
            <>
              <h4>Choose a size</h4>
              <div className="variants">
                {product.variants.map((v, i) => (
                  <button
                    key={v}
                    className={variant === i ? 'chosen' : ''}
                    onClick={() => setVariant(i)}
                  >
                    {v}<b>{'\u20B9'}{i ? product.price * 2 : product.price}</b>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Add to cart / stepper */}
          {quantity ? (
            <div className="modal-step">
              <button
                onClick={() => setQuantity(product.id, quantity - 1)}
                aria-label="Decrease quantity"
              >
                <Minus />
              </button>
              <b>{quantity} in cart</b>
              <button onClick={addItem} aria-label="Increase quantity">
                <Plus />
              </button>
            </div>
          ) : (
            <button className="wide-add" onClick={addItem}>
              Add to cart
              <span>{'\u20B9'}{variantPrice}</span>
            </button>
          )}

          {/* Description */}
          {product.description && (
            <p className="desc">{product.description}</p>
          )}

          {/* Related products */}
          {related.length > 0 && (
            <>
              <h3>You might also like</h3>
              <div className="related">
                {related.map((item) => (
                  <ProductCard
                    key={item.id}
                    product={item}
                    onOpen={() => {}}
                    onAdded={notify}
                  />
                ))}
              </div>
            </>
          )}

        </div>
      </section>
    </div>
  )
}