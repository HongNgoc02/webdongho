package com.bandongho.services.impl;

import com.bandongho.dtos.CheckoutRequest;
import com.bandongho.dtos.OrderDTO;
import com.bandongho.dtos.OrderItemDTO;
import com.bandongho.entities.Order;
import com.bandongho.entities.OrderItem;
import com.bandongho.entities.Product;
import com.bandongho.entities.User;
import com.bandongho.exceptions.ResourceNotFoundException;
import com.bandongho.exceptions.BusinessException;
import com.bandongho.repositories.OrderRepository;
import com.bandongho.repositories.ProductRepository;
import com.bandongho.services.EmailService;
import com.bandongho.services.OrderService;
import com.bandongho.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Override
    public OrderDTO createOrder(CheckoutRequest request, List<OrderItemDTO> cartItems) {
        if (cartItems == null || cartItems.isEmpty()) {
            throw new BusinessException("Cart is empty");
        }

        User user = userService.getUserEntity(request.getUserId());

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(request.getShippingAddress());
        order.setPhoneNumber(request.getPhoneNumber());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setOrderNumber("ORD" + System.currentTimeMillis());

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemDTO itemDTO : cartItems) {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemDTO.getProductId()));

            if (product.getStock() < itemDTO.getQuantity()) {
                throw new BusinessException("Insufficient stock for product: " + product.getName());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setPrice(product.getPrice());
            // Calculate subtotal
            BigDecimal itemSubtotal = product.getPrice().multiply(BigDecimal.valueOf(itemDTO.getQuantity()));
            orderItem.setSubtotal(itemSubtotal);

            order.getOrderItems().add(orderItem);
            totalAmount = totalAmount.add(itemSubtotal);

            // Update product stock
            product.setStock(product.getStock() - itemDTO.getQuantity());
            productRepository.save(product);
        }

        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);

        // Send order confirmation email
        emailService.sendOrderConfirmationEmail(
                user.getEmail(),
                user.getFullName(),
                savedOrder.getOrderNumber(),
                savedOrder.getTotalAmount().doubleValue()
        );

        return convertToDTO(savedOrder);
    }

    @Override
    public OrderDTO updateOrder(Long id, OrderDTO orderDTO) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        if (orderDTO.getStatus() != null) {
            order.setStatus(orderDTO.getStatus());
        }
        if (orderDTO.getShippingAddress() != null) {
            order.setShippingAddress(orderDTO.getShippingAddress());
        }
        if (orderDTO.getPhoneNumber() != null) {
            order.setPhoneNumber(orderDTO.getPhoneNumber());
        }

        Order updatedOrder = orderRepository.save(order);
        return convertToDTO(updatedOrder);
    }

    @Override
    public OrderDTO updateOrderItemQuantity(Long orderId, Long orderItemId, Integer quantity) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        OrderItem orderItem = order.getOrderItems().stream()
                .filter(item -> item.getId().equals(orderItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Order item not found with id: " + orderItemId));

        if (quantity <= 0) {
            throw new BusinessException("Quantity must be greater than 0");
        }

        Product product = orderItem.getProduct();
        int stockDifference = quantity - orderItem.getQuantity();

        if (product.getStock() < stockDifference) {
            throw new BusinessException("Insufficient stock for product: " + product.getName());
        }

        orderItem.setQuantity(quantity);
        // Recalculate subtotal for this item
        BigDecimal itemSubtotal = orderItem.getPrice().multiply(BigDecimal.valueOf(quantity));
        orderItem.setSubtotal(itemSubtotal);

        // Update product stock
        product.setStock(product.getStock() - stockDifference);
        productRepository.save(product);

        // Recalculate total amount
        BigDecimal totalAmount = order.getOrderItems().stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(totalAmount);

        Order updatedOrder = orderRepository.save(order);
        return convertToDTO(updatedOrder);
    }

    @Override
    public OrderDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        return convertToDTO(order);
    }

    @Override
    public OrderDTO getOrderByOrderNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with order number: " + orderNumber));
        return convertToDTO(order);
    }

    @Override
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> searchOrders(String keyword) {
        return orderRepository.searchOrders(keyword).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new ResourceNotFoundException("Order not found with id: " + id);
        }
        orderRepository.deleteById(id);
    }

    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setUserId(order.getUser().getId());
        dto.setUserEmail(order.getUser().getEmail());
        dto.setUserName(order.getUser().getFullName());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setPhoneNumber(order.getPhoneNumber());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());

        dto.setOrderItems(order.getOrderItems().stream()
                .map(this::convertOrderItemToDTO)
                .collect(Collectors.toList()));

        return dto;
    }

    private OrderItemDTO convertOrderItemToDTO(OrderItem orderItem) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setId(orderItem.getId());
        dto.setProductId(orderItem.getProduct().getId());
        dto.setProductName(orderItem.getProduct().getName());
        dto.setProductImageUrl(orderItem.getProduct().getImageUrl());
        dto.setQuantity(orderItem.getQuantity());
        dto.setPrice(orderItem.getPrice());
        dto.setSubtotal(orderItem.getSubtotal());
        return dto;
    }
}

