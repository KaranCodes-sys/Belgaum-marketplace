/**
 * catalog.ts — Data access layer for the prototype.
 *
 * All functions read from local JSON files.
 * In Phase 6, replace these imports with API calls — the function signatures
 * and return types stay the same, so all UI code remains unchanged.
 */

import categoriesJson from '../data/categories.json'
import masterProductsJson from '../data/masterProducts.json'
import shopsJson from '../data/shops.json'
import inventoryJson from '../data/inventory.json'
import type { Category, MasterProduct, DisplayProduct } from '../types/catalog'
import type { Shop, ShopInventory } from '../types/shop'

const _categories  = categoriesJson  as Category[]
const _master      = masterProductsJson as MasterProduct[]
const _shops       = shopsJson       as Shop[]
const _inventory   = inventoryJson   as ShopInventory[]

// ── Raw accessors ─────────────────────────────────────────────────────────

export function getCategories(): Category[] {
  return _categories
}

export function getMasterProducts(): MasterProduct[] {
  return _master
}

export function getShops(): Shop[] {
  return _shops
}

export function getInventory(): ShopInventory[] {
  return _inventory
}

// ── Display products ──────────────────────────────────────────────────────
/**
 * Returns every master product enriched with its first available inventory
 * entry.  This is what the current single-marketplace UI renders.
 *
 * Phase 1 upgrade path: filter inventory by nearby shopIds before calling
 * this so that only local inventory is surfaced.
 */
export function getDisplayProducts(): DisplayProduct[] {
  return _master.flatMap((product) => {
    const inv = _inventory.find((i) => i.masterProductId === product.id)
    if (!inv) return []   // product exists in catalog but no shop stocks it yet
    return [buildDisplayProduct(product, inv)]
  })
}

/** Products filtered to a single category. */
export function getDisplayProductsByCategory(categoryId: string): DisplayProduct[] {
  return getDisplayProducts().filter((p) => p.categoryId === categoryId)
}

/**
 * All inventory entries for a specific shop, enriched with master product
 * data.  Used in Phase 3 (Shop detail page).
 */
export function getDisplayProductsForShop(shopId: string): DisplayProduct[] {
  return _master.flatMap((product) => {
    const inv = _inventory.find(
      (i) => i.masterProductId === product.id && i.shopId === shopId,
    )
    if (!inv) return []
    return [buildDisplayProduct(product, inv)]
  })
}

// ── Private helpers ───────────────────────────────────────────────────────

function buildDisplayProduct(
  product: MasterProduct,
  inv: ShopInventory,
): DisplayProduct {
  return {
    id:          product.id,
    categoryId:  product.categoryId,
    name:        product.name,
    description: product.description,
    image:       product.image,
    weight:      inv.weight || product.defaultWeight,
    variants:    product.variants,
    tags:        product.tags,
    inventoryId: inv.inventoryId,
    shopId:      inv.shopId,
    price:       inv.price,
    mrp:         inv.mrp,
    inStock:     inv.inStock,
  }
}
