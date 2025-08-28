package com.nnt.englishvocabsystem.controllers;

import com.nnt.englishvocabsystem.dto.ReviewScheduleResponse;
import com.nnt.englishvocabsystem.dto.ReviewWordResponse;
import com.nnt.englishvocabsystem.dto.WordProgressResponse;
import com.nnt.englishvocabsystem.dto.WordProgressRequest;
import com.nnt.englishvocabsystem.entity.User;
import com.nnt.englishvocabsystem.entity.WordProgress;
import com.nnt.englishvocabsystem.services.UserService;
import com.nnt.englishvocabsystem.services.WordProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/secure/word-progress")
public class ApiWordProgressController {
    @Autowired
    WordProgressService wordProgressService;
    @Autowired
    UserService userService;

    @GetMapping("/review")
    public ResponseEntity<Page<ReviewWordResponse>> getReviewWords(
            Principal principal,
            @RequestParam Map<String, String> params  // nhận tất cả query param
    ) {
        User user = userService.getUserByUsername(principal.getName());

        // gọi service, service sẽ xử lý reviewAt, page, size, keyword,...
        Page<ReviewWordResponse> pageResult = wordProgressService.getDueWords(user, params);

        return ResponseEntity.ok(pageResult);
    }
    @GetMapping("/schedule")
    public ResponseEntity<ReviewScheduleResponse> getReviewSchedule(
            Principal principal
    ) {
        User user = userService.getUserByUsername(principal.getName());
        return ResponseEntity.ok(wordProgressService.getReviewSchedule(user));
    }
}
