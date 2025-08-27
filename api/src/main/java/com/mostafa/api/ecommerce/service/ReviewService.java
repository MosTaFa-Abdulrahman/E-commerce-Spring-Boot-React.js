package com.mostafa.api.ecommerce.service;


import com.mostafa.api.ecommerce.dto.review.CreateReviewDTO;
import com.mostafa.api.ecommerce.dto.review.FullReviewResponseDTO;
import com.mostafa.api.ecommerce.dto.review.ReviewResponseDTO;
import com.mostafa.api.ecommerce.exception.CustomResponseException;
import com.mostafa.api.ecommerce.mapper.EntityDtoMapper;
import com.mostafa.api.ecommerce.model.Product;
import com.mostafa.api.ecommerce.model.Review;
import com.mostafa.api.ecommerce.model.User;
import com.mostafa.api.ecommerce.repository.ProductRepo;
import com.mostafa.api.ecommerce.repository.ReviewRepo;
import com.mostafa.api.ecommerce.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepo reviewRepo;
    private final UserRepo userRepo;
    private final ProductRepo productRepo;
    private final EntityDtoMapper mapper;


    //    Create
    public ReviewResponseDTO createReview(CreateReviewDTO dto) {
        User user = userRepo.findById(dto.userId())
                .orElseThrow(() -> CustomResponseException.ResourceNotFound(
                        "User not found with this ID: " + dto.userId()
                ));
        Product product = productRepo.findById(dto.productId())
                .orElseThrow(() -> CustomResponseException.ResourceNotFound(
                        "Product not found with this ID: " + dto.productId()
                ));

        Review review = new Review();
        review.setRating(dto.rating());
        review.setDescription(dto.description());
        review.setUser(user);
        review.setProduct(product);

        Review savedReview = reviewRepo.save(review);

        return mapper.toReviewResponseDTO(savedReview);
    }

    //    Delete
    public String deleteReview(UUID reviewId) {
        Review existingReview = reviewRepo.findById(reviewId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound(
                        "Category Not Found with this ID:  " + reviewId
                ));

        reviewRepo.delete(existingReview);

        return "Review deleted successfully";
    }


    // ***************************** ((Specifications)) *********************** //
    // Get All Reviews for Specific ((Product))
    public List<FullReviewResponseDTO> getReviewsByProductId(UUID productId) {
        if (productId == null) {
            throw new IllegalArgumentException("Product ID cannot be null");
        }

        productRepo.findById(productId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound(
                        "Product not found with this ID: " + productId
                ));

        List<Review> reviews = reviewRepo.findByProductId(productId);


        return reviews.stream()
                .map(mapper::mapToFullReviewResponseDTO)
                .toList();
    }


}
