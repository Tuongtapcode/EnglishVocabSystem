package com.nnt.englishvocabsystem.dto;

public class OptionResponse {
    private Integer optionId;
    private String optionText;
    //    private Boolean isCorrect;
    // Note: isCorrect is intentionally excluded from response for security

    public OptionResponse() {}

    public OptionResponse(Integer optionId, String optionText) {
        this.optionId = optionId;
        this.optionText = optionText;
    }

    public Integer getOptionId() {
        return optionId;
    }

    public void setOptionId(Integer optionId) {
        this.optionId = optionId;
    }

    public String getOptionText() {
        return optionText;
    }

    public void setOptionText(String optionText) {
        this.optionText = optionText;
    }
}
