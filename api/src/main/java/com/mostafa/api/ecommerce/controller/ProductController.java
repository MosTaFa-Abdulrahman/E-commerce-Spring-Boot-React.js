package com.mostafa.api.ecommerce.controller;


import com.mostafa.api.ecommerce.dto.PaginatedResponse;
import com.mostafa.api.ecommerce.dto.product.CreateProductDTO;
import com.mostafa.api.ecommerce.dto.product.ProductResponseDTO;
import com.mostafa.api.ecommerce.dto.product.UpdateProductDTO;
import com.mostafa.api.ecommerce.exception.GlobalResponse;
import com.mostafa.api.ecommerce.service.ProductService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;


    //    Create
    @PostMapping
    public ResponseEntity<GlobalResponse<ProductResponseDTO>> createProduct(
            @Valid @RequestBody CreateProductDTO dto) {
        ProductResponseDTO createdProduct = productService.createProduct(dto);
        GlobalResponse<ProductResponseDTO> res = new GlobalResponse<>(createdProduct);

        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

    //    Update
    @PutMapping("/{productId}")
    public ResponseEntity<GlobalResponse<ProductResponseDTO>> updateProduct(
            @PathVariable UUID productId,
            @Valid @RequestBody UpdateProductDTO dto
    ) {
        ProductResponseDTO updatedProduct = productService.updateProduct(productId, dto);
        GlobalResponse<ProductResponseDTO> res = new GlobalResponse<>(updatedProduct);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //    Delete
    @DeleteMapping("/{productId}")
    public ResponseEntity<GlobalResponse<String>> deleteProduct(@PathVariable UUID productId) {
        String deleteProduct = productService.deleteProduct(productId);
        GlobalResponse<String> res = new GlobalResponse<>(deleteProduct);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //    Get All
    @GetMapping
    public ResponseEntity<GlobalResponse<PaginatedResponse<ProductResponseDTO>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest req
    ) {
        Page<ProductResponseDTO> products = productService.getAll(page - 1, size);

        String baseUrl = req.getRequestURL().toString();
        String nextUrl = products.hasNext() ? String.format("%s?page=%d&size=%d", baseUrl, page + 1, size) : null;
        String prevUrl = products.hasPrevious() ? String.format("%s?page=%d&size=%d", baseUrl, page - 1, size) : null;

        var paginatedResponse = new PaginatedResponse<ProductResponseDTO>(
                products.getContent(),
                products.getNumber() + 1,
                products.getTotalPages(),
                products.getTotalElements(),
                products.hasNext(),
                products.hasPrevious(),
                nextUrl,
                prevUrl
        );

        return new ResponseEntity<>(new GlobalResponse<>(paginatedResponse), HttpStatus.OK);
    }

    //    Get By (productId)
    @GetMapping("/{productId}")
    public ResponseEntity<GlobalResponse<ProductResponseDTO>> getByProductId(
            @PathVariable UUID productId) {
        ProductResponseDTO product = productService.getById(productId);
        GlobalResponse<ProductResponseDTO> res = new GlobalResponse<>(product);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }


    // ************************** ((Specifications)) ************************ //


}
