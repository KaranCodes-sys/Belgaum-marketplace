import { useEffect, useMemo, useState } from 'react'
import categoriesJson from './data/categories.json'
import productsJson from './data/products.json'
import type { Category, Product } from './types'
import { Header } from './components/Header'
import { ProductCard } from './components/ProductCard'
import { CartBar } from './components/CartBar'
import { Toast } from './components/Toast'
import { useCart } from './context/CartContext'
import { ArrowLeft, Check, ChevronRight, Home, MapPin, Minus, PackageCheck, Plus, SlidersHorizontal, Trash2, X } from './components/icons'

const categories = categoriesJson as Category[]
const products = productsJson as Product[]
const ADDRESSES = ['18, Market Road, Belgaum', '31, Club Road, Belgaum']
type View = 'home' | 'category' | 'search' | 'cart' | 'checkout' | 'tracking'
const money = (value: number) => `₹${value.toLocaleString('en-IN')}`

function ProductGrid({ items, loading, openProduct, notify }: { items: Product[]; loading?: boolean; openProduct: (product: Product) => void; notify: (message: string) => void }) {
  return <div className="product-grid">{loading
    ? Array.from({ length: 6 }, (_, index) => <div className="skeleton" key={index} />)
    : items.map((product) => <ProductCard key={product.id} product={product} onOpen={openProduct} onAdded={notify} />)}</div>
}

export default function App() {
  const [view, setView] = useState<View>('home')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | null>(null)
  const [selected, setSelected] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [address, setAddress] = useState(ADDRESSES[0])
  const [addressPicker, setAddressPicker] = useState(false)
  const { add, clear, count, lines, setQuantity } = useCart()

  useEffect(() => { setLoading(true); const timer = window.setTimeout(() => setLoading(false), 450); return () => window.clearTimeout(timer) }, [category, view])
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(''), 1800); return () => window.clearTimeout(timer) }, [toast])

  const navigate = (next: View) => { setView(next); setSelected(null); if (next !== 'search') setQuery('') }
  const notify = (message: string) => setToast(message)
  const openProduct = (product: Product) => setSelected(product)
  const selectedQuantity = selected ? lines.find((line) => line.product.id === selected.id)?.quantity ?? 0 : 0

  const content = view === 'home' ? <HomePage loading={loading} openProduct={openProduct} openCategory={(item) => { setCategory(item); navigate('category') }} notify={notify} />
    : view === 'category' && category ? <CategoryPage category={category} loading={loading} openProduct={openProduct} notify={notify} onBack={() => navigate('home')} />
      : view === 'search' ? <SearchPage query={query} openProduct={openProduct} notify={notify} />
        : view === 'cart' ? <CartPage onCheckout={() => navigate('checkout')} onShop={() => navigate('home')} />
          : view === 'checkout' ? <CheckoutPage address={address} onAddress={() => setAddressPicker(true)} onPlaceOrder={() => { clear(); navigate('tracking') }} />
            : <TrackingPage onHome={() => navigate('home')} />

  return <main className="app-shell">
    {view !== 'tracking' && <Header query={query} setQuery={(value) => { setQuery(value); setView('search') }} goHome={() => navigate('home')} goCart={() => navigate('cart')} address={address} onAddressClick={() => setAddressPicker(true)} />}
    {content}
    {view !== 'tracking' && <><nav className="bottom-nav"><button className={view === 'home' ? 'active' : ''} onClick={() => navigate('home')}><Home />Home</button><button className={view === 'search' ? 'active' : ''} onClick={() => { setQuery(''); navigate('search') }}><SlidersHorizontal />Browse</button><button className={view === 'cart' ? 'active' : ''} onClick={() => navigate('cart')}><PackageCheck />Cart</button></nav>{view !== 'cart' && <CartBar goCart={() => navigate('cart')} />}</>}
    {selected && <ProductModal product={selected} quantity={selectedQuantity} close={() => setSelected(null)} openProduct={openProduct} notify={notify} />}
    {addressPicker && <AddressPicker address={address} choose={(value) => { setAddress(value); setAddressPicker(false); notify('Delivery address updated') }} close={() => setAddressPicker(false)} />}
    {toast && <Toast text={toast} />}
  </main>
}

