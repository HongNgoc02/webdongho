import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import "./Header.css"

function Header({ user, onLogout, cartCount }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">✨</span>
          <span className="logo-text">Chrono</span>
        </Link>

        <nav className={`nav ${mobileMenuOpen ? "open" : ""}`}>
          <Link 
            to="/" 
            className={location.pathname === "/" ? "active" : ""}
            onClick={() => setMobileMenuOpen(false)}
          >
            Trang Chủ
          </Link>
          <Link 
            to="/shop" 
            className={location.pathname === "/shop" ? "active" : ""}
            onClick={() => setMobileMenuOpen(false)}
          >
            Cửa Hàng
          </Link>
          <Link 
            to="/about" 
            className={location.pathname === "/about" ? "active" : ""}
            onClick={() => setMobileMenuOpen(false)}
          >
            Giới Thiệu
          </Link>
          <Link 
            to="/contact" 
            className={location.pathname === "/contact" ? "active" : ""}
            onClick={() => setMobileMenuOpen(false)}
          >
            Liên Hệ
          </Link>
        </nav>

        <div className="header-actions">
          <Link to="/cart" className="cart-link">
            <span className="cart-icon">🛍️</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <span className="user-name">👤 {user.name}</span>
              <Link to="/account" className="btn-secondary">
                Tài Khoản
              </Link>
              <button onClick={onLogout} className="btn-logout">
                Đăng Xuất
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary">
              Đăng Nhập
            </Link>
          )}
        </div>

        <button 
          className={`mobile-menu-btn ${mobileMenuOpen ? "active" : ""}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Chuyển đổi menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  )
}

export default Header
