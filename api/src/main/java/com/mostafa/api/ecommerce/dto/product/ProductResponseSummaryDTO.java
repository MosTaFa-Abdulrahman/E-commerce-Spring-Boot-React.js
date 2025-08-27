package com.mostafa.api.ecommerce.dto.product;

import java.math.BigDecimal;
import java.util.UUID;

public record ProductResponseSummaryDTO(
        UUID id,
        String name,
        String description,
        String imageUrl,
        BigDecimal price,
        Integer stockQuantity
) {
}
