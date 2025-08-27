package com.mostafa.api.ecommerce.dto.favourites;

import java.util.UUID;

public record FavouritesResponseDTO(
        UUID id,

        // User
        UUID userId,
        String userName,
        String userEmail,

        // Product
        UUID productId,
        String productName,
        String productImageUrl
) {
}
