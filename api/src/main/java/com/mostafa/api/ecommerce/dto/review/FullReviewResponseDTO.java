package com.mostafa.api.ecommerce.dto.review;

import java.time.LocalDateTime;
import java.util.UUID;


public record FullReviewResponseDTO(
        UUID id,
        int rating,
        String description,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,

        // User
        UUID userId,
        String userName,
        String userEmail,

        // Product
        UUID productId,
        String productName,
        String productDescription
) {
}
