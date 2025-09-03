package com.nnt.englishvocabsystem.services.impl;

import com.nnt.englishvocabsystem.dto.RecentSessionDTO;
import com.nnt.englishvocabsystem.repositories.ExerciseQuestionRepository;
import com.nnt.englishvocabsystem.repositories.StudySessionRepository;
import com.nnt.englishvocabsystem.repositories.UserRepository;
import com.nnt.englishvocabsystem.repositories.WordRepository;
import com.nnt.englishvocabsystem.services.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StatsServiceImpl implements StatsService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudySessionRepository studySessionRepository;

    @Autowired
    private WordRepository wordRepository;

    @Autowired
    private ExerciseQuestionRepository exerciseQuestionRepository;
    @Override
    public long totalUser() {
        return userRepository.count();
    }

    @Override
    public long totalWord() {
        return wordRepository.count();
    }

    @Override
    public long totalStudySesion() {
        return studySessionRepository.count();
    }

    @Override
    public long totalQuestion() {
        return exerciseQuestionRepository.count();
    }

    @Override
    public List<RecentSessionDTO> getRecentSessions() {
        Pageable top5 = PageRequest.of(0, 5);
        List<Object[]> rawData = studySessionRepository.findRecentSessions(top5);

        return rawData.stream()
                .map(row -> new RecentSessionDTO(
                        (String) row[0],      // username
                        (String) row[1],      // sessionType
                        (Instant) row[2],     // startTime
                        (Boolean) row[3]      // completed
                ))
                .toList();
    }

    @Override
    public Map<String, Long> getUserTypeStats() {
        List<Object[]> raw = userRepository.countUsersByType();

        Map<String, Long> result = new HashMap<>();
        for (Object[] row : raw) {
            String type = (String) row[0];
            Long count = (Long) row[1];
            result.put(type.toUpperCase(), count);
        }
        return result;
    }

    @Override
    public Map<Integer, Long> getUserActivityLast7Days() {
        Instant sevenDaysAgo = Instant.now().minus(7, ChronoUnit.DAYS);
        List<Object[]> results = userRepository.countActiveUsersByDay(sevenDaysAgo);

        Map<Integer, Long> stats = new HashMap<>();
        for (Object[] row : results) {
            Integer dayOfWeek = ((Number) row[0]).intValue();
            Long count = ((Number) row[1]).longValue();
            stats.put(dayOfWeek, count);
        }
        return stats;
    }
}
