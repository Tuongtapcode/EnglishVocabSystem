package com.nnt.englishvocabsystem.repositories;

import com.nnt.englishvocabsystem.entity.User;
import com.nnt.englishvocabsystem.entity.VocabularyList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VocabularyListRepository extends JpaRepository<VocabularyList, Integer> {
    List<VocabularyList> findByUser(User user);
    boolean existsByUserAndName(User user, String name);
}