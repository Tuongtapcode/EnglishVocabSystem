package com.nnt.englishvocabsystem.services;

import com.nnt.englishvocabsystem.dto.CategoryStatsDTO;
import com.nnt.englishvocabsystem.entity.Category;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;


public interface CategoryService {
    List<Category> getAllCategories();
    Page<Category> getAllCategories(Map<String, String> params);

    Category getCategoryById(Integer id);

    List<CategoryStatsDTO> getAllCategoryStats();

    CategoryStatsDTO getCategoryStats(Integer categoryId);

}
