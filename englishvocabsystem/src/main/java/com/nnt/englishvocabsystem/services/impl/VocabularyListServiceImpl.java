package com.nnt.englishvocabsystem.services.impl;

import com.nnt.englishvocabsystem.dto.CategoryDTO;
import com.nnt.englishvocabsystem.dto.VocabularyListDTO;
import com.nnt.englishvocabsystem.dto.VocabularyListRequest;
import com.nnt.englishvocabsystem.dto.WordDTO;
import com.nnt.englishvocabsystem.entity.User;
import com.nnt.englishvocabsystem.entity.VocabularyList;
import com.nnt.englishvocabsystem.entity.VocabularyListWord;
import com.nnt.englishvocabsystem.entity.Word;

import com.nnt.englishvocabsystem.exceptions.DuplicateVocabularyListException;
import com.nnt.englishvocabsystem.exceptions.ResourceNotFoundException;
import com.nnt.englishvocabsystem.repositories.VocabularyListRepository;
import com.nnt.englishvocabsystem.repositories.VocabularyListWordRepository;
import com.nnt.englishvocabsystem.services.VocabularyListService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VocabularyListServiceImpl implements VocabularyListService {
    @Autowired
    private VocabularyListRepository vocabularyListRepository;
    @Autowired
    private VocabularyListWordRepository vocabularyListWordRepository;

    @Override
    public List<VocabularyListDTO> getVocabularyList(User user) {
        List<VocabularyList> lists = vocabularyListRepository.findByUser(user);
        return lists.stream()
                .map(list -> {
                    Long count = vocabularyListWordRepository.countByVocabularyList(list);
                    return new VocabularyListDTO(
                            list.getId(),
                            list.getUser().getId(),
                            list.getName(),
                            list.getDescription(),
                            count
                    );
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<WordDTO> getWordsInList(Integer listId, User user) {
        VocabularyList list = vocabularyListRepository.findById(listId)
                .orElseThrow(() -> new ResourceNotFoundException("Vocabulary list not found"));
        if (!list.getUser().equals(user)) {
            throw new AccessDeniedException("Bạn không có quyền truy cập danh sách này");
        }

        return vocabularyListWordRepository.findByVocabularyListId(listId)
                .stream()
                .map(vlw -> {
                    Word w = vlw.getWord();
                    return new WordDTO(
                            w.getId(),
                            w.getEnglishWord(),
                            w.getVietnameseMeaning(),
                            w.getPronunciation(),
                            w.getWordType(),   // giữ nguyên enum, không cần .name()
                            w.getLevel(),
                            w.getImageUrl(),
                            w.getAudioUrl(),
                            new CategoryDTO(
                                    w.getCategory().getId(),
                                    w.getCategory().getName(),
                                    w.getCategory().getDescription(),
                                    w.getCategory().getImage(),
                                    w.getCategory().getIsActive()
                            )
                    );
                })
                .toList();
    }

    @Override
    public VocabularyList createVocabularyList(VocabularyListRequest request, User user) {
        if (vocabularyListRepository.existsByUserAndName(user, request.getName())) {
            throw new DuplicateVocabularyListException("Bạn đã có danh sách với tên này rồi");
        }
        VocabularyList list = new VocabularyList();
        list.setName(request.getName());
        list.setDescription(request.getDescription());
        list.setIsPublic(request.getPublic() != null ? request.getPublic() : false);
        list.setIsDefault(false);
        list.setCreatedAt(Instant.now());
        list.setUpdatedAt(Instant.now());
        list.setUser(user);

        return vocabularyListRepository.save(list);
    }

    @Override
    public VocabularyList getById(Integer id, User user) {

        VocabularyList list = vocabularyListRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("List not found"));
        if (!list.getUser().equals(user)) {
            throw new AccessDeniedException("Bạn không có quyền xem danh sách này");
        }
        return list;
    }

    @Override
    public VocabularyList updateVocabularyList(Integer id, VocabularyListRequest request, User user) {
        VocabularyList list = vocabularyListRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("List not found"));

        if (!list.getUser().equals(user)) {
            throw new AccessDeniedException("Bạn không có quyền sửa danh sách này");
        }
        if (vocabularyListRepository.existsByUserAndName(user, request.getName())) {
            throw new DuplicateVocabularyListException("Bạn đã có danh sách với tên này rồi");
        }
        if (request.getName() != null) list.setName(request.getName());
        if (request.getDescription() != null) list.setDescription(request.getDescription());
        if (request.getPublic() != null) list.setIsPublic(request.getPublic());
        list.setUpdatedAt(Instant.now());

        return vocabularyListRepository.save(list);
    }

    @Override
    @Transactional
    public void deleteVocabularyList(Integer id, User user) {
        VocabularyList list = vocabularyListRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vocabulary list not found"));

        if (!list.getUser().equals(user)) {
            throw new AccessDeniedException("Bạn không có quyền xóa danh sách này");
        }

        // Xóa các word trong list trước
        vocabularyListWordRepository.deleteByVocabularyList(list);

        // Xóa luôn list
        vocabularyListRepository.delete(list);
    }
}
