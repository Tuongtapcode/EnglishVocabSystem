package com.nnt.englishvocabsystem.services;

import com.nnt.englishvocabsystem.dto.WordDTO;
import com.nnt.englishvocabsystem.entity.Category;
import com.nnt.englishvocabsystem.entity.VocabularyList;
import com.nnt.englishvocabsystem.entity.Word;
import com.nnt.englishvocabsystem.repositories.WordRepository;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

public interface WordService {
    Word getWordById(Integer id);
    List<Word> getWordsByCategoryId(Integer categoryId);
    Page<WordDTO> getAllWords(Map<String, String> params);

    void addOrUpdateWord(Word word);
    void deleteWordById(Integer id);

}