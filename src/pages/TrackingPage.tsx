import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from '../components/icons'
import type { Order } from '../types/order'

const STEPS: { title: string; description: string }[] = [
  { title: 'Order placed',      description: 'We\'ve received your order.' },
  { title: 'Preparing',         description: 'Your items are being freshly packed.' },
  { title: 'Out for delivery',  description: 'Rider is on the way to you.' },
  { title: 'Delivered',         description: 'Enjoy your fresh groceries! 🎉' },
]

const AUTO_ADVANCE_MS = 8000

function loadLastOrder(): Order | null {
  try {
    const raw = localStorage.getItem('belgaum_last_order')
    if (raw) return JSON.parse(raw) as Order
  } catch { /* ignore */ }
  return null
}

const money = (v: number) => `₹${v.toLocaleString('en-IN')}`

export default function TrackingPage() {
  const navigate = useNavigate()
  const [step, setStep]   = useState(0)   // 0 = placed, 3 = delivered
  const [order]           = useState<Order | null>(loadLastOrder)

  // Auto-advance through steps (prototype only — not real)
  useEffect(() => {
    if (step >= STEPS.length - 1) return
    const t = window.setTimeout(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), AUTO_ADVANCE_MS)
    return () => window.clearTimeout(t)
  }, [step])

  const isDelivered = step === STEPS.length - 1

  return (
    <section className="tracking">
      {/* Success header */}
      <div className="success">
        <span><Check /></span>
        <h1>{isDelivered ? 'Order delivered!' : 'Order placed!'}</h1>
        {order && (
          <p className="order-id">Order #{order.id}</p>
        )}
        <p>
          {isDelivered
            ? 'Your groceries have been delivered. Enjoy!'
            : 'Your groceries are being lovingly packed.'}
        </p>
      </div>

      {/* ETA / delivery status */}
      {!isDelivered && (
        <div className="eta">
          <span>🛵</span>
          <div>
            <small>ESTIMATED ARRIVAL</small>
            <h2>10–15 mins</h2>
          </div>
        </div>
      )}

      {/* Step timeline */}
      <div className="timeline">
        {STEPS.map(({ title, description }, i) => (
          <div
            key={title}
            className={i <= step ? 'done' : ''}
          >
            <i>{i < step ? <Check size={15} /> : i === step ? <Check size={15} /> : i + 1}</i>
            <span>
              <b>{title}</b>
              <small>{description}</small>
            </span>
          </div>
        ))}
      </div>

      {/* Delivery address */}
      {order && (
        <div className="tracking-summary">
          <p><small>Delivering to</small></p>
          <p>{order.address}</p>
          <p><small>Order total: {money(order.total)}</small></p>
        </div>
      )}

      <button className="wide-add" onClick={() => navigate('/')}>
        Continue shopping
      </button>
    </section>
  )
}

