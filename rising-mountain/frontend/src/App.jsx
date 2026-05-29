import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import StorePage from './pages/StorePage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import CartPage from './pages/CartPage.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<StorePage />} />
        <Route path="/products/:handle" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </>
  )
}
