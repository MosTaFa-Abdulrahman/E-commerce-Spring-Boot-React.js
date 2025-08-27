package com.mostafa.api.ecommerce.dto.order;

import com.mostafa.api.ecommerce.dto.orderItem.CreateOrderItemDTO;
import com.mostafa.api.ecommerce.model.OrderAddress;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record CreateOrderDTO(
        @Min(value = 0, message = "Price must be at least 0")
        @Max(value = 99999, message = "Price must be at not greater than 99999")
        BigDecimal totalPrice,


        @NotNull(message = "User is required")
        UUID userId,

        @NotNull(message = "Order address is required")
        @Valid
        OrderAddress orderAddress,

        @NotEmpty(message = "Order items cannot be empty")
        @Valid
        List<CreateOrderItemDTO> orderItems
) {
}
