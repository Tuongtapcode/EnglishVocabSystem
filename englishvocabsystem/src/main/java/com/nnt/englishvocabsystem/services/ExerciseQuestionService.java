package com.nnt.englishvocabsystem.services;

import com.nnt.englishvocabsystem.dto.ExerciseQuestionDTO;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

public interface ExerciseQuestionService {
    Page<ExerciseQuestionDTO> getQuestionsForWord(Integer wordId, Map<String, String> params);
}
