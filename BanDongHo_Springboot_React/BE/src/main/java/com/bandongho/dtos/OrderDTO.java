package com.bandongho.dtos;

import com.bandongho.entities.Order;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;

    private String orderNumber;

    @NotNull(message = "User ID is required")
    private Long userId;

    private String userEmail;
    private String userName;

    @Valid
    @NotEmpty(message = "Order items are required")
    private List<OrderItemDTO> orderItems = new ArrayList<>();

    private BigDecimal totalAmount;

    private Order.OrderStatus status;

    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

