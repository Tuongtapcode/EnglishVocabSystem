package com.nnt.englishvocabsystem.controllers;

import com.nnt.englishvocabsystem.entity.ExerciseQuestion;
import com.nnt.englishvocabsystem.entity.User;
import com.nnt.englishvocabsystem.services.CategoryService;
import com.nnt.englishvocabsystem.services.ExerciseQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@Controller
public class ExerciseQuestionController {
    @Autowired
    ExerciseQuestionService exerciseQuestionService;

    @GetMapping("/questions")
    public String listQuestions(Model model, @RequestParam Map<String, String> params)  {
        model.addAttribute("questions", this.exerciseQuestionService.getAllQuestions(params));
        return  "questions";
    }



//    @GetMapping("/questions/add")
//    public String addQuestions(Model model)  {
//        model.addAttribute("question",  new ExerciseQuestion()); //
//        model.addAttribute("exerciseQuestion", new Object());
//        model.addAttribute("exercises",  new Object());
//        model.addAttribute("words",  new Object());
//        return "questionDetail";
//    }
}
