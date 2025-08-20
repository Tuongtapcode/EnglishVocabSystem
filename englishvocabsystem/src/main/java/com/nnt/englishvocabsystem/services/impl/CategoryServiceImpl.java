package com.nnt.englishvocabsystem.services.impl;

import com.nnt.englishvocabsystem.dto.CategoryStatsDTO;
import com.nnt.englishvocabsystem.entity.Category;
import com.nnt.englishvocabsystem.enums.Level;
import com.nnt.englishvocabsystem.repositories.CategoryRepository;
import com.nnt.englishvocabsystem.repositories.WordRepository;
import com.nnt.englishvocabsystem.services.CategoryService;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final WordRepository wordRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository, WordRepository wordRepository) {
        this.categoryRepository = categoryRepository;
        this.wordRepository = wordRepository;
    }


    @Override
    public Page<Category> getAllCategories(Map<String, String> params) {
        int page = Integer.parseInt(params.getOrDefault("page", "0"));
        int size = Integer.parseInt(params.getOrDefault("size", "10"));
        String sortBy = params.getOrDefault("sortBy", "id");
        String direction = params.getOrDefault("direction", "asc");

        Sort sort = Sort.by(direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Category> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            String keyword = params.get("keyword");
            if (keyword != null && !keyword.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + keyword.toLowerCase() + "%"));
            }

            String description = params.get("description");
            if (description != null && !description.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("description")), "%" + description.toLowerCase() + "%"));
            }

            // Thêm điều kiện lọc khác nếu cần
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return categoryRepository.findAll(spec, pageable);
    }


    @Override
    public Category getCategoryById(Integer id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    @Override
    public List<CategoryStatsDTO> getAllCategoryStats() {
        List<Category> categories = categoryRepository.findAll();
        List<CategoryStatsDTO> stats = new ArrayList<>();

        for (Category category : categories) {
            Long totalWords = wordRepository.countByCategory_Id(category.getId());

            Map<String, Long> difficultyStats = new HashMap<>();
            for (Level l : Level.values()) {
                Long count = wordRepository.countByCategory_IdAndLevel(category.getId(), l);
                difficultyStats.put(l.name(), count);
            }

            stats.add(new CategoryStatsDTO(
                    category.getId(),
                    category.getName(),
                    totalWords,
                    difficultyStats
            ));
        }

        return stats;
    }

    @Override
    public CategoryStatsDTO getCategoryStats(Integer categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        Long totalWords = wordRepository.countByCategory_Id(categoryId);
        Map<String, Long> difficultyStats = new HashMap<>();
        for (Level l : Level.values()) {
            Long count = wordRepository.countByCategory_IdAndLevel(categoryId, l);
            difficultyStats.put(l.name(), count);
        }

        return new CategoryStatsDTO(
                category.getId(),
                category.getName(),
                totalWords,
                difficultyStats
        );

    }
}

