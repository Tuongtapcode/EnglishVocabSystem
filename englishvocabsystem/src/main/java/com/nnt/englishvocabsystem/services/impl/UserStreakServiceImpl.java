package com.nnt.englishvocabsystem.services.impl;

import com.nnt.englishvocabsystem.entity.User;
import com.nnt.englishvocabsystem.entity.UserStreak;
import com.nnt.englishvocabsystem.repositories.UserStreakRepository;
import com.nnt.englishvocabsystem.services.UserStreakService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.temporal.IsoFields;

@Service
public class UserStreakServiceImpl implements UserStreakService {
    @Autowired
    private UserStreakRepository streakRepo;

    @Override
    public UserStreak updateUserStreak(User user, int wordsLearned, int studyMinutes) {
        Instant now = Instant.now();
        LocalDate today = LocalDate.ofInstant(now, ZoneOffset.UTC);
        UserStreak streak = streakRepo.findByUser(user).orElseGet(() -> {
            UserStreak s = new UserStreak();
            s.setUser(user);
            s.setCurrentStreak(0);
            s.setLongestStreak(0);
            s.setTotalStudyDays(0);
            s.setWordsLearnedToday(0);
            s.setWordsLearnedThisWeek(0);
            s.setStudyTimeTodayMinutes(0);
            s.setStudyTimeThisWeekMinutes(0);
            s.setLastResetDate(now);
            return s;
        });

        // Reset daily/weekly if needed
        LocalDate lastResetDate = streak.getLastResetDate() != null
                ? LocalDate.ofInstant(streak.getLastResetDate(), ZoneOffset.UTC)
                : null;

        if (lastResetDate == null || !lastResetDate.equals(today)) {
            streak.setWordsLearnedToday(0);
            streak.setStudyTimeTodayMinutes(0);

            // Nếu khác tuần thì reset luôn weekly
            if (lastResetDate == null || lastResetDate.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR) != today.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR)) {
                streak.setWordsLearnedThisWeek(0);
                streak.setStudyTimeThisWeekMinutes(0);
            }

            streak.setLastResetDate(now);
        }

        // Streak logic
        LocalDate lastStudyDate = streak.getLastStudyDate() != null
                ? LocalDate.ofInstant(streak.getLastStudyDate(), ZoneOffset.UTC)
                : null;

        if (lastStudyDate != null && lastStudyDate.equals(today.minusDays(1))) {
            streak.setCurrentStreak(streak.getCurrentStreak() + 1);
        } else if (lastStudyDate == null || !lastStudyDate.equals(today)) {
            streak.setCurrentStreak(1);
        }

        streak.setLastStudyDate(now);
        streak.setTotalStudyDays(streak.getTotalStudyDays() + 1);
        streak.setLongestStreak(Math.max(streak.getLongestStreak(), streak.getCurrentStreak()));

        // Update stats
        streak.setWordsLearnedToday(streak.getWordsLearnedToday() + wordsLearned);
        streak.setWordsLearnedThisWeek(streak.getWordsLearnedThisWeek() + wordsLearned);
        streak.setStudyTimeTodayMinutes(streak.getStudyTimeTodayMinutes() + studyMinutes);
        streak.setStudyTimeThisWeekMinutes(streak.getStudyTimeThisWeekMinutes() + studyMinutes);

        return streakRepo.save(streak);
    }

}
