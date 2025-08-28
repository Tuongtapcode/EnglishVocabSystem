package com.nnt.englishvocabsystem.entity;

import com.nnt.englishvocabsystem.enums.Level;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;

@Entity
@Table(name = "words")
public class Word {
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 100)
    @NotNull
    @Column(name = "english_word", nullable = false, length = 100)
    private String englishWord;

    @NotNull
    @Column(name = "vietnamese_meaning", nullable = false, length = 100)
    private String vietnameseMeaning;

    @Size(max = 200)
    @Column(name = "pronunciation", length = 200)
    private String pronunciation;

    @NotNull
    @Lob
    @Column(name = "word_type", nullable = false)
    private String wordType;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "level", nullable = false)
    private Level level;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Lob
    @Column(name = "example_sentence_en")
    private String exampleSentenceEn;

    @Lob
    @Column(name = "example_sentence_vi")
    private String exampleSentenceVi;

    @Size(max = 500)
    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Size(max = 500)
    @Column(name = "audio_url", length = 500)
    private String audioUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @Column(name = "is_active")
    private Boolean isActive;

    @Size(max = 20)
    @Column(name = "approval_status", length = 20)
    private String approvalStatus;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

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

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getExampleSentenceEn() {
        return exampleSentenceEn;
    }

    public void setExampleSentenceEn(String exampleSentenceEn) {
        this.exampleSentenceEn = exampleSentenceEn;
    }

    public String getExampleSentenceVi() {
        return exampleSentenceVi;
    }

    public void setExampleSentenceVi(String exampleSentenceVi) {
        this.exampleSentenceVi = exampleSentenceVi;
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

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public String getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(String approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

}