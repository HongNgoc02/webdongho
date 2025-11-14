import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { mockProducts } from "../data/mockData"
import "./ProductDetail.css"

function ProductDetail({ onAddToCart }) {
  const { id } = useParams()
  const product = mockProducts.find((p) => p.id === Number.parseInt(id))
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <div className="product-detail error">
        <div className="container">
          <h2>Không tìm thấy sản phẩm</h2>
          <Link to="/shop" className="btn-primary">
            Quay Lại Cửa Hàng
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product)
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const relatedProducts = mockProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3)

  return (
    <div className="product-detail">
      <div className="container">
        <Link to="/shop" className="back-link">
          ← Quay Lại Cửa Hàng
        </Link>

        <div className="product-detail-content">
          <div className="product-image-section">
            <img src={product.image || "/placeholder.svg"} alt={product.name} />
          </div>

          <div className="product-details-section">
            <h1>{product.name}</h1>

            <div className="product-meta">
              <div className="rating">
                <span className="stars">⭐ {product.rating}</span>
                <span className="reviews">({product.reviews} đánh giá)</span>
              </div>
              <span className="category">{product.category}</span>
            </div>

            <p className="description">{product.description}</p>

            <div className="specs">
              <h3>Thông Số Kỹ Thuật</h3>
              <ul>
                <li>Chống Nước</li>
                <li>Kính Sapphire Chống Xước</li>
                <li>Bộ Máy Thụy Sĩ</li>
                <li>Bảo Hành 2 Năm</li>
              </ul>
            </div>

            <div className="purchase-section">
              <div className="price-tag">
                <span className="currency">$</span>
                <span className="amount">{product.price}</span>
              </div>

              <div className="quantity-selector">
                <label htmlFor="quantity">Số Lượng:</label>
                <button onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}>−</button>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                />
                <button onClick={() => setQuantity((q) => q + 1)}>+</button>
              </div>

              <button onClick={handleAddToCart} className={`btn-add-to-cart ${added ? "added" : ""}`}>
                {added ? "✓ Đã Thêm Vào Giỏ" : "Thêm Vào Giỏ"}
              </button>

              <Link to="/cart" className="btn-checkout">
                Đến Giỏ Hàng
              </Link>
            </div>

            <div className="benefits">
              <div className="benefit">
                <span className="icon">🚚</span>
                <div>
                  <h4>Miễn Phí Vận Chuyển</h4>
                  <p>Cho đơn hàng trên $100</p>
                </div>
              </div>
              <div className="benefit">
                <span className="icon">↩️</span>
                <div>
                  <h4>Đổi Trả Dễ Dàng</h4>
                  <p>Bảo đảm hoàn tiền trong 30 ngày</p>
                </div>
              </div>
              <div className="benefit">
                <span className="icon">🔒</span>
                <div>
                  <h4>Thanh Toán An Toàn</h4>
                  <p>Thanh toán 100% an toàn</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h2>Sản Phẩm Liên Quan</h2>
            <div className="related-grid">
              {relatedProducts.map((related) => (
                <Link key={related.id} to={`/product/${related.id}`} className="related-card">
                  <img src={related.image || "/placeholder.svg"} alt={related.name} />
                  <h4>{related.name}</h4>
                  <p>${related.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail
