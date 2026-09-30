package com.elms.report.dto;

import java.util.List;

public class AdminDashboardStatsResponse {

    private long totalActiveEmployees;
    private long totalDepartments;
    private long pendingRequests;
    private long approvedRequests;
    private long rejectedRequests;
    private long cancelledRequests;
    private long totalAllocatedDays;
    private long totalUsedDays;
    private double utilizationPercentage;
    private List<ReportItem> leaveByType;
    private List<ReportItem> leaveByDepartment;
    private List<MonthlyTrendItem> monthlyTrends;

    public AdminDashboardStatsResponse() {
    }

    public AdminDashboardStatsResponse(
            long totalActiveEmployees,
            long totalDepartments,
            long pendingRequests,
            long approvedRequests,
            long rejectedRequests,
            long cancelledRequests,
            long totalAllocatedDays,
            long totalUsedDays,
            double utilizationPercentage,
            List<ReportItem> leaveByType,
            List<ReportItem> leaveByDepartment,
            List<MonthlyTrendItem> monthlyTrends
    ) {
        this.totalActiveEmployees = totalActiveEmployees;
        this.totalDepartments = totalDepartments;
        this.pendingRequests = pendingRequests;
        this.approvedRequests = approvedRequests;
        this.rejectedRequests = rejectedRequests;
        this.cancelledRequests = cancelledRequests;
        this.totalAllocatedDays = totalAllocatedDays;
        this.totalUsedDays = totalUsedDays;
        this.utilizationPercentage = utilizationPercentage;
        this.leaveByType = leaveByType;
        this.leaveByDepartment = leaveByDepartment;
        this.monthlyTrends = monthlyTrends;
    }

    public long getTotalActiveEmployees() {
        return totalActiveEmployees;
    }

    public void setTotalActiveEmployees(long totalActiveEmployees) {
        this.totalActiveEmployees = totalActiveEmployees;
    }

    public long getTotalDepartments() {
        return totalDepartments;
    }

    public void setTotalDepartments(long totalDepartments) {
        this.totalDepartments = totalDepartments;
    }

    public long getPendingRequests() {
        return pendingRequests;
    }

    public void setPendingRequests(long pendingRequests) {
        this.pendingRequests = pendingRequests;
    }

    public long getApprovedRequests() {
        return approvedRequests;
    }

    public void setApprovedRequests(long approvedRequests) {
        this.approvedRequests = approvedRequests;
    }

    public long getRejectedRequests() {
        return rejectedRequests;
    }

    public void setRejectedRequests(long rejectedRequests) {
        this.rejectedRequests = rejectedRequests;
    }

    public long getCancelledRequests() {
        return cancelledRequests;
    }

    public void setCancelledRequests(long cancelledRequests) {
        this.cancelledRequests = cancelledRequests;
    }

    public long getTotalAllocatedDays() {
        return totalAllocatedDays;
    }

    public void setTotalAllocatedDays(long totalAllocatedDays) {
        this.totalAllocatedDays = totalAllocatedDays;
    }

    public long getTotalUsedDays() {
        return totalUsedDays;
    }

    public void setTotalUsedDays(long totalUsedDays) {
        this.totalUsedDays = totalUsedDays;
    }

    public double getUtilizationPercentage() {
        return utilizationPercentage;
    }

    public void setUtilizationPercentage(double utilizationPercentage) {
        this.utilizationPercentage = utilizationPercentage;
    }

    public List<ReportItem> getLeaveByType() {
        return leaveByType;
    }

    public void setLeaveByType(List<ReportItem> leaveByType) {
        this.leaveByType = leaveByType;
    }

    public List<ReportItem> getLeaveByDepartment() {
        return leaveByDepartment;
    }

    public void setLeaveByDepartment(List<ReportItem> leaveByDepartment) {
        this.leaveByDepartment = leaveByDepartment;
    }

    public List<MonthlyTrendItem> getMonthlyTrends() {
        return monthlyTrends;
    }

    public void setMonthlyTrends(List<MonthlyTrendItem> monthlyTrends) {
        this.monthlyTrends = monthlyTrends;
    }
}
