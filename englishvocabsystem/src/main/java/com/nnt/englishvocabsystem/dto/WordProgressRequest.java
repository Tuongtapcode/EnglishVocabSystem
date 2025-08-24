package com.nnt.englishvocabsystem.dto;

import java.time.Instant;

public class WordProgressRequest {
    private Integer wordId;

    private Integer lastScore;
    private Boolean isLearning;

    private Float easeFactor;
    private Integer intervalDays;

    private Integer repetitionCount;
    private Instant nextReviewDate;
    private Float difficultyLevel;

    public WordProgressRequest(Integer wordId, Integer lastScore, Boolean isLearning, Float easeFactor, Integer intervalDays, Integer repetitionCount, Instant nextReviewDate, Float difficultyLevel) {
        this.wordId = wordId;
        this.lastScore = lastScore;
        this.isLearning = isLearning;
        this.easeFactor = easeFactor;
        this.intervalDays = intervalDays;
        this.repetitionCount = repetitionCount;
        this.nextReviewDate = nextReviewDate;
        this.difficultyLevel = difficultyLevel;
    }

    public Integer getWordId() {
        return wordId;
    }

    public void setWordId(Integer wordId) {
        this.wordId = wordId;
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

    public Integer getRepetitionCount() {
        return repetitionCount;
    }

    public void setRepetitionCount(Integer repetitionCount) {
        this.repetitionCount = repetitionCount;
    }

    public Instant getNextReviewDate() {
        return nextReviewDate;
    }

    public void setNextReviewDate(Instant nextReviewDate) {
        this.nextReviewDate = nextReviewDate;
    }

    public Float getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(Float difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }
}
