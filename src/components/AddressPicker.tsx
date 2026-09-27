import { Check, MapPin, X } from './icons'
import { useUserLocation, MOCK_ADDRESSES } from '../context/LocationContext'

export function AddressPicker() {
  const { userLocation, setUserAddress, addressPickerOpen, closeAddressPicker } = useUserLocation()

  if (!addressPickerOpen) return null

  return (
    <div className="modal-wrap address-wrap" onMouseDown={closeAddressPicker}>
      <section
        className="address-picker"
        role="dialog"
        aria-modal="true"
        aria-label="Select delivery address"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="picker-title">
          <h2>Choose delivery address</h2>
          <button onClick={closeAddressPicker} aria-label="Close"><X /></button>
        </div>
        {MOCK_ADDRESSES.map((addr) => {
          const isSelected = userLocation.address.label === addr.label
          return (
            <button
              key={addr.label}
              className={isSelected ? 'address-option selected-address' : 'address-option'}
              onClick={() => setUserAddress(addr)}
            >
              <MapPin />
              <span>
                <b>{addr.label}</b>
                <small>{addr.line1}, {addr.city} - {addr.pincode}</small>
              </span>
              {isSelected && <Check size={18} />}
            </button>
          )
        })}
        <button
          className="add-address"
          onClick={() =>
            setUserAddress({
              label:   'Other',
              line1:   'New saved address',
              city:    'Belagavi',
              state:   'Karnataka',
              pincode: '590001',
            })
          }
        >
          + Add a new address
        </button>
      </section>
    </div>
  )
}
