package com.elms.leavebalance.dto;

import com.elms.leavebalance.LeaveBalance;

public class LeaveBalanceResponse {

    private Long id;
    private Long employeeId;
    private String employeeName;
    private Long leaveTypeId;
    private String leaveTypeName;
    private Integer allocatedDays;
    private Integer usedDays;
    private Integer pendingDays = 0;
    private Integer remainingDays;
    private Integer year;

    public LeaveBalanceResponse() {
    }

    public LeaveBalanceResponse(Long id, Long employeeId, String employeeName, Long leaveTypeId, String leaveTypeName, Integer allocatedDays, Integer usedDays, Integer remainingDays, Integer year) {
        this.id = id;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.leaveTypeId = leaveTypeId;
        this.leaveTypeName = leaveTypeName;
        this.allocatedDays = allocatedDays;
        this.usedDays = usedDays;
        this.pendingDays = 0;
        this.remainingDays = remainingDays;
        this.year = year;
    }

    public LeaveBalanceResponse(Long id, Long employeeId, String employeeName, Long leaveTypeId, String leaveTypeName, Integer allocatedDays, Integer usedDays, Integer pendingDays, Integer remainingDays, Integer year) {
        this.id = id;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.leaveTypeId = leaveTypeId;
        this.leaveTypeName = leaveTypeName;
        this.allocatedDays = allocatedDays;
        this.usedDays = usedDays;
        this.pendingDays = pendingDays != null ? pendingDays : 0;
        this.remainingDays = remainingDays;
        this.year = year;
    }

    public static LeaveBalanceResponse fromEntity(LeaveBalance entity) {
        if (entity == null) return null;
        return new LeaveBalanceResponse(
                entity.getId(),
                entity.getEmployee() != null ? entity.getEmployee().getId() : null,
                entity.getEmployee() != null ? entity.getEmployee().getName() : null,
                entity.getLeaveType() != null ? entity.getLeaveType().getId() : null,
                entity.getLeaveType() != null ? entity.getLeaveType().getName() : null,
                entity.getAllocatedDays(),
                entity.getUsedDays(),
                0,
                entity.getRemainingDays(),
                entity.getYear()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public Long getLeaveTypeId() {
        return leaveTypeId;
    }

    public void setLeaveTypeId(Long leaveTypeId) {
        this.leaveTypeId = leaveTypeId;
    }

    public String getLeaveTypeName() {
        return leaveTypeName;
    }

    public void setLeaveTypeName(String leaveTypeName) {
        this.leaveTypeName = leaveTypeName;
    }

    public Integer getAllocatedDays() {
        return allocatedDays;
    }

    public void setAllocatedDays(Integer allocatedDays) {
        this.allocatedDays = allocatedDays;
    }

    public Integer getUsedDays() {
        return usedDays;
    }

    public void setUsedDays(Integer usedDays) {
        this.usedDays = usedDays;
    }

    public Integer getPendingDays() {
        return pendingDays;
    }

    public void setPendingDays(Integer pendingDays) {
        this.pendingDays = pendingDays;
    }

    public Integer getRemainingDays() {
        return remainingDays;
    }

    public void setRemainingDays(Integer remainingDays) {
        this.remainingDays = remainingDays;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }
}
