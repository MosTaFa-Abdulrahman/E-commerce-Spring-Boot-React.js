package com.mostafa.api.ecommerce.dto.favourites;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CreateFavouritesDTO(
        @NotNull(message = "User ID is required")
        UUID userId,
        @NotNull(message = "Product ID is required")
        UUID productId
) {
}
