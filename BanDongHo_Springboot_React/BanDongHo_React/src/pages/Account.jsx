import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Account.css"

function Account({ user, onLogout }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("profile")
  const lastOrder = JSON.parse(localStorage.getItem("lastOrder"))

  const handleLogout = () => {
    onLogout()
    navigate("/login")
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
              onClick={() => setActiveTab("profile")}
            >
              Hồ Sơ
            </button>
            <button
              className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              Đơn Hàng Của Tôi
            </button>
            <button
              className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              Cài Đặt
            </button>
            <button onClick={handleLogout} className="btn-logout">
              Đăng Xuất
            </button>
          </aside>

          <main className="account-main">
            {activeTab === "profile" && (
              <section className="tab-content">
                <h2>Thông Tin Hồ Sơ</h2>
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
                    <label>Loại Tài Khoản</label>
                    <p className="account-type">Khách Hàng</p>
                  </div>
                  <div className="info-group">
                    <label>Thành Viên Từ</label>
                    <p>Tháng 11 năm 2024</p>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "orders" && (
              <section className="tab-content">
                <h2>Lịch Sử Đơn Hàng</h2>
                {lastOrder ? (
                  <div className="orders-list">
                    <div className="order-card">
                      <div className="order-header">
                        <div>
                          <h3>Mã Đơn Hàng: {lastOrder.id}</h3>
                          <p>Đặt vào {new Date(lastOrder.date).toLocaleDateString("vi-VN")}</p>
                        </div>
                        <span className="order-status">Đang Xử Lý</span>
                      </div>
                      <div className="order-items">
                        <h4>Sản Phẩm:</h4>
                        <ul>
                          {lastOrder.items.map((item) => (
                            <li key={item.id}>
                              {item.name} x {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="order-total">
                        <strong>Tổng: ${lastOrder.total.toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="no-orders">
                    <p>Bạn chưa đặt đơn hàng nào.</p>
                  </div>
                )}
              </section>
            )}

            {activeTab === "settings" && (
              <section className="tab-content">
                <h2>Cài Đặt</h2>
                <div className="settings-group">
                  <h3>Tùy Chọn</h3>
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    Nhận email khuyến mãi
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    Nhận cập nhật đơn hàng
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    Đăng ký nhận bản tin
                  </label>
                </div>

                <div className="settings-group">
                  <h3>Bảo Mật</h3>
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    Chia sẻ thông tin hồ sơ
                  </label>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Account
