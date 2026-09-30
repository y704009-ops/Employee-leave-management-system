package com.elms.report.dto;

import com.elms.leaverequest.dto.LeaveRequestResponse;
import java.util.List;
import java.util.Map;

public class ReportSummaryResponse {

    private Map<String, Long> countsByStatus;
    private long totalAllocatedDays;
    private long totalUsedDays;
    private double utilizationPercentage;
    private List<ReportItem> leaveByDepartment;
    private List<ReportItem> leaveByType;
    private List<MonthlyTrendItem> monthlyTrends;
    private List<LeaveRequestResponse> records;

    public ReportSummaryResponse() {
    }

    public ReportSummaryResponse(
            Map<String, Long> countsByStatus,
            long totalAllocatedDays,
            long totalUsedDays,
            double utilizationPercentage,
            List<ReportItem> leaveByDepartment,
            List<ReportItem> leaveByType,
            List<MonthlyTrendItem> monthlyTrends,
            List<LeaveRequestResponse> records
    ) {
        this.countsByStatus = countsByStatus;
        this.totalAllocatedDays = totalAllocatedDays;
        this.totalUsedDays = totalUsedDays;
        this.utilizationPercentage = utilizationPercentage;
        this.leaveByDepartment = leaveByDepartment;
        this.leaveByType = leaveByType;
        this.monthlyTrends = monthlyTrends;
        this.records = records;
    }

    public Map<String, Long> getCountsByStatus() {
        return countsByStatus;
    }

    public void setCountsByStatus(Map<String, Long> countsByStatus) {
        this.countsByStatus = countsByStatus;
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

    public List<ReportItem> getLeaveByDepartment() {
        return leaveByDepartment;
    }

    public void setLeaveByDepartment(List<ReportItem> leaveByDepartment) {
        this.leaveByDepartment = leaveByDepartment;
    }

    public List<ReportItem> getLeaveByType() {
        return leaveByType;
    }

    public void setLeaveByType(List<ReportItem> leaveByType) {
        this.leaveByType = leaveByType;
    }

    public List<MonthlyTrendItem> getMonthlyTrends() {
        return monthlyTrends;
    }

    public void setMonthlyTrends(List<MonthlyTrendItem> monthlyTrends) {
        this.monthlyTrends = monthlyTrends;
    }

    public List<LeaveRequestResponse> getRecords() {
        return records;
    }

    public void setRecords(List<LeaveRequestResponse> records) {
        this.records = records;
    }
}
