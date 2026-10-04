/**
 * ShopDetailPage — /shop/:shopId
 *
 * Shows a specific shop's information and its inventory of products.
 *
 * CRITICAL RULES:
 * - Products displayed come ONLY from that shop's inventory (inventory.json).
 * - Prices are the SHOP-SPECIFIC inventory price passed through pricing.ts.
 *   Do NOT use the cheapest cross-shop price from the normal catalog.
 * - The shopId is always derived from the URL param — never inferred.
 *
 * Out-of-stock products are shown (not hidden) with "Out of stock" state
 * and a disabled Add button, so the customer knows the shop carries the item.
 *
 * No backend. No real GPS. No shop management. Prototype only.
 */

import { useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronRight, MapPin } from '../components/icons'
import { getShopById, getDisplayProductsForShop, getCategories } from '../services/catalog'
import { useUI } from '../context/UIContext'
import { useShop } from '../context/ShopContext'
import { ProductCard } from '../components/ProductCard'
import type { DisplayProduct } from '../types/catalog'
import type { ShopType } from '../types/shop'

// ── Helpers ────────────────────────────────────────────────────────────────

const SHOP_TYPE_LABELS: Record<ShopType, string> = {
  grocery:       'Grocery Store',
  fruits_veggies:'Fruits & Vegetables',
  bakery:        'Bakery',
  pharmacy:      'Pharmacy',
  meat:          'Meat & Seafood',
  dairy:         'Dairy Shop',
  cosmetics:     'Cosmetics',
  electronics:   'Electronics',
  general:       'General Store',
}

const SHOP_TYPE_EMOJI: Record<ShopType, string> = {
  grocery:       '🛒',
  fruits_veggies:'🥬',
  bakery:        '🥐',
  pharmacy:      '💊',
  meat:          '🥩',
  dairy:         '🥛',
  cosmetics:     '💄',
  electronics:   '📱',
  general:       '🏪',
}

const allCategories = getCategories()

// ── Category section ───────────────────────────────────────────────────────

function CategorySection({
  categoryId,
  products,
  onOpen,
  onAdded,
}: {
  categoryId: string
  products: DisplayProduct[]
  onOpen: (p: DisplayProduct) => void
  onAdded: (msg: string) => void
}) {
  const cat = allCategories.find((c) => c.id === categoryId)
  const label = cat ? `${cat.emoji} ${cat.name}` : categoryId

  return (
    <div className="shop-cat-section">
      <h2 className="shop-cat-heading">{label}</h2>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onOpen={onOpen}
            onAdded={onAdded}
          />
        ))}
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function ShopDetailPage() {
  const { shopId } = useParams<{ shopId: string }>()
  const navigate = useNavigate()
  const { openProduct, notify } = useUI()
  const { setActiveShopId } = useShop()

  // Register the active shop in context so the product modal
  // can know it's in shop mode (for future shop-aware cart phases).
  useEffect(() => {
    if (shopId) setActiveShopId(shopId)
    return () => setActiveShopId(null)  // clean up when leaving shop
  }, [shopId, setActiveShopId])

  const shop = shopId ? getShopById(shopId) : undefined

  // Products for this shop using THIS shop's inventory price (not cross-shop cheapest)
  const products = useMemo(
    () => (shopId ? getDisplayProductsForShop(shopId) : []),
    [shopId],
  )

  // Group products by categoryId
  const grouped = useMemo(() => {
    const map = new Map<string, DisplayProduct[]>()
    for (const p of products) {
      const list = map.get(p.categoryId) ?? []
      list.push(p)
      map.set(p.categoryId, list)
    }
    return map
  }, [products])

  if (!shop) {
    return (
      <section className="catalog">
        <div className="page-heading">
          <button className="back" onClick={() => navigate('/shops')} aria-label="Back to shops">
            <ArrowLeft />
          </button>
          <div>
            <small>Shops</small>
            <h1>Shop not found</h1>
          </div>
        </div>
        <div className="shops-empty" style={{ marginTop: 40 }}>
          <span>🏪</span>
          <p>This shop doesn't exist.</p>
          <button
            className="shop-back-link"
            onClick={() => navigate('/shops')}
          >
            Browse all shops <ChevronRight size={14} />
          </button>
        </div>
      </section>
    )
  }

  const inStockCount = products.filter((p) => p.inStock).length

  return (
    <section className="catalog" id={`shop-detail-${shopId}`}>
      {/* Back nav */}
      <div className="page-heading">
        <button className="back" onClick={() => navigate('/shops')} aria-label="Back to shops">
          <ArrowLeft />
        </button>
        <div>
          <small>Local Shops</small>
          <h1>{shop.name}</h1>
        </div>
      </div>

      {/* Shop hero card */}
      <div className="shop-hero">
        <div className="shop-hero-icon" aria-hidden="true">
          {SHOP_TYPE_EMOJI[shop.type] ?? '🏪'}
        </div>

        <div className="shop-hero-info">
          <div className="shop-hero-top">
            <span className="shop-hero-type">
              {SHOP_TYPE_LABELS[shop.type] ?? shop.type}
            </span>
            <span className={`shop-status-pill ${shop.isOpen ? 'open' : 'closed'}`}>
              {shop.isOpen ? 'Open now' : 'Closed'}
            </span>
          </div>

          <p className="shop-hero-tagline">{shop.tagline}</p>

          <div className="shop-hero-meta">
            <span className="shop-meta-item">
              <MapPin size={11} />
              {shop.address}
            </span>
          </div>

          <div className="shop-hero-stats">
            {shop.rating && (
              <div className="shop-stat">
                <b>{shop.rating.toFixed(1)}</b>
                <small>Rating</small>
              </div>
            )}
            <div className="shop-stat">
              <b>{shop.deliveryTimeMinutes} min</b>
              <small>Delivery</small>
            </div>
            <div className="shop-stat">
              <b>₹{shop.minOrderAmount}</b>
              <small>Min order</small>
            </div>
            <div className="shop-stat">
              <b>{inStockCount}</b>
              <small>In stock</small>
            </div>
          </div>
        </div>
      </div>

      {/* Closed banner */}
      {!shop.isOpen && (
        <div className="shop-closed-banner">
          <span>⏸</span>
          <div>
            <b>Shop is currently closed</b>
            <p>You can browse products but ordering is paused.</p>
          </div>
        </div>
      )}

      {/* Products by category */}
      {products.length === 0 ? (
        <div className="shops-empty" style={{ marginTop: 40 }}>
          <span>📦</span>
          <p>No products listed for this shop yet.</p>
        </div>
      ) : (
        <div className="shop-products-area">
          <div className="shop-products-header">
            <h2>Products</h2>
            <span>{products.length} items</span>
          </div>

          {Array.from(grouped.entries()).map(([catId, catProducts]) => (
            <CategorySection
              key={catId}
              categoryId={catId}
              products={catProducts}
              onOpen={openProduct}
              onAdded={notify}
            />
          ))}
        </div>
      )}
    </section>
  )
}
