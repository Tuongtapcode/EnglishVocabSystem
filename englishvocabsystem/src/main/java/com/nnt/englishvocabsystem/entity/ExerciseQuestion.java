package com.nnt.englishvocabsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "exercise_questions")
public class ExerciseQuestion {
    @Id
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

    @NotNull
    @Lob
    @Column(name = "correct_answer", nullable = false)
    private String correctAnswer;

    @Lob
    @Column(name = "explanation")
    private String explanation;

    @Column(name = "difficulty_score")
    private Float difficultyScore;

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

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
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

}