package com.nnt.englishvocabsystem.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public class StudyWordRequest {
    @NotNull
    @Size(min = 1, message = "Word IDs list cannot be empty")
    private List<Integer> wordIds;
    @Min(value = 1, message = "Questions per word must be at least 1")
    @Max(value = 10, message = "Questions per word cannot exceed 10")
    private Integer questionsPerWord = 5;
    private String sessionType = "VOCABULARY_STUDY";

    public StudyWordRequest() {}

    public StudyWordRequest(List<Integer> wordIds) {
        this.wordIds = wordIds;
    }

    public List<Integer> getWordIds() {
        return wordIds;
    }

    public void setWordIds(List<Integer> wordIds) {
        this.wordIds = wordIds;
    }

    public Integer getQuestionsPerWord() {
        return questionsPerWord;
    }

    public void setQuestionsPerWord(Integer questionsPerWord) {
        this.questionsPerWord = questionsPerWord;
    }

    public String getSessionType() {
        return sessionType;
    }

    public void setSessionType(String sessionType) {
        this.sessionType = sessionType;
    }

}
