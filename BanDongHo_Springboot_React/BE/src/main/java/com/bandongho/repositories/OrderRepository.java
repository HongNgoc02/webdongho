package com.bandongho.repositories;

import com.bandongho.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<Order> findAllByOrderByCreatedAtDesc();
    
    @Query("SELECT o FROM Order o WHERE o.orderNumber LIKE %:keyword% OR o.user.email LIKE %:keyword% OR o.user.fullName LIKE %:keyword%")
    List<Order> searchOrders(@Param("keyword") String keyword);
    
    Optional<Order> findByOrderNumber(String orderNumber);
}

