import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { productAPI, categoryAPI } from "../services/api"
import "./Home.css"

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadFeaturedData()
  }, [])

  const loadFeaturedData = async () => {
    try {
      setLoading(true)
      const [productsRes, categoriesRes] = await Promise.all([
        productAPI.getAllProducts(),
        categoryAPI.getAllCategories(),
      ])

      if (productsRes.success) {
        // Lấy top 6 sản phẩm có rating cao nhất
        const products = productsRes.data || []
        const sorted = [...products]
          .sort((a, b) => {
            const ratingA = (a.rating || 0) * (a.reviews || 0)
            const ratingB = (b.rating || 0) * (b.reviews || 0)
            return ratingB - ratingA
          })
          .slice(0, 6)
        setFeaturedProducts(sorted)
      }

      if (categoriesRes.success) {
        setCategories(categoriesRes.data || [])
      }
    } catch (err) {
      console.error("Error loading featured data:", err)
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

  // Map category name to link
  const getCategoryLink = (categoryName) => {
    const category = categories.find((cat) => cat.name === categoryName)
    if (category) {
      return `/shop?categoryId=${category.id}`
    }
    return "/shop"
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Vẻ Đẹp Vượt Thời Gian</h1>
          <p>Khám phá chiếc đồng hồ hoàn hảo cho mọi khoảnh khắc</p>
          <Link to="/shop" className="btn-cta">
            Mua Ngay
          </Link>
        </div>
      </section>


      {featuredProducts.length > 0 && (
        <section className="featured-products">
          <div className="container">
            <h2>Sản Phẩm Nổi Bật</h2>
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <Link to={`/product/${product.id}`}>
                    <div className="product-image">
                      <img
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = "/placeholder.svg"
                        }}
                      />
                    </div>
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <div className="product-rating">
                        <span className="stars">⭐ {product.rating || 0}</span>
                        <span className="reviews">({product.reviews || 0})</span>
                      </div>
                      <p className="product-desc">
                        {product.description
                          ? product.description.length > 80
                            ? `${product.description.substring(0, 80)}...`
                            : product.description
                          : "Không có mô tả"}
                      </p>
                      <div className="product-footer">
                        <span className="price">{formatPrice(product.price)}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <Link to="/shop" className="btn-primary">
                Xem Tất Cả Sản Phẩm
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="why-us">
        <div className="container">
          <h2>Tại Sao Chọn Chrono?</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">✓</div>
              <h4>Chất Lượng Chính Hãng</h4>
              <p>Tất cả đồng hồ được đảm bảo 100% chính hãng</p>
            </div>
            <div className="feature">
              <div className="feature-icon">✓</div>
              <h4>Giao Hàng Nhanh</h4>
              <p>Miễn phí vận chuyển cho đơn hàng trên 2.500.000đ</p>
            </div>
            <div className="feature">
              <div className="feature-icon">✓</div>
              <h4>Đổi Trả Dễ Dàng</h4>
              <p>Bảo đảm hoàn tiền trong 30 ngày</p>
            </div>
            <div className="feature">
              <div className="feature-icon">✓</div>
              <h4>Hỗ Trợ Chuyên Nghiệp</h4>
              <p>Dịch vụ khách hàng 24/7</p>
            </div>
          </div>
        </div>
      </section>

      <section className="newsletter">
        <div className="container">
          <h2>Cập Nhật Thông Tin</h2>
          <p>Đăng ký để nhận ưu đãi đặc biệt và cập nhật bộ sưu tập mới</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Nhập email của bạn" />
            <button className="btn-primary">Đăng Ký</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
