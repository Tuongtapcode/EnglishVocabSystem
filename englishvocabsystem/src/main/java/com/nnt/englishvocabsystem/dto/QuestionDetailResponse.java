package com.nnt.englishvocabsystem.dto;

import com.nnt.englishvocabsystem.enums.QuestionFormat;

import java.util.List;
//complete
public class QuestionDetailResponse {
    private Integer questionId;
    private Integer wordId;
    private String englishWord;
    private String vietnameseMeaning;
    private String questionText;
    private QuestionFormat questionFormat;

    // User response
    private String userAnswer;
    private String correctAnswer;
    private Boolean isCorrect;
    private Integer timeSpentSeconds;
    private Float pronunciationScore;

    // Learning support
    private String explanation;
    private String feedback;
    private List<String> allOptions; // for multiple choice

    public QuestionDetailResponse() {
    }

    public Integer getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Integer questionId) {
        this.questionId = questionId;
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

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public QuestionFormat getQuestionFormat() {
        return questionFormat;
    }

    public void setQuestionFormat(QuestionFormat questionFormat) {
        this.questionFormat = questionFormat;
    }

    public String getUserAnswer() {
        return userAnswer;
    }

    public void setUserAnswer(String userAnswer) {
        this.userAnswer = userAnswer;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public Boolean getCorrect() {
        return isCorrect;
    }

    public void setCorrect(Boolean correct) {
        isCorrect = correct;
    }

    public Integer getTimeSpentSeconds() {
        return timeSpentSeconds;
    }

    public void setTimeSpentSeconds(Integer timeSpentSeconds) {
        this.timeSpentSeconds = timeSpentSeconds;
    }

    public Float getPronunciationScore() {
        return pronunciationScore;
    }

    public void setPronunciationScore(Float pronunciationScore) {
        this.pronunciationScore = pronunciationScore;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public List<String> getAllOptions() {
        return allOptions;
    }

    public void setAllOptions(List<String> allOptions) {
        this.allOptions = allOptions;
    }
}
