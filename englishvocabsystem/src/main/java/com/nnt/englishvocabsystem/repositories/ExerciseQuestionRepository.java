package com.nnt.englishvocabsystem.repositories;

import com.nnt.englishvocabsystem.entity.ExerciseQuestion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseQuestionRepository extends JpaRepository<ExerciseQuestion, Integer> {
    Page<ExerciseQuestion> findByWordId(Integer wordId, Pageable pageable);
    List<ExerciseQuestion> findByWordIdIn(List<Integer> wordIds);

    // Optional: Thêm query để random câu hỏi cho performance tốt hơn
    @Query("SELECT eq FROM ExerciseQuestion eq WHERE eq.word.id = :wordId ORDER BY FUNCTION('RAND')")
    List<ExerciseQuestion> findRandomQuestionsByWordId(@Param("wordId") Integer wordId, Pageable pageable);

    // Optional: Count số câu hỏi per word để validate
    @Query("SELECT eq.word.id, COUNT(eq) FROM ExerciseQuestion eq WHERE eq.word.id IN :wordIds GROUP BY eq.word.id")
    List<Object[]> countQuestionsByWordIds(@Param("wordIds") List<Integer> wordIds);
}
