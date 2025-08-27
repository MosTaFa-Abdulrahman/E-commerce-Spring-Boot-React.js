package com.mostafa.api.ecommerce.repository;

import com.mostafa.api.ecommerce.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;


@Repository
public interface OrderItemRepo extends JpaRepository<OrderItem, UUID> {
}
