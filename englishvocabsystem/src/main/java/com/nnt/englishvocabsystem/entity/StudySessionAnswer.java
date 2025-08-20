package com.nnt.englishvocabsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

@Entity
@Table(name = "study_session_answers")
public class StudySessionAnswer {
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    private StudySession session;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private ExerciseQuestion question;

    @NotNull
    @Lob
    @Column(name = "user_answer", nullable = false)
    private String userAnswer;

    @NotNull
    @Column(name = "is_correct", nullable = false)
    private Boolean isCorrect = false;

    @Column(name = "time_spent_seconds")
    private Integer timeSpentSeconds;

    @Column(name = "pronunciation_score")
    private Float pronunciationScore;

    @Column(name = "answered_at")
    private Instant answeredAt;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public StudySession getSession() {
        return session;
    }

    public void setSession(StudySession session) {
        this.session = session;
    }

    public ExerciseQuestion getQuestion() {
        return question;
    }

    public void setQuestion(ExerciseQuestion question) {
        this.question = question;
    }

    public String getUserAnswer() {
        return userAnswer;
    }

    public void setUserAnswer(String userAnswer) {
        this.userAnswer = userAnswer;
    }

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }

    public Integer getTimeSpentSeconds() {
        return timeSpentSeconds;
    }

    public void setTimeSpentSeconds(Integer timeSpentSeconds) {
        this.timeSpentSeconds = timeSpentSeconds;
    }

    public Float getPronunciationScore() {
        return pronunciationScore;
    }

    public void setPronunciationScore(Float pronunciationScore) {
        this.pronunciationScore = pronunciationScore;
    }

    public Instant getAnsweredAt() {
        return answeredAt;
    }

    public void setAnsweredAt(Instant answeredAt) {
        this.answeredAt = answeredAt;
    }

}