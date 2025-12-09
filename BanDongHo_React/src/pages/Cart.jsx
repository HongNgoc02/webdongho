import { Link } from "react-router-dom"
import "./Cart.css"

function Cart({ items, onRemove, onUpdateQuantity }) {
  const formatPrice = (price) => {
    if (!price) return "0"
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const subtotal = items.reduce((sum, item) => {
    const itemPrice = parseFloat(item.price) || 0
    return sum + itemPrice * (item.quantity || 1)
  }, 0)

  const finalTotal = subtotal

  // Check if any item is out of stock or has invalid quantity
  const hasOutOfStockItems = items.some((item) => item.stock !== undefined && item.stock === 0)
  const hasInvalidQuantities = items.some((item) => item.stock !== undefined && item.stock > 0 && item.quantity > item.stock)

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
                  {items.map((item) => {
                    const itemPrice = parseFloat(item.price) || 0
                    const quantity = item.quantity || 1
                    const itemTotal = itemPrice * quantity

                    return (
                      <tr key={item.id}>
                        <td className="product-cell">
                          <div className="product-info">
                            {item.imageUrl && (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="product-thumb"
                                onError={(e) => {
                                  e.target.src = "/placeholder.svg"
                                }}
                              />
                            )}
                            <div>
                              <div className="product-name">{item.name || "N/A"}</div>
                              {item.description && (
                                <div className="product-desc">{item.description.substring(0, 50)}...</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="price">{formatPrice(itemPrice)}</td>
                        <td className="quantity">
                          <div className="quantity-controls">
                            <button onClick={() => onUpdateQuantity(item.id, Math.max(1, quantity - 1))}>−</button>
                            <input 
                              type="number" 
                              value={quantity} 
                              min="1" 
                              max={item.stock || 999}
                              onChange={(e) => {
                                const newQty = parseInt(e.target.value) || 1
                                if (newQty >= 1 && (!item.stock || newQty <= item.stock)) {
                                  onUpdateQuantity(item.id, newQty)
                                }
                              }}
                            />
                            <button 
                              onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                              disabled={item.stock !== undefined && quantity >= item.stock}
                            >
                              +
                            </button>
                          </div>
                          {item.stock !== undefined && (
                            <div className="stock-info">
                              {item.stock > 0 ? (
                                <span className="stock-in">Còn {item.stock} sản phẩm</span>
                              ) : (
                                <span className="stock-out">Hết hàng</span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="subtotal">{formatPrice(itemTotal)}</td>
                        <td className="action">
                          <button onClick={() => onRemove(item.id)} className="btn-remove">
                            Xóa
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="cart-summary">
              <div className="summary-card">
                <h3>Tóm Tắt Đơn Hàng</h3>
                {hasOutOfStockItems || hasInvalidQuantities ? (
                  <div className="error-message" style={{ marginBottom: "1rem", padding: "0.75rem", backgroundColor: "#fee2e2", color: "#991b1b", borderRadius: "0.375rem" }}>
                    ⚠️ Một số sản phẩm đã hết hàng hoặc số lượng vượt quá tồn kho. Vui lòng kiểm tra lại.
                  </div>
                ) : null}
                <div className="summary-row total">
                  <span>Tổng Cộng:</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
                <Link 
                  to="/checkout" 
                  className="btn-checkout"
                  style={(hasOutOfStockItems || hasInvalidQuantities) ? { opacity: 0.5, pointerEvents: "none", cursor: "not-allowed" } : {}}
                  onClick={(e) => {
                    if (hasOutOfStockItems || hasInvalidQuantities) {
                      e.preventDefault()
                      alert("Vui lòng xử lý các sản phẩm hết hàng trước khi thanh toán.")
                    }
                  }}
                >
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
