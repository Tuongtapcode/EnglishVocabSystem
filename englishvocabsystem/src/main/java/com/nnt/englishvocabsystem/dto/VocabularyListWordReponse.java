package com.nnt.englishvocabsystem.dto;

import java.time.Instant;

public class VocabularyListWordReponse {
    private Integer id;
    private Integer vocabularyListId;
    private Integer wordId;
    private String vocabularyListName;
    private String englishWord;
    private String vietnameseMeaning;
    private Instant addedAt;

    public VocabularyListWordReponse(Integer id, Integer vocabularyListId, Integer wordId, String vocabularyListName, String englishWord, String vietnameseMeaning, Instant addedAt) {
        this.id = id;
        this.vocabularyListId = vocabularyListId;
        this.wordId = wordId;
        this.vocabularyListName = vocabularyListName;
        this.englishWord = englishWord;
        this.vietnameseMeaning = vietnameseMeaning;
        this.addedAt = addedAt;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

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

    public String getVocabularyListName() {
        return vocabularyListName;
    }

    public void setVocabularyListName(String vocabularyListName) {
        this.vocabularyListName = vocabularyListName;
    }

    public String getEnglishWord() {
        return englishWord;
    }

    public void setEnglishWord(String englishWord) {
        this.englishWord = englishWord;
    }

    public String getVietnameseMeaning() {
        return vietnameseMeaning;
    }

    public void setVietnameseMeaning(String vietnameseMeaning) {
        this.vietnameseMeaning = vietnameseMeaning;
    }

    public Instant getAddedAt() {
        return addedAt;
    }

    public void setAddedAt(Instant addedAt) {
        this.addedAt = addedAt;
    }
}
