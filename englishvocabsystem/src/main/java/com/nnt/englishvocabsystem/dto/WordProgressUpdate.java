package com.nnt.englishvocabsystem.dto;

import java.time.Instant;
//complete
public class WordProgressUpdate {
    private Integer wordId;
    private String englishWord;
    private String vietnameseMeaning;

    // Progress info
    private Integer repetitionCount;
    private Integer intervalDays;
    private Instant nextReviewDate;
    private String masteryLevel; // "new", "learning", "reviewing", "mastered"
    private Float easeFactor;

    // Performance in this session
    private Integer questionsInSession;
    private Integer correctInSession;
    private Boolean improvedThisSession;

    public WordProgressUpdate() {
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

    public String getVietnameseMeaning() {
        return vietnameseMeaning;
    }

    public void setVietnameseMeaning(String vietnameseMeaning) {
        this.vietnameseMeaning = vietnameseMeaning;
    }

    public Integer getRepetitionCount() {
        return repetitionCount;
    }

    public void setRepetitionCount(Integer repetitionCount) {
        this.repetitionCount = repetitionCount;
    }

    public Integer getIntervalDays() {
        return intervalDays;
    }

    public void setIntervalDays(Integer intervalDays) {
        this.intervalDays = intervalDays;
    }

    public Instant getNextReviewDate() {
        return nextReviewDate;
    }

    public void setNextReviewDate(Instant nextReviewDate) {
        this.nextReviewDate = nextReviewDate;
    }

    public String getMasteryLevel() {
        return masteryLevel;
    }

    public void setMasteryLevel(String masteryLevel) {
        this.masteryLevel = masteryLevel;
    }

    public Float getEaseFactor() {
        return easeFactor;
    }

    public void setEaseFactor(Float easeFactor) {
        this.easeFactor = easeFactor;
    }

    public Integer getQuestionsInSession() {
        return questionsInSession;
    }

    public void setQuestionsInSession(Integer questionsInSession) {
        this.questionsInSession = questionsInSession;
    }

    public Integer getCorrectInSession() {
        return correctInSession;
    }

    public void setCorrectInSession(Integer correctInSession) {
        this.correctInSession = correctInSession;
    }

    public Boolean getImprovedThisSession() {
        return improvedThisSession;
    }

    public void setImprovedThisSession(Boolean improvedThisSession) {
        this.improvedThisSession = improvedThisSession;
    }
}
