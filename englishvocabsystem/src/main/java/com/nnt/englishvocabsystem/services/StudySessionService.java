package com.nnt.englishvocabsystem.services;

import com.nnt.englishvocabsystem.dto.StudySessionResponse;
import com.nnt.englishvocabsystem.dto.StudyWordRequest;
import com.nnt.englishvocabsystem.entity.User;


public interface StudySessionService {
    StudySessionResponse startStudySession(User user, StudyWordRequest request);
}
