package com.nnt.englishvocabsystem.repositories;

import com.nnt.englishvocabsystem.entity.User;
import com.nnt.englishvocabsystem.entity.VocabularyList;
import com.nnt.englishvocabsystem.entity.VocabularyListWord;
import com.nnt.englishvocabsystem.entity.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);

    @Repository
    interface VocabularyListWordRepository extends JpaRepository<VocabularyListWord, Integer> {
        boolean existsByVocabularyListAndWord(VocabularyList list, Word word);
    }
}