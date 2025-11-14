import { mockProducts, mockOrders } from "../../data/mockData"
import AdminLayout from "./AdminLayout"
import "./AdminDashboard.css"

function AdminDashboard({ user, onLogout }) {
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = mockOrders.length
  const totalProducts = mockProducts.length
  const avgOrderValue = (totalRevenue / totalOrders).toFixed(2)

  const stats = [
    { label: "Tổng Doanh Thu", value: `$${totalRevenue.toFixed(2)}`, icon: "💰" },
    { label: "Tổng Đơn Hàng", value: totalOrders, icon: "📦" },
    { label: "Tổng Sản Phẩm", value: totalProducts, icon: "🏷️" },
    { label: "Giá Trị Đơn Trung Bình", value: `$${avgOrderValue}`, icon: "📈" },
  ]

  return (
    <AdminLayout user={user} onLogout={onLogout}>
      <div className="dashboard-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-sections">
        <section className="dashboard-section">
          <h2>Đơn Hàng Gần Đây</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã Đơn Hàng</th>
                <th>Khách Hàng</th>
                <th>Tổng Tiền</th>
                <th>Trạng Thái</th>
                <th>Ngày</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong>{order.id}</strong>
                  </td>
                  <td>{order.user}</td>
                  <td className="amount">${order.total.toFixed(2)}</td>
                  <td>
                    <span className={`status ${order.status.toLowerCase()}`}>
                      {order.status === "Pending" ? "Chờ Xử Lý" : order.status === "Processing" ? "Đang Xử Lý" : "Đã Giao"}
                    </span>
                  </td>
                  <td>{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="dashboard-section">
          <h2>Sản Phẩm Bán Chạy</h2>
          <div className="products-list">
            {mockProducts.slice(0, 5).map((product) => (
              <div key={product.id} className="product-item">
                <div className="product-name">
                  <strong>{product.name}</strong>
                  <p>{product.category}</p>
                </div>
                <div className="product-price">${product.price}</div>
                <div className="product-rating">⭐ {product.rating}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
