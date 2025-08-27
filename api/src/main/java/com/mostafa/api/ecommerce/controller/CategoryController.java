package com.mostafa.api.ecommerce.controller;


import com.mostafa.api.ecommerce.dto.category.CategoryResponseDTO;
import com.mostafa.api.ecommerce.dto.category.CategoryResponseSummaryDTO;
import com.mostafa.api.ecommerce.dto.category.CreateCategoryDTO;
import com.mostafa.api.ecommerce.dto.category.UpdateCategoryDTO;
import com.mostafa.api.ecommerce.exception.GlobalResponse;
import com.mostafa.api.ecommerce.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService categoryService;


    //    Create
    @PostMapping
    public ResponseEntity<GlobalResponse<CategoryResponseSummaryDTO>> createCategory(
            @Valid @RequestBody CreateCategoryDTO dto) {
        CategoryResponseSummaryDTO createdCategory = categoryService.createCategory(dto);
        GlobalResponse<CategoryResponseSummaryDTO> res = new GlobalResponse<>(createdCategory);

        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }


    //    Update
    @PutMapping("/{categoryId}")
    public ResponseEntity<GlobalResponse<CategoryResponseSummaryDTO>> updateCategory(
            @PathVariable UUID categoryId,
            @Valid @RequestBody UpdateCategoryDTO dto) {
        CategoryResponseSummaryDTO updatedCategory = categoryService.updateCategory(categoryId, dto);
        GlobalResponse<CategoryResponseSummaryDTO> res = new GlobalResponse<>(updatedCategory);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //    Delete
    @DeleteMapping("/{categoryId}")
    public ResponseEntity<GlobalResponse<String>> deleteCategory(@PathVariable UUID categoryId) {
        String deleteCategory = categoryService.deleteCategory(categoryId);
        GlobalResponse<String> res = new GlobalResponse<>(deleteCategory);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //    Get All
    @GetMapping
    public ResponseEntity<GlobalResponse<List<CategoryResponseSummaryDTO>>> getAllCategories() {
        return new ResponseEntity<>(new GlobalResponse<>(categoryService.getAllCategories()), HttpStatus.OK);
    }


    //    Get Single
    @GetMapping("/{categoryId}")
    public ResponseEntity<GlobalResponse<CategoryResponseDTO>> getByCatId(@PathVariable UUID categoryId) {
        CategoryResponseDTO category = categoryService.getByCategoryId(categoryId);
        GlobalResponse<CategoryResponseDTO> res = new GlobalResponse<>(category);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

}
