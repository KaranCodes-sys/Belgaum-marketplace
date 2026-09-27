import { useNavigate } from 'react-router-dom'
import { Check } from '../components/icons'

const STEPS = [
  ['Packed',           'Your items are freshly packed'],
  ['Out for delivery', 'Rider will be assigned shortly'],
  ['Delivered',        'Enjoy your fresh groceries!'],
] as const

export default function TrackingPage() {
  const navigate = useNavigate()

  return (
    <section className="tracking">
      <div className="success">
        <span><Check /></span>
        <h1>Order placed!</h1>
        <p>Your groceries are being lovingly packed.</p>
      </div>

      <div className="eta">
        <span>🛵</span>
        <div>
          <small>ESTIMATED ARRIVAL</small>
          <h2>10–15 mins</h2>
        </div>
      </div>

      <div className="timeline">
        {STEPS.map(([title, description], i) => (
          <div className={i === 0 ? 'done' : ''} key={title}>
            <i>{i === 0 ? <Check size={15} /> : i + 1}</i>
            <span>
              <b>{title}</b>
              <small>{description}</small>
            </span>
          </div>
        ))}
      </div>

      <button className="wide-add" onClick={() => navigate('/')}>
        Continue shopping
      </button>
    </section>
  )
}
