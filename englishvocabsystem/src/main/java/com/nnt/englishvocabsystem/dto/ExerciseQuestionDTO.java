package com.nnt.englishvocabsystem.dto;

import java.util.List;

public class ExerciseQuestionDTO {
    private Integer id;
    private String questionText;
    private String questionFormat;
    private String audioUrl;
    private String imageUrl;
    private String explanation;
    private List<ExerciseOptionDTO> options;

    public ExerciseQuestionDTO(Integer id, String questionText, String questionFormat, String audioUrl, String imageUrl, String explanation, List<ExerciseOptionDTO> options) {
        this.id = id;
        this.questionText = questionText;
        this.questionFormat = questionFormat;
        this.audioUrl = audioUrl;
        this.imageUrl = imageUrl;
        this.explanation = explanation;
        this.options = options;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getQuestionFormat() {
        return questionFormat;
    }

    public void setQuestionFormat(String questionFormat) {
        this.questionFormat = questionFormat;
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

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public List<ExerciseOptionDTO> getOptions() {
        return options;
    }

    public void setOptions(List<ExerciseOptionDTO> options) {
        this.options = options;
    }
}
