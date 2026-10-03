import { X, Minus, Plus } from './icons'
import type { DisplayProduct } from '../types/catalog'
import { useCart } from '../context/CartContext'
import { useUI } from '../context/UIContext'
import { ProductCard } from './ProductCard'
import { getDisplayProducts } from '../services/catalog'

type Props = {
  product: DisplayProduct
  close: () => void
  notify: (message: string) => void
}

export function ProductModal({ product, close, notify }: Props) {
  const { lines, add, setQuantity } = useCart()
  const { openProduct } = useUI()
  const quantity = lines.find((l) => l.product.id === product.id)?.quantity ?? 0

  const related = getDisplayProducts()
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4)

  const addItem = () => { add(product); notify(product.name + ' added to cart') }

  // Prices come directly from the catalog — never fabricated
  const price    = product.price
  const mrp      = product.mrp
  const discount = Math.round((1 - price / mrp) * 100)

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

          {/* Unit — default unit label, e.g. "1 kg", "500 ml" */}
          <p className="weight">{product.unit}</p>

          {/* Price block — real catalog price only */}
          <div className="modal-price-block">
            <span className="modal-price">{'\u20B9'}{price}</span>
            {mrp > price && (
              <del className="modal-price-mrp">{'\u20B9'}{mrp}</del>
            )}
            {discount >= 3 && (
              <span className="modal-discount-tag">{discount}% off</span>
            )}
          </div>

          {/* Variant labels (display-only — no fabricated pricing) */}
          {product.variants.length > 1 && (
            <>
              <h4>Available sizes</h4>
              <div className="variants">
                {product.variants.map((v, i) => (
                  <span key={v} className={i === 0 ? 'chosen' : ''}>
                    {v}
                  </span>
                ))}
              </div>
            </>
          )}

          {/* Add to cart / stepper */}
          {!product.inStock ? (
            <span className="sold-out wide-oos">Out of stock</span>
          ) : quantity ? (
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
              <span>{'\u20B9'}{price}</span>
            </button>
          )}

          {/* Description */}
          {product.description && (
            <p className="desc">{product.description}</p>
          )}

          {/* Related products — clicking opens that product's detail */}
          {related.length > 0 && (
            <>
              <h3>You might also like</h3>
              <div className="related">
                {related.map((item) => (
                  <ProductCard
                    key={item.id}
                    product={item}
                    onOpen={openProduct}
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