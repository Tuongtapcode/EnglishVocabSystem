package com.nnt.englishvocabsystem.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.nnt.englishvocabsystem.dto.CategoryDTO;
import com.nnt.englishvocabsystem.dto.WordDTO;
import com.nnt.englishvocabsystem.entity.VocabularyList;
import com.nnt.englishvocabsystem.entity.Word;
import com.nnt.englishvocabsystem.repositories.WordRepository;
import com.nnt.englishvocabsystem.services.WordService;
import com.nnt.englishvocabsystem.utils.RequestParamUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;


@Service
public class WordServiceImpl implements WordService {
    private final WordRepository wordRepository;

    public WordServiceImpl(WordRepository wordRepository) {
        this.wordRepository = wordRepository;
    }

    @Autowired
    private Cloudinary cloudinary;
    @Override
    public Word getWordById(Integer id) {
        return wordRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Word not found with id = " + id));
    }

    @Override
    public List<Word> getWordsByCategoryId(Integer categoryId) {
        return wordRepository.findByCategoryId(categoryId);
    }
    @Override
    public Page<WordDTO> getAllWords(Map<String, String> params) {
        int page = RequestParamUtils.parseIntSafe(params.get("page"), 0);
        int size = RequestParamUtils.parseIntSafe(params.get("size"), 10);
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
            if (RequestParamUtils.hasText(keyword)) {
                String kwLower = "%" + keyword.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("englishWord").as(String.class)), kwLower),
                        cb.like(cb.lower(root.get("vietnameseMeaning").as(String.class)), kwLower)
                ));
            }

            // Filter theo level
            String level = params.get("level");
            if (RequestParamUtils.hasText(level)) {
                predicates.add(
                        cb.equal(cb.lower(root.get("level").as(String.class)), level.toLowerCase())
                );
            }


            // Filter theo wordType
            String wordType = params.get("wordType");
            if (RequestParamUtils.hasText(wordType)) {
                predicates.add(
                        cb.equal(cb.lower(root.get("wordType").as(String.class)), wordType.toLowerCase())
                );
            }

            // Filter theo category
            String category = params.get("category");
            if (RequestParamUtils.hasText(category)) {
                Integer catId = RequestParamUtils.parseIntSafe(category, null);
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


    @Override
    public void addOrUpdateWord(Word word) {
        try {
            Word existing = null;
            if (word.getId() != null) {
                existing = wordRepository.findById(word.getId()).orElse(null);
            }
            if (existing != null) {
                word.setCreatedAt(existing.getCreatedAt());
            } else {
                word.setCreatedAt(Instant.now());
            }
            word.setUpdatedAt(Instant.now());

            if (word.getAudioFile() != null && !word.getAudioFile().isEmpty()) {
                Map<?, ?> res = cloudinary.uploader().upload(
                        word.getAudioFile().getBytes(),
                        ObjectUtils.asMap("resource_type", "auto")
                );
                word.setAudioUrl(res.get("secure_url").toString());
            }

            // Upload image file nếu có
            if (word.getImageFile() != null && !word.getImageFile().isEmpty()) {
                Map<?, ?> res = cloudinary.uploader().upload(
                        word.getImageFile().getBytes(),
                        ObjectUtils.asMap("resource_type", "auto")
                );
                word.setImageUrl(res.get("secure_url").toString());
            }

            // Lưu xuống DB
            wordRepository.save(word);

        } catch (IOException e) {
            Logger.getLogger(WordServiceImpl.class.getName()).log(Level.SEVERE, null, e);
            throw new RuntimeException("Upload file thất bại!", e);
        }
    }

    @Override
    public void deleteWordById(Integer id) {
        if (!wordRepository.existsById(id)) {
            throw new EntityNotFoundException("Word with id " + id + " not found!");
        }
        wordRepository.deleteById(id);
    }
}
