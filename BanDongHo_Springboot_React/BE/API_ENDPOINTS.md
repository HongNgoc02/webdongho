# Danh sách API Endpoints

## Base URL
```
http://localhost:8080/api
```

## 1. User APIs

### Đăng ký tài khoản
```
POST /users/register
Body: {
  "email": "user@example.com",
  "password": "123456",
  "fullName": "Nguyễn Văn A",
  "phone": "0123456789",
  "address": "123 Đường ABC"
}
```

### Đăng nhập
```
POST /users/login
Body: {
  "email": "user@example.com",
  "password": "123456"
}
```

### Lấy thông tin user
```
GET /users/{id}
```

### Cập nhật thông tin user
```
PUT /users/{id}
Body: {
  "fullName": "Nguyễn Văn B",
  "phone": "0987654321",
  "address": "456 Đường XYZ"
}
```

### Lấy danh sách users (Admin)
```
GET /users
```

### Tìm kiếm users (Admin)
```
GET /users/search?keyword=nguyen
```

### Xóa user (Admin)
```
DELETE /users/{id}
```

## 2. Product APIs

### Lấy danh sách sản phẩm (Guest/Customer/Admin)
```
GET /products
```

### Lấy chi tiết sản phẩm
```
GET /products/{id}
```

### Lấy sản phẩm theo danh mục
```
GET /products/category/{categoryId}
```

### Tìm kiếm sản phẩm
```
GET /products/search?keyword=watch
```

### Tìm kiếm sản phẩm theo danh mục
```
GET /products/search/category/{categoryId}?keyword=watch
```

### Tạo sản phẩm (Admin)
```
POST /products
Body: {
  "name": "Classic Elegance",
  "description": "Timeless sophistication",
  "price": 2990000,
  "stock": 100,
  "imageUrl": "/luxury-watch.jpg",
  "rating": 4.8,
  "reviews": 142,
  "categoryId": 1
}
```

### Cập nhật sản phẩm (Admin)
```
PUT /products/{id}
Body: {
  "name": "Updated Name",
  "price": 3500000,
  "stock": 150
}
```

### Xóa sản phẩm (Admin)
```
DELETE /products/{id}
```

## 3. Category APIs

### Lấy danh sách danh mục
```
GET /categories
```

### Lấy chi tiết danh mục
```
GET /categories/{id}
```

### Tìm kiếm danh mục
```
GET /categories/search?keyword=luxury
```

### Tạo danh mục (Admin)
```
POST /categories
Body: {
  "name": "Luxury",
  "description": "Đồng hồ cao cấp"
}
```

### Cập nhật danh mục (Admin)
```
PUT /categories/{id}
Body: {
  "name": "Premium",
  "description": "Đồng hồ cao cấp nhất"
}
```

### Xóa danh mục (Admin)
```
DELETE /categories/{id}
```

## 4. Order APIs

### Thanh toán (Checkout)
```
POST /orders/checkout
Body: {
  "userId": 1,
  "shippingAddress": "123 Đường ABC",
  "phoneNumber": "0123456789",
  "cartItems": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 2990000
    },
    {
      "productId": 2,
      "quantity": 1,
      "price": 1990000
    }
  ]
}
```

### Lấy chi tiết đơn hàng
```
GET /orders/{id}
```

### Lấy đơn hàng theo order number
```
GET /orders/number/{orderNumber}
```

### Lấy đơn hàng của user
```
GET /orders/user/{userId}
```

### Lấy danh sách đơn hàng (Admin)
```
GET /orders
```

### Tìm kiếm đơn hàng (Admin)
```
GET /orders/search?keyword=ORD123
```

### Cập nhật đơn hàng (Admin)
```
PUT /orders/{id}
Body: {
  "status": "PROCESSING"
}
```

### Cập nhật số lượng sản phẩm trong đơn hàng (Admin)
```
PUT /orders/{orderId}/items/{orderItemId}?quantity=5
```

### Xóa đơn hàng (Admin)
```
DELETE /orders/{id}
```

## Response Format

Tất cả API trả về định dạng:
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

## Error Response

```json
{
  "success": false,
  "message": "Error message",
  "data": null
}
```

## Validation Errors

```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "email": "Email should be valid",
    "password": "Password must be at least 6 characters"
  }
}
```

