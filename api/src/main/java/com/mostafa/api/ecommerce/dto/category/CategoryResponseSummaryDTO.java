package com.mostafa.api.ecommerce.dto.category;

import java.util.UUID;

public record CategoryResponseSummaryDTO(
        UUID id,
        String name
) {
}
