package com.nnt.englishvocabsystem.controllers;

import com.nnt.englishvocabsystem.dto.WordDTO;
import com.nnt.englishvocabsystem.services.WordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/words") // nếu muốn prefix API
public class ApiWordController {
    @Autowired
    private WordService wordService;


    @GetMapping
    public ResponseEntity<Page<WordDTO>> getAllWords(@RequestParam Map<String, String> params) {
        return ResponseEntity.ok(wordService.getAllWords(params));
    }
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteWord(@PathVariable(value = "id") int id) {
        this.wordService.deleteWordById(id);
    }



}
