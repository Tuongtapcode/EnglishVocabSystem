package com.nnt.englishvocabsystem.dto;


import java.time.Instant;
//progress
public class ReviewWordResponse {
    private Integer Id;
    private String englishWord;
    private String vietnameseMeaning;
    private String pronunciation;
    private String wordType;
    private String level;
    private String imageUrl;
    private String audioUrl;

    private Instant nextReviewDate;
    private Instant lastReviewDate;
    private Integer totalReviews;
    private Integer correctReviews;
    private Integer intervalDays;
    private Double easeFactor;
    private Integer repetitionCount;
    private Integer lastScore;
    private Boolean isLearning;
    private CategoryDTO category;

    public ReviewWordResponse() {
    }

    public ReviewWordResponse(Integer Id, String englishWord, String vietnameseMeaning, String pronunciation, String wordType, String level, String imageUrl, String audioUrl, Instant nextReviewDate, Instant lastReviewDate, Integer totalReviews, Integer correctReviews, Integer intervalDays, Double easeFactor, Integer repetitionCount, Integer lastScore, Boolean isLearning, CategoryDTO category) {
        this.Id = Id;
        this.englishWord = englishWord;
        this.vietnameseMeaning = vietnameseMeaning;
        this.pronunciation = pronunciation;
        this.wordType = wordType;
        this.level = level;
        this.imageUrl = imageUrl;
        this.audioUrl = audioUrl;
        this.nextReviewDate = nextReviewDate;
        this.lastReviewDate = lastReviewDate;
        this.totalReviews = totalReviews;
        this.correctReviews = correctReviews;
        this.intervalDays = intervalDays;
        this.easeFactor = easeFactor;
        this.repetitionCount = repetitionCount;
        this.lastScore = lastScore;
        this.isLearning = isLearning;
        this.category = category;
    }

    public Integer getId() {
        return Id;
    }

    public void setId(Integer id) {
        Id = id;
    }

    public String getEnglishWord() {
        return englishWord;
    }

    public void setEnglishWord(String englishWord) {
        this.englishWord = englishWord;
    }

    public String getVietnameseMeaning() {
        return vietnameseMeaning;
    }

    public void setVietnameseMeaning(String vietnameseMeaning) {
        this.vietnameseMeaning = vietnameseMeaning;
    }

    public String getPronunciation() {
        return pronunciation;
    }

    public void setPronunciation(String pronunciation) {
        this.pronunciation = pronunciation;
    }

    public String getWordType() {
        return wordType;
    }

    public void setWordType(String wordType) {
        this.wordType = wordType;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getAudioUrl() {
        return audioUrl;
    }

    public void setAudioUrl(String audioUrl) {
        this.audioUrl = audioUrl;
    }

    public Instant getNextReviewDate() {
        return nextReviewDate;
    }

    public void setNextReviewDate(Instant nextReviewDate) {
        this.nextReviewDate = nextReviewDate;
    }

    public Instant getLastReviewDate() {
        return lastReviewDate;
    }

    public void setLastReviewDate(Instant lastReviewDate) {
        this.lastReviewDate = lastReviewDate;
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

    public Integer getIntervalDays() {
        return intervalDays;
    }

    public void setIntervalDays(Integer intervalDays) {
        this.intervalDays = intervalDays;
    }

    public Double getEaseFactor() {
        return easeFactor;
    }

    public void setEaseFactor(Double easeFactor) {
        this.easeFactor = easeFactor;
    }

    public Integer getRepetitionCount() {
        return repetitionCount;
    }

    public void setRepetitionCount(Integer repetitionCount) {
        this.repetitionCount = repetitionCount;
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

    public CategoryDTO getCategory() {
        return category;
    }

    public void setCategory(CategoryDTO category) {
        this.category = category;
    }
}
