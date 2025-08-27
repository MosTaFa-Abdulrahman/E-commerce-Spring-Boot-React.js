package com.mostafa.api.ecommerce.dto.category;

import com.mostafa.api.ecommerce.dto.product.ProductResponseSummaryDTO;

import java.util.List;
import java.util.UUID;

public record CategoryResponseDTO(
        UUID id,
        String name,


        List<ProductResponseSummaryDTO> products
) {
}
