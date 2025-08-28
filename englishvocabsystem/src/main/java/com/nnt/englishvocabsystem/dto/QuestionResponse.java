package com.nnt.englishvocabsystem.dto;

import com.nnt.englishvocabsystem.enums.QuestionFormat;

import java.util.List;

public class QuestionResponse {
    private Integer questionId;
    private Integer wordId;
    private String wordText;
    private String questionText;
    private String audioUrl;
    private String imageUrl;
    private QuestionFormat questionFormat;
    private List<OptionResponse> options;
    private Float difficultyScore;

    // Constructors, getters, setters
    public QuestionResponse() {}

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

    public String getWordText() {
        return wordText;
    }

    public void setWordText(String wordText) {
        this.wordText = wordText;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getAudioUrl() {
        return audioUrl;
    }

    public void setAudioUrl(String audioUrl) {
        this.audioUrl = audioUrl;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public QuestionFormat getQuestionFormat() {
        return questionFormat;
    }

    public void setQuestionFormat(QuestionFormat questionFormat) {
        this.questionFormat = questionFormat;
    }

    public List<OptionResponse> getOptions() {
        return options;
    }

    public void setOptions(List<OptionResponse> options) {
        this.options = options;
    }

    public Float getDifficultyScore() {
        return difficultyScore;
    }

    public void setDifficultyScore(Float difficultyScore) {
        this.difficultyScore = difficultyScore;
    }
}
