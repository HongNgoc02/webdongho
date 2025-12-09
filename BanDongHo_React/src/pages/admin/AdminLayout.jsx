import { useNavigate, Link, useLocation } from "react-router-dom"
import "./AdminLayout.css"

function AdminLayout({ children, user, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    onLogout()
    navigate("/login")
  }

  // Get page title based on route
  const getPageTitle = () => {
    if (location.pathname === "/admin") return "Bảng Điều Khiển"
    if (location.pathname === "/admin/products") return "Quản Lý Sản Phẩm"
    if (location.pathname === "/admin/categories") return "Quản Lý Danh Mục"
    // if (location.pathname === "/admin/users") return "Quản Lý Người Dùng"
    if (location.pathname === "/admin/orders") return "Quản Lý Đơn Hàng"
    return "Quản Trị"
  }

  const getPageDescription = () => {
    if (location.pathname === "/admin") return "Tổng quan về cửa hàng đồng hồ của bạn"
    if (location.pathname === "/admin/products") return "Thêm, sửa, xóa sản phẩm"
    if (location.pathname === "/admin/categories") return "Thêm, sửa, xóa danh mục sản phẩm"
    // if (location.pathname === "/admin/users") return "Xem, sửa, xóa thông tin người dùng"
    if (location.pathname === "/admin/orders") return "Xem và quản lý đơn hàng"
    return "Quản lý cửa hàng đồng hồ của bạn"
  }

  // Check if nav item is active
  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span className="logo-icon">⌚</span>
          <span className="logo-text">BanDongHo Admin</span>
        </div>

        <nav className="admin-nav">
          <Link 
            to="/admin" 
            className={`nav-item ${isActive("/admin") ? "active" : ""}`}
          >
            <span className="nav-icon">📊</span>
            <span>Bảng Điều Khiển</span>
          </Link>
          <Link 
            to="/admin/products" 
            className={`nav-item ${isActive("/admin/products") ? "active" : ""}`}
          >
            <span className="nav-icon">📦</span>
            <span>Sản Phẩm</span>
          </Link>
          <Link 
            to="/admin/categories" 
            className={`nav-item ${isActive("/admin/categories") ? "active" : ""}`}
          >
            <span className="nav-icon">🏷️</span>
            <span>Danh Mục</span>
          </Link>
          { <Link 
            to="/admin/users" 
            className={`nav-item ${isActive("/admin/users") ? "active" : ""}`}
          >
            <span className="nav-icon">👥</span>
            <span>Người Dùng</span>
          </Link> }
          <Link 
            to="/admin/orders" 
            className={`nav-item ${isActive("/admin/orders") ? "active" : ""}`}
          >
            <span className="nav-icon">📋</span>
            <span>Đơn Hàng</span>
          </Link>
          <Link 
            to="/" 
            className="nav-item"
          >
            <span className="nav-icon">🏠</span>
            <span>Trang Chủ</span>
          </Link>
        </nav>

        <div className="admin-user">
          <div className="admin-user-info">
            <div className="avatar">👤</div>
            <div>
              <p className="user-name">{user?.name || "Quản Trị"}</p>
              <p className="user-role">Quản Trị Viên</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Đăng Xuất
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <h1>{getPageTitle()}</h1>
          <p>{getPageDescription()}</p>
        </div>
        {children}
      </main>
    </div>
  )
}

export default AdminLayout
