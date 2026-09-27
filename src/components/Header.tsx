import { ChevronRight, MapPin, Search, ShoppingBag } from './icons'
import { useCart } from '../context/CartContext'

type Props = { query: string; setQuery: (value: string) => void; goHome: () => void; goCart: () => void; address: string; onAddressClick: () => void }

export function Header({ query, setQuery, goHome, goCart, address, onAddressClick }: Props) {
  const { count } = useCart()
  return <header className="header">
    <div className="topline">
      <button className="location" onClick={onAddressClick} aria-label="Choose delivery address">
        <span className="bolt">⚡</span><span><b>Delivery in 10 minutes</b><small><MapPin size={12} /> {address} <ChevronRight size={13} /></small></span>
      </button>
      <button className="bag" onClick={goCart} aria-label="Open cart"><ShoppingBag size={21} />{count > 0 && <i>{count > 99 ? '99+' : count}</i>}</button>
    </div>
    <label className="search"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search for milk, fruits, snacks..." /></label>
  </header>
}
