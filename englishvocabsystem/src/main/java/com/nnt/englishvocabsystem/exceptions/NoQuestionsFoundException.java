package com.nnt.englishvocabsystem.exceptions;

public class NoQuestionsFoundException extends RuntimeException {
    public NoQuestionsFoundException(String message) {
        super(message);
    }
}