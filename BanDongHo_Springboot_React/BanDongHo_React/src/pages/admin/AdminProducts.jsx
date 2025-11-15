import { useState } from "react"
import { mockProducts } from "../../data/mockData"
import AdminLayout from "./AdminLayout"
import "./AdminProducts.css"

function AdminProducts({ user, onLogout }) {
  const [products] = useState(mockProducts)
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "Luxury",
  })

  const handleAddProduct = (e) => {
    e.preventDefault()
    // In a real app, this would save to a database
    alert(`Sản phẩm "${newProduct.name}" sẽ được thêm!`)
    setNewProduct({ name: "", price: "", category: "Luxury" })
  }

  return (
    <AdminLayout user={user} onLogout={onLogout}>
      <div className="products-container">
        <section className="add-product-section">
          <h2>Thêm Sản Phẩm Mới</h2>
          <form onSubmit={handleAddProduct} className="product-form">
            <div className="form-group">
              <label>Tên Sản Phẩm</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Nhập tên sản phẩm"
                required
              />
            </div>

            <div className="form-group">
              <label>Giá</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                placeholder="Nhập giá"
                required
              />
            </div>

            <div className="form-group">
              <label>Danh Mục</label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              >
                <option>Luxury</option>
                <option>Sports</option>
                <option>Smart</option>
                <option>Casual</option>
              </select>
            </div>

            <button type="submit" className="btn-submit">
              Thêm Sản Phẩm
            </button>
          </form>
        </section>

        <section className="products-section">
          <h2>Tất Cả Sản Phẩm ({products.length})</h2>
          <div className="products-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tên Sản Phẩm</th>
                  <th>Danh Mục</th>
                  <th>Giá</th>
                  <th>Đánh Giá</th>
                  <th>Nhận Xét</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <strong>{product.name}</strong>
                    </td>
                    <td>{product.category}</td>
                    <td className="price">${product.price}</td>
                    <td>⭐ {product.rating}</td>
                    <td>{product.reviews}</td>
                    <td className="actions">
                      <button className="btn-edit">Sửa</button>
                      <button className="btn-delete">Xóa</button>
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

export default AdminProducts
