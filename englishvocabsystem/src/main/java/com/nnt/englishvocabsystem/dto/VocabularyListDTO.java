package com.nnt.englishvocabsystem.dto;

public class VocabularyListDTO {
    private Integer id;
    private Integer userId;
    private String name;
    private String description;
    private Long wordCount;


    public VocabularyListDTO(Integer id, Integer userId, String name, String description, Long wordCount) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.description = description;
        this.wordCount = wordCount;
    }
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getWordCount() {
        return wordCount;
    }

    public void setWordCount(Long wordCount) {
        this.wordCount = wordCount;
    }

}
