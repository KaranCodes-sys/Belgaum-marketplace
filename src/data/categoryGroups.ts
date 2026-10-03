/**
 * categoryGroups.ts — Static category group configuration (Phase 2 prototype).
 *
 * Groups existing category IDs into named sections for the CategoriesPage.
 * Only references IDs that exist in categories.json — no new categories added.
 * Keep this file as the single source of truth for the group → category mapping.
 */

export interface CategoryGroup {
  id: string
  label: string
  categoryIds: string[]
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: 'grocery',
    label: 'Grocery & Kitchen',
    categoryIds: ['fruits', 'staples', 'dairy', 'bakery'],
  },
  {
    id: 'snacks-drinks',
    label: 'Snacks & Drinks',
    categoryIds: ['snacks', 'beverages'],
  },
  {
    id: 'home-personal',
    label: 'Home & Personal Care',
    categoryIds: ['personal', 'household'],
  },
]