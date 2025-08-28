package com.nnt.englishvocabsystem.dto;

public class SubmitAnswerRequest {
    private Integer sessionId;
    private Integer questionId;
    private String userAnswer;
    private Integer timeSpentSeconds;
    private Float pronunciationScore;

    public SubmitAnswerRequest() {}

    public SubmitAnswerRequest(Integer sessionId, Integer questionId, String userAnswer, Integer timeSpentSeconds) {
        this.sessionId = sessionId;
        this.questionId = questionId;
        this.userAnswer = userAnswer;
        this.timeSpentSeconds = timeSpentSeconds;
    }

    public Integer getSessionId() { return sessionId; }
    public void setSessionId(Integer sessionId) { this.sessionId = sessionId; }

    public Integer getQuestionId() { return questionId; }
    public void setQuestionId(Integer questionId) { this.questionId = questionId; }

    public String getUserAnswer() { return userAnswer; }
    public void setUserAnswer(String userAnswer) { this.userAnswer = userAnswer; }

    public Integer getTimeSpentSeconds() { return timeSpentSeconds; }
    public void setTimeSpentSeconds(Integer timeSpentSeconds) { this.timeSpentSeconds = timeSpentSeconds; }

    public Float getPronunciationScore() { return pronunciationScore; }
    public void setPronunciationScore(Float pronunciationScore) { this.pronunciationScore = pronunciationScore; }
}
