package com.nnt.englishvocabsystem.controllers;

import com.nnt.englishvocabsystem.dto.StudySessionResponse;
import com.nnt.englishvocabsystem.dto.StudyWordRequest;
import com.nnt.englishvocabsystem.entity.User;
import com.nnt.englishvocabsystem.services.StudySessionService;
import com.nnt.englishvocabsystem.services.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;


@RestController
@RequestMapping("/api/secure/vocabulary")
@Validated
public class ApiStudySessionController {
    @Autowired
    private StudySessionService studySessionService;
    @Autowired
    private UserService userService;
    @PostMapping("/study")
    public ResponseEntity<StudySessionResponse> startStudySession(
            Principal principal,
            @Valid @RequestBody StudyWordRequest request) {
        User user = userService.getUserByUsername(principal.getName());
        StudySessionResponse response = studySessionService.startStudySession(user, request);
        return ResponseEntity.ok(response);
    }

}
