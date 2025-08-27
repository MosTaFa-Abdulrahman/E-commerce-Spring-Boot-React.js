package com.mostafa.api.ecommerce.dto.user;

import java.util.UUID;

public record UserInfoDto(
        UUID userId,
        String username,
        String email,
        String role
) {
}
