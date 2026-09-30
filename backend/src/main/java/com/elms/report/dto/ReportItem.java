package com.elms.report.dto;

public class ReportItem {

    private String name;
    private long count;
    private long days;

    public ReportItem() {
    }

    public ReportItem(String name, long count, long days) {
        this.name = name;
        this.count = count;
        this.days = days;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }

    public long getDays() {
        return days;
    }

    public void setDays(long days) {
        this.days = days;
    }
}
