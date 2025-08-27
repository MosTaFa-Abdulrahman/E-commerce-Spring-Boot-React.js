package com.mostafa.api.ecommerce.dto.order;

import com.mostafa.api.ecommerce.dto.orderItem.OrderItemResponseDTO;
import com.mostafa.api.ecommerce.dto.user.UserResponseSummaryDTO;
import com.mostafa.api.ecommerce.enums.OrderStatus;
import com.mostafa.api.ecommerce.model.OrderAddress;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record OrderResponseDTO(
        UUID id,
        BigDecimal totalPrice,
        String paymentId,

        OrderStatus status,
        OrderAddress orderAddress,
        UserResponseSummaryDTO user,
        List<OrderItemResponseDTO> orderItems,
        java.time.LocalDateTime createdAt


) {
}
