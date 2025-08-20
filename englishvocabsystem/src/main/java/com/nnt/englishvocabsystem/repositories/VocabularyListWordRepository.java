package com.nnt.englishvocabsystem.repositories;

import com.nnt.englishvocabsystem.entity.VocabularyList;
import com.nnt.englishvocabsystem.entity.VocabularyListWord;
import com.nnt.englishvocabsystem.entity.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VocabularyListWordRepository extends JpaRepository<VocabularyListWord, Long> {
    List<VocabularyListWord> findByVocabularyListId(Integer vocabularyListId);
    Long countByVocabularyList(VocabularyList list);
    boolean existsByVocabularyListAndWord(VocabularyList list, Word word);
    void deleteByVocabularyList(VocabularyList vocabularyList);

    Optional<VocabularyListWord> findByVocabularyListAndWord(VocabularyList list, Word word);
}
