/**
 * ShopsPage — /shops
 *
 * The optional "Shop Discovery" directory.
 * Customers intentionally navigate here to browse local shops.
 *
 * This page does NOT change the normal Home → Category → Product flow.
 * It is a secondary, additive entry point.
 *
 * Data: reads from shops.json via catalog service.
 * Distance: calculated from mock user location using haversine (from availability.ts helpers).
 * No backend, no real GPS.
 */

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronRight, MapPin } from '../components/icons'
import { getShops } from '../services/catalog'
import { useUserLocation } from '../context/LocationContext'
import type { Shop, ShopType } from '../types/shop'

// ── Helpers ────────────────────────────────────────────────────────────────

function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371
  const dL = ((b.lat - a.lat) * Math.PI) / 180
  const dG = ((b.lng - a.lng) * Math.PI) / 180
  const x =
    Math.sin(dL / 2) * Math.sin(dL / 2) +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dG / 2) *
      Math.sin(dG / 2)
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
}

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

const FILTER_OPTIONS: { label: string; value: string }[] = [
  { label: 'All',      value: 'all' },
  { label: '🥬 Fresh', value: 'fruits_veggies' },
  { label: '🥛 Dairy', value: 'dairy' },
  { label: '🥐 Bakery',value: 'bakery' },
  { label: '🛒 Grocery',value:'grocery' },
  { label: '🏪 General',value:'general' },
]

const ALL_SHOPS = getShops()

// ── Shop Card ──────────────────────────────────────────────────────────────

function ShopCard({
  shop,
  distanceKm,
}: {
  shop: Shop
  distanceKm: number
}) {
  const navigate = useNavigate()

  return (
    <button
      className="shop-card"
      id={`shop-card-${shop.id}`}
      onClick={() => navigate(`/shop/${shop.id}`)}
      aria-label={`View ${shop.name}`}
    >
      {/* Icon */}
      <span className="shop-card-icon" aria-hidden="true">
        {SHOP_TYPE_EMOJI[shop.type] ?? '🏪'}
      </span>

      {/* Info */}
      <div className="shop-card-body">
        <div className="shop-card-top">
          <b className="shop-card-name">{shop.name}</b>
          <span className={`shop-status-pill ${shop.isOpen ? 'open' : 'closed'}`}>
            {shop.isOpen ? 'Open' : 'Closed'}
          </span>
        </div>

        <span className="shop-card-type">
          {SHOP_TYPE_LABELS[shop.type] ?? shop.type}
        </span>

        <div className="shop-card-meta">
          <span className="shop-meta-item">
            <MapPin size={11} />
            {distanceKm < 1
              ? `${Math.round(distanceKm * 1000)} m away`
              : `${distanceKm.toFixed(1)} km away`}
          </span>
          {shop.rating && (
            <span className="shop-meta-item">
              ⭐ {shop.rating.toFixed(1)}
            </span>
          )}
          <span className="shop-meta-item">
            ⏱ {shop.deliveryTimeMinutes} min
          </span>
        </div>

        <p className="shop-card-tagline">{shop.tagline}</p>
      </div>

      {/* Arrow */}
      <span className="shop-card-arrow">
        <ChevronRight size={18} />
      </span>
    </button>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function ShopsPage() {
  const navigate = useNavigate()
  const { userLocation } = useUserLocation()
  const [filter, setFilter] = useState('all')

  // Compute distances from mock user location, sort by distance
  const shopsWithDistance = useMemo(() => {
    return ALL_SHOPS.map((shop) => ({
      shop,
      distanceKm: haversineKm(userLocation.coords, { lat: shop.lat, lng: shop.lng }),
    })).sort((a, b) => a.distanceKm - b.distanceKm)
  }, [userLocation.coords])

  const filtered = useMemo(() => {
    if (filter === 'all') return shopsWithDistance
    return shopsWithDistance.filter(({ shop }) => shop.type === filter)
  }, [shopsWithDistance, filter])

  const openCount = ALL_SHOPS.filter((s) => s.isOpen).length

  return (
    <section className="catalog" id="shops-directory-page">
      {/* Page heading */}
      <div className="page-heading">
        <button className="back" onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft />
        </button>
        <div>
          <small>Marketplace</small>
          <h1>Local Shops</h1>
        </div>
      </div>

      {/* Subtitle */}
      <div className="shops-header">
        <p className="shops-subtitle">
          Neighbourhood stores near you in Belagavi.
        </p>
        <span className="shops-open-count">
          {openCount} open now
        </span>
      </div>

      {/* Filter chips */}
      <div className="shops-filters" role="group" aria-label="Filter by shop type">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            id={`shop-filter-${opt.value}`}
            className={`shops-filter-chip ${filter === opt.value ? 'active' : ''}`}
            onClick={() => setFilter(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Shop list */}
      <div className="shops-list">
        {filtered.length === 0 ? (
          <div className="shops-empty">
            <span>🏪</span>
            <p>No shops found for this filter.</p>
          </div>
        ) : (
          filtered.map(({ shop, distanceKm }) => (
            <ShopCard key={shop.id} shop={shop} distanceKm={distanceKm} />
          ))
        )}
      </div>
    </section>
  )
}
