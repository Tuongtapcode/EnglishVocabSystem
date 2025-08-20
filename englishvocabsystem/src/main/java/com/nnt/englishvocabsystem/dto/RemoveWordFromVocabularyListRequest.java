package com.nnt.englishvocabsystem.dto;

public class RemoveWordFromVocabularyListRequest {
    private Integer vocabularyListId;
    private Integer wordId;

    // getters & setters
    public Integer getVocabularyListId() {
        return vocabularyListId;
    }

    public void setVocabularyListId(Integer vocabularyListId) {
        this.vocabularyListId = vocabularyListId;
    }

    public Integer getWordId() {
        return wordId;
    }

    public void setWordId(Integer wordId) {
        this.wordId = wordId;
    }
}
