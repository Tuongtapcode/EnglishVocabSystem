package com.nnt.englishvocabsystem.services;

import com.nnt.englishvocabsystem.dto.VocabularyListDTO;
import com.nnt.englishvocabsystem.dto.VocabularyListRequest;
import com.nnt.englishvocabsystem.dto.WordDTO;
import com.nnt.englishvocabsystem.entity.User;
import com.nnt.englishvocabsystem.entity.VocabularyList;


import java.util.List;

public interface VocabularyListService {
    List<VocabularyListDTO> getVocabularyList(User user);

    List<WordDTO>getWordsInList(Integer listId, User user);

    VocabularyList createVocabularyList(VocabularyListRequest request, User user);

    VocabularyList getById(Integer id, User user);
    VocabularyList updateVocabularyList(Integer id, VocabularyListRequest request, User user);
    void deleteVocabularyList(Integer id, User user);
}
