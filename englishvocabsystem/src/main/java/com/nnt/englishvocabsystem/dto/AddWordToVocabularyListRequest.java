package com.nnt.englishvocabsystem.dto;

public class AddWordToVocabularyListRequest {
    private Integer vocabularyListId;
    private Integer wordId;

    public AddWordToVocabularyListRequest(Integer vocabularyListId, Integer wordId) {
        this.vocabularyListId = vocabularyListId;
        this.wordId = wordId;
    }

    public Integer getWordId() {
        return wordId;
    }

    public void setWordId(Integer wordId) {
        this.wordId = wordId;
    }

    public Integer getVocabularyListId() {
        return vocabularyListId;
    }

    public void setVocabularyListId(Integer vocabularyListId) {
        this.vocabularyListId = vocabularyListId;
    }
}
