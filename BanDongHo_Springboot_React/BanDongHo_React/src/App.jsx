import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Shop from "./pages/Shop"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import Account from "./pages/Account"
import Login from "./pages/Login"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminProducts from "./pages/admin/AdminProducts"
import AdminOrders from "./pages/admin/AdminOrders"
import "./App.css"

function App() {
  const [user, setUser] = useState(null)
  const [cartItems, setCartItems] = useState([])

  // Load user and cart from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    const savedCart = localStorage.getItem("cart")

    if (savedUser) setUser(JSON.parse(savedUser))
    if (savedCart) setCartItems(JSON.parse(savedCart))
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id)

    let updatedCart
    if (existingItem) {
      updatedCart = cartItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      updatedCart = [...cartItems, { ...product, quantity: 1 }]
    }

    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId)
    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  const updateCartQuantity = (productId, quantity) => {
    const updatedCart = cartItems.map((item) => (item.id === productId ? { ...item, quantity } : item))
    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.setItem("cart", JSON.stringify([]))
  }

  return (
    <Router>
      {!user || user.role === "customer" ? (
        <>
          <Header user={user} onLogout={handleLogout} cartCount={cartItems.length} />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop onAddToCart={addToCart} />} />
              <Route path="/product/:id" element={<ProductDetail onAddToCart={addToCart} />} />
              <Route
                path="/cart"
                element={<Cart items={cartItems} onRemove={removeFromCart} onUpdateQuantity={updateCartQuantity} />}
              />
              <Route
                path="/checkout"
                element={<Checkout cartItems={cartItems} onClearCart={clearCart} user={user} />}
              />
              <Route
                path="/account"
                element={user ? <Account user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
              />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </>
      ) : (
        <>
          <Routes>
            <Route path="/admin" element={<AdminDashboard user={user} onLogout={handleLogout} />} />
            <Route path="/admin/products" element={<AdminProducts user={user} onLogout={handleLogout} />} />
            <Route path="/admin/orders" element={<AdminOrders user={user} onLogout={handleLogout} />} />
            <Route path="*" element={<Navigate to="/admin" />} />
          </Routes>
        </>
      )}
    </Router>
  )
}

export default App
