# Hướng dẫn Setup và Chạy Backend

## Bước 1: Cài đặt MySQL

1. Cài đặt MySQL 8.0+ trên máy
2. Tạo database:
```sql
CREATE DATABASE bandongho_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Bước 2: Cấu hình Database

Sửa file `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bandongho_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&characterEncoding=UTF-8
spring.datasource.username=root
spring.datasource.password=your_password_here
```

## Bước 3: Cấu hình Email (Tùy chọn)

Nếu muốn test chức năng gửi email, cấu hình trong `application.properties`:
```properties
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

**Lưu ý**: Với Gmail, cần tạo App Password trong Google Account settings.

## Bước 4: Build và Chạy

### Cách 1: Sử dụng Maven
```bash
cd BE
mvn clean install
mvn spring-boot:run
```

### Cách 2: Sử dụng IDE
1. Mở project trong IntelliJ IDEA hoặc Eclipse
2. Đảm bảo Java 17 được cấu hình
3. Chạy file `BanDongHoApplication.java`

## Bước 5: Kiểm tra

- API chạy tại: http://localhost:8080/api
- Swagger UI: http://localhost:8080/api/swagger-ui.html
- API Docs: http://localhost:8080/api/api-docs

## Bước 6: Test API

### 1. Tạo Category (Admin)
```bash
POST http://localhost:8080/api/categories
Content-Type: application/json

{
  "name": "Luxury",
  "description": "Đồng hồ cao cấp"
}
```

### 2. Tạo Product (Admin)
```bash
POST http://localhost:8080/api/products
Content-Type: application/json

{
  "name": "Classic Elegance",
  "description": "Timeless sophistication with Swiss precision",
  "price": 2990000,
  "stock": 100,
  "imageUrl": "/luxury-watch-classic-design.jpg",
  "rating": 4.8,
  "reviews": 142,
  "categoryId": 1
}
```

### 3. Đăng ký User
```bash
POST http://localhost:8080/api/users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "123456",
  "fullName": "Nguyễn Văn A",
  "phone": "0123456789",
  "address": "123 Đường ABC, Quận XYZ"
}
```

### 4. Đăng nhập
```bash
POST http://localhost:8080/api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "123456"
}
```

### 5. Xem danh sách sản phẩm (Guest)
```bash
GET http://localhost:8080/api/products
```

### 6. Xem chi tiết sản phẩm
```bash
GET http://localhost:8080/api/products/1
```

### 7. Thanh toán (Checkout)
```bash
POST http://localhost:8080/api/orders/checkout
Content-Type: application/json

{
  "userId": 1,
  "shippingAddress": "123 Đường ABC, Quận XYZ",
  "phoneNumber": "0123456789",
  "cartItems": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 2990000
    }
  ]
}
```

## Troubleshooting

### Lỗi kết nối database
- Kiểm tra MySQL đã chạy chưa
- Kiểm tra username/password trong application.properties
- Kiểm tra database đã được tạo chưa

### Lỗi port 8080 đã được sử dụng
- Đổi port trong application.properties: `server.port=8081`
- Hoặc tắt ứng dụng đang chạy trên port 8080

### Lỗi compile
- Đảm bảo Java 17 đã được cài đặt
- Chạy `mvn clean install` để rebuild project
- Kiểm tra Lombok plugin đã được cài trong IDE

