package com.nnt.englishvocabsystem.repositories;

import com.nnt.englishvocabsystem.entity.User;
import com.nnt.englishvocabsystem.entity.Word;
import com.nnt.englishvocabsystem.entity.WordProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WordProgressRepository extends JpaRepository<WordProgress, Integer> {
    Optional<WordProgress> findByUserAndWord(User user, Word word);
}
