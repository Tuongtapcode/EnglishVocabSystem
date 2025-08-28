package com.nnt.englishvocabsystem.dto;
//progresss
public class ReviewScheduleResponse {
    private long today;
    private long tomorrow;
    private long next7Days;
    private long later;

    public ReviewScheduleResponse() {}

    public ReviewScheduleResponse(long today, long tomorrow, long next7Days, long later) {
        this.today = today;
        this.tomorrow = tomorrow;
        this.next7Days = next7Days;
        this.later = later;
    }

    // Getter & Setter
    public long getToday() { return today; }
    public void setToday(long today) { this.today = today; }

    public long getTomorrow() { return tomorrow; }
    public void setTomorrow(long tomorrow) { this.tomorrow = tomorrow; }

    public long getNext7Days() { return next7Days; }
    public void setNext7Days(long next7Days) { this.next7Days = next7Days; }

    public long getLater() { return later; }
    public void setLater(long later) { this.later = later; }
}
