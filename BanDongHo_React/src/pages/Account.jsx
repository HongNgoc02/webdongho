import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { orderAPI, userAPI } from "../services/api"
import "./Account.css"

function Account({ user, onLogout, onUserUpdate }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState("profile")
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  // Form states
  const [editMode, setEditMode] = useState(false)
  const [changePasswordMode, setChangePasswordMode] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Set active tab from URL query parameter
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "orders") {
      setActiveTab("orders")
    } else {
      setActiveTab("profile")
    }
  }, [searchParams])

  useEffect(() => {
    if (user && user.id) {
      loadOrders()
      setFormData({
        fullName: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
      })
    }
  }, [user])

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await orderAPI.getOrdersByUserId(user.id)
      if (response.success) {
        setOrders(response.data || [])
      }
    } catch (err) {
      setError(err.message || "Không thể tải lịch sử đơn hàng")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    onLogout()
    navigate("/login")
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError("")
      setSuccess("")

      const updateData = {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
      }

      const response = await userAPI.updateUser(user.id, updateData)
      if (response.success) {
        setSuccess("Cập nhật thông tin thành công!")
        setEditMode(false)
        // Update user in parent component - map fullName to name
        if (onUserUpdate && response.data) {
          const updatedUser = {
            ...response.data,
            name: response.data.fullName || response.data.name,
          }
          onUserUpdate(updatedUser)
        }
        setTimeout(() => setSuccess(""), 3000)
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi cập nhật thông tin")
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError("")
      setSuccess("")

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError("Mật khẩu mới và xác nhận mật khẩu không khớp")
        return
      }

      if (passwordData.newPassword.length < 6) {
        setError("Mật khẩu mới phải có ít nhất 6 ký tự")
        return
      }

      // Verify current password by attempting login
      try {
        await userAPI.login(user.email, passwordData.currentPassword)
      } catch (err) {
        setError("Mật khẩu hiện tại không đúng")
        return
      }

      const updateData = {
        password: passwordData.newPassword,
      }

      const response = await userAPI.updateUser(user.id, updateData)
      if (response.success) {
        setSuccess("Đổi mật khẩu thành công!")
        setChangePasswordMode(false)
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
        setTimeout(() => setSuccess(""), 3000)
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi đổi mật khẩu")
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

  return (
    <div className="account">
      <div className="container">
        <div className="account-header">
          <h1>Tài Khoản Của Tôi</h1>
          <p>Chào mừng trở lại, {user?.name || "Người Dùng"}!</p>
        </div>

        <div className="account-content">
          <aside className="account-sidebar">
            <button
              className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("profile")
                setEditMode(false)
                setChangePasswordMode(false)
              }}
            >
              Hồ Sơ
            </button>
            <button
              className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("orders")
                setEditMode(false)
                setChangePasswordMode(false)
              }}
            >
              Đơn Hàng Của Tôi
            </button>
            <button onClick={handleLogout} className="btn-logout">
              Đăng Xuất
            </button>
          </aside>

          <main className="account-main">
            {activeTab === "profile" && (
              <section className="tab-content">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <h2>Thông Tin Hồ Sơ</h2>
                  {!editMode && !changePasswordMode && (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        className="btn-edit"
                        onClick={() => {
                          setEditMode(true)
                          setChangePasswordMode(false)
                        }}
                      >
                        Chỉnh Sửa
                      </button>
                      <button
                        className="btn-change-password"
                        onClick={() => {
                          setChangePasswordMode(true)
                          setEditMode(false)
                        }}
                      >
                        Đổi Mật Khẩu
                      </button>
                    </div>
                  )}
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                {changePasswordMode ? (
                  <form onSubmit={handleChangePassword} className="profile-form">
                    <h3>Đổi Mật Khẩu</h3>
                    <div className="form-group">
                      <label htmlFor="currentPassword">Mật Khẩu Hiện Tại *</label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="newPassword">Mật Khẩu Mới *</label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirmPassword">Xác Nhận Mật Khẩu Mới *</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? "Đang xử lý..." : "Đổi Mật Khẩu"}
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => {
                          setChangePasswordMode(false)
                          setPasswordData({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          })
                          setError("")
                        }}
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                ) : editMode ? (
                  <form onSubmit={handleUpdateProfile} className="profile-form">
                    <h3>Cập Nhật Thông Tin</h3>
                    <div className="form-group">
                      <label htmlFor="fullName">Họ Tên *</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled
                        style={{ backgroundColor: "#f1f5f9", cursor: "not-allowed" }}
                      />
                      <small style={{ color: "#64748b", fontSize: "0.875rem" }}>Email không thể thay đổi</small>
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Số Điện Thoại *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="address">Địa Chỉ *</label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        rows="3"
                      />
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? "Đang xử lý..." : "Lưu Thay Đổi"}
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => {
                          setEditMode(false)
                          setFormData({
                            fullName: user?.name || "",
                            email: user?.email || "",
                            phone: user?.phone || "",
                            address: user?.address || "",
                          })
                          setError("")
                        }}
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="profile-info">
                    <div className="info-group">
                      <label>Họ Tên</label>
                      <p>{user?.name || "Chưa thiết lập"}</p>
                    </div>
                    <div className="info-group">
                      <label>Email</label>
                      <p>{user?.email || "Chưa thiết lập"}</p>
                    </div>
                    <div className="info-group">
                      <label>Số Điện Thoại</label>
                      <p>{user?.phone || "Chưa thiết lập"}</p>
                    </div>
                    <div className="info-group">
                      <label>Địa Chỉ</label>
                      <p>{user?.address || "Chưa thiết lập"}</p>
                    </div>
                    <div className="info-group">
                      <label>Loại Tài Khoản</label>
                      <p className="account-type">
                        {user?.role === "admin" ? "Quản Trị Viên" : "Khách Hàng"}
                      </p>
                    </div>
                  </div>
                )}
              </section>
            )}

            {activeTab === "orders" && (
              <section className="tab-content">
                <h2>Lịch Sử Đơn Hàng</h2>
                {error && <div className="error-message">{error}</div>}
                {loading ? (
                  <div className="loading">Đang tải...</div>
                ) : orders.length > 0 ? (
                  <div className="orders-list">
                    {orders.map((order) => (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <div>
                            <h3>Mã Đơn Hàng: {order.orderNumber || `#${order.id}`}</h3>
                            <p>Đặt vào {formatDate(order.createdAt)}</p>
                          </div>
                          <span className={`order-status ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                        <div className="order-items">
                          <h4>Sản Phẩm:</h4>
                          <div className="order-items-list">
                            {order.orderItems?.map((item, idx) => (
                              <div key={idx} className="order-item-row">
                                {item.productImageUrl && (
                                  <img 
                                    src={item.productImageUrl} 
                                    alt={item.productName || "Product"} 
                                    className="order-item-image"
                                    onError={(e) => {
                                      e.target.src = "/placeholder.svg"
                                    }}
                                  />
                                )}
                                <div className="order-item-details">
                                  <span className="order-item-name">{item.productName || "N/A"}</span>
                                  <span className="order-item-quantity">Số lượng: {item.quantity || 0}</span>
                                </div>
                                <span className="order-item-price">{formatPrice(item.subtotal || (item.price ? item.price * (item.quantity || 0) : 0))}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="order-footer">
                          <div className="order-shipping">
                            <p>
                              <strong>Địa chỉ giao hàng:</strong> {order.shippingAddress || "N/A"}
                            </p>
                            <p>
                              <strong>Số điện thoại:</strong> {order.phoneNumber || "N/A"}
                            </p>
                          </div>
                          <div className="order-total">
                            <strong>Tổng: {formatPrice(order.totalAmount)}</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-orders">
                    <p>Bạn chưa đặt đơn hàng nào.</p>
                    <a href="/shop" className="btn-primary" style={{ marginTop: "1rem", display: "inline-block" }}>
                      Mua Sắm Ngay
                    </a>
                  </div>
                )}
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Account
