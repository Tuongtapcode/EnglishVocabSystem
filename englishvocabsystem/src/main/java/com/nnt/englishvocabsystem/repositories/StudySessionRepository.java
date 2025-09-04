package com.nnt.englishvocabsystem.repositories;

import com.nnt.englishvocabsystem.entity.StudySession;
import com.nnt.englishvocabsystem.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudySessionRepository extends JpaRepository<StudySession, Integer> {


    List<StudySession> findByUserIdAndCompleted(Integer userId, Boolean completed);

    Optional<StudySession> findTopByUserIdOrderByStartTimeDesc(Integer userId);

    long countByUserAndCompletedTrue(User user);


    List<StudySession> findByUserIdAndSessionType(Integer userId, String sessionType);

    @Query("SELECT s FROM StudySession s WHERE s.user.id = :userId AND s.startTime BETWEEN :startTime AND :endTime")
    List<StudySession> findByUserIdAndTimeRange(@Param("userId") Integer userId,
                                                @Param("startTime") Instant startTime,
                                                @Param("endTime") Instant endTime);

    @Query("""
        SELECT u.username, s.sessionType, s.startTime, s.completed
        FROM StudySession s
        JOIN s.user u
        ORDER BY s.startTime DESC
        """)
    List<Object[]> findRecentSessions(Pageable pageable);
}
