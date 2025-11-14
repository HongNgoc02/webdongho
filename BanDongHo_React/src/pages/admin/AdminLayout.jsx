import { useNavigate, Link } from "react-router-dom"
import "./AdminLayout.css"

function AdminLayout({ children, user, onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate("/login")
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span className="logo-icon">⌚</span>
          <span className="logo-text">Chrono Admin</span>
        </div>

        <nav className="admin-nav">
          <Link to="/admin" className="nav-item">
            <span className="nav-icon">📊</span>
            <span>Bảng Điều Khiển</span>
          </Link>
          <Link to="/admin/products" className="nav-item">
            <span className="nav-icon">📦</span>
            <span>Sản Phẩm</span>
          </Link>
          <Link to="/admin/orders" className="nav-item">
            <span className="nav-icon">📋</span>
            <span>Đơn Hàng</span>
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
          <h1>Bảng Điều Khiển Quản Trị</h1>
          <p>Quản lý cửa hàng đồng hồ của bạn</p>
        </div>
        {children}
      </main>
    </div>
  )
}

export default AdminLayout
