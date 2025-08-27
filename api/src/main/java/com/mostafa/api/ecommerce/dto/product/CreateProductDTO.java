package com.mostafa.api.ecommerce.dto.product;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.UUID;

public record CreateProductDTO(
        @NotBlank(message = "Product name is required")
        @Size(max = 255, message = "Product name cannot exceed 255 characters")
        String name,

        @Size(max = 1000, message = "Description cannot exceed 1000 characters")
        String description,

        @Min(value = 0, message = "Stock quantity cannot be negative")
        Integer stockQuantity,

        BigDecimal price,
        String imageUrl,


        @NotNull(message = "Category ID is required")
        UUID categoryId
) {
}
