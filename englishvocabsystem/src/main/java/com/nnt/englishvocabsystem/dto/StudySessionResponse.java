package com.nnt.englishvocabsystem.dto;

import java.time.Instant;
import java.util.List;

public class StudySessionResponse {
    private Integer sessionId;
    private Integer totalQuestions;
    private List<QuestionResponse> questions;
    private Instant startTime;
    private String sessionType;


    public StudySessionResponse() {}

    public StudySessionResponse(Integer sessionId, Integer totalQuestions,
                                List<QuestionResponse> questions, Instant startTime, String sessionType) {
        this.sessionId = sessionId;
        this.totalQuestions = totalQuestions;
        this.questions = questions;
        this.startTime = startTime;
        this.sessionType = sessionType;
    }

    public Integer getSessionId() {
        return sessionId;
    }

    public void setSessionId(Integer sessionId) {
        this.sessionId = sessionId;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public List<QuestionResponse> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionResponse> questions) {
        this.questions = questions;
    }

    public Instant getStartTime() {
        return startTime;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public String getSessionType() {
        return sessionType;
    }

    public void setSessionType(String sessionType) {
        this.sessionType = sessionType;
    }
}
