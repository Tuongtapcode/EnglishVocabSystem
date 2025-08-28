package com.nnt.englishvocabsystem.repositories;

import com.nnt.englishvocabsystem.entity.StudySessionAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudySessionAnswerRepository extends JpaRepository<StudySessionAnswer, Integer> {

    List<StudySessionAnswer> findBySessionId(Integer sessionId);

    boolean existsBySessionIdAndQuestionId(Integer sessionId, Integer questionId);

    @Query("SELECT COUNT(ssa) FROM StudySessionAnswer ssa WHERE ssa.session.id = :sessionId AND ssa.isCorrect = true")
    Integer countCorrectAnswersBySessionId(@Param("sessionId") Integer sessionId);

    @Query("SELECT COUNT(ssa) FROM StudySessionAnswer ssa WHERE ssa.session.id = :sessionId")
    Integer countTotalAnswersBySessionId(@Param("sessionId") Integer sessionId);

//    boolean existsQuestionInSession(@Param("sessionId") Integer sessionId,
//                                    @Param("questionId") Integer questionId);

}