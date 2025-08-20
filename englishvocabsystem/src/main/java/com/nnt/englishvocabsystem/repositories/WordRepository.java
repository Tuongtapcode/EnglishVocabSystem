package com.nnt.englishvocabsystem.repositories;

import com.nnt.englishvocabsystem.entity.VocabularyList;
import com.nnt.englishvocabsystem.entity.Word;
import com.nnt.englishvocabsystem.enums.Level;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WordRepository extends JpaRepository<Word, Integer>, JpaSpecificationExecutor<Word> {
    List<Word> findByCategoryId(Integer categoryId);

    Long countByCategory_Id(Integer categoryId);
    Long countByCategory_IdAndLevel(Integer categoryId, Level level);
}