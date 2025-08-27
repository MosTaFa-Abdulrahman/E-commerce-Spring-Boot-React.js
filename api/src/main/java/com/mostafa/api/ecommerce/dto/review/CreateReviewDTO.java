package com.mostafa.api.ecommerce.dto.review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateReviewDTO(
        @Min(value = 1, message = "Rating cannot be negative or zero")
        @Max(value = 5, message = "Rating cannot be Greater than 5")
        Integer rating,

        @Size(max = 1000, message = "Description cannot exceed 1000 characters")
        String description,


        @NotNull(message = "User ID is required")
        UUID userId,
        @NotNull(message = "Product ID is required")
        UUID productId
) {
}
