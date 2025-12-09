import { useState, useEffect, useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import "./Header.css"

function Header({ user, onLogout, cartCount }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false)
      }
    }

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [userMenuOpen])

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
            onClick={() => {
              setMobileMenuOpen(false)
              setUserMenuOpen(false)
            }}
          >
            Trang Chủ
          </Link>
          <Link 
            to="/shop" 
            className={location.pathname === "/shop" ? "active" : ""}
            onClick={() => {
              setMobileMenuOpen(false)
              setUserMenuOpen(false)
            }}
          >
            Cửa Hàng
          </Link>
          <Link 
            to="/about" 
            className={location.pathname === "/about" ? "active" : ""}
            onClick={() => {
              setMobileMenuOpen(false)
              setUserMenuOpen(false)
            }}
          >
            Giới Thiệu
          </Link>
        </nav>

        <div className="header-actions">
          {/* Cart icon - chỉ hiển thị cho customer, không hiển thị cho admin */}
          {(!user || user.role !== "admin") && (
            <Link to="/cart" className="cart-link">
              <span className="cart-icon">🛍️</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          )}

          {user ? (
            <div className="user-menu-wrapper" ref={userMenuRef}>
              <div 
                className="user-info-clickable"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="user-info">
                  <span className="user-avatar">👤</span>
                  <span className="user-name">{user.name}</span>
                </div>
                <span className={`user-menu-arrow ${userMenuOpen ? "open" : ""}`}>▼</span>
              </div>
              
              {userMenuOpen && (
                <div className="user-menu-dropdown">
                  {user.role === "admin" && (
                    <Link 
                      to="/admin" 
                      className="user-menu-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <span>⚙️</span>
                      <span>Quản Trị</span>
                    </Link>
                  )}
                  <Link 
                    to="/account?tab=orders" 
                    className="user-menu-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <span>👤</span>
                    <span>Tài Khoản</span>
                  </Link>
                  <div className="user-menu-divider"></div>
                  <button 
                    onClick={() => {
                      setUserMenuOpen(false)
                      onLogout()
                    }} 
                    className="user-menu-item logout"
                  >
                    <span>🚪</span>
                    <span>Đăng Xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-primary">
              Đăng Nhập
            </Link>
          )}
        </div>

        <button 
          className={`mobile-menu-btn ${mobileMenuOpen ? "active" : ""}`}
          onClick={() => {
            setMobileMenuOpen(!mobileMenuOpen)
            setUserMenuOpen(false)
          }}
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
