package com.nnt.englishvocabsystem.services.impl;

import com.nnt.englishvocabsystem.entity.User;
import com.nnt.englishvocabsystem.entity.VocabularyList;
import com.nnt.englishvocabsystem.entity.VocabularyListWord;
import com.nnt.englishvocabsystem.entity.Word;
import com.nnt.englishvocabsystem.repositories.VocabularyListRepository;
import com.nnt.englishvocabsystem.repositories.VocabularyListWordRepository;
import com.nnt.englishvocabsystem.repositories.WordRepository;
import com.nnt.englishvocabsystem.services.VocabularyListWordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;

import java.time.Instant;

@Service
public class VocabularyListWordServiceImpl implements VocabularyListWordService {
    @Autowired
    private VocabularyListRepository vocabularyListRepository;
    @Autowired
    private WordRepository wordRepository;
    @Autowired
    private VocabularyListWordRepository listWordRepository;

    @Override
    public VocabularyListWord addWordToList(Integer listId, Integer wordId, User user) {
        VocabularyList list = vocabularyListRepository.findById(listId)
                .orElseThrow(() -> new RuntimeException("Danh sách không tồn tại"));

        // Check: list phải có user, và phải trùng với user hiện tại
        if (list.getUser() == null || !list.getUser().equals(user)) {
            throw new AccessDeniedException("Bạn không có quyền thêm từ vào danh sách này");
        }

        Word word = wordRepository.findById(wordId)
                .orElseThrow(() -> new RuntimeException("Từ không tồn tại"));

        // Kiểm tra từ đã có trong danh sách chưa
        if (listWordRepository.existsByVocabularyListAndWord(list, word)) {
            throw new RuntimeException("Từ đã có trong danh sách");
        }

        VocabularyListWord vlw = new VocabularyListWord();
        vlw.setVocabularyList(list);
        vlw.setWord(word);
        vlw.setAddedAt(Instant.now());

        return listWordRepository.save(vlw);
    }

    @Override
    public void removeWordFromList(Integer listId, Integer wordId, User user) {
        VocabularyList list = vocabularyListRepository.findById(listId)
                .orElseThrow(() -> new RuntimeException("Danh sách không tồn tại"));

        // Check quyền sở hữu
        if (list.getUser() == null || !list.getUser().equals(user)) {
            throw new AccessDeniedException("Bạn không có quyền xóa từ khỏi danh sách này");
        }

        Word word = wordRepository.findById(wordId)
                .orElseThrow(() -> new RuntimeException("Từ không tồn tại"));

        VocabularyListWord vlw = listWordRepository.findByVocabularyListAndWord(list, word)
                .orElseThrow(() -> new RuntimeException("Từ không có trong danh sách"));

        listWordRepository.delete(vlw);
    }
}
