import { useNavigate } from 'react-router-dom'
import { ChevronRight, MapPin, Search, ShoppingBag } from './icons'
import { useCart } from '../context/CartContext'
import { useUserLocation } from '../context/LocationContext'

export function Header() {
  const navigate = useNavigate()
  const { count } = useCart()
  const { userLocation, openAddressPicker } = useUserLocation()
  const { address } = userLocation

  return (
    <header className="header">
      <div className="topline">
        <button className="location" onClick={openAddressPicker} aria-label="Choose delivery address">
          <span className="bolt">⚡</span>
          <span>
            <b>Delivery in 10 minutes</b>
            <small>
              <MapPin size={12} /> {address.line1}, {address.city} <ChevronRight size={13} />
            </small>
          </span>
        </button>
        <button className="bag" onClick={() => navigate('/cart')} aria-label="Open cart">
          <ShoppingBag size={21} />
          {count > 0 && <i>{count > 99 ? '99+' : count}</i>}
        </button>
      </div>
      <label className="search">
        <Search size={19} />
        <input
          placeholder="Search for milk, fruits, snacks..."
          onChange={(e) => navigate(`/search?q=${encodeURIComponent(e.target.value)}`)}
        />
      </label>
    </header>
  )
}
