package com.nnt.englishvocabsystem.controllers;

import com.nnt.englishvocabsystem.dto.AddWordToVocabularyListRequest;
import com.nnt.englishvocabsystem.dto.RemoveWordFromVocabularyListRequest;
import com.nnt.englishvocabsystem.dto.VocabularyListWordReponse;
import com.nnt.englishvocabsystem.entity.User;
import com.nnt.englishvocabsystem.entity.VocabularyListWord;
import com.nnt.englishvocabsystem.services.UserService;
import com.nnt.englishvocabsystem.services.VocabularyListWordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.access.AccessDeniedException;
import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/secure/vocabulary-list-words")
public class ApiVocabularyListWordController {
    @Autowired
    private VocabularyListWordService service;

    @Autowired
    private UserService userService;

    @PostMapping("/add")
    public ResponseEntity<?> addWord(@RequestBody AddWordToVocabularyListRequest request,
                                     Principal principal) {
        // Lấy user từ token
        User user = userService.getUserByUsername(principal.getName());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        try {
            VocabularyListWord result = service.addWordToList(
                    request.getVocabularyListId(),
                    request.getWordId(),
                    user // truyền user vào
            );

            VocabularyListWordReponse dto = new VocabularyListWordReponse(
                    result.getId(),
                    result.getVocabularyList().getId(),
                    result.getWord().getId(),
                    result.getVocabularyList().getName(),
                    result.getWord().getEnglishWord(),
                    result.getWord().getVietnameseMeaning(),
                    result.getAddedAt()
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(dto);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }
    @DeleteMapping("/remove")
    public ResponseEntity<?> removeWord(@RequestBody RemoveWordFromVocabularyListRequest request,
                                        Principal principal) {
        User user = userService.getUserByUsername(principal.getName());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        try {
            service.removeWordFromList(request.getVocabularyListId(), request.getWordId(), user);
            return ResponseEntity.noContent().build();
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

}
