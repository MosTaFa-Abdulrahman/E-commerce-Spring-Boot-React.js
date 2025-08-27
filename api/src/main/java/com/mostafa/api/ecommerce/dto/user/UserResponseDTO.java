package com.mostafa.api.ecommerce.dto.user;

import com.mostafa.api.ecommerce.enums.UserRole;

import java.util.UUID;

public record UserResponseDTO(
        UUID id,
        String username,
        String email,
        String phoneNumber,


        UserRole role
) {
}
