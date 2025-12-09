import { Navigate } from "react-router-dom"

function ProtectedRoute({ children, user, requiredRole }) {
  // Nếu chưa đăng nhập, redirect đến login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Nếu có requiredRole, kiểm tra role
  if (requiredRole) {
    // Admin có thể truy cập tất cả routes (bao gồm cả customer routes)
    if (user.role === "admin") {
      return children
    }
    
    // Admin routes - chỉ admin mới có thể truy cập
    if (requiredRole === "admin" && user.role !== "admin") {
      return <Navigate to="/" replace />
    }
    
    // Customer routes - customer và admin đều có thể truy cập
    if (requiredRole === "customer") {
      // Admin cũng có thể truy cập customer routes
      return children
    }
    
    // Nếu role khớp với requiredRole
    if (user.role === requiredRole) {
      return children
    }
  }

  // Nếu không có requiredRole, chỉ cần đăng nhập (cả admin và customer đều có thể truy cập)
  return children
}

export default ProtectedRoute

