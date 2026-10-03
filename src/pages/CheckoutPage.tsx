import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useUserLocation } from '../context/LocationContext'
import type { Order } from '../types/order'

const money = (v: number) => `₹${v.toLocaleString('en-IN')}`
const DELIVERY_THRESHOLD = 399
const DELIVERY_FEE       = 29
const HANDLING_FEE       = 4
const PAYMENT_OPTIONS    = ['UPI', 'Credit / Debit card', 'Cash on delivery']

function generateOrderId(): string {
  return 'BM' + Date.now().toString(36).toUpperCase()
}

export default function CheckoutPage() {
  const navigate                    = useNavigate()
  const { lines, subtotal, clear }  = useCart()
  const { userLocation, openAddressPicker } = useUserLocation()
  const [payment, setPayment]       = useState('UPI')

  const deliveryFee = subtotal >= DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  const total       = subtotal + deliveryFee + HANDLING_FEE
  const { address } = userLocation

  if (!lines.length) {
    return (
      <section className="checkout">
        <h1>Checkout</h1>
        <div className="empty">
          <span>🛒</span>
          <h2>Your cart is empty</h2>
          <p>Add products before proceeding to checkout.</p>
          <button className="shop-btn" onClick={() => navigate('/')}>Shop now</button>
        </div>
      </section>
    )
  }

  const placeOrder = () => {
    const order: Order = {
      id:            generateOrderId(),
      lines:         [...lines],
      address:       `${address.label} — ${address.line1}, ${address.city} ${address.pincode}`,
      paymentMethod: payment,
      subtotal,
      deliveryFee,
      handlingFee:   HANDLING_FEE,
      total,
      status:        'placed',
      placedAt:      new Date().toISOString(),
    }
    try {
      localStorage.setItem('belgaum_last_order', JSON.stringify(order))
    } catch {
      // storage unavailable — continue anyway
    }
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
        <p><span>Item total</span><b>{money(subtotal)}</b></p>
        <p><span>Delivery fee</span><b>{deliveryFee ? money(deliveryFee) : 'FREE'}</b></p>
        <p><span>Handling fee</span><b>₹{HANDLING_FEE}</b></p>
        <hr />
        <p className="total"><b>To pay</b><b>{money(total)}</b></p>
      </div>

      <button className="checkout-btn" onClick={placeOrder}>
        Place order <span>{money(total)}</span>
      </button>
    </section>
  )
}

