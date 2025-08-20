package com.nnt.englishvocabsystem.controllers;

import com.nnt.englishvocabsystem.dto.WordDTO;
import com.nnt.englishvocabsystem.services.WordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
}
