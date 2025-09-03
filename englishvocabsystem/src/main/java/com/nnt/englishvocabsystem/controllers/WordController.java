package com.nnt.englishvocabsystem.controllers;

import com.nnt.englishvocabsystem.entity.Word;
import com.nnt.englishvocabsystem.services.CategoryService;
import com.nnt.englishvocabsystem.services.WordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
public class WordController {
    @Autowired
    private WordService wordService;

    @Autowired
    private CategoryService categoryService;
    @GetMapping("/words")
    public String listWords(Model model, @RequestParam Map<String, String> params)  {
        model.addAttribute("words",this.wordService.getAllWords(params));
        return "words";
    }
    @GetMapping("/words/add")
    public String addWord(Model model)  {
        model.addAttribute("word", new Word());
        model.addAttribute("categories", this.categoryService.getAllCategories());
        return "wordDetail";
    }

    @GetMapping("/words/{wordId}")
    public String updateWord(Model model, @PathVariable(value = "wordId") int id)  {
        model.addAttribute("word", this.wordService.getWordById(id));
        model.addAttribute("categories", this.categoryService.getAllCategories());
        return "wordDetail";
    }

    @PostMapping("/words")
    public String saveOrUpdateWord(@ModelAttribute("words") Word word) {
        wordService.addOrUpdateWord(word);
        return "redirect:/words"; // sau khi lưu thì quay lại danh sách
    }


}
