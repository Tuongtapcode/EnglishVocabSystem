package com.nnt.englishvocabsystem.dto;

public class ExerciseOptionDTO {
    private Integer id;
    private String optionText;
    private Boolean isCorrect;


    public ExerciseOptionDTO(Integer id, String optionText, Boolean isCorrect) {
        this.id = id;
        this.optionText = optionText;
        this.isCorrect = isCorrect;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getOptionText() {
        return optionText;
    }

    public void setOptionText(String optionText) {
        this.optionText = optionText;
    }

    public Boolean getCorrect() {
        return isCorrect;
    }

    public void setCorrect(Boolean correct) {
        isCorrect = correct;
    }
}
