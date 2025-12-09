import { useState, useEffect } from "react"
import { categoryAPI } from "../../services/api"
import "./AdminCategories.css"

function AdminCategories({ user }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchKeyword, setSearchKeyword] = useState("")
  
  // Form states
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      setError("")
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

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      loadCategories()
      return
    }

    try {
      setLoading(true)
      setError("")
      const response = await categoryAPI.searchCategories(searchKeyword)
      if (response.success) {
        setCategories(response.data || [])
      }
    } catch (err) {
      setError(err.message || "Không thể tìm kiếm danh mục")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError("")
      if (editingCategory) {
        const response = await categoryAPI.updateCategory(editingCategory.id, formData)
        if (response.success) {
          await loadCategories()
          resetForm()
          alert("Cập nhật danh mục thành công!")
        }
      } else {
        const response = await categoryAPI.createCategory(formData)
        if (response.success) {
          await loadCategories()
          resetForm()
          alert("Tạo danh mục thành công!")
        }
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra")
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name || "",
      description: category.description || "",
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này? Danh mục có sản phẩm sẽ không thể xóa.")) return
    
    try {
      setError("")
      const response = await categoryAPI.deleteCategory(id)
      if (response.success) {
        await loadCategories()
        alert("Xóa danh mục thành công!")
      }
    } catch (err) {
      setError(err.message || "Không thể xóa danh mục. Có thể danh mục đang được sử dụng bởi sản phẩm.")
    }
  }

  const resetForm = () => {
    setFormData({ name: "", description: "" })
    setEditingCategory(null)
    setShowForm(false)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleString("vi-VN")
  }

  return (
    <div className="admin-content">
      <div className="admin-categories-container">
        {error && <div className="error-message">{error}</div>}

        <div className="section-header">
          <h2>Quản Lý Danh Mục ({categories.length})</h2>
          <div className="header-actions">
            <div className="search-box">
              <input
                type="text"
                placeholder="Tìm kiếm danh mục..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="search-input"
              />
              <button className="btn-search" onClick={handleSearch}>
                🔍 Tìm Kiếm
              </button>
              {searchKeyword && (
                <button className="btn-clear" onClick={() => {
                  setSearchKeyword("")
                  loadCategories()
                }}>
                  ✕
                </button>
              )}
            </div>
            <button
              className="btn-add"
              onClick={() => {
                resetForm()
                setShowForm(true)
              }}
            >
              + Thêm Danh Mục
            </button>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="form-modal" onClick={(e) => e.target === e.currentTarget && resetForm()}>
            <div className="form-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="form-header">
                <h3>{editingCategory ? "Sửa Danh Mục" : "Thêm Danh Mục Mới"}</h3>
                <button className="btn-close" onClick={resetForm}>×</button>
              </div>
              <form onSubmit={handleSubmit} className="category-form">
                <div className="form-group">
                  <label>Tên Danh Mục *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nhập tên danh mục"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Mô Tả</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Nhập mô tả danh mục (tùy chọn)"
                    rows="4"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-submit">
                    {editingCategory ? "Cập Nhật" : "Tạo Mới"}
                  </button>
                  <button type="button" className="btn-cancel" onClick={resetForm}>
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
          <div className="categories-grid">
            {categories.length === 0 ? (
              <div className="empty-state">
                {searchKeyword ? "Không tìm thấy danh mục nào" : "Chưa có danh mục nào. Hãy thêm danh mục mới!"}
              </div>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="category-card">
                  <div className="category-header">
                    <div className="category-icon">📂</div>
                    <div className="category-info">
                      <h3 className="category-name">{category.name}</h3>
                      {category.description && (
                        <p className="category-description">{category.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="category-meta">
                    <div className="meta-item">
                      <span className="meta-label">ID:</span>
                      <span className="meta-value">#{category.id}</span>
                    </div>
                    {category.createdAt && (
                      <div className="meta-item">
                        <span className="meta-label">Ngày tạo:</span>
                        <span className="meta-value">{formatDate(category.createdAt)}</span>
                      </div>
                    )}
                  </div>
                  <div className="category-actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(category)}
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(category.id)}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminCategories

