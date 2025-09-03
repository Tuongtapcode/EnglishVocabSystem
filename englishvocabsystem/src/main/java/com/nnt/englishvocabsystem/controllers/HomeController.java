package com.nnt.englishvocabsystem.controllers;

import com.nnt.englishvocabsystem.dto.RecentSessionDTO;
import com.nnt.englishvocabsystem.services.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Arrays;
import java.util.List;

@Controller
public class HomeController {


    @Autowired
    private StatsService statsService;
    @GetMapping("/dashboard")
    public String index(Model model) {
        model.addAttribute("totalUser", this.statsService.totalUser());
        model.addAttribute("totalQuestion", this.statsService.totalQuestion());
        model.addAttribute("totalWord", this.statsService.totalWord());
        model.addAttribute("totalStudySesion", this.statsService.totalStudySesion());
        model.addAttribute("userTypeStats",  this.statsService.getUserTypeStats());
        model.addAttribute("userActivity", this.statsService.getUserActivityLast7Days());
        model.addAttribute("recentSessions", this.statsService.getRecentSessions());
        return "index"; // trỏ đến file index.html trong thư mục templates
    }
}
