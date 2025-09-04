package com.nnt.englishvocabsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

@Entity
@Table(name = "user_streaks")
public class UserStreak {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "current_streak")
    private Integer currentStreak;

    @Column(name = "longest_streak")
    private Integer longestStreak;

    @Column(name = "last_study_date")
    private Instant lastStudyDate;

    @Column(name = "total_study_days")
    private Integer totalStudyDays;

    @Column(name = "words_learned_today")
    private Integer wordsLearnedToday;

    @Column(name = "words_learned_this_week")
    private Integer wordsLearnedThisWeek;

    @Column(name = "study_time_today_minutes")
    private Integer studyTimeTodayMinutes;

    @Column(name = "study_time_this_week_minutes")
    private Integer studyTimeThisWeekMinutes;

    @Column(name = "last_reset_date")
    private Instant lastResetDate;

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

    public Integer getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(Integer currentStreak) {
        this.currentStreak = currentStreak;
    }

    public Integer getLongestStreak() {
        return longestStreak;
    }

    public void setLongestStreak(Integer longestStreak) {
        this.longestStreak = longestStreak;
    }

    public Instant getLastStudyDate() {
        return lastStudyDate;
    }

    public void setLastStudyDate(Instant lastStudyDate) {
        this.lastStudyDate = lastStudyDate;
    }

    public Integer getTotalStudyDays() {
        return totalStudyDays;
    }

    public void setTotalStudyDays(Integer totalStudyDays) {
        this.totalStudyDays = totalStudyDays;
    }

    public Integer getWordsLearnedToday() {
        return wordsLearnedToday;
    }

    public void setWordsLearnedToday(Integer wordsLearnedToday) {
        this.wordsLearnedToday = wordsLearnedToday;
    }

    public Integer getWordsLearnedThisWeek() {
        return wordsLearnedThisWeek;
    }

    public void setWordsLearnedThisWeek(Integer wordsLearnedThisWeek) {
        this.wordsLearnedThisWeek = wordsLearnedThisWeek;
    }

    public Integer getStudyTimeTodayMinutes() {
        return studyTimeTodayMinutes;
    }

    public void setStudyTimeTodayMinutes(Integer studyTimeTodayMinutes) {
        this.studyTimeTodayMinutes = studyTimeTodayMinutes;
    }

    public Integer getStudyTimeThisWeekMinutes() {
        return studyTimeThisWeekMinutes;
    }

    public void setStudyTimeThisWeekMinutes(Integer studyTimeThisWeekMinutes) {
        this.studyTimeThisWeekMinutes = studyTimeThisWeekMinutes;
    }

    public Instant getLastResetDate() {
        return lastResetDate;
    }

    public void setLastResetDate(Instant lastResetDate) {
        this.lastResetDate = lastResetDate;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    @PrePersist
    public void onCreate() {
        updatedAt = Instant.now();
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = Instant.now();
    }

}