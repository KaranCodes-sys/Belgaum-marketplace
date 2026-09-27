/**
 * LocationContext — User's current delivery location.
 *
 * Prototype behaviour:
 *   • Default location is hardcoded Belagavi city centre.
 *   • User can pick from a preset list of addresses (no real GPS).
 *   • Selection is persisted to localStorage so it survives page refresh.
 *
 * Phase 2 upgrade path: replace MOCK_ADDRESSES with navigator.geolocation
 * and a reverse-geocoding call; keep the context interface identical.
 */

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Address, UserLocation } from '../types/location'

// ── Mock Belagavi locations ───────────────────────────────────────────────

export const MOCK_ADDRESSES: Address[] = [
  {
    label:   'Home',
    line1:   '18, Market Road',
    city:    'Belagavi',
    state:   'Karnataka',
    pincode: '590001',
    coords:  { lat: 15.851, lng: 74.499 },
  },
  {
    label:   'Work',
    line1:   '31, Club Road',
    city:    'Belagavi',
    state:   'Karnataka',
    pincode: '590001',
    coords:  { lat: 15.8535, lng: 74.502 },
  },
]

const DEFAULT_LOCATION: UserLocation = {
  address: MOCK_ADDRESSES[0],
  coords:  MOCK_ADDRESSES[0].coords!,
}

// ── Context ───────────────────────────────────────────────────────────────

type LocationContextValue = {
  userLocation: UserLocation
  setUserAddress: (address: Address) => void
  addressPickerOpen: boolean
  openAddressPicker: () => void
  closeAddressPicker: () => void
}

const LocationContext = createContext<LocationContextValue | null>(null)

function loadSavedLocation(): UserLocation {
  try {
    const saved = localStorage.getItem('belgaum_user_location')
    if (saved) return JSON.parse(saved) as UserLocation
  } catch {
    // ignore parse errors
  }
  return DEFAULT_LOCATION
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [userLocation, setUserLocation] = useState<UserLocation>(loadSavedLocation)
  const [addressPickerOpen, setAddressPickerOpen] = useState(false)

  const setUserAddress = (address: Address) => {
    const newLocation: UserLocation = {
      address,
      coords: address.coords ?? userLocation.coords,
    }
    setUserLocation(newLocation)
    try {
      localStorage.setItem('belgaum_user_location', JSON.stringify(newLocation))
    } catch {
      // ignore storage errors
    }
    setAddressPickerOpen(false)
  }

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        setUserAddress,
        addressPickerOpen,
        openAddressPicker:  () => setAddressPickerOpen(true),
        closeAddressPicker: () => setAddressPickerOpen(false),
      }}
    >
      {children}
    </LocationContext.Provider>
  )
}

export function useUserLocation() {
  const ctx = useContext(LocationContext)
  if (!ctx) throw new Error('useUserLocation must be used inside LocationProvider')
  return ctx
}
