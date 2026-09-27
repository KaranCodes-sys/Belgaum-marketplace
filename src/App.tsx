import { BrowserRouter, Routes, Route, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Header } from './components/Header'
import { CartBar } from './components/CartBar'
import { Toast } from './components/Toast'
import { ProductModal } from './components/ProductModal'
import { AddressPicker } from './components/AddressPicker'
import { Home, PackageCheck, SlidersHorizontal } from './components/icons'
import { UIProvider, useUI } from './context/UIContext'
import HomePage      from './pages/HomePage'
import CategoryPage  from './pages/CategoryPage'
import SearchPage    from './pages/SearchPage'
import CartPage      from './pages/CartPage'
import CheckoutPage  from './pages/CheckoutPage'
import TrackingPage  from './pages/TrackingPage'

// ── Layout ────────────────────────────────────────────────────────────────
// Wraps every route except Tracking. Renders Header, BottomNav,
// CartBar, modals, and toasts around the <Outlet /> (active page).

function Layout() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const { selectedProduct, closeProduct, toast, notify } = useUI()
  const isTracking = location.pathname === '/tracking'
  const path       = location.pathname

  return (
    <main className="app-shell">
      {!isTracking && <Header />}

      <Outlet />

      {!isTracking && (
        <>
          <nav className="bottom-nav">
            <button
              id="nav-home"
              className={path === '/' ? 'active' : ''}
              onClick={() => navigate('/')}
            >
              <Home />Home
            </button>
            <button
              id="nav-browse"
              className={path === '/search' ? 'active' : ''}
              onClick={() => navigate('/search')}
            >
              <SlidersHorizontal />Browse
            </button>
            <button
              id="nav-cart"
              className={path === '/cart' ? 'active' : ''}
              onClick={() => navigate('/cart')}
            >
              <PackageCheck />Cart
            </button>
          </nav>

          {path !== '/cart' && <CartBar goCart={() => navigate('/cart')} />}
        </>
      )}

      {selectedProduct && (
        <ProductModal product={selectedProduct} close={closeProduct} notify={notify} />
      )}
      <AddressPicker />
      {toast && <Toast text={toast} />}
    </main>
  )
}

// ── Router ────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <UIProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/"                       element={<HomePage />} />
            <Route path="/category/:categoryId"   element={<CategoryPage />} />
            <Route path="/search"                 element={<SearchPage />} />
            <Route path="/cart"                   element={<CartPage />} />
            <Route path="/checkout"               element={<CheckoutPage />} />
            <Route path="/tracking"               element={<TrackingPage />} />
          </Route>
        </Routes>
      </UIProvider>
    </BrowserRouter>
  )
}
