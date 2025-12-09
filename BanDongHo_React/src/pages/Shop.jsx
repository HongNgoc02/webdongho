import { useState, useEffect, useMemo } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { productAPI, categoryAPI } from "../services/api"
import "./Shop.css"

function Shop({ onAddToCart }) {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("Tất Cả")
  const [sortBy, setSortBy] = useState("name")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  // Handle categoryId from URL query params
  useEffect(() => {
    const categoryId = searchParams.get("categoryId")
    if (categoryId && categories.length > 0) {
      const category = categories.find((cat) => cat.id === parseInt(categoryId))
      if (category) {
        setSelectedCategory(category.name)
      }
    }
  }, [searchParams, categories])

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [productsRes, categoriesRes] = await Promise.all([
        productAPI.getAllProducts(),
        categoryAPI.getAllCategories(),
      ])

      if (productsRes.success) {
        setProducts(productsRes.data || [])
      }
      if (categoriesRes.success) {
        setCategories(categoriesRes.data || [])
      }
    } catch (err) {
      setError(err.message || "Không thể tải dữ liệu")
    } finally {
      setLoading(false)
    }
  }

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products]

    // Filter by category
    if (selectedCategory !== "Tất Cả") {
      const selectedCat = categories.find((cat) => cat.name === selectedCategory)
      if (selectedCat) {
        result = result.filter((p) => p.categoryId === selectedCat.id)
      }
    }

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "price-low") return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0)
      if (sortBy === "price-high") return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0)
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0)
      return (a.name || "").localeCompare(b.name || "")
    })

    return result
  }, [products, categories, selectedCategory, sortBy, searchTerm])

  const formatPrice = (price) => {
    if (!price) return "0"
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const categoryList = ["Tất Cả", ...categories.map((cat) => cat.name)]

  return (
    <div className="shop">
      <div className="shop-header">
        <h1>Bộ Sưu Tập Của Chúng Tôi</h1>
        <p>Khám phá bộ sưu tập đồng hồ cao cấp của chúng tôi</p>
      </div>

      <div className="container">
        {error && <div className="error-message">{error}</div>}

        <div className="shop-controls">
          <input
            type="text"
            placeholder="Tìm kiếm đồng hồ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <div className="controls-group">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
              <option value="name">Sắp xếp theo: Tên</option>
              <option value="price-low">Giá: Thấp đến Cao</option>
              <option value="price-high">Giá: Cao đến Thấp</option>
              <option value="rating">Đánh Giá Cao Nhất</option>
            </select>
          </div>
        </div>

        <div className="shop-content">
          <aside className="filters">
            <h3>Danh Mục</h3>
            <div className="category-list">
              {categoryList.map((cat) => (
                <button
                  key={cat}
                  className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </aside>

          <div className="products-grid">
            {loading ? (
              <div className="loading">Đang tải sản phẩm...</div>
            ) : filteredAndSortedProducts.length > 0 ? (
              filteredAndSortedProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <Link>
                    <div className="product-image">
                    <img
                      src={product.imageUrl || "/placeholder.svg"}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = "/placeholder.svg"
                      }}
                    />
                  </div>
                  </Link>
                  
                  <div className="product-info">
                    {/*<h3>{product.name}</h3>*/}
                    <h3>
                      <Link to={`/product/${product.id}`} >
                        {product.name}
                      </Link>
                    </h3>
                    <div className="product-rating">
                      <span className="stars">⭐ {product.rating || 0}</span>
                      <span className="reviews">({product.reviews || 0})</span>
                    </div>
                    <p className="product-desc">
                      {product.description ? (product.description.length > 100 ? `${product.description.substring(0, 100)}...` : product.description) : "Không có mô tả"}
                    </p>
                    <div className="product-footer">
                      <div>
                        <span className="price">{formatPrice(product.price)}</span>
                        <div className="product-stock">
                          {product.stock > 0 ? (
                            <span className="stock-in">Còn {product.stock} sản phẩm</span>
                          ) : (
                            <span className="stock-out">Hết hàng</span>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => onAddToCart(product)} 
                        className="btn-add-cart"
                        disabled={!product.stock || product.stock === 0}
                        style={(!product.stock || product.stock === 0) ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                      >
                        {product.stock > 0 ? "Thêm Vào Giỏ" : "Hết Hàng"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-products">
                <p>Không tìm thấy sản phẩm. Hãy thử điều chỉnh bộ lọc của bạn.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shop