function HomePage({ loading, openCategory, openProduct, notify }: { loading: boolean; openCategory: (category: Category) => void; openProduct: (product: Product) => void; notify: (message: string) => void }) {
  const [banner, setBanner] = useState(0)
  const banners = [{ eyebrow: 'Fresh picks, super quick', title: <>Groceries at your door <mark>in minutes.</mark></>, emoji: '🛵' }, { eyebrow: 'Pantry refresh', title: <>Save up to <mark>25% today.</mark></>, emoji: '🛍️' }]
  useEffect(() => { const id = window.setInterval(() => setBanner((current) => (current + 1) % banners.length), 3500); return () => window.clearInterval(id) }, [])
  const row = (title: string, filter: (item: Product) => boolean) => <section className="home-section"><div className="section-title"><h2>{title}</h2><button onClick={() => notify('Explore more categories from Browse')}>See all <ChevronRight size={16} /></button></div><div className="horizontal-products">{loading ? Array.from({ length: 4 }, (_, index) => <div className="skeleton card-skel" key={index} />) : products.filter(filter).slice(0, 8).map((product) => <ProductCard key={product.id} product={product} onOpen={openProduct} onAdded={notify} />)}</div></section>
  return <><section className="hero"><div><p>{banners[banner].eyebrow}</p><h1>{banners[banner].title}</h1><button onClick={() => openCategory(categories[0])}>Shop essentials <ChevronRight size={16} /></button><div className="dots">{banners.map((_, index) => <i className={banner === index ? 'current' : ''} key={index} />)}</div></div><span>{banners[banner].emoji}</span></section><section className="offer-strip"><b>FREE DELIVERY</b><span>on your first 3 orders</span><i>Use code HELLO</i></section><section className="categories"><div className="section-title"><h2>Shop by category</h2><button onClick={() => notify('Choose a category to start shopping')}>View all</button></div><div className="category-grid">{categories.map((item) => <button className="category-tile" style={{ background: item.color }} key={item.id} onClick={() => openCategory(item)}><span>{item.emoji}</span><b>{item.name}</b><i>→</i></button>)}</div></section>{row('Best sellers', (item) => item.tags.includes('bestseller'))}{row('Fresh vegetables', (item) => item.categoryId === 'fruits')}{row('Deals of the day', (item) => item.tags.includes('deal'))}</>
}

function CategoryPage({ category, loading, openProduct, notify, onBack }: { category: Category; loading: boolean; openProduct: (product: Product) => void; notify: (message: string) => void; onBack: () => void }) {
  const [sort, setSort] = useState('popular')
  const items = useMemo(() => products.filter((item) => item.categoryId === category.id).sort((a, b) => sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : a.tags.includes('bestseller') === b.tags.includes('bestseller') ? a.name.localeCompare(b.name) : a.tags.includes('bestseller') ? -1 : 1), [category, sort])
  return <section className="catalog"><div className="page-heading"><button className="back" onClick={onBack}><ArrowLeft /></button><div><small>Category</small><h1>{category.name}</h1></div></div><div className="filters"><span><SlidersHorizontal size={15} /> {items.length} items</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products"><option value="popular">Popularity</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></div><ProductGrid items={items} loading={loading} openProduct={openProduct} notify={notify} /></section>
}

