package com.nnt.englishvocabsystem.services.impl;

import com.nnt.englishvocabsystem.dto.OptionResponse;
import com.nnt.englishvocabsystem.dto.QuestionResponse;
import com.nnt.englishvocabsystem.dto.StudySessionResponse;
import com.nnt.englishvocabsystem.dto.StudyWordRequest;
import com.nnt.englishvocabsystem.entity.ExerciseQuestion;
import com.nnt.englishvocabsystem.entity.StudySession;
import com.nnt.englishvocabsystem.entity.User;
import com.nnt.englishvocabsystem.exceptions.NoQuestionsFoundException;
import com.nnt.englishvocabsystem.repositories.ExerciseQuestionRepository;
import com.nnt.englishvocabsystem.repositories.StudySessionRepository;
import com.nnt.englishvocabsystem.repositories.UserRepository;
import com.nnt.englishvocabsystem.services.StudySessionService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudySessionServiceImpl implements StudySessionService {

    @Autowired
    private ExerciseQuestionRepository questionRepository;

    @Autowired
    private StudySessionRepository sessionRepository;

    @Override
    public StudySessionResponse startStudySession(User user, StudyWordRequest request) {

        // Create study session
        StudySession session = createStudySession(user, request);

        // Get questions for the words
        List<ExerciseQuestion> questions = getQuestionsForWords(request.getWordIds(), request.getQuestionsPerWord());

        if (questions.isEmpty()) {
            throw new NoQuestionsFoundException("No questions found for the specified words");
        }
        // Update session with question count
        session.setTotalQuestions(questions.size());
        session = sessionRepository.save(session);

        // Convert to response DTOs
        List<QuestionResponse> questionResponses = questions.stream()
                .map(this::convertToQuestionResponse)
                .collect(Collectors.toList());

        return new StudySessionResponse(
                session.getId(),
                questions.size(),
                questionResponses,
                session.getStartTime(),
                session.getSessionType()
        );
    }

    public StudySession createStudySession(User user, StudyWordRequest request) {
        StudySession session = new StudySession();
        session.setUser(user);
        session.setSessionType(request.getSessionType());
        session.setStartTime(Instant.now());
        session.setCompleted(false);
        session.setCorrectAnswers(0);
        // exercise_id is null for vocabulary study sessions

        return sessionRepository.save(session);
    }

    public List<ExerciseQuestion> getQuestionsForWords(List<Integer> wordIds, Integer questionsPerWord) {
        List<ExerciseQuestion> allQuestions = new ArrayList<>();

        for (Integer wordId : wordIds) {
            // Sử dụng repository method có sẵn
            List<ExerciseQuestion> allWordQuestions = questionRepository
                    .findByWordIdIn(Arrays.asList(wordId)); // Reuse existing method

            // Shuffle và lấy số lượng câu hỏi cần thiết
            Collections.shuffle(allWordQuestions);

            int questionsToTake = Math.min(questionsPerWord, allWordQuestions.size());
            List<ExerciseQuestion> selectedQuestions = allWordQuestions
                    .subList(0, questionsToTake);

            allQuestions.addAll(selectedQuestions);
        }

        // Shuffle final list để mix câu hỏi từ các từ khác nhau
        Collections.shuffle(allQuestions);
        return allQuestions;
    }

    public QuestionResponse convertToQuestionResponse(ExerciseQuestion question) {
        QuestionResponse response = new QuestionResponse();
        response.setQuestionId(question.getId());
        response.setWordId(question.getWord().getId());
        response.setWordText(question.getWord().getEnglishWord());
        response.setQuestionText(question.getQuestionText());
        response.setAudioUrl(question.getAudioUrl());
        response.setImageUrl(question.getImageUrl());
        response.setQuestionFormat(question.getQuestionFormat());
        response.setDifficultyScore(question.getDifficultyScore());

        List<OptionResponse> options = question.getOptions().stream()
                .map(option -> new OptionResponse(option.getId(), option.getOptionText()))
                .collect(Collectors.toList());
        response.setOptions(options);

        return response;
    }
}
