package com.nnt.englishvocabsystem.services.impl;


import com.nnt.englishvocabsystem.entity.Achievement;
import com.nnt.englishvocabsystem.entity.User;
import com.nnt.englishvocabsystem.entity.UserAchievement;
import com.nnt.englishvocabsystem.entity.UserStreak;
import com.nnt.englishvocabsystem.repositories.*;
import com.nnt.englishvocabsystem.services.AchievementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class AchievementServiceImpl implements AchievementService {
    @Autowired
    private AchievementRepository achievementRepo;

    @Autowired
    private UserAchievementRepository userAchRepo;
    @Autowired
    private UserStreakRepository streakRepo;

    @Autowired
    private StudySessionRepository sessionRepo;
    @Autowired
    private WordProgressRepository wordProgressRepo;
    @Override
    public void checkAchievements(User user) {
        List<Achievement> achievements = achievementRepo.findByIsActiveTrue();

        UserStreak streak = streakRepo.findByUser(user).orElse(null);
        long completedSessions = sessionRepo.countByUserAndCompletedTrue(user);
        long wordsLearned = wordProgressRepo.countByUserAndIsLearningFalse(user);

        for (Achievement ach : achievements) {
            boolean already = userAchRepo.existsByUserAndAchievement(user, ach);
            if (already) continue;

            boolean earned = false;
            switch (ach.getCriteriaType()) {
                case "streak":
                    if (streak != null && streak.getCurrentStreak() >= ach.getCriteriaValue())
                        earned = true;
                    break;
                case "sessions_completed":
                    if (completedSessions >= ach.getCriteriaValue())
                        earned = true;
                    break;
                case "words_learned":
                    if (wordsLearned >= ach.getCriteriaValue())
                        earned = true;
                    break;
            }

            if (earned) {
                UserAchievement ua = new UserAchievement();
                ua.setUser(user);
                ua.setAchievement(ach);
                ua.setEarnedAt(Instant.now());
                userAchRepo.save(ua);
            }
        }
    }

}
