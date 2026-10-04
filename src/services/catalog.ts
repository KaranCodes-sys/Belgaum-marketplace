/**
 * catalog.ts — Data access layer for the prototype (Phase 1).
 *
 * All functions read from local JSON files.
 * No backend, no API calls, no external services.
 *
 * Phase 1 Architecture:
 *   - Prices, names, descriptions, images are owned by the MASTER CATALOG.
 *   - Shops only declare whether a product is in stock (ShopInventory).
 *   - The customer UI receives DisplayProduct which is entirely master-catalog
 *     data + a single boolean (inStock) resolved from local inventory.
 *   - Shop information is never exposed in DisplayProduct.
 */

import categoriesJson     from '../data/categories.json'
import masterProductsJson from '../data/masterProducts.json'
import shopsJson          from '../data/shops.json'
import inventoryJson      from '../data/inventory.json'
import type { Category, MasterProduct, DisplayProduct } from '../types/catalog'
import type { Shop, ShopInventory } from '../types/shop'
import { calculateCustomerPrice } from './pricing'

const _categories = categoriesJson  as Category[]
const _master     = masterProductsJson as MasterProduct[]
const _shops      = shopsJson       as Shop[]
const _inventory  = inventoryJson   as ShopInventory[]

// ── Categories ─────────────────────────────────────────────────────────────

export function getCategories(): Category[] {
  return _categories
}

// ── Master Products ────────────────────────────────────────────────────────

/** All products in the master catalog, regardless of shop availability. */
export function getMasterProducts(): MasterProduct[] {
  return _master
}

/** Get a single master product by its ID. Returns undefined if not found. */
export function getProductById(productId: string): MasterProduct | undefined {
  return _master.find((p) => p.id === productId)
}

/** All master products belonging to a given category. */
export function getProductsForCategory(categoryId: string): MasterProduct[] {
  return _master.filter((p) => p.categoryId === categoryId)
}

/**
 * Search master products by name, category ID, or tags.
 * Case-insensitive substring match.
 */
export function searchProducts(query: string): MasterProduct[] {
  const q = query.trim().toLowerCase()
  if (!q) return _master
  return _master.filter((p) =>
    `${p.name} ${p.categoryId} ${p.tags.join(' ')}`
      .toLowerCase()
      .includes(q),
  )
}

// ── Shops ──────────────────────────────────────────────────────────────────

export function getShops(): Shop[] {
  return _shops
}

export function getShopById(shopId: string): Shop | undefined {
  return _shops.find((s) => s.id === shopId)
}

// ── Inventory ──────────────────────────────────────────────────────────────

/** All raw inventory records. */
export function getInventory(): ShopInventory[] {
  return _inventory
}

/** All inventory records for a specific shop. */
export function getInventoryForShop(shopId: string): ShopInventory[] {
  return _inventory.filter((i) => i.shopId === shopId)
}

/**
 * Returns true if the given product is in stock at the given shop.
 * Returns false if there is no inventory record or the record is out of stock.
 */
export function isProductInStockAtShop(productId: string, shopId: string): boolean {
  const record = _inventory.find(
    (i) => i.productId === productId && i.shopId === shopId,
  )
  return record?.inStock ?? false
}

// ── Display Products ───────────────────────────────────────────────────────

/**
 * Converts a MasterProduct to a DisplayProduct.
 *
 * Price is derived from the cheapest in-stock shop inventory record,
 * passed through calculateCustomerPrice() in pricing.ts.
 * If only out-of-stock records exist, falls back to the cheapest overall.
 *
 * Note: shop identity is intentionally NOT included in DisplayProduct.
 * Use getAvailableShopsForProduct() in availability.ts for internal logic.
 */
function buildDisplayProduct(product: MasterProduct): DisplayProduct {
  const productRecords = _inventory.filter((i) => i.productId === product.id)
  const inStockRecords = productRecords.filter((i) => i.inStock)

  // Resolve availability and the representative shop price
  const available = inStockRecords.length > 0
  const priceSource = available
    ? inStockRecords.reduce((a, b) => (a.price <= b.price ? a : b))
    : productRecords[0]  // fallback when all out of stock

  return {
    id:          product.id,
    categoryId:  product.categoryId,
    name:        product.name,
    description: product.description,
    image:       product.image,
    unit:        product.unit,
    variants:    product.variants,
    tags:        product.tags,
    price:       calculateCustomerPrice(priceSource.price), // shop price → customer price
    mrp:         product.mrp,
    inStock:     available,
  }
}

/**
 * All display products, resolved for the unified marketplace.
 * Only includes products that appear in at least one inventory record.
 * Products in the catalog but not listed in any shop inventory are excluded.
 */
export function getDisplayProducts(): DisplayProduct[] {
  return _master
    .filter((p) => _inventory.some((i) => i.productId === p.id))
    .map(buildDisplayProduct)
}

/** Display products filtered to a category. */
export function getDisplayProductsByCategory(categoryId: string): DisplayProduct[] {
  return getDisplayProducts().filter((p) => p.categoryId === categoryId)
}

/**
 * Display products matching a search query.
 * Searches name, categoryId, and tags.
 */
export function searchDisplayProducts(query: string): DisplayProduct[] {
  const q = query.trim().toLowerCase()
  if (!q) return getDisplayProducts()
  return getDisplayProducts().filter((p) =>
    `${p.name} ${p.categoryId} ${p.tags.join(' ')}`
      .toLowerCase()
      .includes(q),
  )
}

/**
 * Converts a MasterProduct to a DisplayProduct using a SPECIFIC shop's
 * inventory record. This is used in Shop Mode so the customer sees the
 * exact price from THAT shop (passed through pricing.ts), not the cheapest
 * cross-shop price.
 *
 * IMPORTANT: This must NOT fall back to another shop's price.
 */
function buildDisplayProductForShop(
  product: MasterProduct,
  inv: ShopInventory,
): DisplayProduct {
  return {
    id:          product.id,
    categoryId:  product.categoryId,
    name:        product.name,
    description: product.description,
    image:       product.image,
    unit:        product.unit,
    variants:    product.variants,
    tags:        product.tags,
    price:       calculateCustomerPrice(inv.price), // this shop's price → customer price
    mrp:         product.mrp,
    inStock:     inv.inStock,
  }
}

/**
 * All inventory entries for a specific shop, enriched with master product
 * data, priced using THAT shop's inventory record only.
 *
 * Used for the Shop Detail page (Phase 4).
 * Returns only products where the shop has an inventory record.
 * Preserves the shop's own inStock status.
 */
export function getDisplayProductsForShop(shopId: string): DisplayProduct[] {
  const shopInventory = getInventoryForShop(shopId)
  return _master.flatMap((product) => {
    const inv = shopInventory.find((i) => i.productId === product.id)
    if (!inv) return []
    return [buildDisplayProductForShop(product, inv)]
  })
}

/**
 * Returns a single DisplayProduct for a specific shop + product pair.
 * Used when entering product detail from shop context to ensure
 * the price/availability reflects THAT shop only.
 * Returns undefined if the shop has no inventory record for this product.
 */
export function getDisplayProductForShop(
  productId: string,
  shopId: string,
): DisplayProduct | undefined {
  const product = getProductById(productId)
  if (!product) return undefined
  const inv = getInventoryForShop(shopId).find((i) => i.productId === productId)
  if (!inv) return undefined
  return buildDisplayProductForShop(product, inv)
}
