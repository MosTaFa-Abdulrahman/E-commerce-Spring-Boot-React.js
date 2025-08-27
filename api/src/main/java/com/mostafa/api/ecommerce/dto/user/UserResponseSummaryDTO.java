package com.mostafa.api.ecommerce.dto.user;

import com.mostafa.api.ecommerce.enums.UserRole;

import java.util.UUID;

public record UserResponseSummaryDTO(
        UUID id,
        String username,
        String email,
        UserRole role
) {
}
