package com.nnt.englishvocabsystem.repositories;


import com.nnt.englishvocabsystem.entity.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Integer> {
    List<Achievement> findByIsActiveTrue();
}