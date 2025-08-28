package com.nnt.englishvocabsystem.entity;

import com.nnt.englishvocabsystem.enums.QuestionFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "exercise_questions")
public class ExerciseQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "word_id", nullable = false)
    private Word word;

    @NotNull
    @Lob
    @Column(name = "question_text", nullable = false)
    private String questionText;

    @Column(name = "audio_url", length = 255)
    private String audioUrl;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "question_format", nullable = false)
    private QuestionFormat questionFormat;

    @Lob
    @Column(name = "explanation")
    private String explanation;

    @Column(name = "difficulty_score")
    private Float difficultyScore = 1.0f;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<ExerciseOption> options = new HashSet<>();

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<StudySessionAnswer> answers = new HashSet<>();

    public ExerciseQuestion() {
    }


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Exercise getExercise() {
        return exercise;
    }

    public void setExercise(Exercise exercise) {
        this.exercise = exercise;
    }

    public Word getWord() {
        return word;
    }

    public void setWord(Word word) {
        this.word = word;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getAudioUrl() {
        return audioUrl;
    }

    public void setAudioUrl(String audioUrl) {
        this.audioUrl = audioUrl;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public QuestionFormat getQuestionFormat() {
        return questionFormat;
    }

    public void setQuestionFormat(QuestionFormat questionFormat) {
        this.questionFormat = questionFormat;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public Float getDifficultyScore() {
        return difficultyScore;
    }

    public void setDifficultyScore(Float difficultyScore) {
        this.difficultyScore = difficultyScore;
    }


    public Set<ExerciseOption> getOptions() {
        return options;
    }

    public void setOptions(Set<ExerciseOption> options) {
        this.options = options;
    }

    public Set<StudySessionAnswer> getAnswers() {
        return answers;
    }

    public void setAnswers(Set<StudySessionAnswer> answers) {
        this.answers = answers;
    }
}