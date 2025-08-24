package com.nnt.englishvocabsystem.enums;

import com.nnt.englishvocabsystem.entity.WordProgress;

import java.time.Instant;

public enum WordStatus {
    UNLEARNED("unlearned"),   // Chưa học
    LEARNING("learning"),     // Đang học
    REVIEW("review"),         // Đã học, cần ôn tập
    LEARNED("learned"),       // Đã học nhiều lần, tạm nhớ
    MASTERED("mastered");     // Thành thạo

    private final String value;

    WordStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }


    public static WordStatus fromProgress(WordProgress wp) {
        if (wp == null) {
            return UNLEARNED;
        }

        // 1. Đã mastered (không còn learning)
        if (!wp.getIsLearning()) {
            return MASTERED;
        }

        // 2. Cần ôn tập (ưu tiên cao nhất khi đang learning)
        if (wp.getNextReviewDate() != null &&
                wp.getNextReviewDate().isBefore(Instant.now()) &&
                wp.getRepetitionCount() > 0) {
            return REVIEW;
        }

        // 3. Đã học được ít nhất và đạt tiêu chuẩn "learned"
        if (wp.getRepetitionCount() >= 3 && wp.getEaseFactor() >= 2.5) {
            return LEARNED;
        }

        // 4. Mới bắt đầu hoặc chưa đạt tiêu chuẩn
        return LEARNING;
    }
}