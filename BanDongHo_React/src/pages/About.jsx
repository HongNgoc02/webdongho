import "./About.css"

function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <h1>Về Chúng Tôi</h1>
          <p className="hero-subtitle">Chrono - Đồng Hồ Chính Hãng, Chất Lượng Cao</p>
        </div>
      </section>

      <section className="about-content">
        <div className="container">
          <div className="about-section">
            <h2>Câu Chuyện Của Chúng Tôi</h2>
            <p>
              Chrono được thành lập với sứ mệnh mang đến những chiếc đồng hồ chất lượng cao, 
              chính hãng với giá cả hợp lý cho người Việt Nam. Chúng tôi tin rằng mỗi chiếc đồng hồ 
              không chỉ là một phụ kiện thời trang mà còn là biểu tượng của phong cách và đẳng cấp.
            </p>
          </div>

          <div className="about-section">
            <h2>Tầm Nhìn</h2>
            <p>
              Trở thành cửa hàng đồng hồ hàng đầu tại Việt Nam, nơi khách hàng có thể tìm thấy 
              những sản phẩm chất lượng cao với dịch vụ chăm sóc khách hàng xuất sắc.
            </p>
          </div>

          <div className="about-section">
            <h2>Sứ Mệnh</h2>
            <p>
              Cung cấp những chiếc đồng hồ chính hãng, đảm bảo chất lượng và uy tín, 
              mang đến trải nghiệm mua sắm tuyệt vời cho mọi khách hàng.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h3>Chất Lượng Chính Hãng</h3>
              <p>Tất cả đồng hồ được đảm bảo 100% chính hãng với chứng nhận đầy đủ</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Giao Hàng Nhanh</h3>
              <p>Miễn phí vận chuyển cho đơn hàng trên 2.500.000đ trên toàn quốc</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">↩️</div>
              <h3>Đổi Trả Dễ Dàng</h3>
              <p>Bảo đảm hoàn tiền trong 30 ngày nếu không hài lòng</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Bảo Hành Chính Hãng</h3>
              <p>Bảo hành 2 năm cho tất cả sản phẩm, hỗ trợ sửa chữa tại các trung tâm chính hãng</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Hỗ Trợ 24/7</h3>
              <p>Đội ngũ tư vấn chuyên nghiệp sẵn sàng hỗ trợ bạn mọi lúc</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Đánh Giá Cao</h3>
              <p>Hàng nghìn khách hàng đã tin tưởng và hài lòng với dịch vụ của chúng tôi</p>
            </div>
          </div>

          <div className="about-section">
            <h2>Liên Hệ Với Chúng Tôi</h2>
            <div className="contact-info">
              <div className="contact-item">
                <strong>Địa Chỉ:</strong>
                <p>123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</p>
              </div>
              <div className="contact-item">
                <strong>Hotline:</strong>
                <p>1900 1234 5678</p>
              </div>
              <div className="contact-item">
                <strong>Email:</strong>
                <p>support@chrono.vn</p>
              </div>
              <div className="contact-item">
                <strong>Giờ Làm Việc:</strong>
                <p>Thứ 2 - Chủ Nhật: 8:00 - 22:00</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About

