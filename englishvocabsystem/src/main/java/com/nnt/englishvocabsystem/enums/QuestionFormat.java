package com.nnt.englishvocabsystem.enums;

public enum QuestionFormat {
    MULTIPLE_CHOICE("multiple_choice"),
    FILL_BLANK("fill_blank"),
    LISTENING_GAP("listening_gap"),
    SPEAKING("speaking");
//    TRUE_FALSE("true_false"),
//    MATCHING("matching"),
//    TRANSLATION("translation"),
//    IMAGE_CHOICE("image_choice");

    private final String value;

    QuestionFormat(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}