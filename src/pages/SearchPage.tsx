import { useSearchParams } from 'react-router-dom'
import { ProductGrid } from '../components/ProductGrid'
import { getDisplayProducts } from '../services/catalog'
import { useUI } from '../context/UIContext'

const allProducts = getDisplayProducts()

const SUGGESTIONS = ['Milk', 'Fruits', 'Chips', 'Rice', 'Coffee']

export default function SearchPage() {
  const [searchParams]          = useSearchParams()
  const query                   = searchParams.get('q')?.trim() ?? ''
  const { openProduct, notify } = useUI()

  const results = allProducts.filter((p) =>
    `${p.name} ${p.categoryId} ${p.tags.join(' ')}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  )

  return (
    <section className="catalog search-page">
      <h1>{query ? `Results for "${query}"` : 'Search our store'}</h1>
      {query ? (
        results.length ? (
          <ProductGrid items={results} onOpen={openProduct} onAdded={notify} />
        ) : (
          <div className="empty">
            <span>🔎</span>
            <h2>No groceries found</h2>
            <p>Try searching for fruit, milk, snacks or coffee.</p>
          </div>
        )
      ) : (
        <>
          <p className="subtle">Type in the search box above to find products.</p>
          <div className="chips">
            {SUGGESTIONS.map((s) => <span key={s}>{s}</span>)}
          </div>
        </>
      )}
    </section>
  )
}
