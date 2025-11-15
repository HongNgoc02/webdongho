import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import "./Checkout.css"

function Checkout({ cartItems, onClearCart, user }) {
  const navigate = useNavigate()
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Simulate order placement
    const order = {
      id: `ORD${Date.now()}`,
      date: new Date().toISOString(),
      items: cartItems,
      total: calculateTotal(),
      customer: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        address: formData.address,
      },
    }

    localStorage.setItem("lastOrder", JSON.stringify(order))
    setOrderPlaced(true)
    onClearCart()

    setTimeout(() => {
      navigate("/account")
    }, 3000)
  }

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = subtotal > 100 ? 0 : 10
    return subtotal + shipping
  }

  if (orderPlaced) {
    return (
      <div className="checkout success-page">
        <div className="success-content">
          <div className="success-icon">✓</div>
          <h1>Đặt Hàng Thành Công!</h1>
          <p>Cảm ơn bạn đã mua hàng. Xác nhận đơn hàng đã được gửi đến email của bạn.</p>
          <div className="order-details">
            <p>
              <strong>Mã Đơn Hàng:</strong> {`ORD${Date.now()}`.slice(0, 10)}
            </p>
            <p>
              <strong>Tổng Tiền:</strong> ${calculateTotal().toFixed(2)}
            </p>
          </div>
          <p className="redirect-text">Đang chuyển hướng đến tài khoản của bạn...</p>
          <Link to="/account" className="btn-primary">
            Xem Đơn Hàng
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout">
      <div className="container">
        <h1>Thanh Toán</h1>

        <div className="checkout-content">
          <form onSubmit={handleSubmit} className="checkout-form">
            <section className="form-section">
              <h2>Địa Chỉ Giao Hàng</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">Họ *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Tên *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Địa Chỉ Email *</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Số Điện Thoại *</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="address">Địa Chỉ *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">Thành Phố *</label>
                  <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="state">Tỉnh/Thành *</label>
                  <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="zipCode">Mã Bưu Điện *</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </section>

            <section className="form-section">
              <h2>Thông Tin Thanh Toán</h2>
              <div className="form-group">
                <label htmlFor="cardName">Tên Chủ Thẻ *</label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cardNumber">Số Thẻ *</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiry">Ngày Hết Hạn *</label>
                  <input
                    type="text"
                    id="expiry"
                    name="expiry"
                    placeholder="MM/YY"
                    value={formData.expiry}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cvv">CVV *</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </section>

            <button type="submit" className="btn-place-order">
              Đặt Hàng
            </button>
          </form>

          <div className="order-summary">
            <h2>Tóm Tắt Đơn Hàng</h2>
            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item.id} className="summary-item">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Tạm Tính:</span>
                <span>${cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Vận Chuyển:</span>
                <span>
                  {cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) > 100 ? "Miễn Phí" : "$10.00"}
                </span>
              </div>
              <div className="summary-row total">
                <span>Tổng Cộng:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
