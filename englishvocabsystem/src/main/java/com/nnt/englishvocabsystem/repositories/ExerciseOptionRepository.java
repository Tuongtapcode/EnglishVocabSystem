package com.nnt.englishvocabsystem.repositories;

import com.nnt.englishvocabsystem.entity.ExerciseOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExerciseOptionRepository extends JpaRepository<ExerciseOption, Integer> {

    // Lấy đáp án đúng duy nhất cho 1 câu hỏi
    Optional<ExerciseOption> findFirstByQuestionIdAndIsCorrectTrue(Integer questionId);
}