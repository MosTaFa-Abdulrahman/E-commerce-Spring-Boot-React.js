package com.mostafa.api.ecommerce.dto.order;

import com.mostafa.api.ecommerce.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;


public record UpdateOrderStatusDTO(
        @NotNull(message = "Order status is required")
        OrderStatus status
) {
}
