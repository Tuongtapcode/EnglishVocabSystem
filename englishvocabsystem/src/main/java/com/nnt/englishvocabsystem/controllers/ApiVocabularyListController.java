package com.nnt.englishvocabsystem.controllers;
import com.nnt.englishvocabsystem.dto.VocabularyListRequest;
import com.nnt.englishvocabsystem.dto.VocabularyListResponse;
import com.nnt.englishvocabsystem.dto.WordDTO;
import com.nnt.englishvocabsystem.entity.User;
import com.nnt.englishvocabsystem.entity.VocabularyList;
import com.nnt.englishvocabsystem.entity.Word;
import com.nnt.englishvocabsystem.exceptions.ResourceNotFoundException;
import com.nnt.englishvocabsystem.services.UserService;
import com.nnt.englishvocabsystem.services.VocabularyListService;
import com.nnt.englishvocabsystem.services.WordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api") // nếu muốn prefix API
@CrossOrigin
public class ApiVocabularyListController {
    @Autowired
    private VocabularyListService vocabularyListService;
    @Autowired
    private UserService userService;
    @Autowired
    private WordService wordService;


    @GetMapping("/secure/vocabulary")
    public ResponseEntity<?> getMyVocabularyLists(Principal principal) {
        // Lấy user từ username trong token
        User user = userService.getUserByUsername(principal.getName());

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        // Gọi service để lấy list
        return ResponseEntity.ok(vocabularyListService.getVocabularyList(user));
    }
    @GetMapping("secure/vocabulary/{id}/words")
    public ResponseEntity<?> getWords(@PathVariable Integer id, Principal principal) {
        // Lấy user từ token
        User user = userService.getUserByUsername(principal.getName());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        try {
            // Gọi service kèm userId để check quyền sở hữu
            List<WordDTO> words = vocabularyListService.getWordsInList(id, user);
            return ResponseEntity.ok(words);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền xem danh sách này");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Vocabulary list not found");
        }
    }

    @PostMapping("secure/vocabulary/create")
    public ResponseEntity<?> createList(@RequestBody VocabularyListRequest request,
                                        Principal principal) {
        // Lấy user từ token
        User user = userService.getUserByUsername(principal.getName());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        VocabularyList createdList = vocabularyListService.createVocabularyList(request, user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new VocabularyListResponse(createdList));
    }

    @GetMapping("secure/vocabulary/{id}")
    public ResponseEntity<?> getListById(@PathVariable Integer id, Principal principal) {
        User user = userService.getUserByUsername(principal.getName());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }
        try {
            VocabularyList list = vocabularyListService.getById(id, user);
            return ResponseEntity.ok(new VocabularyListResponse(list));
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("secure/vocabulary/{id}")
    @PatchMapping("secure/vocabulary/{id}") // nếu muốn support cả 2
    public ResponseEntity<?> updateList(@PathVariable Integer id,
                                        @RequestBody VocabularyListRequest request,
                                        Principal principal) {
        User user = userService.getUserByUsername(principal.getName());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }
        try {
            VocabularyList updated = vocabularyListService.updateVocabularyList(id, request, user);
            return ResponseEntity.ok(new VocabularyListResponse(updated));
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("secure/vocabulary/{id}")
    public ResponseEntity<?> deleteList(@PathVariable Integer id, Principal principal) {
        User user = userService.getUserByUsername(principal.getName());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }
        try {
            vocabularyListService.deleteVocabularyList(id, user);
            return ResponseEntity.noContent().build(); // HTTP 204
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }



}
