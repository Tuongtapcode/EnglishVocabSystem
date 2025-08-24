package com.nnt.englishvocabsystem.services;

import com.nnt.englishvocabsystem.dto.WordProgressRequest;
import com.nnt.englishvocabsystem.entity.User;
import com.nnt.englishvocabsystem.entity.WordProgress;

public interface WordProgressService {

    WordProgress saveOrUpdateProgress(WordProgressRequest req, User user);
}
