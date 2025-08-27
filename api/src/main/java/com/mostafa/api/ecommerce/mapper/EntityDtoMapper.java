package com.mostafa.api.ecommerce.mapper;

import com.mostafa.api.ecommerce.dto.category.CategoryResponseDTO;
import com.mostafa.api.ecommerce.dto.category.CategoryResponseSummaryDTO;
import com.mostafa.api.ecommerce.dto.category.CreateCategoryDTO;
import com.mostafa.api.ecommerce.dto.favourites.FavouritesResponseDTO;
import com.mostafa.api.ecommerce.dto.order.CreateOrderDTO;
import com.mostafa.api.ecommerce.dto.order.OrderResponseDTO;
import com.mostafa.api.ecommerce.dto.orderItem.CreateOrderItemDTO;
import com.mostafa.api.ecommerce.dto.orderItem.OrderItemResponseDTO;
import com.mostafa.api.ecommerce.dto.product.CreateProductDTO;
import com.mostafa.api.ecommerce.dto.product.ProductResponseDTO;
import com.mostafa.api.ecommerce.dto.product.ProductResponseSummaryDTO;
import com.mostafa.api.ecommerce.dto.review.FullReviewResponseDTO;
import com.mostafa.api.ecommerce.dto.review.ReviewResponseDTO;
import com.mostafa.api.ecommerce.dto.user.CreateUserDTO;
import com.mostafa.api.ecommerce.dto.user.UserResponseDTO;
import com.mostafa.api.ecommerce.dto.user.UserResponseSummaryDTO;
import com.mostafa.api.ecommerce.enums.UserRole;
import com.mostafa.api.ecommerce.model.*;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;


@Component
public class EntityDtoMapper {

    //    ****************************** ((User)) ************************* //
    public User toUserEntity(CreateUserDTO dto) {
        return User.builder()
                .username(dto.username())
                .email(dto.email())
                .password(dto.password())
                .phoneNumber(dto.phoneNumber())
                .role(UserRole.USER)
                .build();
    }

    public UserResponseSummaryDTO toUserSummaryDTO(User user) {
        return new UserResponseSummaryDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole()
        );
    }

    public UserResponseDTO toUserResponseDTO(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRole()

        );
    }


    //    ****************************** ((Address)) ************************* //


    //    ****************************** ((Category)) ************************* //
    public Category toCategoryEntity(CreateCategoryDTO dto) {
        return Category.builder()
                .name(dto.name())
                .build();
    }

    public CategoryResponseSummaryDTO toCategorySummaryDTO(Category category) {
        return new CategoryResponseSummaryDTO(
                category.getId(),
                category.getName()
        );
    }

    public CategoryResponseDTO toCategoryResponseDTO(Category category) {
        List<ProductResponseSummaryDTO> products = category.getProducts() != null ?
                category.getProducts().stream()
                        .map(this::toProductSummaryDTO)
                        .collect(Collectors.toList())
                : Collections.emptyList();

        return new CategoryResponseDTO(
                category.getId(),
                category.getName(),
                products
        );
    }

    // ******************************* ((Reviews)) ****************************** //
    public ReviewResponseDTO toReviewResponseDTO(Review review) {
        return new ReviewResponseDTO(
                review.getId(),
                review.getRating(),
                review.getDescription(),
                review.getUser() != null ? toUserSummaryDTO(review.getUser()) : null
        );
    }

    public FullReviewResponseDTO mapToFullReviewResponseDTO(Review review) {
        return new FullReviewResponseDTO(
                review.getId(),
                review.getRating(),
                review.getDescription(),
                review.getCreatedDate(),
                review.getLastModifiedDate(),
                review.getUser().getId(),
                review.getUser().getUsername(),
                review.getUser().getEmail(),
                review.getProduct().getId(),
                review.getProduct().getName(),
                review.getProduct().getDescription()
        );
    }


    // ******************************* ((Favourites)) ****************************** //
    public FavouritesResponseDTO mapToFavouritesResponseDTO(Favourites favourite) {
        return new FavouritesResponseDTO(
                favourite.getId(),
                favourite.getUser().getId(),
                favourite.getUser().getUsername(),
                favourite.getUser().getEmail(),
                favourite.getProduct().getId(),
                favourite.getProduct().getName(),
                favourite.getProduct().getImageUrl()
        );
    }


    //    ****************************** ((Products)) ************************* //
    public Product toProductEntity(CreateProductDTO dto) {
        return Product.builder()
                .name(dto.name())
                .description(dto.description())
                .imageUrl(dto.imageUrl())
                .price(dto.price())
                .stockQuantity(dto.stockQuantity())
                .build();
    }

    public ProductResponseSummaryDTO toProductSummaryDTO(Product product) {
        return new ProductResponseSummaryDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getImageUrl(),
                product.getPrice(),
                product.getStockQuantity()
        );
    }

    public ProductResponseDTO toProductResponseDTO(Product product) {
        return new ProductResponseDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getImageUrl(),
                product.getPrice(),
                product.getStockQuantity(),
                product.getCategory() != null ? toCategorySummaryDTO(product.getCategory()) : null
        );
    }


    //    ****************************** ((Order-Item)) ************************* //
    public OrderItem toOrderItemEntity(CreateOrderItemDTO dto) {
        return OrderItem.builder()
                .quantity(dto.quantity())
                .price(java.math.BigDecimal.valueOf(dto.price()))
                .build();
    }

    public OrderItemResponseDTO toOrderItemResponseDTO(OrderItem orderItem) {
        return new OrderItemResponseDTO(
                orderItem.getId(),
                orderItem.getQuantity(),
                orderItem.getPrice(),
                orderItem.getProduct() != null ? toProductSummaryDTO(orderItem.getProduct()) : null
        );
    }


    //    ****************************** ((Order)) ************************* //
    public Order toOrderEntity(CreateOrderDTO dto) {
        return Order.builder()
                .totalPrice(dto.totalPrice())
                .orderAddress(dto.orderAddress())
                .build();
    }

    public OrderResponseDTO toOrderResponseDTO(Order order) {
        List<OrderItemResponseDTO> orderItems = order.getOrderItems() != null
                ? order.getOrderItems().stream()
                .map(this::toOrderItemResponseDTO)
                .collect(Collectors.toList())
                : Collections.emptyList();

        return new OrderResponseDTO(
                order.getId(),
                order.getTotalPrice(),
                order.getPaymentId(),
                order.getStatus(),
                order.getOrderAddress(),
                order.getUser() != null ? toUserSummaryDTO(order.getUser()) : null,
                orderItems,
                order.getCreatedDate()
        );
    }


}