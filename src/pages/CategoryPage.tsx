import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, SlidersHorizontal } from '../components/icons'
import { ProductGrid } from '../components/ProductGrid'
import { getCategories, getDisplayProductsByCategory } from '../services/catalog'
import { useUI } from '../context/UIContext'

const categories = getCategories()

export default function CategoryPage() {
  const { categoryId }    = useParams<{ categoryId: string }>()
  const navigate          = useNavigate()
  const { openProduct, notify } = useUI()
  const [sort, setSort]   = useState('popular')
  const [loading, setLoading] = useState(true)

  const category = categories.find((c) => c.id === categoryId)

  useEffect(() => {
    setLoading(true)
    const t = window.setTimeout(() => setLoading(false), 450)
    return () => window.clearTimeout(t)
  }, [categoryId])

  const items = useMemo(() => {
    const products = categoryId ? getDisplayProductsByCategory(categoryId) : []
    return [...products].sort((a, b) => {
      if (sort === 'low')  return a.price - b.price
      if (sort === 'high') return b.price - a.price
      const aBest = a.tags.includes('bestseller')
      const bBest = b.tags.includes('bestseller')
      if (aBest !== bBest) return aBest ? -1 : 1
      return a.name.localeCompare(b.name)
    })
  }, [categoryId, sort])

  if (!category) {
    return (
      <section className="catalog">
        <h1>Category not found</h1>
        <button onClick={() => navigate('/')}>Go home</button>
      </section>
    )
  }

  return (
    <section className="catalog">
      <div className="page-heading">
        <button className="back" onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft />
        </button>
        <div>
          <small>Category</small>
          <h1>{category.name}</h1>
        </div>
      </div>
      <div className="filters">
        <span><SlidersHorizontal size={15} /> {items.length} items</span>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
          <option value="popular">Popularity</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
        </select>
      </div>
      <ProductGrid items={items} loading={loading} onOpen={openProduct} onAdded={notify} />
    </section>
  )
}
