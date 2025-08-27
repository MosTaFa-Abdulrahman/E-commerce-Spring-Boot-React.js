package com.mostafa.api.ecommerce.dto.order;

import java.util.UUID;

public record PaymentDTO(
        UUID orderId
) {
}
