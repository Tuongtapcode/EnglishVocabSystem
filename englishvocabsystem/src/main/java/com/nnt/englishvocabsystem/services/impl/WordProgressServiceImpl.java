package com.nnt.englishvocabsystem.services.impl;

import com.nnt.englishvocabsystem.dto.WordProgressRequest;
import com.nnt.englishvocabsystem.entity.User;
import com.nnt.englishvocabsystem.entity.Word;
import com.nnt.englishvocabsystem.entity.WordProgress;
import com.nnt.englishvocabsystem.repositories.UserRepository;
import com.nnt.englishvocabsystem.repositories.WordProgressRepository;
import com.nnt.englishvocabsystem.repositories.WordRepository;
import com.nnt.englishvocabsystem.services.WordProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.Instant;

@Repository
public class WordProgressServiceImpl implements WordProgressService {

    @Autowired
    WordProgressRepository wordProgressRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    WordRepository wordRepository;

    @Override
    public WordProgress saveOrUpdateProgress(WordProgressRequest req, User user) {
        Word word = wordRepository.findById(req.getWordId())
                .orElseThrow(() -> new RuntimeException("Word not found"));

        WordProgress wp = wordProgressRepository.findByUserAndWord(user, word)
                .orElseGet(() -> {
                    WordProgress newWp = new WordProgress();
                    newWp.setUser(user);
                    newWp.setWord(word);
                    newWp.setCreatedAt(Instant.now());
                    newWp.setIsLearning(true);
                    return newWp;
                });

        // update các field
        wp.setLastScore(req.getLastScore());
        wp.setIsLearning(req.getLearning());
        wp.setEaseFactor(req.getEaseFactor());
        wp.setIntervalDays(req.getIntervalDays());
        wp.setRepetitionCount(req.getRepetitionCount());
        wp.setNextReviewDate(req.getNextReviewDate());
        wp.setDifficultyLevel(req.getDifficultyLevel());
        wp.setUpdatedAt(Instant.now());

        return wordProgressRepository.save(wp);
    }
}
