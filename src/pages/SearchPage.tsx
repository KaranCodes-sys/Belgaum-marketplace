import { useSearchParams, useNavigate } from 'react-router-dom'
import { ProductGrid } from '../components/ProductGrid'
import { searchDisplayProducts } from '../services/catalog'
import { useUI } from '../context/UIContext'

const SUGGESTIONS = ['Milk', 'Fruits', 'Chips', 'Rice', 'Coffee']

export default function SearchPage() {
  const [searchParams]          = useSearchParams()
  const navigate                = useNavigate()
  const query                   = searchParams.get('q')?.trim() ?? ''
  const { openProduct, notify } = useUI()

  const results = searchDisplayProducts(query)

  return (
    <section className="catalog search-page">
      <h1>{query ? `Results for "${query}"` : 'Browse products'}</h1>
      {query ? (
        results.length ? (
          <ProductGrid items={results} onOpen={openProduct} onAdded={notify} />
        ) : (
          <div className="empty">
            <span>🔎</span>
            <h2>No products found</h2>
            <p>Try a different search — fruit, milk, snacks, rice, coffee…</p>
            <button className="shop-btn" onClick={() => navigate('/categories')}>
              Browse categories
            </button>
          </div>
        )
      ) : (
        <>
          <p className="subtle">Type in the search box above to find products.</p>
          <div className="chips">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                className="chip-btn"
                onClick={() => navigate(`/search?q=${encodeURIComponent(s)}`)}
              >
                {s}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

