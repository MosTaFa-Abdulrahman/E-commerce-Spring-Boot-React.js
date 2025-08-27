package com.mostafa.api.ecommerce.dto.user;


import jakarta.validation.constraints.Email;

public record UpdateUserDTO(
        @Email(message = "Email should be valid")
        String email,

        String phoneNumber
) {
}
