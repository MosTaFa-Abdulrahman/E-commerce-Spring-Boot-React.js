package com.mostafa.api.ecommerce.controller;


import com.mostafa.api.ecommerce.dto.review.CreateReviewDTO;
import com.mostafa.api.ecommerce.dto.review.FullReviewResponseDTO;
import com.mostafa.api.ecommerce.dto.review.ReviewResponseDTO;
import com.mostafa.api.ecommerce.exception.GlobalResponse;
import com.mostafa.api.ecommerce.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewService reviewService;


    //    Create
    @PostMapping
    public ResponseEntity<GlobalResponse<ReviewResponseDTO>> createReview(
            @Valid @RequestBody CreateReviewDTO dto) {
        ReviewResponseDTO createdReview = reviewService.createReview(dto);
        GlobalResponse<ReviewResponseDTO> res = new GlobalResponse<>(createdReview);

        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

    //    Delete
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<GlobalResponse<String>> deleteReview(@PathVariable UUID reviewId) {
        String deleteReview = reviewService.deleteReview(reviewId);
        GlobalResponse<String> res = new GlobalResponse<>(deleteReview);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }


    // ***************************** ((Specifications)) *********************** //

    // Get All Reviews for Specific Product
    @GetMapping("/product/{productId}")
    public ResponseEntity<GlobalResponse<List<FullReviewResponseDTO>>> getReviewsByProductId(
            @PathVariable UUID productId) {

        List<FullReviewResponseDTO> reviews = reviewService.getReviewsByProductId(productId);
        GlobalResponse<List<FullReviewResponseDTO>> response = new GlobalResponse<>(reviews);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
