package com.nnt.englishvocabsystem.services;

import com.nnt.englishvocabsystem.dto.ExerciseQuestionDTO;
import com.nnt.englishvocabsystem.entity.ExerciseQuestion;
import org.springframework.data.domain.Page;

import java.util.Map;

public interface ExerciseQuestionService {
    Page<ExerciseQuestionDTO> getQuestionsForWord(Integer wordId, Map<String, String> params);
    Page<ExerciseQuestionDTO> getAllQuestions(Map<String, String> params);


}
