# BanDongHo Spring Boot Backend

Backend API cho website bán đồng hồ sử dụng Spring Boot.

## Yêu cầu

- Java 17
- Maven 3.6+
- MySQL 8.0+

## Cấu hình

1. Tạo database MySQL:
```sql
CREATE DATABASE bandongho_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Cấu hình database trong `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bandongho_db
spring.datasource.username=root
spring.datasource.password=your_password
```

3. Cấu hình email (tùy chọn):
```properties
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

## Chạy ứng dụng

```bash
mvn spring-boot:run
```

Hoặc build và chạy:
```bash
mvn clean package
java -jar target/bandongho-springboot-1.0.0.jar
```

## API Documentation

Sau khi chạy ứng dụng, truy cập Swagger UI tại:
- http://localhost:8080/api/swagger-ui.html
- http://localhost:8080/api/api-docs

## API Endpoints

### Users
- `POST /api/users/register` - Đăng ký tài khoản
- `POST /api/users/login` - Đăng nhập
- `GET /api/users/{id}` - Lấy thông tin user
- `PUT /api/users/{id}` - Cập nhật thông tin user
- `GET /api/users` - Lấy danh sách users (Admin)
- `GET /api/users/search?keyword=...` - Tìm kiếm users (Admin)
- `DELETE /api/users/{id}` - Xóa user (Admin)

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/{id}` - Lấy chi tiết sản phẩm
- `GET /api/products/category/{categoryId}` - Lấy sản phẩm theo danh mục
- `GET /api/products/search?keyword=...` - Tìm kiếm sản phẩm
- `POST /api/products` - Tạo sản phẩm (Admin)
- `PUT /api/products/{id}` - Cập nhật sản phẩm (Admin)
- `DELETE /api/products/{id}` - Xóa sản phẩm (Admin)

### Categories
- `GET /api/categories` - Lấy danh sách danh mục
- `GET /api/categories/{id}` - Lấy chi tiết danh mục
- `GET /api/categories/search?keyword=...` - Tìm kiếm danh mục
- `POST /api/categories` - Tạo danh mục (Admin)
- `PUT /api/categories/{id}` - Cập nhật danh mục (Admin)
- `DELETE /api/categories/{id}` - Xóa danh mục (Admin)

### Orders
- `POST /api/orders/checkout` - Thanh toán đơn hàng
- `GET /api/orders/{id}` - Lấy chi tiết đơn hàng
- `GET /api/orders/user/{userId}` - Lấy đơn hàng của user
- `GET /api/orders` - Lấy danh sách đơn hàng (Admin)
- `GET /api/orders/search?keyword=...` - Tìm kiếm đơn hàng (Admin)
- `PUT /api/orders/{id}` - Cập nhật đơn hàng (Admin)
- `PUT /api/orders/{orderId}/items/{orderItemId}?quantity=...` - Cập nhật số lượng (Admin)

## Cấu trúc dự án

```
src/main/java/com/bandongho/
├── entities/          # Entity classes
├── dtos/             # Data Transfer Objects
├── repositories/     # Repository interfaces
├── services/         # Service interfaces
├── services/impl/    # Service implementations
├── controllers/      # REST Controllers
├── configs/          # Configuration classes
└── exceptions/       # Exception handlers
```

## Lưu ý

- API không có bảo mật (không sử dụng Spring Security)
- Mật khẩu được lưu dạng plain text (nên mã hóa trong production)
- CORS đã được cấu hình để cho phép tất cả origins
- Database sẽ tự động tạo bảng khi chạy ứng dụng (spring.jpa.hibernate.ddl-auto=update)

