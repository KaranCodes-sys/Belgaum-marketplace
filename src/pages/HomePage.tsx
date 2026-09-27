import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from '../components/icons'
import { ProductCard } from '../components/ProductCard'
import { getCategories, getDisplayProducts } from '../services/catalog'
import { useUI } from '../context/UIContext'
import type { DisplayProduct } from '../types/catalog'

const categories    = getCategories()
const allProducts   = getDisplayProducts()
const BANNERS = [
  { eyebrow: 'Fresh picks, super quick', title: <>Groceries at your door <mark>in minutes.</mark></>, emoji: '🛵' },
  { eyebrow: 'Pantry refresh',           title: <>Save up to <mark>25% today.</mark></>,              emoji: '🛍️' },
]

function HorizontalRow({
  title,
  items,
  loading,
}: {
  title: string
  items: DisplayProduct[]
  loading: boolean
}) {
  const { openProduct, notify } = useUI()
  return (
    <section className="home-section">
      <div className="section-title">
        <h2>{title}</h2>
        <button onClick={() => notify('Explore more categories from Browse')}>
          See all <ChevronRight size={16} />
        </button>
      </div>
      <div className="horizontal-products">
        {loading
          ? Array.from({ length: 4 }, (_, i) => <div className="skeleton card-skel" key={i} />)
          : items.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} onOpen={openProduct} onAdded={notify} />
            ))}
      </div>
    </section>
  )
}

export default function HomePage() {
  const navigate          = useNavigate()
  const { notify }        = useUI()
  const [banner, setBanner] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const id = window.setInterval(() => setBanner((b) => (b + 1) % BANNERS.length), 3500)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    setLoading(true)
    const t = window.setTimeout(() => setLoading(false), 450)
    return () => window.clearTimeout(t)
  }, [])

  const bestSellers   = allProducts.filter((p) => p.tags.includes('bestseller'))
  const freshVeggies  = allProducts.filter((p) => p.categoryId === 'fruits')
  const deals         = allProducts.filter((p) => p.tags.includes('deal'))

  return (
    <>
      {/* Hero Banner */}
      <section className="hero">
        <div>
          <p>{BANNERS[banner].eyebrow}</p>
          <h1>{BANNERS[banner].title}</h1>
          <button onClick={() => navigate('/category/fruits')}>
            Shop essentials <ChevronRight size={16} />
          </button>
          <div className="dots">
            {BANNERS.map((_, i) => <i className={banner === i ? 'current' : ''} key={i} />)}
          </div>
        </div>
        <span>{BANNERS[banner].emoji}</span>
      </section>

      {/* Offer strip */}
      <section className="offer-strip">
        <b>FREE DELIVERY</b>
        <span>on your first 3 orders</span>
        <i>Use code HELLO</i>
      </section>

      {/* Category grid */}
      <section className="categories">
        <div className="section-title">
          <h2>Shop by category</h2>
          <button onClick={() => notify('Choose a category to start shopping')}>View all</button>
        </div>
        <div className="category-grid">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="category-tile"
              style={{ background: cat.color }}
              onClick={() => navigate(`/category/${cat.id}`)}
            >
              <span>{cat.emoji}</span>
              <b>{cat.name}</b>
              <i>→</i>
            </button>
          ))}
        </div>
      </section>

      {/* Product rows */}
      <HorizontalRow title="Best sellers"      items={bestSellers}  loading={loading} />
      <HorizontalRow title="Fresh vegetables"  items={freshVeggies} loading={loading} />
      <HorizontalRow title="Deals of the day"  items={deals}        loading={loading} />
    </>
  )
}
