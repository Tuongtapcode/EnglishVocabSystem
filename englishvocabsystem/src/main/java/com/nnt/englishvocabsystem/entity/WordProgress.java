package com.nnt.englishvocabsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

@Entity
@Table(name = "word_progress")
public class WordProgress {
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "word_id", nullable = false)
    private Word word;

    @Column(name = "ease_factor")
    private Float easeFactor;

    @Column(name = "interval_days")
    private Integer intervalDays;

    @Column(name = "repetition_count")
    private Integer repetitionCount;

    @Column(name = "next_review_date")
    private Instant nextReviewDate;

    @Column(name = "total_reviews")
    private Integer totalReviews;

    @Column(name = "correct_reviews")
    private Integer correctReviews;

    @Column(name = "last_review_date")
    private Instant lastReviewDate;

    @Column(name = "last_score")
    private Integer lastScore;

    @Column(name = "is_learning")
    private Boolean isLearning;

    @Column(name = "difficulty_level")
    private Float difficultyLevel;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Word getWord() {
        return word;
    }

    public void setWord(Word word) {
        this.word = word;
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

    public Integer getLastScore() {
        return lastScore;
    }

    public void setLastScore(Integer lastScore) {
        this.lastScore = lastScore;
    }

    public Boolean getIsLearning() {
        return isLearning;
    }

    public void setIsLearning(Boolean isLearning) {
        this.isLearning = isLearning;
    }

    public Float getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(Float difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

}