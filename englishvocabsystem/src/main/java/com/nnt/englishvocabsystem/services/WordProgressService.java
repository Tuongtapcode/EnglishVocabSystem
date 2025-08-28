package com.nnt.englishvocabsystem.services;

import com.nnt.englishvocabsystem.dto.ReviewScheduleResponse;
import com.nnt.englishvocabsystem.dto.ReviewWordResponse;
import com.nnt.englishvocabsystem.dto.WordProgressRequest;
import com.nnt.englishvocabsystem.entity.ExerciseQuestion;
import com.nnt.englishvocabsystem.entity.User;
import com.nnt.englishvocabsystem.entity.Word;
import com.nnt.englishvocabsystem.entity.WordProgress;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

public interface WordProgressService {

    WordProgress addOrUpdateProgress(User user, Word word, int quality);
    Page<ReviewWordResponse> getDueWords(User user, Map<String, String> params);
    ReviewScheduleResponse getReviewSchedule(User user);
}
