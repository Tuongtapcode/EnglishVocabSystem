package com.nnt.englishvocabsystem.exceptions;

public class DuplicateFieldException extends RuntimeException {
    private String field;

    public DuplicateFieldException(String field, String message) {
        super(message);
        this.field = field;
    }

    public String getField() {
        return field;
    }
}
