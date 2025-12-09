import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { productAPI } from "../services/api"
import "./ProductDetail.css"

function ProductDetail({ onAddToCart }) {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadProduct()
  }, [id])

  const loadProduct = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await productAPI.getProductById(id)
      if (response.success && response.data) {
        setProduct(response.data)
        // Load related products
        if (response.data.categoryId) {
          loadRelatedProducts(response.data.categoryId, response.data.id)
        }
      } else {
        setError("Không tìm thấy sản phẩm")
      }
    } catch (err) {
      setError(err.message || "Không thể tải thông tin sản phẩm")
    } finally {
      setLoading(false)
    }
  }

  const loadRelatedProducts = async (categoryId, currentProductId) => {
    try {
      const response = await productAPI.getProductsByCategory(categoryId)
      if (response.success) {
        const related = (response.data || [])
          .filter((p) => p.id !== currentProductId)
          .slice(0, 3)
        setRelatedProducts(related)
      }
    } catch (err) {
      console.error("Error loading related products:", err)
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    
    // Check stock before adding
    if (!product.stock || product.stock <= 0) {
      alert("Sản phẩm này đã hết hàng!")
      return
    }

    if (quantity > product.stock) {
      alert(`Số lượng tồn kho không đủ. Chỉ còn ${product.stock} sản phẩm.`)
      setQuantity(product.stock)
      return
    }

    // Add product with specified quantity
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product)
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const formatPrice = (price) => {
    if (!price) return "0"
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  if (loading) {
    return (
      <div className="product-detail">
        <div className="container">
          <div className="loading">Đang tải thông tin sản phẩm...</div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="product-detail error">
        <div className="container">
          <h2>{error || "Không tìm thấy sản phẩm"}</h2>
          <Link to="/shop" className="btn-primary">
            Quay Lại Cửa Hàng
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="product-detail">
      <div className="container">
        <Link to="/shop" className="back-link">
          ← Quay Lại Cửa Hàng
        </Link>

        <div className="product-detail-content">
          <div className="product-image-section">
            <img
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              onError={(e) => {
                e.target.src = "/placeholder.svg"
              }}
            />
          </div>

          <div className="product-details-section">
            <h1>{product.name}</h1>

            <div className="product-meta">
              <div className="rating">
                <span className="stars">⭐ {product.rating || 0}</span>
                <span className="reviews">({product.reviews || 0} đánh giá)</span>
              </div>
              <span className="category">{product.categoryName || "N/A"}</span>
            </div>

            <p className="description">{product.description || "Không có mô tả"}</p>

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
                <span className="amount">{formatPrice(product.price)}</span>
              </div>

              <div className="stock-info">
                <span className={product.stock > 0 ? "in-stock" : "out-of-stock"}>
                  {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : "Hết hàng"}
                </span>
              </div>

              <div className="quantity-selector">
                <label htmlFor="quantity">Số Lượng:</label>
                <button onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}>−</button>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={product.stock || 1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock || 1, Number.parseInt(e.target.value) || 1)))}
                />
                <button onClick={() => setQuantity((q) => Math.min(product.stock || 1, q + 1))}>+</button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`btn-add-to-cart ${added ? "added" : ""}`}
                disabled={!product.stock || product.stock === 0}
              >
                {added ? "✓ Đã Thêm Vào Giỏ" : product.stock > 0 ? "Thêm Vào Giỏ" : "Hết Hàng"}
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
                  <p>Cho đơn hàng trên 2.500.000đ</p>
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
                  <img
                    src={related.imageUrl || "/placeholder.svg"}
                    alt={related.name}
                    onError={(e) => {
                      e.target.src = "/placeholder.svg"
                    }}
                  />
                  <h4>{related.name}</h4>
                  <p>{formatPrice(related.price)}</p>
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
