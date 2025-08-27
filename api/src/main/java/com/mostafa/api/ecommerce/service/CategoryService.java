package com.mostafa.api.ecommerce.service;


import com.mostafa.api.ecommerce.dto.category.CategoryResponseDTO;
import com.mostafa.api.ecommerce.dto.category.CategoryResponseSummaryDTO;
import com.mostafa.api.ecommerce.dto.category.CreateCategoryDTO;
import com.mostafa.api.ecommerce.dto.category.UpdateCategoryDTO;
import com.mostafa.api.ecommerce.exception.CustomResponseException;
import com.mostafa.api.ecommerce.mapper.EntityDtoMapper;
import com.mostafa.api.ecommerce.model.Category;
import com.mostafa.api.ecommerce.repository.CategoryRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepo categoryRepo;
    private final EntityDtoMapper mapper;


    //    Create
    public CategoryResponseSummaryDTO createCategory(CreateCategoryDTO dto) {
        if (categoryRepo.existsByName(dto.name())) {
            throw new CustomResponseException("Category with name '" + dto.name() + "' already exists", 409);
        }

        Category category = mapper.toCategoryEntity(dto);
        Category savedCategory = categoryRepo.save(category);

        return mapper.toCategorySummaryDTO(savedCategory);
    }

    //    Update
    public CategoryResponseSummaryDTO updateCategory(UUID categoryId, UpdateCategoryDTO dto) {
        Category existingCategory = categoryRepo.findById(categoryId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Category not Found With This ID:  " + categoryId));

        existingCategory.setName(dto.name());
        Category updatedCategory = categoryRepo.save(existingCategory);

        return mapper.toCategorySummaryDTO(updatedCategory);
    }

    //    Delete
    public String deleteCategory(UUID categoryId) {
        Category existingCategory = categoryRepo.findById(categoryId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Category Not Found with this ID:  " + categoryId));

        categoryRepo.delete(existingCategory);

        return "Category deleted successfully";
    }

    //    Get All
    public List<CategoryResponseSummaryDTO> getAllCategories() {
        List<Category> categories = categoryRepo.findAll();

        return categories.stream()
                .map(mapper::toCategorySummaryDTO)
                .collect(Collectors.toList());
    }

    //    Get By (categoryId)
    public CategoryResponseDTO getByCategoryId(UUID categoryId) {
        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Category Not Found with this ID:  " + categoryId));

        return mapper.toCategoryResponseDTO(category);
    }

}
