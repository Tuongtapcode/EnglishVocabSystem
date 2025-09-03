package com.nnt.englishvocabsystem.services;

import com.nnt.englishvocabsystem.dto.RecentSessionDTO;

import java.util.List;
import java.util.Map;

public interface StatsService {
    long totalUser();
    long totalWord();
    long totalStudySesion();
    long totalQuestion();

    List<RecentSessionDTO> getRecentSessions();
    Map<String, Long> getUserTypeStats();
    Map<Integer, Long> getUserActivityLast7Days();
}
