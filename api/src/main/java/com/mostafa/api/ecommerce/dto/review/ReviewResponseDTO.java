package com.mostafa.api.ecommerce.dto.review;

import com.mostafa.api.ecommerce.dto.user.UserResponseSummaryDTO;

import java.util.UUID;

public record ReviewResponseDTO(
        UUID id,
        int rating,
        String description,

        UserResponseSummaryDTO user
) {
}
