import { useState } from "react"
import { mockOrders } from "../../data/mockData"
import AdminLayout from "./AdminLayout"
import "./AdminOrders.css"

function AdminOrders({ user, onLogout }) {
  const [orders, setOrders] = useState(mockOrders)

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  return (
    <AdminLayout user={user} onLogout={onLogout}>
      <div className="orders-container">
        <section className="orders-section">
          <h2>Quản Lý Đơn Hàng</h2>
          <div className="orders-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã Đơn Hàng</th>
                  <th>Khách Hàng</th>
                  <th>Email</th>
                  <th>Sản Phẩm</th>
                  <th>Tổng Tiền</th>
                  <th>Trạng Thái</th>
                  <th>Ngày</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.id}</strong>
                    </td>
                    <td>{order.user}</td>
                    <td>{order.email}</td>
                    <td>
                      <div className="items-count">{order.items.length} sản phẩm</div>
                      <ul className="items-list">
                        {order.items.map((item) => (
                          <li key={item.id}>
                            {item.name} x {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="amount">${order.total.toFixed(2)}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`status-select ${order.status.toLowerCase()}`}
                      >
                        <option value="Pending">Chờ Xử Lý</option>
                        <option value="Processing">Đang Xử Lý</option>
                        <option value="Delivered">Đã Giao</option>
                      </select>
                    </td>
                    <td>{order.date}</td>
                    <td>
                      <button className="btn-view">Xem</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminLayout>
  )
}

export default AdminOrders
