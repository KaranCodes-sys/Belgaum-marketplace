// ── Location Types ──────────────────────────────────────────────────────────
// Structured address and coordinate types.
// GPS/geocoding is mocked in the prototype via a hardcoded Belgaum location.

export type Coords = {
  lat: number
  lng: number
}

export type Address = {
  label: 'Home' | 'Work' | 'Other'
  line1: string
  city: string
  state: string
  pincode: string
  coords?: Coords
}

export type UserLocation = {
  address: Address
  coords: Coords
}
