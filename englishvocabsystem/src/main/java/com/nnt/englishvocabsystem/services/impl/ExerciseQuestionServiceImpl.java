package com.nnt.englishvocabsystem.services.impl;

import com.nnt.englishvocabsystem.dto.ExerciseOptionDTO;
import com.nnt.englishvocabsystem.dto.ExerciseQuestionDTO;
import com.nnt.englishvocabsystem.entity.ExerciseQuestion;
import com.nnt.englishvocabsystem.entity.Word;
import com.nnt.englishvocabsystem.repositories.ExerciseQuestionRepository;
import com.nnt.englishvocabsystem.repositories.WordRepository;
import com.nnt.englishvocabsystem.services.ExerciseQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ExerciseQuestionServiceImpl implements ExerciseQuestionService {

    @Autowired
    private WordRepository wordRepository;
    @Autowired
    private ExerciseQuestionRepository exerciseQuestionRepository;
    @Override
    public Page<ExerciseQuestionDTO> getQuestionsForWord(Integer wordId, Map<String, String> params) {
        // Lấy page & size từ params, default 0/10 nếu không có
        int page = Integer.parseInt(params.getOrDefault("page", "0"));
        int size = Integer.parseInt(params.getOrDefault("size", "10"));

        Pageable pageable = PageRequest.of(page, size);

        // Lấy phân trang theo wordId
        Page<ExerciseQuestion> pageResult = exerciseQuestionRepository.findByWordId(wordId, pageable);

        // Chuyển sang DTO
        return pageResult.map(q -> {
            List<ExerciseOptionDTO> optionDTOs = q.getOptions().stream()
                    .map(o -> new ExerciseOptionDTO(o.getId(), o.getOptionText(), o.getIsCorrect()))
                    .collect(Collectors.toList());

            return new ExerciseQuestionDTO(
                    q.getId(),
                    q.getQuestionText(),
                    q.getQuestionFormat().name(),
                    q.getAudioUrl(),
                    q.getImageUrl(),
                    q.getExplanation(),
                    optionDTOs
            );
        });
    }

    @Override
    public Page<ExerciseQuestionDTO> getAllQuestions(Map<String, String> params) {
        // Lấy page & size từ params
        int page = Integer.parseInt(params.getOrDefault("page", "0"));
        int size = Integer.parseInt(params.getOrDefault("size", "10"));
        String sortBy = params.getOrDefault("sortBy", "id");
        String direction = params.getOrDefault("direction", "asc");

        Sort sort = Sort.by(
                direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC,
                sortBy
        );
        Pageable pageable = PageRequest.of(page, size, sort);

        // Nếu muốn filter/search, bạn có thể dùng Specification như ở UserService
        Page<ExerciseQuestion> pageResult = exerciseQuestionRepository.findAll(pageable);

        // Chuyển sang DTO
        return pageResult.map(q -> {
            List<ExerciseOptionDTO> optionDTOs = q.getOptions().stream()
                    .map(o -> new ExerciseOptionDTO(o.getId(), o.getOptionText(), o.getIsCorrect()))
                    .collect(Collectors.toList());

            return new ExerciseQuestionDTO(
                    q.getId(),
                    q.getQuestionText(),
                    q.getQuestionFormat().name(),
                    q.getAudioUrl(),
                    q.getImageUrl(),
                    q.getExplanation(),
                    optionDTOs
            );
        });
    }

}