function SearchPage({ query, openProduct, notify }: { query: string; openProduct: (product: Product) => void; notify: (message: string) => void }) {
  const results = products.filter((item) => `${item.name} ${item.categoryId} ${item.tags.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase()))
  return <section className="catalog search-page"><h1>{query ? `Results for “${query}”` : 'Search our store'}</h1>{query ? results.length ? <ProductGrid items={results} openProduct={openProduct} notify={notify} /> : <div className="empty"><span>🔎</span><h2>No groceries found</h2><p>Try searching for fruit, milk, snacks or coffee.</p></div> : <><p className="subtle">Type in the search box above to find products.</p><div className="chips">{['Milk', 'Fruits', 'Chips', 'Rice', 'Coffee'].map((item) => <span key={item}>{item}</span>)}</div></>}</section>
}

function ProductModal({ product, quantity, close, openProduct, notify }: { product: Product; quantity: number; close: () => void; openProduct: (product: Product) => void; notify: (message: string) => void }) {
  const [variant, setVariant] = useState(0)
  const { add, setQuantity } = useCart()
  const related = products.filter((item) => item.categoryId === product.categoryId && item.id !== product.id).slice(0, 3)
  const addItem = () => { add(product); notify(`${product.name} added to cart`) }
  return <div className="modal-wrap" role="presentation" onMouseDown={close}><section className="product-modal" role="dialog" aria-modal="true" aria-label={product.name} onMouseDown={(event) => event.stopPropagation()}><button className="back close-modal" onClick={close} aria-label="Close product details"><X /></button><img src={product.image} alt={product.name} /><div className="modal-body"><span className="pill">10 MINS</span><h2>{product.name}</h2><p className="weight">{product.weight}</p><div className="modal-price">₹{variant ? product.price * 2 : product.price} <del>₹{variant ? product.mrp * 2 : product.mrp}</del> <em>{Math.round((1 - product.price / product.mrp) * 100)}% OFF</em></div><p className="desc">{product.description}</p><h4>Choose a size</h4><div className="variants">{product.variants.map((item, index) => <button className={variant === index ? 'chosen' : ''} onClick={() => setVariant(index)} key={item}>{item}<b>₹{index ? product.price * 2 : product.price}</b></button>)}</div>{quantity ? <div className="modal-step"><button onClick={() => setQuantity(product.id, quantity - 1)} aria-label="Decrease quantity"><Minus /></button><b>{quantity} in cart</b><button onClick={addItem} aria-label="Increase quantity"><Plus /></button></div> : <button className="wide-add" onClick={addItem}>Add to cart <span>₹{variant ? product.price * 2 : product.price}</span></button>}<h3>You might also like</h3><div className="related">{related.map((item) => <ProductCard key={item.id} product={item} onOpen={openProduct} onAdded={notify} />)}</div></div></section></div>
}

function CartPage({ onCheckout, onShop }: { onCheckout: () => void; onShop: () => void }) {
  const { lines, remove, setQuantity, subtotal } = useCart()
  const fee = subtotal === 0 || subtotal >= 399 ? 0 : 29
  const total = subtotal + fee + (subtotal ? 4 : 0)
  if (!lines.length) return <section className="cart-page"><h1>My cart</h1><div className="empty"><span>🛒</span><h2>Your basket is waiting</h2><p>Add a few fresh favourites to get started.</p><button className="shop-btn" onClick={onShop}>Shop now</button></div></section>
  return <section className="cart-page"><h1>My cart</h1><p className="delivery-note">⚡ Your order will arrive in 10–15 mins</p><div className="cart-lines">{lines.map(({ product, quantity }) => <article key={product.id}><img src={product.image} alt={product.name} /><div><b>{product.name}</b><small>{product.weight}</small><strong>{money(product.price * quantity)}</strong></div><div className="cart-actions"><button className="trash" onClick={() => remove(product.id)} aria-label={`Remove ${product.name}`}><Trash2 size={16} /></button><div className="stepper"><button onClick={() => setQuantity(product.id, quantity - 1)} aria-label="Remove one"><Minus size={14} /></button><b>{quantity}</b><button onClick={() => setQuantity(product.id, quantity + 1)} aria-label="Add one"><Plus size={14} /></button></div></div></article>)}</div><div className="bill"><h3>Bill details</h3><p><span>Item total</span><b>{money(subtotal)}</b></p><p><span>Delivery fee</span><b>{fee ? money(fee) : 'FREE'}</b></p><p><span>Handling fee</span><b>₹4</b></p><hr /><p className="total"><span>To pay</span><b>{money(total)}</b></p></div><button className="checkout-btn" onClick={onCheckout}>Proceed to checkout <ChevronRight /></button></section>
}

function CheckoutPage({ address, onAddress, onPlaceOrder }: { address: string; onAddress: () => void; onPlaceOrder: () => void }) {
  const [payment, setPayment] = useState('UPI')
  const { lines, subtotal } = useCart()
  const fee = subtotal >= 399 ? 0 : 29
  const total = subtotal + fee + 4
  if (!lines.length) return <section className="checkout"><h1>Checkout</h1><div className="empty"><span>🛒</span><h2>Your cart is empty</h2><p>Add products before proceeding to checkout.</p></div></section>
  return <section className="checkout"><h1>Checkout</h1><div className="checkout-card"><h3>Delivering to</h3><p><b>Home</b><br />{address}<br />Karnataka 590006</p><button onClick={onAddress}>Change</button></div><div className="checkout-card"><h3>Payment method</h3>{['UPI', 'Credit / Debit card', 'Cash on delivery'].map((item) => <label key={item}><input checked={payment === item} onChange={() => setPayment(item)} type="radio" name="payment" /> {item}</label>)}</div><div className="checkout-card"><h3>Order summary</h3>{lines.map((line) => <p key={line.product.id}><span>{line.quantity} × {line.product.name}</span><b>{money(line.quantity * line.product.price)}</b></p>)}<hr /><p><b>Total</b><b>{money(total)}</b></p></div><button className="checkout-btn" onClick={onPlaceOrder}>Place order <span>{money(total)}</span></button></section>
}

function TrackingPage({ onHome }: { onHome: () => void }) {
  return <section className="tracking"><div className="success"><span><Check /></span><h1>Order placed!</h1><p>Your groceries are being lovingly packed.</p></div><div className="eta"><span>🛵</span><div><small>ESTIMATED ARRIVAL</small><h2>10–15 mins</h2></div></div><div className="timeline">{[['Packed', 'Your items are freshly packed'], ['Out for delivery', 'Rider will be assigned shortly'], ['Delivered', 'Enjoy your fresh groceries!']].map(([title, description], index) => <div className={index === 0 ? 'done' : ''} key={title}><i>{index === 0 ? <Check size={15} /> : index + 1}</i><span><b>{title}</b><small>{description}</small></span></div>)}</div><button className="wide-add" onClick={onHome}>Continue shopping</button></section>
}

function AddressPicker({ address, choose, close }: { address: string; choose: (address: string) => void; close: () => void }) {
  return <div className="modal-wrap address-wrap" onMouseDown={close}><section className="address-picker" role="dialog" aria-modal="true" aria-label="Select delivery address" onMouseDown={(event) => event.stopPropagation()}><div className="picker-title"><h2>Choose delivery address</h2><button onClick={close} aria-label="Close"><X /></button></div>{ADDRESSES.map((item) => <button className={address === item ? 'address-option selected-address' : 'address-option'} onClick={() => choose(item)} key={item}><MapPin /><span><b>{address === item ? 'Home' : 'Work'}</b><small>{item}</small></span>{address === item && <Check size={18} />}</button>)}<button className="add-address" onClick={() => choose('New saved address, Belgaum')}>+ Add a new address</button></section></div>
}
