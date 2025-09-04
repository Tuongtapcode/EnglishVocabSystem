package com.nnt.englishvocabsystem.controllers;

import com.nnt.englishvocabsystem.entity.User;
import com.nnt.englishvocabsystem.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public String listUsers(Model model, @RequestParam Map<String, String> params) {
        model.addAttribute("users", this.userService.getAllUsers(params));
        return "users";
    }
    @GetMapping("/users/add")
    public String addUser(Model model)  {
        model.addAttribute("user", new User());
        return "userDetail";
    }

    @GetMapping("/users/{username}")
    public String updateUser(Model model, @PathVariable(value = "username") String username)  {
        model.addAttribute("user", this.userService.getUserByUsername(username));
        return "userDetail";
    }



    @PostMapping("/users")
    public String saveOrUpdateUser(@ModelAttribute("users") User user) {
        this.userService.addOrUpdateUser(user);
        return "redirect:/users"; // sau khi lưu thì quay lại danh sách
    }
}
