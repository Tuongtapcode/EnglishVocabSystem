package com.nnt.englishvocabsystem.utils;

import java.time.Instant;

public class RequestParamUtils {
    private RequestParamUtils() {
        // chặn khởi tạo
    }
    public static Integer parseIntSafe(String value, Integer defaultValue) {
        try {
            return (value != null && !value.isBlank()) ? Integer.parseInt(value) : defaultValue;
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    public static boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    // nếu cần thêm cho Instant
    public static Instant parseInstantSafe(String value, Instant defaultValue) {
        try {
            return (value != null && !value.isBlank()) ? Instant.parse(value) : defaultValue;
        } catch (Exception e) {
            return defaultValue;
        }
    }
}
