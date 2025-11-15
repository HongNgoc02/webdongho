package com.bandongho.services;

public interface EmailService {
    void sendRegistrationEmail(String to, String userName);
    void sendOrderConfirmationEmail(String to, String userName, String orderNumber, Double totalAmount);
}

