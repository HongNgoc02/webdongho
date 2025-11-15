package com.bandongho.services.impl;

import com.bandongho.services.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendRegistrationEmail(String to, String userName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Chào mừng bạn đến với BanDongHo!");
            helper.setText(buildRegistrationEmailContent(userName), true);

            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("Error sending registration email: " + e.getMessage());
        }
    }

    @Override
    public void sendOrderConfirmationEmail(String to, String userName, String orderNumber, Double totalAmount) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Xác nhận đơn hàng #" + orderNumber);
            helper.setText(buildOrderConfirmationEmailContent(userName, orderNumber, totalAmount), true);

            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("Error sending order confirmation email: " + e.getMessage());
        }
    }

    private String buildRegistrationEmailContent(String userName) {
        return "<html><body>" +
                "<h2>Chào mừng bạn đến với BanDongHo!</h2>" +
                "<p>Xin chào <strong>" + userName + "</strong>,</p>" +
                "<p>Cảm ơn bạn đã đăng ký tài khoản tại BanDongHo. Tài khoản của bạn đã được tạo thành công.</p>" +
                "<p>Bạn có thể bắt đầu mua sắm ngay bây giờ!</p>" +
                "<p>Trân trọng,<br>Đội ngũ BanDongHo</p>" +
                "</body></html>";
    }

    private String buildOrderConfirmationEmailContent(String userName, String orderNumber, Double totalAmount) {
        return "<html><body>" +
                "<h2>Xác nhận đơn hàng thành công!</h2>" +
                "<p>Xin chào <strong>" + userName + "</strong>,</p>" +
                "<p>Cảm ơn bạn đã đặt hàng tại BanDongHo.</p>" +
                "<p><strong>Mã đơn hàng:</strong> " + orderNumber + "</p>" +
                "<p><strong>Tổng tiền:</strong> " + String.format("%,.0f", totalAmount) + " VNĐ</p>" +
                "<p>Đơn hàng của bạn đã được tiếp nhận và sẽ được xử lý sớm nhất.</p>" +
                "<p>Trân trọng,<br>Đội ngũ BanDongHo</p>" +
                "</body></html>";
    }
}

