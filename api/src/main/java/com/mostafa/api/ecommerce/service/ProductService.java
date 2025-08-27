package com.mostafa.api.ecommerce.service;


import com.mostafa.api.ecommerce.dto.product.CreateProductDTO;
import com.mostafa.api.ecommerce.dto.product.ProductResponseDTO;
import com.mostafa.api.ecommerce.dto.product.UpdateProductDTO;
import com.mostafa.api.ecommerce.exception.CustomResponseException;
import com.mostafa.api.ecommerce.mapper.EntityDtoMapper;
import com.mostafa.api.ecommerce.model.Category;
import com.mostafa.api.ecommerce.model.Product;
import com.mostafa.api.ecommerce.repository.CategoryRepo;
import com.mostafa.api.ecommerce.repository.ProductRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepo productRepo;
    private final CategoryRepo categoryRepo;
    private final EntityDtoMapper mapper;


    //    Create
    public ProductResponseDTO createProduct(CreateProductDTO dto) {
        Product product = mapper.toProductEntity(dto);
        Category category = categoryRepo.findById(dto.categoryId())
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Category not Found with this ID: " + dto.categoryId()));

        product.setCategory(category);
        Product savedProduct = productRepo.save(product);

        return mapper.toProductResponseDTO(savedProduct);
    }

    //    Update
    public ProductResponseDTO updateProduct(UUID productId, UpdateProductDTO dto) {
        Product existingProduct = productRepo.findById(productId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Product not Found with this ID: " + productId));

        // Only update fields that are provided (not null)
        if (dto.name() != null && !dto.name().trim().isEmpty()) {
            existingProduct.setName(dto.name());
        }
        if (dto.description() != null) {
            existingProduct.setDescription(dto.description());
        }
        if (dto.stockQuantity() != null) {  // Only update if provided
            existingProduct.setStockQuantity(dto.stockQuantity());
        }
        if (dto.price() != null) {
            existingProduct.setPrice(dto.price());
        }
        if (dto.imageUrl() != null) {
            existingProduct.setImageUrl(dto.imageUrl());
        }
        if (dto.categoryId() != null) {
            Category category = categoryRepo.findById(dto.categoryId())
                    .orElseThrow(() -> CustomResponseException.ResourceNotFound("Category not Found with this ID: " + dto.categoryId()));
            existingProduct.setCategory(category);
        }
        Product updatedProduct = productRepo.save(existingProduct);

        return mapper.toProductResponseDTO(updatedProduct);
    }

    //    Delete
    public String deleteProduct(UUID productId) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Product not Found with this ID: " + productId));

        productRepo.delete(product);

        return "Product Deleted Successfully";
    }

    //    Get All
    public Page<ProductResponseDTO> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productsPage = productRepo.findAll(pageable);

        // Convert Page<Product> to Page<ProductResponseDTO>
        return productsPage.map(mapper::toProductResponseDTO);
    }

    //    Get Single
    public ProductResponseDTO getById(UUID productId) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Product not Found with this ID: " + productId));

        return mapper.toProductResponseDTO(product);
    }


    // ************************** ((Specifications)) ************************ //

    //    Get All Products Dependent on (categoryId)
    public List<Product> getAllByCategoryId(UUID categoryId) {
        return productRepo.findByCategoryId(categoryId);
    }


}
