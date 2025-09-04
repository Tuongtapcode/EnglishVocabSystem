package com.nnt.englishvocabsystem.repositories;

import com.nnt.englishvocabsystem.entity.Achievement;
import com.nnt.englishvocabsystem.entity.User;
import com.nnt.englishvocabsystem.entity.UserAchievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserAchievementRepository extends JpaRepository<UserAchievement, Integer> {
    boolean existsByUserAndAchievement(User user, Achievement achievement);
}