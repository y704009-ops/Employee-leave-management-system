package com.elms.leavetype.dto;

import com.elms.leavetype.LeaveType;

public class LeaveTypeResponse {

    private Long id;
    private String name;
    private String description;
    private Integer annualAllocation;
    private boolean requiresAttachment;
    private boolean active;

    public LeaveTypeResponse() {
    }

    public LeaveTypeResponse(Long id, String name, String description, Integer annualAllocation, boolean requiresAttachment, boolean active) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.annualAllocation = annualAllocation;
        this.requiresAttachment = requiresAttachment;
        this.active = active;
    }

    public static LeaveTypeResponse fromEntity(LeaveType entity) {
        if (entity == null) return null;
        return new LeaveTypeResponse(
                entity.getId(),
                entity.getName(),
                entity.getDescription(),
                entity.getAnnualAllocation(),
                entity.isRequiresAttachment(),
                entity.isActive()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getAnnualAllocation() {
        return annualAllocation;
    }

    public void setAnnualAllocation(Integer annualAllocation) {
        this.annualAllocation = annualAllocation;
    }

    public boolean isRequiresAttachment() {
        return requiresAttachment;
    }

    public void setRequiresAttachment(boolean requiresAttachment) {
        this.requiresAttachment = requiresAttachment;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
