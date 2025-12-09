import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { userAPI } from "../services/api"
import "./Login.css"

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    address: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validation
    if (!formData.email || !formData.password || !formData.fullName || !formData.phone || !formData.address) {
      setError("Vui lòng điền đầy đủ thông tin")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự")
      setLoading(false)
      return
    }

    try {
      const response = await userAPI.register(formData)
      
      if (response.success) {
        // Đăng ký thành công, chuyển đến trang đăng nhập
        alert("Đăng ký thành công! Vui lòng đăng nhập.")
        navigate("/login")
      } else {
        setError(response.message || "Đăng ký thất bại")
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi đăng ký")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Đăng Ký Tài Khoản</h1>
            <p>Tạo tài khoản mới để bắt đầu mua sắm</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Họ và Tên</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Địa Chỉ Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Số Điện Thoại</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0123456789"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Địa Chỉ</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Đường ABC, Quận XYZ"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật Khẩu</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? "Đang đăng ký..." : "Đăng Ký"}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register

