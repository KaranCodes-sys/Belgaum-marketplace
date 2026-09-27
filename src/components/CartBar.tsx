import { ArrowRight, ShoppingBag } from './icons'
import { useCart } from '../context/CartContext'
export function CartBar({ goCart }: { goCart: () => void }) {
  const { count, subtotal } = useCart()
  if (!count) return null
  return <button className="cart-bar" onClick={goCart}><span className="cart-count"><ShoppingBag size={18} />{count} item{count === 1 ? '' : 's'}</span><b>₹{subtotal}</b><span>View cart <ArrowRight size={16} /></span></button>
}
