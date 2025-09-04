package com.nnt.englishvocabsystem.services.impl;

import com.nnt.englishvocabsystem.dto.*;
import com.nnt.englishvocabsystem.entity.*;
import com.nnt.englishvocabsystem.exceptions.ResourceNotFoundException;
import com.nnt.englishvocabsystem.exceptions.SessionAlreadyCompletedException;
import com.nnt.englishvocabsystem.exceptions.UnauthorizedException;
import com.nnt.englishvocabsystem.repositories.*;
import com.nnt.englishvocabsystem.services.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StudySessionAnswerServiceImpl implements StudySessionAnswerService {
    @Autowired
    private StudySessionRepository sessionRepository;

    @Autowired
    private ExerciseQuestionRepository questionRepository;

    @Autowired
    private ExerciseOptionRepository optionRepository;

    @Autowired
    private StudySessionAnswerRepository answerRepository;

    @Autowired
    private WordProgressService wordProgressService;

    @Autowired
    private UserStreakService userStreakService;

    @Autowired
    private AchievementService achievementService;

    @Override
    public AnswerGradingResponse submitAndGradeAnswer(User user, SubmitAnswerRequest request) {
        StudySession session = sessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new EntityNotFoundException("Study session not found"));
        if (!session.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Not your session");
        }
        if (session.getCompleted()) {
            throw new IllegalStateException("Session is already completed");
        }

        ExerciseQuestion question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new EntityNotFoundException("Question not found"));

        if (answerRepository.existsBySessionIdAndQuestionId(request.getSessionId(), request.getQuestionId())) {
            throw new IllegalStateException("Question already answered in this session");
        }



        boolean isCorrect = isAnswerCorrect(question, request.getUserAnswer());

        // Save answer
        StudySessionAnswer sessionAnswer = new StudySessionAnswer();
        sessionAnswer.setSession(session);
        sessionAnswer.setQuestion(question);
        sessionAnswer.setUserAnswer(request.getUserAnswer());
        sessionAnswer.setIsCorrect(isCorrect);
        sessionAnswer.setTimeSpentSeconds(request.getTimeSpentSeconds());
        sessionAnswer.setPronunciationScore(request.getPronunciationScore());
        sessionAnswer.setAnsweredAt(Instant.now());
        answerRepository.save(sessionAnswer);

        // Update session stats
        updateSessionStats(session);
        // Build response
        return buildGradingResponse(sessionAnswer, question, session);
    }

    @Override
    public boolean isAnswerCorrect(ExerciseQuestion question, String userAnswer) {
        if (userAnswer == null || userAnswer.trim().isEmpty()) {
            return false;
        }
        List<ExerciseOption> correctOptions = question.getOptions().stream()
                .filter(ExerciseOption::getIsCorrect)
                .toList();
        String correctAnswer = correctOptions.isEmpty() ? "" : correctOptions.get(0).getOptionText().trim().toLowerCase();
        String normalizedUserAnswer = userAnswer.trim().toLowerCase();

        switch (question.getQuestionFormat()) {
            case MULTIPLE_CHOICE:
                // For multiple choice, check if user answer matches any correct option
                return question.getOptions().stream()
                        .anyMatch(option -> option.getIsCorrect() &&
                                option.getOptionText().trim().toLowerCase().equals(normalizedUserAnswer));

            case FILL_BLANK:
                // For fill blank, allow some flexibility in matching
                return isFlexibleMatch(correctAnswer, normalizedUserAnswer);

            case LISTENING_GAP:
                // Similar to fill blank but might be more strict
                return correctAnswer.equals(normalizedUserAnswer);

            case SPEAKING:
                // For speaking, this would typically be handled by pronunciation scoring
                // For now, we'll do basic text matching
                return isFlexibleMatch(correctAnswer, normalizedUserAnswer);

            default:
                return correctAnswer.equals(normalizedUserAnswer);
        }
    }

    private boolean isFlexibleMatch(String correct, String user) {
        // Basic flexible matching - can be enhanced
        return correct.equals(user) ||
                correct.replaceAll("[^a-zA-Z0-9]", "").equals(user.replaceAll("[^a-zA-Z0-9]", ""));
    }

    private void updateSessionStats(StudySession session) {
        Integer correctAnswers = answerRepository.countCorrectAnswersBySessionId(session.getId());
        Integer totalAnswers = answerRepository.countTotalAnswersBySessionId(session.getId());

        session.setCorrectAnswers(correctAnswers != null ? correctAnswers : 0);

        if (totalAnswers != null && totalAnswers > 0) {
            session.setScorePercentage((float) (correctAnswers * 100) / totalAnswers);
        }

        sessionRepository.save(session);
    }

    @Override
    public String generateFeedback(boolean isCorrect, ExerciseQuestion question, Integer timeSpent) {
        Optional<ExerciseOption> correctOption = question.getOptions().stream()
                .filter(ExerciseOption::getIsCorrect)
                .findFirst();

        String correctAnswer = correctOption.map(ExerciseOption::getOptionText).orElse("N/A");
        if (isCorrect) {
            return (timeSpent != null && timeSpent < 5) ?
                    "Excellent! Quick and correct!" : "Well done! Correct answer.";
        } else {
            return "Not quite right. The correct answer is: " + correctAnswer;
        }
    }

    private AnswerGradingResponse buildGradingResponse(StudySessionAnswer sessionAnswer,
                                                       ExerciseQuestion question,
                                                       StudySession session) {
        AnswerGradingResponse response = new AnswerGradingResponse();
        response.setIsCorrect(sessionAnswer.getIsCorrect());
        Optional<ExerciseOption> correctOption = question.getOptions().stream()
                .filter(ExerciseOption::getIsCorrect)
                .findFirst();
        response.setCorrectAnswer(correctOption.map(ExerciseOption::getOptionText).orElse(null));
        response.setUserAnswer(sessionAnswer.getUserAnswer());
        response.setExplanation(question.getExplanation());
        response.setTimeSpentSeconds(sessionAnswer.getTimeSpentSeconds());
        response.setPronunciationScore(sessionAnswer.getPronunciationScore());
        response.setFeedback(generateFeedback(sessionAnswer.getIsCorrect(), question, sessionAnswer.getTimeSpentSeconds()));
        Integer answeredCount = answerRepository.countTotalAnswersBySessionId(session.getId());


        return response;
    }
    @Override
    public SessionCompleteResponse completeSession(User user, Integer sessionId) {
        StudySession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        if (!session.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Not your session");
        }
        if (Boolean.TRUE.equals(session.getCompleted())) {
            throw new SessionAlreadyCompletedException("Session already completed");
        }
        // 2. Đánh dấu hoàn thành
        session.setCompleted(true);
        Instant endTime = Instant.now();
        int durationMinutes = (int) ChronoUnit.MINUTES.between(session.getStartTime(), endTime);
        session.setDurationMinutes(durationMinutes);
        session.setEndTime(endTime);
        sessionRepository.save(session);

        // 3. Lấy answers
        List<StudySessionAnswer> answers = answerRepository.findBySessionId(sessionId);

        int correctCount = 0;
        List<QuestionDetailResponse> questionDetails = new ArrayList<>();
        List<WordProgressUpdate> wordUpdates = new ArrayList<>();

        for (StudySessionAnswer ans : answers) {
            ExerciseQuestion q = ans.getQuestion();
            Word word = q.getWord();

            boolean isCorrect = Boolean.TRUE.equals(ans.getIsCorrect());
            if (isCorrect) correctCount++;

            int quality = isCorrect ? 5 : 2;

            // 4. Add or update WordProgress thông qua service riêng
            WordProgress wp = wordProgressService.addOrUpdateProgress(user, word, quality);

            // 5. Thống kê và build WordProgressUpdate
            WordProgressUpdate wpu = new WordProgressUpdate();
            wpu.setWordId(word.getId());
            wpu.setEnglishWord(word.getEnglishWord());
            wpu.setVietnameseMeaning(word.getVietnameseMeaning());
            wpu.setRepetitionCount(wp.getRepetitionCount());
            wpu.setIntervalDays(wp.getIntervalDays());
            wpu.setNextReviewDate(wp.getNextReviewDate());
            wpu.setEaseFactor(wp.getEaseFactor());
            wpu.setQuestionsInSession(1);
            wpu.setCorrectInSession(isCorrect ? 1 : 0);
            wpu.setImprovedThisSession(isCorrect);
            wordUpdates.add(wpu);

            // 6. Build QuestionDetailResponse
            QuestionDetailResponse qdr = new QuestionDetailResponse();
            qdr.setQuestionId(q.getId());
            qdr.setWordId(word.getId());
            qdr.setEnglishWord(word.getEnglishWord());
            qdr.setVietnameseMeaning(word.getVietnameseMeaning());
            qdr.setQuestionText(q.getQuestionText());
            qdr.setQuestionFormat(q.getQuestionFormat());
            qdr.setUserAnswer(ans.getUserAnswer());

            optionRepository.findFirstByQuestionIdAndIsCorrectTrue(q.getId())
                    .ifPresent(opt -> qdr.setCorrectAnswer(opt.getOptionText()));

            qdr.setTimeSpentSeconds(ans.getTimeSpentSeconds());
            qdr.setPronunciationScore(ans.getPronunciationScore());
            qdr.setExplanation(q.getExplanation());
            qdr.setFeedback(isCorrect ? "Good job!" : "Review this word again");

            questionDetails.add(qdr);
        }

        // 7. Tính toán điểm và performance
        float scorePercentage = answers.isEmpty() ? 0f : (correctCount * 100f / answers.size());

        float efficiency = answers.isEmpty() ? 0f : (scorePercentage / (durationMinutes + 1));

        String performance;
        if (scorePercentage >= 90) performance = "excellent";
        else if (scorePercentage >= 70) performance = "good";
        else performance = "needs_improvement";

        // 8. Build response
        SessionCompleteResponse.SessionSummary summary = new SessionCompleteResponse.SessionSummary();
        summary.setTotalQuestions(answers.size());
        summary.setCorrectAnswers(correctCount);
        summary.setScorePercentage(scorePercentage);
        summary.setTotalWordsStudied(wordUpdates.size());
        summary.setOverallEfficiency(efficiency);
        summary.setPerformance(performance);

        SessionCompleteResponse response = new SessionCompleteResponse();
        response.setSessionId(session.getId());
        response.setCompletedAt(session.getEndTime());
        response.setDurationMinutes(session.getDurationMinutes());
        response.setSummary(summary);
        response.setQuestions(questionDetails);
        response.setWordUpdates(wordUpdates);
        // 9. Update streak
        userStreakService.updateUserStreak(user, wordUpdates.size(), session.getDurationMinutes());
        // 10. Check achievements
        achievementService.checkAchievements(user);
        return response;
    }
}
