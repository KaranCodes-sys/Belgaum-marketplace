import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'
import { CartProvider } from './context/CartContext'
import { LocationProvider } from './context/LocationContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocationProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </LocationProvider>
  </StrictMode>,
)
