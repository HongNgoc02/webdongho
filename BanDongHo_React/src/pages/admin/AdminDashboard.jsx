import { useState, useEffect } from "react"
import { orderAPI, productAPI, categoryAPI } from "../../services/api"
import "./AdminDashboard.css"

function AdminDashboard({ user }) {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCategories: 0,
    avgOrderValue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    deliveredOrders: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError("")

      // Load all data in parallel
      const [ordersRes, productsRes, categoriesRes] = await Promise.all([
        orderAPI.getAllOrders(),
        productAPI.getAllProducts(),
        categoryAPI.getAllCategories(),
      ])

      const orders = ordersRes.success ? ordersRes.data || [] : []
      const products = productsRes.success ? productsRes.data || [] : []
      const categories = categoriesRes.success ? categoriesRes.data || [] : []

      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => {
        return sum + (parseFloat(order.totalAmount) || 0)
      }, 0)

      const totalOrders = orders.length
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

      const pendingOrders = orders.filter((o) => o.status === "PENDING").length
      const processingOrders = orders.filter((o) => o.status === "PROCESSING").length
      const deliveredOrders = orders.filter((o) => o.status === "DELIVERED").length

      // Get recent orders (last 5)
      const sortedOrders = [...orders].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0)
        const dateB = new Date(b.createdAt || 0)
        return dateB - dateA
      })
      const recent = sortedOrders.slice(0, 5)

      // Get top products (by reviews or rating)
      const sortedProducts = [...products]
        .sort((a, b) => {
          const ratingA = (a.rating || 0) * (a.reviews || 0)
          const ratingB = (b.rating || 0) * (b.reviews || 0)
          return ratingB - ratingA
        })
        .slice(0, 5)

      setStats({
        totalRevenue,
        totalOrders,
        totalProducts: products.length,
        totalCategories: categories.length,
        avgOrderValue,
        pendingOrders,
        processingOrders,
        deliveredOrders,
      })
      setRecentOrders(recent)
      setTopProducts(sortedProducts)
    } catch (err) {
      setError(err.message || "Không thể tải dữ liệu dashboard")
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    if (!price) return "0"
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleString("vi-VN")
  }

  const getStatusLabel = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "Chờ Xử Lý"
      case "PROCESSING":
        return "Đang Xử Lý"
      case "DELIVERED":
        return "Đã Giao"
      case "CANCELLED":
        return "Đã Hủy"
      default:
        return status || "-"
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "status-pending"
      case "PROCESSING":
        return "status-processing"
      case "DELIVERED":
        return "status-delivered"
      case "CANCELLED":
        return "status-cancelled"
      default:
        return ""
    }
  }

  const statCards = [
    {
      label: "Tổng Doanh Thu",
      value: formatPrice(stats.totalRevenue),
      icon: "💰",
      color: "stat-revenue",
    },
    {
      label: "Tổng Đơn Hàng",
      value: stats.totalOrders,
      icon: "📦",
      color: "stat-orders",
    },
    {
      label: "Tổng Sản Phẩm",
      value: stats.totalProducts,
      icon: "🏷️",
      color: "stat-products",
    },
    {
      label: "Tổng Danh Mục",
      value: stats.totalCategories,
      icon: "📂",
      color: "stat-categories",
    },
    {
      label: "Giá Trị Đơn Trung Bình",
      value: formatPrice(stats.avgOrderValue),
      icon: "📈",
      color: "stat-avg",
    },
    {
      label: "Đơn Chờ Xử Lý",
      value: stats.pendingOrders,
      icon: "⏳",
      color: "stat-pending",
    },
    {
      label: "Đơn Đang Xử Lý",
      value: stats.processingOrders,
      icon: "⚙️",
      color: "stat-processing",
    },
    {
      label: "Đơn Đã Giao",
      value: stats.deliveredOrders,
      icon: "✅",
      color: "stat-delivered",
    },
  ]

  return (
    <div className="admin-content">
      <div className="admin-dashboard-container">
        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Đang tải dữ liệu...</div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="dashboard-stats-grid">
              {statCards.map((stat, idx) => (
                <div key={idx} className={`stat-card ${stat.color}`}>
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-content">
                    <p className="stat-label">{stat.label}</p>
                    <p className="stat-value">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders and Top Products */}
            <div className="dashboard-sections">
              <section className="dashboard-section">
                <div className="section-header">
                  <h2>Đơn Hàng Gần Đây</h2>
                </div>
                {recentOrders.length === 0 ? (
                  <div className="empty-state">Chưa có đơn hàng nào</div>
                ) : (
                  <div className="table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Mã Đơn</th>
                          <th>Khách Hàng</th>
                          <th>Tổng Tiền</th>
                          <th>Trạng Thái</th>
                          <th>Ngày Đặt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => (
                          <tr key={order.id}>
                            <td>
                              <strong className="order-number">
                                {order.orderNumber || `#${order.id}`}
                              </strong>
                            </td>
                            <td>{order.userName || order.userEmail || "N/A"}</td>
                            <td className="amount">{formatPrice(order.totalAmount)}</td>
                            <td>
                              <span className={`status-badge ${getStatusColor(order.status)}`}>
                                {getStatusLabel(order.status)}
                              </span>
                            </td>
                            <td>{formatDate(order.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              <section className="dashboard-section">
                <div className="section-header">
                  <h2>Sản Phẩm Nổi Bật</h2>
                </div>
                {topProducts.length === 0 ? (
                  <div className="empty-state">Chưa có sản phẩm nào</div>
                ) : (
                  <div className="products-list">
                    {topProducts.map((product) => (
                      <div key={product.id} className="product-item">
                        <div className="product-info">
                          {product.imageUrl && (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="product-thumb"
                            />
                          )}
                          <div className="product-details">
                            <strong className="product-name">{product.name}</strong>
                            <p className="product-category">{product.categoryName || "N/A"}</p>
                          </div>
                        </div>
                        <div className="product-stats">
                          <div className="product-price">{formatPrice(product.price)}</div>
                          <div className="product-rating">
                            {product.rating ? `⭐ ${product.rating}` : "-"}
                            {product.reviews > 0 && ` (${product.reviews})`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
