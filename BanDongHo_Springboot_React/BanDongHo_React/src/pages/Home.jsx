import { Link } from "react-router-dom"
import "./Home.css"

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Vẻ Đẹp Vượt Thời Gian</h1>
          <p>Khám phá chiếc đồng hồ hoàn hảo cho mọi khoảnh khắc</p>
          <Link to="/shop" className="btn-cta">
            Mua Ngay
          </Link>
        </div>
      </section>

      <section className="featured">
        <div className="container">
          <h2>Bộ Sưu Tập Nổi Bật</h2>
          <div className="collection-grid">
            <div className="collection-card">
              <div
                className="collection-image"
                style={{ backgroundImage: "url(/luxury-watch-classic-design.jpg)" }}
              ></div>
              <h3>Cao Cấp</h3>
              <p>Chất lượng thủ công và thiết kế vượt thời gian</p>
              <Link to="/shop?category=Luxury">Khám Phá</Link>
            </div>
            <div className="collection-card">
              <div
                className="collection-image"
                style={{ backgroundImage: "url(/sports-watch-modern-design.jpg)" }}
              ></div>
              <h3>Thể Thao</h3>
              <p>Được chế tạo cho hiệu suất và phiêu lưu</p>
              <Link to="/shop?category=Sports">Khám Phá</Link>
            </div>
            <div className="collection-card">
              <div className="collection-image" style={{ backgroundImage: "url(/smartwatch-technology.jpg)" }}></div>
              <h3>Thông Minh</h3>
              <p>Công nghệ gặp gỡ sự tinh tế</p>
              <Link to="/shop?category=Smart">Khám Phá</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="why-us">
        <div className="container">
          <h2>Tại Sao Chọn Chrono?</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">✓</div>
              <h4>Chất Lượng Chính Hãng</h4>
              <p>Tất cả đồng hồ được đảm bảo 100% chính hãng</p>
            </div>
            <div className="feature">
              <div className="feature-icon">✓</div>
              <h4>Giao Hàng Nhanh</h4>
              <p>Miễn phí vận chuyển cho đơn hàng trên 2.500.000đ</p>
            </div>
            <div className="feature">
              <div className="feature-icon">✓</div>
              <h4>Đổi Trả Dễ Dàng</h4>
              <p>Bảo đảm hoàn tiền trong 30 ngày</p>
            </div>
            <div className="feature">
              <div className="feature-icon">✓</div>
              <h4>Hỗ Trợ Chuyên Nghiệp</h4>
              <p>Dịch vụ khách hàng 24/7</p>
            </div>
          </div>
        </div>
      </section>

      <section className="newsletter">
        <div className="container">
          <h2>Cập Nhật Thông Tin</h2>
          <p>Đăng ký để nhận ưu đãi đặc biệt và cập nhật bộ sưu tập mới</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Nhập email của bạn" />
            <button className="btn-primary">Đăng Ký</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
