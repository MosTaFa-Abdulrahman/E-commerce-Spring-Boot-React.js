package com.mostafa.api.ecommerce.dto.product;

import com.mostafa.api.ecommerce.dto.category.CategoryResponseSummaryDTO;

import java.math.BigDecimal;
import java.util.UUID;

public record ProductResponseDTO(
        UUID id,
        String name,
        String description,
        String imageUrl,
        BigDecimal price,
        Integer stockQuantity,


        CategoryResponseSummaryDTO category
) {
}
