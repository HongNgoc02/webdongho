import { useState, useMemo } from "react"
import { mockProducts } from "../data/mockData"
import "./Shop.css"

function Shop({ onAddToCart }) {
  const [selectedCategory, setSelectedCategory] = useState("Tất Cả")
  const [sortBy, setSortBy] = useState("name")
  const [searchTerm, setSearchTerm] = useState("")

  const categories = ["Tất Cả", "Cao Cấp", "Thể Thao", "Thông Minh", "Thường Ngày"]

  const filteredAndSortedProducts = useMemo(() => {
    let result = mockProducts

    if (selectedCategory !== "Tất Cả") {
      // Map Vietnamese category to English for filtering
      const categoryMap = {
        "Cao Cấp": "Luxury",
        "Thể Thao": "Sports",
        "Thông Minh": "Smart",
        "Thường Ngày": "Casual"
      }
      const englishCategory = categoryMap[selectedCategory] || selectedCategory
      result = result.filter((p) => p.category === englishCategory)
    }

    if (searchTerm) {
      result = result.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    result.sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price
      if (sortBy === "price-high") return b.price - a.price
      if (sortBy === "rating") return b.rating - a.rating
      return a.name.localeCompare(b.name)
    })

    return result
  }, [selectedCategory, sortBy, searchTerm])

  return (
    <div className="shop">
      <div className="shop-header">
        <h1>Bộ Sưu Tập Của Chúng Tôi</h1>
        <p>Khám phá bộ sưu tập đồng hồ cao cấp của chúng tôi</p>
      </div>

      <div className="container">
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
              {categories.map((cat) => (
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
            {filteredAndSortedProducts.length > 0 ? (
              filteredAndSortedProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img src={product.image || "/placeholder.svg"} alt={product.name} />
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <div className="product-rating">
                      <span className="stars">⭐ {product.rating}</span>
                      <span className="reviews">({product.reviews})</span>
                    </div>
                    <p className="product-desc">{product.description}</p>
                    <div className="product-footer">
                      <span className="price">${product.price}</span>
                      <button onClick={() => onAddToCart(product)} className="btn-add-cart">
                        Thêm Vào Giỏ
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
