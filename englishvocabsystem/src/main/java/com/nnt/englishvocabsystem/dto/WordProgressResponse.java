package com.nnt.englishvocabsystem.dto;

import java.time.Instant;

public class WordProgressResponse {
    private Integer id;
    private Integer wordId;
    private String englishWord;

    private Integer lastScore;
    private Boolean isLearning;
    private Instant nextReviewDate;

    private Integer repetitionCount;
    private Float easeFactor;
    private Integer intervalDays;
    private Float difficultyLevel;

    // Nếu cần hiển thị thống kê chi tiết thì thêm:
    private Integer totalReviews;
    private Integer correctReviews;
    private Instant lastReviewDate;

    public WordProgressResponse() {
    }

    public WordProgressResponse(Integer id, Integer wordId, String englishWord, Integer lastScore, Boolean isLearning, Instant nextReviewDate, Integer repetitionCount, Float easeFactor, Integer intervalDays, Float difficultyLevel, Integer totalReviews, Integer correctReviews, Instant lastReviewDate) {
        this.id = id;
        this.wordId = wordId;
        this.englishWord = englishWord;
        this.lastScore = lastScore;
        this.isLearning = isLearning;
        this.nextReviewDate = nextReviewDate;
        this.repetitionCount = repetitionCount;
        this.easeFactor = easeFactor;
        this.intervalDays = intervalDays;
        this.difficultyLevel = difficultyLevel;
        this.totalReviews = totalReviews;
        this.correctReviews = correctReviews;
        this.lastReviewDate = lastReviewDate;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getWordId() {
        return wordId;
    }

    public void setWordId(Integer wordId) {
        this.wordId = wordId;
    }

    public String getEnglishWord() {
        return englishWord;
    }

    public void setEnglishWord(String englishWord) {
        this.englishWord = englishWord;
    }

    public Integer getLastScore() {
        return lastScore;
    }

    public void setLastScore(Integer lastScore) {
        this.lastScore = lastScore;
    }

    public Boolean getLearning() {
        return isLearning;
    }

    public void setLearning(Boolean learning) {
        isLearning = learning;
    }

    public Instant getNextReviewDate() {
        return nextReviewDate;
    }

    public void setNextReviewDate(Instant nextReviewDate) {
        this.nextReviewDate = nextReviewDate;
    }

    public Integer getRepetitionCount() {
        return repetitionCount;
    }

    public void setRepetitionCount(Integer repetitionCount) {
        this.repetitionCount = repetitionCount;
    }

    public Float getEaseFactor() {
        return easeFactor;
    }

    public void setEaseFactor(Float easeFactor) {
        this.easeFactor = easeFactor;
    }

    public Integer getIntervalDays() {
        return intervalDays;
    }

    public void setIntervalDays(Integer intervalDays) {
        this.intervalDays = intervalDays;
    }

    public Float getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(Float difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public Integer getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(Integer totalReviews) {
        this.totalReviews = totalReviews;
    }

    public Integer getCorrectReviews() {
        return correctReviews;
    }

    public void setCorrectReviews(Integer correctReviews) {
        this.correctReviews = correctReviews;
    }

    public Instant getLastReviewDate() {
        return lastReviewDate;
    }

    public void setLastReviewDate(Instant lastReviewDate) {
        this.lastReviewDate = lastReviewDate;
    }
}
