package com.nnt.englishvocabsystem.dto;

public class AnswerGradingResponse {
    private Boolean isCorrect;
    private String correctAnswer;
    private String userAnswer;
    private String explanation;
    private String feedback;
    private Integer timeSpentSeconds;
    private Float pronunciationScore;

    // Constructors
    public AnswerGradingResponse() {}

    // Getters and Setters

    public Boolean getIsCorrect() { return isCorrect; }
    public void setIsCorrect(Boolean isCorrect) { this.isCorrect = isCorrect; }

    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }

    public String getUserAnswer() { return userAnswer; }
    public void setUserAnswer(String userAnswer) { this.userAnswer = userAnswer; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public Integer getTimeSpentSeconds() { return timeSpentSeconds; }
    public void setTimeSpentSeconds(Integer timeSpentSeconds) { this.timeSpentSeconds = timeSpentSeconds; }

    public Float getPronunciationScore() { return pronunciationScore; }
    public void setPronunciationScore(Float pronunciationScore) { this.pronunciationScore = pronunciationScore; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

}
