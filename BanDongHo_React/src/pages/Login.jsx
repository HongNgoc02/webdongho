import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import "./Login.css"

function Login({ onLogin }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Vui lòng điền đầy đủ thông tin")
      return
    }

    // Simulate login - mock data
    if (email === "customer@example.com" && password === "password") {
      onLogin({
        name: "Nguyễn Văn A",
        email: "customer@example.com",
        role: "customer",
      })
      navigate("/")
    } else if (email === "admin@example.com" && password === "password") {
      onLogin({
        name: "Quản Trị Viên",
        email: "admin@example.com",
        role: "admin",
      })
      navigate("/admin")
    } else {
      setError("Thông tin đăng nhập không hợp lệ. Thử customer@example.com hoặc admin@example.com (mật khẩu: password)")
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

            <button type="submit" className="btn-login">
              Đăng Nhập
            </button>
          </form>

          <div className="login-footer">
            <p>
              Chưa có tài khoản? <Link to="/signup">Tạo tài khoản</Link>
            </p>
          </div>

          <div className="demo-credentials">
            <h3>Thông Tin Demo:</h3>
            <p>
              <strong>Khách Hàng:</strong> customer@example.com
            </p>
            <p>
              <strong>Quản Trị:</strong> admin@example.com
            </p>
            <p>
              <strong>Mật Khẩu:</strong> password
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
