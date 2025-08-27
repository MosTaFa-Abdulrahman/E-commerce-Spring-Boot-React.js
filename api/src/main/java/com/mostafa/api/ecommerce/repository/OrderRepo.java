package com.mostafa.api.ecommerce.repository;

import com.mostafa.api.ecommerce.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;


@Repository
public interface OrderRepo extends JpaRepository<Order, UUID> {
    List<Order> findByUserIdOrderByCreatedDateDesc(UUID userId);
}
