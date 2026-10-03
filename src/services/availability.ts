/**
 * availability.ts — Internal marketplace availability resolver (Phase 1).
 *
 * Answers the question: "Which nearby shops currently have this product?"
 *
 * IMPORTANT: This information is for INTERNAL marketplace logic only.
 * The customer UI must NEVER display shop names, distances, or fulfillment
 * information on normal product cards or category pages.
 *
 * In later phases this will be replaced with real GPS + radius filtering.
 * For now the mock user location and all Belagavi shops are assumed to be
 * within the service radius.
 */

import type { Coords } from '../types/location'
import type { Shop, ShopInventory } from '../types/shop'
import { getShops, getInventory, getShopById } from './catalog'

// ── Config ─────────────────────────────────────────────────────────────────

/** Maximum service radius in kilometres for the Belagavi prototype. */
const SERVICE_RADIUS_KM = 5

// ── Haversine distance ─────────────────────────────────────────────────────

/**
 * Returns the great-circle distance in kilometres between two coordinates.
 * Accuracy is sufficient for hyperlocal delivery radius checks.
 */
function haversineKm(a: Coords, b: Coords): number {
  const R  = 6371                           // Earth's radius in km
  const dL = ((b.lat - a.lat) * Math.PI) / 180
  const dG = ((b.lng - a.lng) * Math.PI) / 180
  const x  =
    Math.sin(dL / 2) * Math.sin(dL / 2) +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dG / 2) *
      Math.sin(dG / 2)
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
}

// ── Eligibility ────────────────────────────────────────────────────────────

/**
 * Returns true if the shop is within the service radius of the user location
 * AND the shop is currently open.
 */
function isShopEligible(shop: Shop, userLocation: Coords): boolean {
  const dist = haversineKm(userLocation, { lat: shop.lat, lng: shop.lng })
  return shop.isOpen && dist <= SERVICE_RADIUS_KM
}

// ── Public resolver ────────────────────────────────────────────────────────

export type AvailableShop = {
  shop: Shop
  inventoryRecord: ShopInventory
  distanceKm: number
}

/**
 * Returns a list of eligible nearby shops that currently have the given
 * product in stock, sorted by distance (closest first).
 *
 * FOR INTERNAL MARKETPLACE LOGIC ONLY.
 * Do not pass this data to customer-facing product cards.
 */
export function getAvailableShopsForProduct(
  productId: string,
  userLocation: Coords,
): AvailableShop[] {
  const inventory  = getInventory()
  const allShops   = getShops()

  return inventory
    .filter((rec) => rec.productId === productId && rec.inStock)
    .flatMap((rec) => {
      const shop = allShops.find((s) => s.id === rec.shopId)
      if (!shop || !isShopEligible(shop, userLocation)) return []
      const distanceKm = haversineKm(userLocation, { lat: shop.lat, lng: shop.lng })
      return [{ shop, inventoryRecord: rec, distanceKm }]
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
}

/**
 * Returns true if a product is available from at least one eligible nearby shop.
 *
 * This is the canonical availability signal used for internal routing.
 * The customer UI uses DisplayProduct.inStock which is a simpler version
 * (any shop in stock → product shown as available).
 */
export function isProductAvailableNearby(
  productId: string,
  userLocation: Coords,
): boolean {
  return getAvailableShopsForProduct(productId, userLocation).length > 0
}

/**
 * Returns the closest eligible shop that has the product in stock.
 * Returns undefined if no eligible shop is found.
 *
 * Used for future order routing in later phases.
 */
export function getClosestShopForProduct(
  productId: string,
  userLocation: Coords,
): AvailableShop | undefined {
  return getAvailableShopsForProduct(productId, userLocation)[0]
}

/**
 * Returns the shop for a given inventory record ID.
 * Convenience helper for internal fulfillment logic.
 */
export function getShopForInventoryRecord(shopId: string): Shop | undefined {
  return getShopById(shopId)
}
