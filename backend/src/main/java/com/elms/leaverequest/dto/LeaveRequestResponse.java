package com.elms.leaverequest.dto;

import com.elms.leaverequest.LeaveRequest;
import com.elms.leaverequest.LeaveStatus;

import java.time.Instant;
import java.time.LocalDate;

public class LeaveRequestResponse {

    private Long id;
    private Long employeeId;
    private String employeeName;
    private String employeeEmail;
    private Long leaveTypeId;
    private String leaveTypeName;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer requestedDays;
    private String reason;
    private LeaveStatus status;
    private String managerComment;
    private String attachmentName;
    private Long approvedById;
    private String approvedByName;
    private Instant approvedAt;
    private Instant createdAt;
    private Instant updatedAt;

    public LeaveRequestResponse() {
    }

    public static LeaveRequestResponse fromEntity(LeaveRequest entity) {
        if (entity == null) return null;
        LeaveRequestResponse resp = new LeaveRequestResponse();
        resp.setId(entity.getId());
        if (entity.getEmployee() != null) {
            resp.setEmployeeId(entity.getEmployee().getId());
            resp.setEmployeeName(entity.getEmployee().getName());
            resp.setEmployeeEmail(entity.getEmployee().getEmail());
        }
        if (entity.getLeaveType() != null) {
            resp.setLeaveTypeId(entity.getLeaveType().getId());
            resp.setLeaveTypeName(entity.getLeaveType().getName());
        }
        resp.setStartDate(entity.getStartDate());
        resp.setEndDate(entity.getEndDate());
        resp.setRequestedDays(entity.getRequestedDays());
        resp.setReason(entity.getReason());
        resp.setAttachmentName(entity.getAttachmentName());
        resp.setStatus(entity.getStatus());
        resp.setManagerComment(entity.getManagerComment());
        if (entity.getApprovedBy() != null) {
            resp.setApprovedById(entity.getApprovedBy().getId());
            resp.setApprovedByName(entity.getApprovedBy().getName());
        }
        resp.setApprovedAt(entity.getApprovedAt());
        resp.setCreatedAt(entity.getCreatedAt());
        resp.setUpdatedAt(entity.getUpdatedAt());
        return resp;
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

    public String getEmployeeEmail() {
        return employeeEmail;
    }

    public void setEmployeeEmail(String employeeEmail) {
        this.employeeEmail = employeeEmail;
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

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Integer getRequestedDays() {
        return requestedDays;
    }

    public void setRequestedDays(Integer requestedDays) {
        this.requestedDays = requestedDays;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LeaveStatus getStatus() {
        return status;
    }

    public void setStatus(LeaveStatus status) {
        this.status = status;
    }

    public String getManagerComment() {
        return managerComment;
    }

    public void setManagerComment(String managerComment) {
        this.managerComment = managerComment;
    }

    public Long getApprovedById() {
        return approvedById;
    }

    public void setApprovedById(Long approvedById) {
        this.approvedById = approvedById;
    }

    public String getApprovedByName() {
        return approvedByName;
    }

    public void setApprovedByName(String approvedByName) {
        this.approvedByName = approvedByName;
    }

    public Instant getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(Instant approvedAt) {
        this.approvedAt = approvedAt;
    }

    public String getAttachmentName() {
        return attachmentName;
    }

    public void setAttachmentName(String attachmentName) {
        this.attachmentName = attachmentName;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
