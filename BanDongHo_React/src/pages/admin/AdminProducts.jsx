import { useState, useEffect } from "react"
import { categoryAPI, productAPI } from "../../services/api"
import "./AdminProducts.css"

function AdminProducts({ user }) {
  const [activeTab, setActiveTab] = useState("products") // "categories" or "products"
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Form states
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  })
  
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    categoryId: "",
    rating: "",
    reviews: "",
  })

  // Load data
  useEffect(() => {
    loadCategories()
    loadProducts()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const response = await categoryAPI.getAllCategories()
      if (response.success) {
        setCategories(response.data || [])
      }
    } catch (err) {
      setError(err.message || "Không thể tải danh sách danh mục")
    } finally {
      setLoading(false)
    }
  }

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await productAPI.getAllProducts()
      if (response.success) {
        setProducts(response.data || [])
      }
    } catch (err) {
      setError(err.message || "Không thể tải danh sách sản phẩm")
    } finally {
      setLoading(false)
    }
  }

  // Category handlers
  const handleCategorySubmit = async (e) => {
    e.preventDefault()
    try {
      setError("")
      if (editingCategory) {
        const response = await categoryAPI.updateCategory(editingCategory.id, categoryForm)
        if (response.success) {
          await loadCategories()
          resetCategoryForm()
          alert("Cập nhật danh mục thành công!")
        }
      } else {
        const response = await categoryAPI.createCategory(categoryForm)
        if (response.success) {
          await loadCategories()
          resetCategoryForm()
          alert("Tạo danh mục thành công!")
        }
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra")
    }
  }

  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name || "",
      description: category.description || "",
    })
    setShowCategoryForm(true)
  }

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return
    
    try {
      const response = await categoryAPI.deleteCategory(id)
      if (response.success) {
        await loadCategories()
        alert("Xóa danh mục thành công!")
      }
    } catch (err) {
      setError(err.message || "Không thể xóa danh mục. Có thể danh mục đang được sử dụng bởi sản phẩm.")
    }
  }

  const resetCategoryForm = () => {
    setCategoryForm({ name: "", description: "" })
    setEditingCategory(null)
    setShowCategoryForm(false)
  }

  // Product handlers
  const handleProductSubmit = async (e) => {
    e.preventDefault()
    try {
      setError("")
      
      // Validate rating (0-5)
      let ratingValue = null
      if (productForm.rating && productForm.rating.trim() !== "") {
        ratingValue = parseFloat(productForm.rating)
        if (isNaN(ratingValue) || ratingValue < 0 || ratingValue > 5) {
          setError("Đánh giá phải từ 0 đến 5")
          return
        }
      }
      
      // Validate reviews (>= 0)
      let reviewsValue = 0
      if (productForm.reviews && productForm.reviews.trim() !== "") {
        reviewsValue = parseInt(productForm.reviews)
        if (isNaN(reviewsValue) || reviewsValue < 0) {
          setError("Số lượng đánh giá phải lớn hơn hoặc bằng 0")
          return
        }
      }
      
      const productData = {
        name: productForm.name,
        description: productForm.description || "",
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock) || 0,
        imageUrl: productForm.imageUrl || "",
        categoryId: parseInt(productForm.categoryId),
        rating: ratingValue,
        reviews: reviewsValue,
      }

      if (editingProduct) {
        const response = await productAPI.updateProduct(editingProduct.id, productData)
        if (response.success) {
          await loadProducts()
          resetProductForm()
          alert("Cập nhật sản phẩm thành công!")
        }
      } else {
        const response = await productAPI.createProduct(productData)
        if (response.success) {
          await loadProducts()
          resetProductForm()
          alert("Tạo sản phẩm thành công!")
        }
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra")
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price?.toString() || "",
      stock: product.stock?.toString() || "0",
      imageUrl: product.imageUrl || "",
      categoryId: product.categoryId?.toString() || "",
      rating: product.rating?.toString() || "",
      reviews: product.reviews?.toString() || "0",
    })
    setShowProductForm(true)
  }

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return
    
    try {
      const response = await productAPI.deleteProduct(id)
      if (response.success) {
        await loadProducts()
        alert("Xóa sản phẩm thành công!")
      }
    } catch (err) {
      setError(err.message || "Không thể xóa sản phẩm")
    }
  }

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      imageUrl: "",
      categoryId: "",
      rating: "",
      reviews: "",
    })
    setEditingProduct(null)
    setShowProductForm(false)
  }

  const formatPrice = (price) => {
    if (!price) return "0"
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  return (
    <div className="admin-content">
      <div className="admin-products-container">
        {error && <div className="error-message">{error}</div>}

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`tab-button ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            📦 Sản Phẩm ({products.length})
          </button>
          <button
            className={`tab-button ${activeTab === "categories" ? "active" : ""}`}
            onClick={() => setActiveTab("categories")}
          >
            🏷️ Danh Mục ({categories.length})
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Quản Lý Sản Phẩm</h2>
              <button
                className="btn-add"
                onClick={() => {
                  resetProductForm()
                  setShowProductForm(true)
                }}
              >
                + Thêm Sản Phẩm
              </button>
            </div>

            {showProductForm && (
              <div className="form-modal">
                <div className="form-modal-content">
                  <div className="form-header">
                    <h3>{editingProduct ? "Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}</h3>
                    <button className="btn-close" onClick={resetProductForm}>×</button>
                  </div>
                  <form onSubmit={handleProductSubmit} className="product-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Tên Sản Phẩm *</label>
                        <input
                          type="text"
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Danh Mục *</label>
                        <select
                          value={productForm.categoryId}
                          onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                          required
                        >
                          <option value="">Chọn danh mục</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Mô Tả</label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        rows="3"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Giá (VND) *</label>
                        <input
                          type="number"
                          step="0.01"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Số Lượng Tồn Kho *</label>
                        <input
                          type="number"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                          required
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>URL Hình Ảnh</label>
                        <input
                          type="text"
                          value={productForm.imageUrl}
                          onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                          placeholder="/image.jpg"
                        />
                      </div>
                      <div className="form-group">
                        <label>Đánh Giá (0-5)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={productForm.rating}
                          onChange={(e) => {
                            const value = e.target.value
                            // Validate on input
                            if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= 5)) {
                              setProductForm({ ...productForm, rating: value })
                            }
                          }}
                          placeholder="0.0 - 5.0"
                        />
                        {productForm.rating && (parseFloat(productForm.rating) < 0 || parseFloat(productForm.rating) > 5) && (
                          <span style={{ color: "#dc2626", fontSize: "0.8125rem", marginTop: "0.25rem" }}>
                            Đánh giá phải từ 0 đến 5
                          </span>
                        )}
                      </div>
                      <div className="form-group">
                        <label>Số Lượng Đánh Giá</label>
                        <input
                          type="number"
                          value={productForm.reviews}
                          onChange={(e) => setProductForm({ ...productForm, reviews: e.target.value })}
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn-submit">
                        {editingProduct ? "Cập Nhật" : "Tạo Mới"}
                      </button>
                      <button type="button" className="btn-cancel" onClick={resetProductForm}>
                        Hủy
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {loading ? (
              <div className="loading">Đang tải...</div>
            ) : (
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tên Sản Phẩm</th>
                      <th>Danh Mục</th>
                      <th>Giá</th>
                      <th>Tồn Kho</th>
                      <th>Đánh Giá</th>
                      <th>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="empty-state">
                          Chưa có sản phẩm nào
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product.id}>
                          <td>{product.id}</td>
                          <td>
                            <div className="product-name-cell">
                              {product.imageUrl && (
                                <img src={product.imageUrl} alt={product.name} className="product-thumb" />
                              )}
                              <div>
                                <strong>{product.name}</strong>
                                {product.description && (
                                  <p className="product-desc">{product.description.substring(0, 50)}...</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>{product.categoryName || "N/A"}</td>
                          <td className="price">{formatPrice(product.price)}</td>
                          <td>{product.stock || 0}</td>
                          <td>
                            {product.rating ? `⭐ ${product.rating}` : "-"} 
                            {product.reviews > 0 && ` (${product.reviews})`}
                          </td>
                          <td className="actions">
                            <button
                              className="btn-edit"
                              onClick={() => handleEditProduct(product)}
                            >
                              Sửa
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Quản Lý Danh Mục</h2>
              <button
                className="btn-add"
                onClick={() => {
                  resetCategoryForm()
                  setShowCategoryForm(true)
                }}
              >
                + Thêm Danh Mục
              </button>
            </div>

            {showCategoryForm && (
              <div className="form-modal">
                <div className="form-modal-content">
                  <div className="form-header">
                    <h3>{editingCategory ? "Sửa Danh Mục" : "Thêm Danh Mục Mới"}</h3>
                    <button className="btn-close" onClick={resetCategoryForm}>×</button>
                  </div>
                  <form onSubmit={handleCategorySubmit} className="category-form">
                    <div className="form-group">
                      <label>Tên Danh Mục *</label>
                      <input
                        type="text"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Mô Tả</label>
                      <textarea
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                        rows="3"
                      />
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn-submit">
                        {editingCategory ? "Cập Nhật" : "Tạo Mới"}
                      </button>
                      <button type="button" className="btn-cancel" onClick={resetCategoryForm}>
                        Hủy
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {loading ? (
              <div className="loading">Đang tải...</div>
            ) : (
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tên Danh Mục</th>
                      <th>Mô Tả</th>
                      <th>Ngày Tạo</th>
                      <th>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="empty-state">
                          Chưa có danh mục nào
                        </td>
                      </tr>
                    ) : (
                      categories.map((category) => (
                        <tr key={category.id}>
                          <td>{category.id}</td>
                          <td>
                            <strong>{category.name}</strong>
                          </td>
                          <td>{category.description || "-"}</td>
                          <td>
                            {category.createdAt
                              ? new Date(category.createdAt).toLocaleDateString("vi-VN")
                              : "-"}
                          </td>
                          <td className="actions">
                            <button
                              className="btn-edit"
                              onClick={() => handleEditCategory(category)}
                            >
                              Sửa
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminProducts
