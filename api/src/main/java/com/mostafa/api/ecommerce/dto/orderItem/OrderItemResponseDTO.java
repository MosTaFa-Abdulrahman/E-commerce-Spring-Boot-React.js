package com.mostafa.api.ecommerce.dto.orderItem;

import com.mostafa.api.ecommerce.dto.product.ProductResponseSummaryDTO;

import java.math.BigDecimal;
import java.util.UUID;


public record OrderItemResponseDTO(
        UUID id,
        int quantity,
        BigDecimal price,


        ProductResponseSummaryDTO product
) {
}
