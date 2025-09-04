package com.nnt.englishvocabsystem.repositories;

import com.nnt.englishvocabsystem.entity.User;
import com.nnt.englishvocabsystem.entity.UserStreak;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserStreakRepository extends JpaRepository<UserStreak, Integer> {
    Optional<UserStreak> findByUser(User user);
}
