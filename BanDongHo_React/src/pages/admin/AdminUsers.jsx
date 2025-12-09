import { useState, useEffect } from "react"
import { userAPI } from "../../services/api"
import "./AdminUsers.css"

function AdminUsers({ user }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchKeyword, setSearchKeyword] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    role: "CUSTOMER",
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await userAPI.getAllUsers()
      if (response.success) {
        setUsers(response.data || [])
      }
    } catch (err) {
      setError(err.message || "Không thể tải danh sách người dùng")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      loadUsers()
      return
    }

    try {
      setLoading(true)
      setError("")
      const response = await userAPI.searchUsers(searchKeyword)
      if (response.success) {
        setUsers(response.data || [])
      }
    } catch (err) {
      setError(err.message || "Không thể tìm kiếm người dùng")
    } finally {
      setLoading(false)
    }
  }

  const handleViewUser = async (userId) => {
    try {
      setError("")
      const response = await userAPI.getUserById(userId)
      if (response.success) {
        setSelectedUser(response.data)
      }
    } catch (err) {
      setError(err.message || "Không thể tải thông tin người dùng")
    }
  }

  const handleEdit = (user) => {
    setEditForm({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      role: user.role || "CUSTOMER",
    })
    setSelectedUser(user)
    setShowEditForm(true)
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault()
    try {
      setError("")
      const response = await userAPI.updateUser(selectedUser.id, editForm)
      if (response.success) {
        await loadUsers()
        setShowEditForm(false)
        setSelectedUser(null)
        alert("Cập nhật thông tin người dùng thành công!")
      }
    } catch (err) {
      setError(err.message || "Không thể cập nhật thông tin người dùng")
    }
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.")) return

    try {
      setError("")
      const response = await userAPI.deleteUser(id)
      if (response.success) {
        await loadUsers()
        if (selectedUser?.id === id) {
          setSelectedUser(null)
        }
        alert("Xóa người dùng thành công!")
      }
    } catch (err) {
      setError(err.message || "Không thể xóa người dùng. Có thể người dùng đang có đơn hàng.")
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleString("vi-VN")
  }

  const getRoleLabel = (role) => {
    switch (role?.toUpperCase()) {
      case "ADMIN":
        return "Quản Trị"
      case "CUSTOMER":
        return "Khách Hàng"
      case "GUEST":
        return "Khách"
      default:
        return role || "-"
    }
  }

  const getRoleColor = (role) => {
    switch (role?.toUpperCase()) {
      case "ADMIN":
        return "role-admin"
      case "CUSTOMER":
        return "role-customer"
      case "GUEST":
        return "role-guest"
      default:
        return ""
    }
  }

  return (
    <div className="admin-content">
      <div className="admin-users-container">
        {error && <div className="error-message">{error}</div>}

        <div className="section-header">
          <h2>Quản Lý Người Dùng ({users.length})</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
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
                loadUsers()
              }}>
                ✕
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ và Tên</th>
                  <th>Email</th>
                  <th>Số Điện Thoại</th>
                  <th>Địa Chỉ</th>
                  <th>Vai Trò</th>
                  <th>Ngày Tạo</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-state">
                      {searchKeyword ? "Không tìm thấy người dùng nào" : "Chưa có người dùng nào"}
                    </td>
                  </tr>
                ) : (
                  users.map((userItem) => (
                    <tr key={userItem.id}>
                      <td>{userItem.id}</td>
                      <td>
                        <strong>{userItem.fullName || "N/A"}</strong>
                      </td>
                      <td>{userItem.email || "N/A"}</td>
                      <td>{userItem.phone || "N/A"}</td>
                      <td className="address-cell">
                        {userItem.address ? (
                          userItem.address.length > 30 ? `${userItem.address.substring(0, 30)}...` : userItem.address
                        ) : "N/A"}
                      </td>
                      <td>
                        <span className={`role-badge ${getRoleColor(userItem.role)}`}>
                          {getRoleLabel(userItem.role)}
                        </span>
                      </td>
                      <td>{formatDate(userItem.createdAt)}</td>
                      <td className="actions">
                        <button
                          className="btn-view"
                          onClick={() => handleViewUser(userItem.id)}
                        >
                          Xem
                        </button>
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(userItem)}
                        >
                          Sửa
                        </button>
                        {userItem.id !== user?.id && (
                          <button
                            className="btn-delete"
                            onClick={() => handleDeleteUser(userItem.id)}
                          >
                            Xóa
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* User Detail Modal */}
        {selectedUser && !showEditForm && (
          <div className="user-modal" onClick={() => setSelectedUser(null)}>
            <div className="user-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Chi Tiết Người Dùng</h3>
                <button className="btn-close" onClick={() => setSelectedUser(null)}>×</button>
              </div>
              <div className="user-details">
                <div className="detail-section">
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">ID:</span>
                      <span className="detail-value">#{selectedUser.id}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Họ và Tên:</span>
                      <span className="detail-value">{selectedUser.fullName || "N/A"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{selectedUser.email || "N/A"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Số Điện Thoại:</span>
                      <span className="detail-value">{selectedUser.phone || "N/A"}</span>
                    </div>
                    <div className="detail-item full-width">
                      <span className="detail-label">Địa Chỉ:</span>
                      <span className="detail-value">{selectedUser.address || "N/A"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Vai Trò:</span>
                      <span className={`role-badge ${getRoleColor(selectedUser.role)}`}>
                        {getRoleLabel(selectedUser.role)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Ngày Tạo:</span>
                      <span className="detail-value">{formatDate(selectedUser.createdAt)}</span>
                    </div>
                    {selectedUser.updatedAt && (
                      <div className="detail-item">
                        <span className="detail-label">Cập Nhật Lần Cuối:</span>
                        <span className="detail-value">{formatDate(selectedUser.updatedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-actions">
                  <button className="btn-edit" onClick={() => setShowEditForm(true)}>
                    ✏️ Sửa Thông Tin
                  </button>
                  <button className="btn-cancel" onClick={() => setSelectedUser(null)}>
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {showEditForm && selectedUser && (
          <div className="user-modal" onClick={() => {
            setShowEditForm(false)
            setSelectedUser(null)
          }}>
            <div className="user-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Sửa Thông Tin Người Dùng</h3>
                <button className="btn-close" onClick={() => {
                  setShowEditForm(false)
                  setSelectedUser(null)
                }}>×</button>
              </div>
              <form onSubmit={handleUpdateUser} className="user-form">
                <div className="form-group">
                  <label>Họ và Tên *</label>
                  <input
                    type="text"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    required
                    disabled
                    style={{ background: "#f1f5f9", color: "#64748b" }}
                  />
                  <small style={{ color: "#64748b", fontSize: "0.8125rem" }}>Email không thể thay đổi</small>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Số Điện Thoại *</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Vai Trò *</label>
                    <select
                      value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      required
                    >
                      <option value="CUSTOMER">Khách Hàng</option>
                      <option value="ADMIN">Quản Trị</option>
                      <option value="GUEST">Khách</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Địa Chỉ *</label>
                  <textarea
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    rows="3"
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-submit">
                    Cập Nhật
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => {
                      setShowEditForm(false)
                      setSelectedUser(null)
                    }}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminUsers

