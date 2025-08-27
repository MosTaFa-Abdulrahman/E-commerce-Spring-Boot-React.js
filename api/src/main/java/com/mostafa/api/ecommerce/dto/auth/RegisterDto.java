package com.mostafa.api.ecommerce.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public record RegisterDto(
        @NotNull(message = "username is required")
        @Size(min = 2, max = 50, message = "min is 2, max is 50")
        String username,
        
        @NotBlank(message = "Email is required")
        @Email(message = "Email should be valid")
        String email,

        @NotNull(message = "password is required")
        @Size(min = 6, max = 50, message = "min is 6, max is 50")
        String password
) {
}
