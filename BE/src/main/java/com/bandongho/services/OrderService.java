package com.bandongho.services;

import com.bandongho.dtos.CheckoutRequest;
import com.bandongho.dtos.OrderDTO;
import com.bandongho.dtos.OrderItemDTO;

import java.util.List;

public interface OrderService {
    OrderDTO createOrder(CheckoutRequest request, List<OrderItemDTO> cartItems);
    OrderDTO updateOrder(Long id, OrderDTO orderDTO);
    OrderDTO updateOrderItemQuantity(Long orderId, Long orderItemId, Integer quantity);
    OrderDTO getOrderById(Long id);
    OrderDTO getOrderByOrderNumber(String orderNumber);
    List<OrderDTO> getAllOrders();
    List<OrderDTO> getOrdersByUserId(Long userId);
    List<OrderDTO> searchOrders(String keyword);
    void deleteOrder(Long id);
}

