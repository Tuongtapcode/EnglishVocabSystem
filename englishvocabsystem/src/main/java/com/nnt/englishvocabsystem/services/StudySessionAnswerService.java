package com.nnt.englishvocabsystem.services;

import com.nnt.englishvocabsystem.dto.AnswerGradingResponse;
import com.nnt.englishvocabsystem.dto.SessionCompleteResponse;
import com.nnt.englishvocabsystem.dto.SubmitAnswerRequest;
import com.nnt.englishvocabsystem.entity.ExerciseQuestion;
import com.nnt.englishvocabsystem.entity.User;

import java.util.List;

public interface StudySessionAnswerService {
    AnswerGradingResponse submitAndGradeAnswer(User user, SubmitAnswerRequest request);
    boolean isAnswerCorrect(ExerciseQuestion question, String userAnswer);
    String generateFeedback(boolean isCorrect, ExerciseQuestion question, Integer timeSpent);
    SessionCompleteResponse completeSession(User user, Integer sessionId);
}