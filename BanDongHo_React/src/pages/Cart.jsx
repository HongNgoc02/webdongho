import { Link } from "react-router-dom"
import "./Cart.css"

function Cart({ items, onRemove, onUpdateQuantity }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = total > 100 ? 0 : 10
  const finalTotal = total + shipping

  return (
    <div className="cart">
      <div className="container">
        <h1>Giỏ Hàng</h1>

        {items.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <h2>Giỏ hàng của bạn đang trống</h2>
            <p>Khám phá bộ sưu tập đồng hồ tuyệt vời của chúng tôi</p>
            <Link to="/shop" className="btn-primary">
              Tiếp Tục Mua Sắm
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Sản Phẩm</th>
                    <th>Giá</th>
                    <th>Số Lượng</th>
                    <th>Tổng</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="product-name">{item.name}</td>
                      <td className="price">${item.price}</td>
                      <td className="quantity">
                        <button onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}>−</button>
                        <input type="text" value={item.quantity} readOnly />
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                      </td>
                      <td className="subtotal">${(item.price * item.quantity).toFixed(2)}</td>
                      <td className="action">
                        <button onClick={() => onRemove(item.id)} className="btn-remove">
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="cart-summary">
              <div className="summary-card">
                <h3>Tóm Tắt Đơn Hàng</h3>
                <div className="summary-row">
                  <span>Tạm Tính:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Vận Chuyển:</span>
                  <span>{shipping === 0 ? "Miễn Phí" : `$${shipping.toFixed(2)}`}</span>
                </div>
                {shipping === 0 && <div className="promo">✓ Áp dụng miễn phí vận chuyển!</div>}
                <div className="summary-row total">
                  <span>Tổng Cộng:</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
                <Link to="/checkout" className="btn-checkout">
                  Thanh Toán
                </Link>
                <Link to="/shop" className="btn-continue">
                  Tiếp Tục Mua Sắm
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
