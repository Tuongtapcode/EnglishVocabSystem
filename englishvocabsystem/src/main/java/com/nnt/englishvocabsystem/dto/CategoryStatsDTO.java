package com.nnt.englishvocabsystem.dto;

import java.util.Map;

public class CategoryStatsDTO {
    private Integer categoryId;
    private String categoryName;
    private Long totalWords;
    private Map<String, Long> difficultyStats;

    public CategoryStatsDTO(Integer categoryId, String categoryName, Long totalWords, Map<String, Long> difficultyStats) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.totalWords = totalWords;
        this.difficultyStats = difficultyStats;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Long getTotalWords() {
        return totalWords;
    }

    public void setTotalWords(Long totalWords) {
        this.totalWords = totalWords;
    }

    public Map<String, Long> getDifficultyStats() {
        return difficultyStats;
    }

    public void setDifficultyStats(Map<String, Long> difficultyStats) {
        this.difficultyStats = difficultyStats;
    }
}
