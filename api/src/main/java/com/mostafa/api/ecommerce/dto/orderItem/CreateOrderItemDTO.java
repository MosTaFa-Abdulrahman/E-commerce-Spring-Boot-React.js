package com.mostafa.api.ecommerce.dto.orderItem;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CreateOrderItemDTO(
        @Min(value = 1, message = "Quantity must be at least 1")
        int quantity,

        @Min(value = 0, message = "Price must be at least 0")
        @Max(value = 99999, message = "Price must be at not greater than 99999")
        int price,


        @NotNull(message = "Product ID is required")
        UUID productId
) {
}
