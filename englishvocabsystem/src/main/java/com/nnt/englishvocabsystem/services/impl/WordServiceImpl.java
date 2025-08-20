package com.nnt.englishvocabsystem.services.impl;

import com.nnt.englishvocabsystem.dto.CategoryDTO;
import com.nnt.englishvocabsystem.dto.WordDTO;
import com.nnt.englishvocabsystem.entity.VocabularyList;
import com.nnt.englishvocabsystem.entity.Word;
import com.nnt.englishvocabsystem.repositories.WordRepository;
import com.nnt.englishvocabsystem.services.WordService;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;




@Service
public class WordServiceImpl implements WordService {
    private final WordRepository wordRepository;

    public WordServiceImpl(WordRepository wordRepository) {
        this.wordRepository = wordRepository;
    }
    @Override
    public List<Word> getWordsByCategoryId(Integer categoryId) {
        return wordRepository.findByCategoryId(categoryId);
    }
    @Override
    public Page<WordDTO> getAllWords(Map<String, String> params) {
        int page = parseIntSafe(params.get("page"), 0);
        int size = parseIntSafe(params.get("size"), 10);
        String sortBy = params.getOrDefault("sortBy", "id");
        String direction = params.getOrDefault("direction", "asc");

        Sort sort = Sort.by(
                direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC,
                sortBy
        );
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Word> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();


            // Search theo keyword
            String keyword = params.get("keyword");
            if (hasText(keyword)) {
                String kwLower = "%" + keyword.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("englishWord").as(String.class)), kwLower),
                        cb.like(cb.lower(root.get("vietnameseMeaning").as(String.class)), kwLower)
                ));
            }

            // Filter theo level
            String level = params.get("level");
            if (hasText(level)) {
                predicates.add(
                        cb.equal(cb.lower(root.get("level").as(String.class)), level.toLowerCase())
                );
            }


            // Filter theo wordType
            String wordType = params.get("wordType");
            if (hasText(wordType)) {
                predicates.add(
                        cb.equal(cb.lower(root.get("wordType").as(String.class)), wordType.toLowerCase())
                );
            }

            // Filter theo category
            String category = params.get("category");
            if (hasText(category)) {
                Integer catId = parseIntSafe(category, null);
                if (catId != null) {
                    predicates.add(cb.equal(root.get("category").get("id"), catId));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Word> pageResult = wordRepository.findAll(spec, pageable);

        return pageResult.map(word -> new WordDTO(
                word.getId(),
                word.getEnglishWord(),
                word.getVietnameseMeaning(),
                word.getPronunciation(),
                word.getWordType(),
                word.getLevel(),
                word.getImageUrl(),
                word.getAudioUrl(),
                new CategoryDTO( // map category
                        word.getCategory().getId(),
                        word.getCategory().getName(),
                        word.getCategory().getDescription(),
                        word.getCategory().getImage(),
                        word.getCategory().getIsActive()
                )
        ));
    }

    // Hàm parse int an toàn
    private Integer parseIntSafe(String value, Integer defaultValue) {
        try {
            return (value != null && !value.isEmpty()) ? Integer.parseInt(value) : defaultValue;
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    // Check chuỗi có ký tự không
    private boolean hasText(String str) {
        return str != null && !str.trim().isEmpty();
    }

}
