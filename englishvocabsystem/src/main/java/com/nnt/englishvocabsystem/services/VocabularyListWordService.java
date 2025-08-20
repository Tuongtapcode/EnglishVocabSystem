package com.nnt.englishvocabsystem.services;

import com.nnt.englishvocabsystem.entity.User;
import com.nnt.englishvocabsystem.entity.VocabularyListWord;

public interface VocabularyListWordService {
    VocabularyListWord addWordToList(Integer listId, Integer wordId, User user);
    public void removeWordFromList(Integer listId, Integer wordId, User user);
}
