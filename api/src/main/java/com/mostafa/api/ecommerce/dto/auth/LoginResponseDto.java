package com.mostafa.api.ecommerce.dto.auth;

import java.util.UUID;

public record LoginResponseDto(
        String token,
        UUID userId,
        String username,
        String email,
        String role
) {
}
