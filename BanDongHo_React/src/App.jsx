import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import ProtectedRoute from "./components/ProtectedRoute"
import Home from "./pages/Home"
import Shop from "./pages/Shop"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import Account from "./pages/Account"
import Login from "./pages/Login"
import Register from "./pages/Register"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminProducts from "./pages/admin/AdminProducts"
import AdminCategories from "./pages/admin/AdminCategories"
import AdminUsers from "./pages/admin/AdminUsers"
import AdminOrders from "./pages/admin/AdminOrders"
import AdminLayout from "./pages/admin/AdminLayout"
import About from "./pages/About"
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
    // Clear cart when logout
    setCartItems([])
    localStorage.removeItem("cart")
  }

  const handleUserUpdate = (updatedUserData) => {
    setUser(updatedUserData)
    localStorage.setItem("user", JSON.stringify(updatedUserData))
  }

  const addToCart = (product) => {
    // Check if product is in stock
    if (!product.stock || product.stock <= 0) {
      alert("Sản phẩm này đã hết hàng!")
      return
    }

    const existingItem = cartItems.find((item) => item.id === product.id)

    let updatedCart
    if (existingItem) {
      // Check if adding one more would exceed stock
      const newQuantity = existingItem.quantity + 1
      if (newQuantity > (product.stock || 0)) {
        alert(`Số lượng tồn kho không đủ. Chỉ còn ${product.stock} sản phẩm.`)
        return
      }
      updatedCart = cartItems.map((item) => (item.id === product.id ? { ...item, quantity: newQuantity } : item))
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
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      removeFromCart(productId)
      return
    }

    const cartItem = cartItems.find((item) => item.id === productId)
    if (cartItem && cartItem.stock !== undefined && quantity > cartItem.stock) {
      alert(`Số lượng tồn kho không đủ. Chỉ còn ${cartItem.stock} sản phẩm.`)
      // Set quantity to max stock available
      quantity = cartItem.stock
    }

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
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <>
              <Header user={user} onLogout={handleLogout} cartCount={cartItems.length} />
              <Home />
              <Footer />
            </>
          }
        />
        <Route
          path="/shop"
          element={
            <>
              <Header user={user} onLogout={handleLogout} cartCount={cartItems.length} />
              <Shop onAddToCart={addToCart} />
              <Footer />
            </>
          }
        />
        <Route
          path="/product/:id"
          element={
            <>
              <Header user={user} onLogout={handleLogout} cartCount={cartItems.length} />
              <ProductDetail onAddToCart={addToCart} />
              <Footer />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <Header user={user} onLogout={handleLogout} cartCount={cartItems.length} />
              <About />
              <Footer />
            </>
          }
        />
        <Route
          path="/login"
          element={user ? <Navigate to={user.role === "admin" ? "/admin" : "/"} replace /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" replace /> : <Register />}
        />

        {/* Protected Customer Routes (Admin cũng có thể truy cập) */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute user={user} requiredRole="customer">
              <Header user={user} onLogout={handleLogout} cartCount={cartItems.length} />
              <Cart items={cartItems} onRemove={removeFromCart} onUpdateQuantity={updateCartQuantity} />
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute user={user} requiredRole="customer">
              <Header user={user} onLogout={handleLogout} cartCount={cartItems.length} />
              <Checkout cartItems={cartItems} onClearCart={clearCart} user={user} />
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute user={user}>
              <Header user={user} onLogout={handleLogout} cartCount={cartItems.length} />
              <Account user={user} onLogout={handleLogout} onUserUpdate={handleUserUpdate} />
              <Footer />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user} requiredRole="admin">
              <AdminLayout user={user} onLogout={handleLogout}>
                <AdminDashboard user={user} />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute user={user} requiredRole="admin">
              <AdminLayout user={user} onLogout={handleLogout}>
                <AdminProducts user={user} />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute user={user} requiredRole="admin">
              <AdminLayout user={user} onLogout={handleLogout}>
                <AdminCategories user={user} />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        { <Route
          path="/admin/users"
          element={
            <ProtectedRoute user={user} requiredRole="admin">
              <AdminLayout user={user} onLogout={handleLogout}>
                <AdminUsers user={user} />
              </AdminLayout>
            </ProtectedRoute>
          }
        /> }
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute user={user} requiredRole="admin">
              <AdminLayout user={user} onLogout={handleLogout}>
                <AdminOrders user={user} />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
