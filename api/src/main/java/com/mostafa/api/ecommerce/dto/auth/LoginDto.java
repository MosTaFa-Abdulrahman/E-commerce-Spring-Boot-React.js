package com.mostafa.api.ecommerce.dto.auth;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public record LoginDto(
        @NotNull(message = "username is required")
        @Size(min = 2, max = 50, message = "min is 2, max is 50")
        String username,

        @NotNull(message = "password is required")
        @Size(min = 6, max = 50, message = "min is 6, max is 50")
        String password
) {
}
