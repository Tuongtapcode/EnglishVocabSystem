package com.nnt.englishvocabsystem.dto;

import java.time.Instant;
import java.util.List;
//Complete
public class SessionCompleteResponse {

    // Session metadata
    private Integer sessionId;
    private Instant completedAt;
    private Integer durationMinutes;

    // Overall statistics
    private SessionSummary summary;

    // Detailed questions (có thể optional dựa trên query param)
    private List<QuestionDetailResponse> questions;

    // Word progress updates
    private List<WordProgressUpdate> wordUpdates;

    public static class SessionSummary {
        private Integer totalQuestions;
        private Integer correctAnswers;
        private Float scorePercentage;
        private Integer totalWordsStudied;
        private Float overallEfficiency; // time vs accuracy
        private String performance; // "excellent", "good", "needs_improvement"

        public SessionSummary() {
        }

        public Integer getTotalQuestions() {
            return totalQuestions;
        }

        public void setTotalQuestions(Integer totalQuestions) {
            this.totalQuestions = totalQuestions;
        }

        public Integer getCorrectAnswers() {
            return correctAnswers;
        }

        public void setCorrectAnswers(Integer correctAnswers) {
            this.correctAnswers = correctAnswers;
        }

        public Float getScorePercentage() {
            return scorePercentage;
        }

        public void setScorePercentage(Float scorePercentage) {
            this.scorePercentage = scorePercentage;
        }

        public Integer getTotalWordsStudied() {
            return totalWordsStudied;
        }

        public void setTotalWordsStudied(Integer totalWordsStudied) {
            this.totalWordsStudied = totalWordsStudied;
        }


        public Float getOverallEfficiency() {
            return overallEfficiency;
        }

        public void setOverallEfficiency(Float overallEfficiency) {
            this.overallEfficiency = overallEfficiency;
        }

        public String getPerformance() {
            return performance;
        }

        public void setPerformance(String performance) {
            this.performance = performance;
        }
    }


    public SessionCompleteResponse() {
    }

    public Integer getSessionId() {
        return sessionId;
    }

    public void setSessionId(Integer sessionId) {
        this.sessionId = sessionId;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Instant completedAt) {
        this.completedAt = completedAt;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public SessionSummary getSummary() {
        return summary;
    }

    public void setSummary(SessionSummary summary) {
        this.summary = summary;
    }

    public List<QuestionDetailResponse> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionDetailResponse> questions) {
        this.questions = questions;
    }

    public List<WordProgressUpdate> getWordUpdates() {
        return wordUpdates;
    }

    public void setWordUpdates(List<WordProgressUpdate> wordUpdates) {
        this.wordUpdates = wordUpdates;
    }


    public SessionCompleteResponse(Integer sessionId, Instant completedAt, Integer durationMinutes, SessionSummary summary, List<QuestionDetailResponse> questions, List<WordProgressUpdate> wordUpdates) {
        this.sessionId = sessionId;
        this.completedAt = completedAt;
        this.durationMinutes = durationMinutes;
        this.summary = summary;
        this.questions = questions;
        this.wordUpdates = wordUpdates;
    }


}
