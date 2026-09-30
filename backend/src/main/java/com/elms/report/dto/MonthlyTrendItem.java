package com.elms.report.dto;

public class MonthlyTrendItem {

    private String month; // e.g. "2026-01"
    private String monthName; // e.g. "Jan 2026"
    private long totalRequests;
    private long approvedDays;
    private long pendingDays;

    public MonthlyTrendItem() {
    }

    public MonthlyTrendItem(String month, String monthName, long totalRequests, long approvedDays, long pendingDays) {
        this.month = month;
        this.monthName = monthName;
        this.totalRequests = totalRequests;
        this.approvedDays = approvedDays;
        this.pendingDays = pendingDays;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public String getMonthName() {
        return monthName;
    }

    public void setMonthName(String monthName) {
        this.monthName = monthName;
    }

    public long getTotalRequests() {
        return totalRequests;
    }

    public void setTotalRequests(long totalRequests) {
        this.totalRequests = totalRequests;
    }

    public long getApprovedDays() {
        return approvedDays;
    }

    public void setApprovedDays(long approvedDays) {
        this.approvedDays = approvedDays;
    }

    public long getPendingDays() {
        return pendingDays;
    }

    public void setPendingDays(long pendingDays) {
        this.pendingDays = pendingDays;
    }
}
