package com.nnt.englishvocabsystem.controllers;

import com.nnt.englishvocabsystem.dto.CategoryStatsDTO;
import com.nnt.englishvocabsystem.entity.Category;
import com.nnt.englishvocabsystem.entity.Word;
import com.nnt.englishvocabsystem.services.CategoryService;
import com.nnt.englishvocabsystem.services.WordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/category")
@CrossOrigin(origins = "*")
public class ApiCategoryController {

    @Autowired
    private CategoryService categoryService;
    @Autowired
    private WordService wordService;

    @GetMapping
    public ResponseEntity<Page<Category>> getCategories(@RequestParam Map<String, String> params) {
        return ResponseEntity.ok(categoryService.getAllCategories(params));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Integer id) {
        Category category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }
    @GetMapping("/stats")
    public ResponseEntity<List<CategoryStatsDTO>> getAllCategoryStats() {
        return ResponseEntity.ok(categoryService.getAllCategoryStats());
    }
    @GetMapping("/{id}/stats")
    public ResponseEntity<CategoryStatsDTO> getCategoryStats(@PathVariable Integer id) {
        return ResponseEntity.ok(categoryService.getCategoryStats(id));
    }

    @GetMapping("/{id}/words")
    public ResponseEntity<List<Word>> getWordsByCategory(@PathVariable Integer id) {
        List<Word> words = wordService.getWordsByCategoryId(id);
        return ResponseEntity.ok(words);
    }

}
