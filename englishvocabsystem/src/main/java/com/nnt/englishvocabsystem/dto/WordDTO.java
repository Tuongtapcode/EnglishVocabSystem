package com.nnt.englishvocabsystem.dto;

import com.nnt.englishvocabsystem.enums.Level;

public class WordDTO {
    private Integer id;
    private String englishWord;
    private String vietnameseMeaning;
    private String pronunciation;
    private String wordType;
    private Level level;
    private String imageUrl;
    private String audioUrl;
    private CategoryDTO category;

    public WordDTO(Integer id, String englishWord, String vietnameseMeaning, String pronunciation, String wordType, Level level, String imageUrl, String audioUrl, CategoryDTO category) {
        this.id = id;
        this.englishWord = englishWord;
        this.vietnameseMeaning = vietnameseMeaning;
        this.pronunciation = pronunciation;
        this.wordType = wordType;
        this.level = level;
        this.imageUrl = imageUrl;
        this.audioUrl = audioUrl;
        this.category = category;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public String getPronunciation() {
        return pronunciation;
    }

    public void setPronunciation(String pronunciation) {
        this.pronunciation = pronunciation;
    }

    public String getWordType() {
        return wordType;
    }

    public void setWordType(String wordType) {
        this.wordType = wordType;
    }

    public Level getLevel() {
        return level;
    }

    public void setLevel(Level level) {
        this.level = level;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getAudioUrl() {
        return audioUrl;
    }

    public void setAudioUrl(String audioUrl) {
        this.audioUrl = audioUrl;
    }

    public CategoryDTO getCategory() {
        return category;
    }
    public void setCategory(CategoryDTO category) {
        this.category = category;
    }
}
