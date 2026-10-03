import { useNavigate } from 'react-router-dom'
import { ChevronRight, Minus, Plus, Trash2 } from '../components/icons'
import { useCart } from '../context/CartContext'

const money = (v: number) => `₹${v.toLocaleString('en-IN')}`
const DELIVERY_THRESHOLD = 399
const DELIVERY_FEE       = 29
const HANDLING_FEE       = 4

export default function CartPage() {
  const navigate                      = useNavigate()
  const { lines, remove, setQuantity, subtotal } = useCart()

  const fee   = subtotal === 0 || subtotal >= DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  const total = subtotal + fee + (subtotal ? HANDLING_FEE : 0)

  if (!lines.length) {
    return (
      <section className="cart-page">
        <h1>My cart</h1>
        <div className="empty">
          <span>🛒</span>
          <h2>Your basket is waiting</h2>
          <p>Add a few fresh favourites to get started.</p>
          <button className="shop-btn" onClick={() => navigate('/')}>Shop now</button>
        </div>
      </section>
    )
  }

  return (
    <section className="cart-page">
      <h1>My cart</h1>
      <p className="delivery-note">⚡ Your order will arrive in 10–15 mins</p>

      <div className="cart-lines">
        {lines.map(({ product, quantity }) => (
          <article key={product.id}>
            <img src={product.image} alt={product.name} />
            <div>
              <b>{product.name}</b>
              <small>{product.unit}</small>
              <strong>{money(product.price * quantity)}</strong>
            </div>
            <div className="cart-actions">
              <button className="trash" onClick={() => remove(product.id)} aria-label={`Remove ${product.name}`}>
                <Trash2 size={16} />
              </button>
              <div className="stepper">
                <button onClick={() => setQuantity(product.id, quantity - 1)} aria-label="Remove one"><Minus size={14} /></button>
                <b>{quantity}</b>
                <button onClick={() => setQuantity(product.id, quantity + 1)} aria-label="Add one"><Plus size={14} /></button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="bill">
        <h3>Bill details</h3>
        <p><span>Item total</span><b>{money(subtotal)}</b></p>
        <p><span>Delivery fee</span><b>{fee ? money(fee) : 'FREE'}</b></p>
        <p><span>Handling fee</span><b>₹{HANDLING_FEE}</b></p>
        <hr />
        <p className="total"><span>To pay</span><b>{money(total)}</b></p>
      </div>

      <button className="checkout-btn" onClick={() => navigate('/checkout')}>
        Proceed to checkout <ChevronRight />
      </button>
    </section>
  )
}
