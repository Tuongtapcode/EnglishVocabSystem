package com.nnt.englishvocabsystem.controllers;

import com.nnt.englishvocabsystem.services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
public class CategoryController {
    @Autowired
    CategoryService categoryService;

    @GetMapping("/categories")
    public String listCategories(Model model,  @RequestParam Map<String, String> params)  {
         model.addAttribute("categories", this.categoryService.getAllCategories(params));
        return  "categories";
    }

}
