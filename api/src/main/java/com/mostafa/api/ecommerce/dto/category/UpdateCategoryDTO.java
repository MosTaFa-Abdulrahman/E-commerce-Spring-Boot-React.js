package com.mostafa.api.ecommerce.dto.category;

import jakarta.validation.constraints.Size;

public record UpdateCategoryDTO(
        @Size(max = 100, message = "Category name cannot exceed 100 characters")
        String name
) {
}
