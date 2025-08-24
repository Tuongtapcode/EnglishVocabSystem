package com.nnt.englishvocabsystem.controllers;

import com.nnt.englishvocabsystem.dto.WordProgressResponse;
import com.nnt.englishvocabsystem.dto.WordProgressRequest;
import com.nnt.englishvocabsystem.entity.User;
import com.nnt.englishvocabsystem.entity.WordProgress;
import com.nnt.englishvocabsystem.services.UserService;
import com.nnt.englishvocabsystem.services.WordProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/secure/word-progress")
public class ApiWordProgressController {
    @Autowired
    WordProgressService wordProgressService;
    @Autowired
    UserService userService;
    @PostMapping("/update")
    public ResponseEntity<?> updateWordProgress(
            @RequestBody WordProgressRequest request,
            Principal principal) {

        User user = userService.getUserByUsername(principal.getName());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        WordProgress wp = wordProgressService.saveOrUpdateProgress(request, user);
        WordProgressResponse dto = new WordProgressResponse();
        dto.setId(wp.getId());
        dto.setWordId(wp.getWord().getId());
        dto.setEnglishWord(wp.getWord().getEnglishWord());
        dto.setLastScore(wp.getLastScore());
        dto.setLearning(wp.getIsLearning());
        dto.setNextReviewDate(wp.getNextReviewDate());
        dto.setRepetitionCount(wp.getRepetitionCount());
        dto.setEaseFactor(wp.getEaseFactor());
        dto.setIntervalDays(wp.getIntervalDays());
        dto.setDifficultyLevel(wp.getDifficultyLevel());
        dto.setTotalReviews(wp.getTotalReviews());
        dto.setCorrectReviews(wp.getCorrectReviews());
        dto.setLastReviewDate(wp.getLastReviewDate());
        return ResponseEntity.ok(dto);
    }
}