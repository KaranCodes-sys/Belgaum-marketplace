import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from '../components/icons'
import { getCategories } from '../services/catalog'
import { CATEGORY_GROUPS } from '../data/categoryGroups'
import type { Category } from '../types/catalog'

/**
 * CategoriesPage — Route: /categories
 *
 * A dedicated category directory page. Organised into named sections
 * (e.g. "Grocery & Kitchen") with visual tiles for each category.
 *
 * Clicking a tile navigates to /category/:categoryId — the product listing page.
 * This page does NOT list products itself.
 */

const allCategories = getCategories()

// Build lookup map once at module level
const catMap = new Map<string, Category>(
  allCategories.map((c) => [c.id, c])
)

export default function CategoriesPage() {
  const navigate = useNavigate()

  return (
    <div className="categories-page">

      <div className="categories-page-header">
        <button
          className="back"
          onClick={() => navigate('/')}
          aria-label="Go back to home"
        >
          <ArrowLeft />
        </button>
        <div>
          <small>Browse</small>
          <h1>All Categories</h1>
        </div>
      </div>

      {CATEGORY_GROUPS.map((group) => {
        const cats = group.categoryIds
          .map((id) => catMap.get(id))
          .filter((c): c is Category => c !== undefined)

        if (cats.length === 0) return null

        return (
          <section key={group.id} className="cat-group">
            <h2 className="cat-group-label">{group.label}</h2>
            <div className="cat-group-grid">
              {cats.map((cat) => (
                <button
                  key={cat.id}
                  className="cat-group-tile"
                  style={{ background: cat.color }}
                  onClick={() => navigate('/category/' + cat.id)}
                  aria-label={'Browse ' + cat.name}
                >
                  <span className="cat-group-emoji">{cat.emoji}</span>
                  <b className="cat-group-name">{cat.name}</b>
                </button>
              ))}
            </div>
          </section>
        )
      })}

    </div>
  )
}