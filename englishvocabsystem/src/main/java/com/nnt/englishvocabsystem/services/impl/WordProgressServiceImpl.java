package com.nnt.englishvocabsystem.services.impl;

import com.nnt.englishvocabsystem.dto.CategoryDTO;
import com.nnt.englishvocabsystem.dto.ReviewScheduleResponse;
import com.nnt.englishvocabsystem.dto.ReviewWordResponse;
import com.nnt.englishvocabsystem.dto.WordProgressRequest;
import com.nnt.englishvocabsystem.entity.*;
import com.nnt.englishvocabsystem.enums.Level;
import com.nnt.englishvocabsystem.repositories.UserRepository;
import com.nnt.englishvocabsystem.repositories.WordProgressRepository;
import com.nnt.englishvocabsystem.repositories.WordRepository;
import com.nnt.englishvocabsystem.services.WordProgressService;
import com.nnt.englishvocabsystem.utils.RequestParamUtils;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class WordProgressServiceImpl implements WordProgressService {

    @Autowired
    WordProgressRepository wordProgressRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    WordRepository wordRepository;

    @Override
    public Page<ReviewWordResponse> getDueWords(User user, Map<String, String> params) {
        int page = RequestParamUtils.parseIntSafe(params.get("page"), 0);
        int size = RequestParamUtils.parseIntSafe(params.get("size"), 10);
        String sortBy = params.getOrDefault("sortBy", "nextReviewDate");
        String direction = params.getOrDefault("direction", "asc");

        Sort sort = Sort.by(direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        // Parse reviewAt nếu FE truyền, mặc định now
        final Instant reviewAt = StringUtils.hasText(params.get("reviewAt"))
                ? Instant.parse(params.get("reviewAt"))
                : Instant.now();

        Specification<WordProgress> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filter theo user
            predicates.add(cb.equal(root.get("user").get("id"), user.getId()));

            // Chỉ lấy due words
            predicates.add(cb.lessThanOrEqualTo(root.get("nextReviewDate"), reviewAt));
            predicates.add(cb.isTrue(root.get("isLearning")));

            // Keyword search
            String keyword = params.get("keyword");
            if (StringUtils.hasText(keyword)) {
                String kwLower = "%" + keyword.toLowerCase() + "%";

                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("word").get("englishWord")), kwLower),
                        cb.like(cb.lower(root.get("word").get("vietnameseMeaning")), kwLower)
                ));
            }

            // Filter level enum trực tiếp
            String levelParam = params.get("level");
            if (StringUtils.hasText(levelParam)) {
                try {
                    Level levelEnum = Level.valueOf(levelParam.toUpperCase());
                    predicates.add(cb.equal(root.get("word").get("level"), levelEnum));
                } catch (IllegalArgumentException e) {
                    // FE gửi level không hợp lệ, bỏ qua filter
                }
            }

            // Filter wordType
            String wordType = params.get("wordType");
            if (StringUtils.hasText(wordType)) {
                predicates.add(cb.equal(cb.lower(root.get("word").get("wordType").as(String.class)), wordType.toLowerCase()));
            }

            // Filter category
            String category = params.get("category");
            if (StringUtils.hasText(category)) {
                Integer catId = RequestParamUtils.parseIntSafe(category, null);
                if (catId != null) {
                    predicates.add(cb.equal(root.get("word").get("category").get("id"), catId));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<WordProgress> pageResult = wordProgressRepository.findAll(spec, pageable);

        // Map sang DTO đầy đủ, null-safe
        return pageResult.map(wp -> {
            Word word = wp.getWord();
            Category cat = word.getCategory();
            CategoryDTO catDto = cat != null
                    ? new CategoryDTO(cat.getId(), cat.getName(), cat.getDescription(), cat.getImage(), cat.getIsActive())
                    : null;
            return new ReviewWordResponse(
                    word.getId(),
                    word.getEnglishWord(),
                    word.getVietnameseMeaning(),
                    word.getPronunciation(),
                    word.getWordType(),
                    word.getLevel().getValue(),
                    word.getImageUrl(),
                    word.getAudioUrl(),
                    wp.getNextReviewDate(),
                    wp.getLastReviewDate(),
                    wp.getTotalReviews(),
                    wp.getCorrectReviews(),
                    wp.getIntervalDays(),
                    wp.getEaseFactor() != null ? wp.getEaseFactor().doubleValue() : null,
                    wp.getRepetitionCount(),
                    wp.getLastScore(),
                    wp.getIsLearning(),
                    catDto
            );
        });
    }


    @Override
    public ReviewScheduleResponse getReviewSchedule(User user) {
        Instant now = Instant.now();
        List<WordProgress> progresses = wordProgressRepository.findAllByUser(user.getId());
        long today = progresses.stream()
                .filter(wp -> wp.getNextReviewDate() != null &&
                        !wp.getNextReviewDate().isAfter(now))
                .count();

        long tomorrow = progresses.stream()
                .filter(wp -> wp.getNextReviewDate() != null &&
                        wp.getNextReviewDate().isAfter(now) &&
                        wp.getNextReviewDate().isBefore(now.plus(2, ChronoUnit.DAYS)))
                .count();

        long next7Days = progresses.stream()
                .filter(wp -> wp.getNextReviewDate() != null &&
                        wp.getNextReviewDate().isAfter(now.plus(1, ChronoUnit.DAYS)) &&
                        wp.getNextReviewDate().isBefore(now.plus(8, ChronoUnit.DAYS)))
                .count();

        long later = progresses.stream()
                .filter(wp -> wp.getNextReviewDate() != null &&
                        wp.getNextReviewDate().isAfter(now.plus(7, ChronoUnit.DAYS)))
                .count();

        return new ReviewScheduleResponse(today, tomorrow, next7Days, later);
    }

    public WordProgress addOrUpdateProgress(User user, Word word, int quality) {
        WordProgress wp = wordProgressRepository.findByUserAndWord(user, word)
                .orElseGet(() -> {
                    WordProgress newWp = new WordProgress();
                    newWp.setUser(user);
                    newWp.setWord(word);
                    newWp.setEaseFactor(2.5f);
                    newWp.setRepetitionCount(0);
                    newWp.setIntervalDays(1);
                    newWp.setNextReviewDate(Instant.now());
                    newWp.setTotalReviews(0);
                    newWp.setCorrectReviews(0);
                    newWp.setIsLearning(true);
                    newWp.setDifficultyLevel(word.getLevel() != null ? word.getLevel().getSm2Value() : 1f);
                    newWp.setCreatedAt(Instant.now());
                    newWp.setUpdatedAt(Instant.now());
                    return newWp;
                });

        wp.setTotalReviews(wp.getTotalReviews() + 1);
        wp.setLastReviewDate(Instant.now());
        wp.setLastScore(quality);

        // ----- SM2 with difficulty adjustment -----
        float difficultyFactor = wp.getDifficultyLevel(); // từ 1.0 (A1) -> 3.5 (C2)
        int adjustedQuality = Math.max(0, quality - Math.round(difficultyFactor - 1));

        if (adjustedQuality >= 3) {
            wp.setCorrectReviews(wp.getCorrectReviews() + 1);

            if (wp.getRepetitionCount() == 0) wp.setIntervalDays(1);
            else if (wp.getRepetitionCount() == 1) wp.setIntervalDays(6);
            else wp.setIntervalDays(Math.round(wp.getIntervalDays() * wp.getEaseFactor()));

            wp.setRepetitionCount(wp.getRepetitionCount() + 1);
        } else {
            wp.setRepetitionCount(0);
            wp.setIntervalDays(1);
        }

        // Update EF
        double ef = wp.getEaseFactor() + (0.1 - (5 - adjustedQuality) * (0.08 + (5 - adjustedQuality) * 0.02));
        if (ef < 1.3) ef = 1.3;
        wp.setEaseFactor((float) ef);

        wp.setNextReviewDate(Instant.now().plus(wp.getIntervalDays(), ChronoUnit.DAYS));
        wp.setUpdatedAt(Instant.now());

        return wordProgressRepository.save(wp);
    }
}
