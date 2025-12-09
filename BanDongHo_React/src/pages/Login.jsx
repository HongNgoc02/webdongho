import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { userAPI } from "../services/api"
import "./Login.css"

function Login({ onLogin }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!email || !password) {
      setError("Vui lòng điền đầy đủ thông tin")
      setLoading(false)
      return
    }

    try {
      const response = await userAPI.login(email, password)
      
      if (response.success && response.data) {
        const userData = response.data
        // Map role từ backend (CUSTOMER, ADMIN) sang frontend (customer, admin)
        const role = userData.role?.toLowerCase() || "customer"
        
        onLogin({
          id: userData.id,
          name: userData.fullName,
          email: userData.email,
          role: role,
          phone: userData.phone,
          address: userData.address,
        })

        // Redirect based on role
        if (role === "admin") {
          navigate("/admin")
        } else {
          navigate("/")
        }
      } else {
        setError(response.message || "Đăng nhập thất bại")
      }
    } catch (err) {
      setError(err.message || "Thông tin đăng nhập không hợp lệ")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Chào Mừng Trở Lại</h1>
            <p>Đăng nhập vào tài khoản của bạn</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Địa Chỉ Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật Khẩu</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu của bạn"
              />
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Chưa có tài khoản? <Link to="/register">Tạo tài khoản</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
