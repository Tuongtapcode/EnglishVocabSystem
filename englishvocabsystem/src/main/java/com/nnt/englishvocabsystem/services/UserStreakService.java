package com.nnt.englishvocabsystem.services;

import com.nnt.englishvocabsystem.entity.User;
import com.nnt.englishvocabsystem.entity.UserStreak;

public interface UserStreakService {
    UserStreak updateUserStreak(User user, int wordsLearned, int studyMinutes);
}
