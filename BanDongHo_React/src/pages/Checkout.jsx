import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { orderAPI } from "../services/api"
import "./Checkout.css"

function Checkout({ cartItems, onClearCart, user }) {
  const navigate = useNavigate()
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [orderNumber, setOrderNumber] = useState("")
  const [formData, setFormData] = useState({
    shippingAddress: user?.address || "",
    phoneNumber: user?.phone || "",
  })

  const formatPrice = (price) => {
    if (!price) return "0"
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => {
      const itemPrice = parseFloat(item.price) || 0
      return sum + itemPrice * (item.quantity || 1)
    }, 0)
    return subtotal
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!user) {
      setError("Vui lòng đăng nhập để đặt hàng")
      return
    }

    if (cartItems.length === 0) {
      setError("Giỏ hàng của bạn đang trống")
      return
    }

    try {
      setLoading(true)
      setError("")

      // Convert cart items to order items format
      const orderItems = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity || 1,
        price: parseFloat(item.price) || 0,
      }))

      const checkoutData = {
        userId: user.id,
        shippingAddress: formData.shippingAddress,
        phoneNumber: formData.phoneNumber,
        cartItems: orderItems,
      }

      const response = await orderAPI.checkout(checkoutData)

      if (response.success && response.data) {
        setOrderNumber(response.data.orderNumber || `#${response.data.id}`)
        setOrderPlaced(true)
        onClearCart()

        setTimeout(() => {
          navigate("/account")
        }, 3000)
      } else {
        setError(response.message || "Đặt hàng thất bại")
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi đặt hàng")
    } finally {
      setLoading(false)
    }
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
              <strong>Mã Đơn Hàng:</strong> {orderNumber}
            </p>
            <p>
              <strong>Tổng Tiền:</strong> {formatPrice(calculateTotal())}
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

  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice = parseFloat(item.price) || 0
    return sum + itemPrice * (item.quantity || 1)
  }, 0)
  const finalTotal = subtotal

  return (
    <div className="checkout">
      <div className="container">
        <h1>Thanh Toán</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="checkout-content">
          <form onSubmit={handleSubmit} className="checkout-form">
            <section className="form-section">
              <h2>Địa Chỉ Giao Hàng</h2>
              <div className="form-group">
                <label htmlFor="shippingAddress">Địa Chỉ Giao Hàng *</label>
                <textarea
                  id="shippingAddress"
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Nhập địa chỉ giao hàng đầy đủ"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Số Điện Thoại *</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  placeholder="0123456789"
                />
              </div>
            </section>

            <button type="submit" className="btn-place-order" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đặt Hàng"}
            </button>
          </form>

          <div className="order-summary">
            <h2>Tóm Tắt Đơn Hàng</h2>
            <div className="summary-items">
              {cartItems.map((item) => {
                const itemPrice = parseFloat(item.price) || 0
                const quantity = item.quantity || 1
                return (
                  <div key={item.id} className="summary-item">
                    <span>
                      {item.name || "N/A"} x {quantity}
                    </span>
                    <span>{formatPrice(itemPrice * quantity)}</span>
                  </div>
                )
              })}
            </div>

            <div className="summary-totals">
              <div className="summary-row total">
                <span>Tổng Cộng:</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
