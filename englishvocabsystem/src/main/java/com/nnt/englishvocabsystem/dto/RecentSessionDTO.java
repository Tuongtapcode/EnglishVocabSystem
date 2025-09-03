package com.nnt.englishvocabsystem.dto;

import java.time.Duration;
import java.time.Instant;

public class RecentSessionDTO {
    private String username;
    private String sessionType;
    private String timeAgo;
    private boolean completed;

    public RecentSessionDTO(String username, String sessionType, Instant startTime, boolean completed) {
        this.username = username;
        this.sessionType = sessionType;
        this.timeAgo = calculateTimeAgo(startTime);
        this.completed = completed;
    }

    private String calculateTimeAgo(Instant startTime) {
        if (startTime == null) return "";

        Duration duration = Duration.between(startTime, Instant.now());

        if (duration.toMinutes() < 1) {
            return "Vừa xong";
        } else if (duration.toMinutes() < 60) {
            return duration.toMinutes() + " phút trước";
        } else if (duration.toHours() < 24) {
            return duration.toHours() + " giờ trước";
        } else {
            return duration.toDays() + " ngày trước";
        }
    }

    public String getUsername() { return username; }
    public String getSessionType() { return sessionType; }
    public String getTimeAgo() { return timeAgo; }
    public boolean isCompleted() { return completed; }

}
