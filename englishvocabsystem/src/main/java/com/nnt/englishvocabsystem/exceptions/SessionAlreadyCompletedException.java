package com.nnt.englishvocabsystem.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class SessionAlreadyCompletedException extends RuntimeException {
    public SessionAlreadyCompletedException(String message) {
        super(message);
    }
}