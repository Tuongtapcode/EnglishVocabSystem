package com.nnt.englishvocabsystem.controllers;

import com.nnt.englishvocabsystem.dto.AnswerGradingResponse;
import com.nnt.englishvocabsystem.dto.SessionCompleteResponse;
import com.nnt.englishvocabsystem.dto.SubmitAnswerRequest;
import com.nnt.englishvocabsystem.entity.User;
import com.nnt.englishvocabsystem.exceptions.UnauthorizedException;
import com.nnt.englishvocabsystem.services.StudySessionAnswerService;
import com.nnt.englishvocabsystem.services.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/secure/study")
public class ApiStudySessionAnswerController {
    @Autowired
    private StudySessionAnswerService studySessionAnswerService;

    @Autowired
    private UserService userService;

        @PostMapping("/submit-answer")
        public ResponseEntity<AnswerGradingResponse> submitAnswer(
                Principal principal,
                @RequestBody @Valid SubmitAnswerRequest request) {
            try {
                User user = userService.getUserByUsername(principal.getName());
                AnswerGradingResponse response = studySessionAnswerService.submitAndGradeAnswer(user, request);
                return ResponseEntity.ok(response);
            } catch (EntityNotFoundException e) {
                return ResponseEntity.notFound().build();
            } catch (IllegalStateException | UnauthorizedException e) {
                return ResponseEntity.badRequest().body(null);
            }
        }
    @PostMapping("/complete-session/{sessionId}")
    public ResponseEntity<SessionCompleteResponse> completeSession(
            Principal principal,
            @PathVariable Integer sessionId) {
        User user = userService.getUserByUsername(principal.getName());
        return ResponseEntity.ok(studySessionAnswerService.completeSession(user, sessionId));
    }
}
