package com.nnt.englishvocabsystem.dto;

import com.nnt.englishvocabsystem.entity.VocabularyList;

import java.time.Instant;

public class VocabularyListResponse {
    private Integer id;
    private String name;
    private String description;
    private Boolean isDefault;
    private Boolean isPublic;
    private Instant createdAt;
    private Integer userId;

    public VocabularyListResponse(VocabularyList list) {
        this.id = list.getId();
        this.name = list.getName();
        this.description = list.getDescription();
        this.isDefault = list.getIsDefault();
        this.isPublic = list.getIsPublic();
        this.createdAt = list.getCreatedAt();
        this.userId = list.getUser().getId();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public Boolean getDefault() {
        return isDefault;
    }

    public void setDefault(Boolean aDefault) {
        isDefault = aDefault;
    }

    public Boolean getPublic() {
        return isPublic;
    }

    public void setPublic(Boolean aPublic) {
        isPublic = aPublic;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}