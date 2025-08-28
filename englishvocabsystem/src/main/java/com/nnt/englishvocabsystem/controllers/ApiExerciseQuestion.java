package com.nnt.englishvocabsystem.controllers;

import com.nnt.englishvocabsystem.dto.ExerciseQuestionDTO;
import com.nnt.englishvocabsystem.entity.User;
import com.nnt.englishvocabsystem.repositories.ExerciseQuestionRepository;
import com.nnt.englishvocabsystem.services.ExerciseQuestionService;
import com.nnt.englishvocabsystem.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiExerciseQuestion {
    @Autowired
    private ExerciseQuestionService exerciseQuestionService;
    @Autowired
    private UserService userService;
    @GetMapping("/secure/word/{wordId}/questions")
    public ResponseEntity<?>  getQuestionsForWord(
            @PathVariable Integer wordId,
            @RequestParam Map<String, String> params, Principal principal
    ) {
        User user = userService.getUserByUsername(principal.getName());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }
        Page<ExerciseQuestionDTO> result = exerciseQuestionService.getQuestionsForWord(wordId, params);
        return ResponseEntity.ok(result);
    }
}
