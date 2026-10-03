import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from '../components/icons'
import { getShops } from '../services/catalog'

const shops = getShops()

/**
 * ShopsPage — Minimal placeholder for the "Explore Local Shops" experience.
 * Phase 2: shows the shop list without any product or pricing detail.
 * Full shop detail pages are NOT implemented in this phase.
 */
export default function ShopsPage() {
  const navigate = useNavigate()

  return (
    <section className="catalog">
      <div className="page-heading">
        <button className="back" onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft />
        </button>
        <div>
          <small>Marketplace</small>
          <h1>Local Shops</h1>
        </div>
      </div>

      <p className="shops-subtitle">
        These are the local stores that fulfil your orders. Browse and discover
        what each shop specialises in.
      </p>

      <div className="shops-list">
        {shops.map((shop) => (
          <div key={shop.id} className="shop-card">
            <span className="shop-icon">
              {shop.type === 'fruits_veggies' ? '🥬'
                : shop.type === 'dairy'        ? '🥛'
                : shop.type === 'bakery'       ? '🥐'
                : shop.type === 'grocery'      ? '🛒'
                : '🏪'}
            </span>
            <div className="shop-info">
              <b>{shop.name}</b>
              <small>{shop.tagline}</small>
              <span className={`shop-status ${shop.isOpen ? 'open' : 'closed'}`}>
                {shop.isOpen ? '● Open now' : '○ Closed'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="shops-note">
        More shop details and browsing by shop will be available in a future update.
      </p>
    </section>
  )
}
