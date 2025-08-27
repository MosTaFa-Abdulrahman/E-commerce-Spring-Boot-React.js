package com.mostafa.api.ecommerce.dto.product;

import java.math.BigDecimal;
import java.util.UUID;


public record UpdateProductDTO(
        String name,
        String description,
        Integer stockQuantity,
        BigDecimal price,
        String imageUrl,


        UUID categoryId
) {
}
