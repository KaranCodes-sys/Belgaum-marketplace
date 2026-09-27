import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useUserLocation } from '../context/LocationContext'

const money = (v: number) => `₹${v.toLocaleString('en-IN')}`
const DELIVERY_THRESHOLD = 399
const DELIVERY_FEE       = 29
const HANDLING_FEE       = 4
const PAYMENT_OPTIONS    = ['UPI', 'Credit / Debit card', 'Cash on delivery']

export default function CheckoutPage() {
  const navigate                    = useNavigate()
  const { lines, subtotal, clear }  = useCart()
  const { userLocation, openAddressPicker } = useUserLocation()
  const [payment, setPayment]       = useState('UPI')

  const fee   = subtotal >= DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  const total = subtotal + fee + HANDLING_FEE
  const { address } = userLocation

  if (!lines.length) {
    return (
      <section className="checkout">
        <h1>Checkout</h1>
        <div className="empty">
          <span>🛒</span>
          <h2>Your cart is empty</h2>
          <p>Add products before proceeding to checkout.</p>
        </div>
      </section>
    )
  }

  const placeOrder = () => {
    clear()
    navigate('/tracking')
  }

  return (
    <section className="checkout">
      <h1>Checkout</h1>

      <div className="checkout-card">
        <h3>Delivering to</h3>
        <p>
          <b>{address.label}</b><br />
          {address.line1}<br />
          {address.city}, {address.state} - {address.pincode}
        </p>
        <button onClick={openAddressPicker}>Change</button>
      </div>

      <div className="checkout-card">
        <h3>Payment method</h3>
        {PAYMENT_OPTIONS.map((option) => (
          <label key={option}>
            <input
              checked={payment === option}
              onChange={() => setPayment(option)}
              type="radio"
              name="payment"
            />{' '}
            {option}
          </label>
        ))}
      </div>

      <div className="checkout-card">
        <h3>Order summary</h3>
        {lines.map((line) => (
          <p key={line.product.id}>
            <span>{line.quantity} × {line.product.name}</span>
            <b>{money(line.quantity * line.product.price)}</b>
          </p>
        ))}
        <hr />
        <p><b>Total</b><b>{money(total)}</b></p>
      </div>

      <button className="checkout-btn" onClick={placeOrder}>
        Place order <span>{money(total)}</span>
      </button>
    </section>
  )
}
