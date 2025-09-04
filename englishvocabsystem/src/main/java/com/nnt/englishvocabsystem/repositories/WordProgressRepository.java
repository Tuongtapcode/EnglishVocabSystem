package com.nnt.englishvocabsystem.repositories;

import com.nnt.englishvocabsystem.entity.User;
import com.nnt.englishvocabsystem.entity.Word;
import com.nnt.englishvocabsystem.entity.WordProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface WordProgressRepository extends JpaRepository<WordProgress, Integer>, JpaSpecificationExecutor<WordProgress> {
    Optional<WordProgress> findByUserAndWord(User user, Word word);
    long countByUserAndIsLearningFalse(User user);


    // Lấy tất cả từ đang học
    @Query("SELECT wp FROM WordProgress wp " +
            "WHERE wp.user.id = :userId AND wp.isLearning = true")
    List<WordProgress> findAllByUser(@Param("userId") Integer userId);


    // Thống kê tiến độ
    @Query("SELECT COUNT(wp) FROM WordProgress wp " +
            "WHERE wp.user.id = :userId AND wp.isLearning = false")
    Long countMasteredWords(@Param("userId") Integer userId);



}
