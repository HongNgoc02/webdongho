package com.bandongho.services;

import com.bandongho.dtos.CategoryDTO;

import java.util.List;

public interface CategoryService {
    CategoryDTO createCategory(CategoryDTO categoryDTO);
    CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO);
    CategoryDTO getCategoryById(Long id);
    List<CategoryDTO> getAllCategories();
    List<CategoryDTO> searchCategories(String keyword);
    void deleteCategory(Long id);
    boolean hasProducts(Long categoryId);
}

