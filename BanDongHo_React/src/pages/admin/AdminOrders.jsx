import { useState, useEffect } from "react"
import { orderAPI } from "../../services/api"
import "./AdminOrders.css"

function AdminOrders({ user }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState("")

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await orderAPI.getAllOrders()
      if (response.success) {
        setOrders(response.data || [])
      }
    } catch (err) {
      setError(err.message || "Không thể tải danh sách đơn hàng")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      loadOrders()
      return
    }

    try {
      setLoading(true)
      setError("")
      const response = await orderAPI.searchOrders(searchKeyword)
      if (response.success) {
        setOrders(response.data || [])
      }
    } catch (err) {
      setError(err.message || "Không thể tìm kiếm đơn hàng")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setError("")
      const order = orders.find((o) => o.id === orderId)
      if (!order) return

      const response = await orderAPI.updateOrder(orderId, {
        ...order,
        status: newStatus,
      })

      if (response.success) {
        await loadOrders()
        alert("Cập nhật trạng thái đơn hàng thành công!")
      }
    } catch (err) {
      setError(err.message || "Không thể cập nhật trạng thái đơn hàng")
    }
  }

  const handleViewOrder = async (orderId) => {
    try {
      setError("")
      const response = await orderAPI.getOrderById(orderId)
      if (response.success) {
        setSelectedOrder(response.data)
      }
    } catch (err) {
      setError(err.message || "Không thể tải chi tiết đơn hàng")
    }
  }

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) return

    try {
      setError("")
      const response = await orderAPI.deleteOrder(orderId)
      if (response.success) {
        await loadOrders()
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null)
        }
        alert("Xóa đơn hàng thành công!")
      }
    } catch (err) {
      setError(err.message || "Không thể xóa đơn hàng")
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

  return (
    <div className="admin-content">
      <div className="admin-orders-container">
        {error && <div className="error-message">{error}</div>}

        <div className="section-header">
          <h2>Quản Lý Đơn Hàng ({orders.length})</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn, email, tên khách hàng..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="search-input"
            />
            <button className="btn-search" onClick={handleSearch}>
              🔍 Tìm Kiếm
            </button>
            {searchKeyword && (
              <button className="btn-clear" onClick={() => {
                setSearchKeyword("")
                loadOrders()
              }}>
                ✕
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Mã Đơn</th>
                    <th>Khách Hàng</th>
                    <th>Email</th>
                    <th>Sản Phẩm</th>
                    <th>Tổng Tiền</th>
                    <th>Trạng Thái</th>
                    <th>Ngày Đặt</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="empty-state">
                        {searchKeyword ? "Không tìm thấy đơn hàng nào" : "Chưa có đơn hàng nào"}
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <strong className="order-number">{order.orderNumber || `#${order.id}`}</strong>
                        </td>
                        <td>{order.userName || "N/A"}</td>
                        <td>{order.userEmail || "N/A"}</td>
                        <td>
                          <div className="order-items-info">
                            <span className="items-count">
                              {order.orderItems?.length || 0} sản phẩm
                            </span>
                            {order.orderItems && order.orderItems.length > 0 && (
                              <ul className="items-list">
                                {order.orderItems.slice(0, 2).map((item, idx) => (
                                  <li key={idx}>
                                    {item.productName || "N/A"} x {item.quantity}
                                  </li>
                                ))}
                                {order.orderItems.length > 2 && (
                                  <li className="more-items">+{order.orderItems.length - 2} sản phẩm khác</li>
                                )}
                              </ul>
                            )}
                          </div>
                        </td>
                        <td className="amount">{formatPrice(order.totalAmount)}</td>
                        <td>
                          <select
                            value={order.status || "PENDING"}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`status-select ${getStatusColor(order.status)}`}
                          >
                            <option value="PENDING">Chờ Xử Lý</option>
                            <option value="PROCESSING">Đang Xử Lý</option>
                            <option value="DELIVERED">Đã Giao</option>
                            <option value="CANCELLED">Đã Hủy</option>
                          </select>
                        </td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td className="actions">
                          <button
                            className="btn-view"
                            onClick={() => handleViewOrder(order.id)}
                          >
                            Xem
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
              <div className="order-modal" onClick={() => setSelectedOrder(null)}>
                <div className="order-modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>Chi Tiết Đơn Hàng: {selectedOrder.orderNumber || `#${selectedOrder.id}`}</h3>
                    <button className="btn-close" onClick={() => setSelectedOrder(null)}>×</button>
                  </div>
                  <div className="order-details">
                    <div className="detail-section">
                      <h4>Thông Tin Khách Hàng</h4>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <span className="detail-label">Tên:</span>
                          <span className="detail-value">{selectedOrder.userName || "N/A"}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Email:</span>
                          <span className="detail-value">{selectedOrder.userEmail || "N/A"}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Số Điện Thoại:</span>
                          <span className="detail-value">{selectedOrder.phoneNumber || "N/A"}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Địa Chỉ Giao Hàng:</span>
                          <span className="detail-value">{selectedOrder.shippingAddress || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h4>Sản Phẩm</h4>
                      <table className="order-items-table">
                        <thead>
                          <tr>
                            <th>Sản Phẩm</th>
                            <th>Số Lượng</th>
                            <th>Đơn Giá</th>
                            <th>Thành Tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.orderItems?.map((item, idx) => (
                            <tr key={idx}>
                              <td>{item.productName || "N/A"}</td>
                              <td>{item.quantity || 0}</td>
                              <td>{formatPrice(item.price)}</td>
                              <td>{formatPrice(item.subtotal)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="3" className="total-label">
                              <strong>Tổng Tiền:</strong>
                            </td>
                            <td className="total-amount">
                              <strong>{formatPrice(selectedOrder.totalAmount)}</strong>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    <div className="detail-section">
                      <h4>Thông Tin Đơn Hàng</h4>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <span className="detail-label">Trạng Thái:</span>
                          <span className={`status-badge ${getStatusColor(selectedOrder.status)}`}>
                            {getStatusLabel(selectedOrder.status)}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Ngày Đặt:</span>
                          <span className="detail-value">{formatDate(selectedOrder.createdAt)}</span>
                        </div>
                        {selectedOrder.updatedAt && (
                          <div className="detail-item">
                            <span className="detail-label">Cập Nhật Lần Cuối:</span>
                            <span className="detail-value">{formatDate(selectedOrder.updatedAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminOrders
