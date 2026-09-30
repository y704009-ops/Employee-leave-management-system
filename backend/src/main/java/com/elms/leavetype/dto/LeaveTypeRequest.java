package com.elms.leavetype.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class LeaveTypeRequest {

    @NotBlank(message = "Leave type name is required")
    @Size(max = 100, message = "Leave type name cannot exceed 100 characters")
    private String name;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @NotNull(message = "Annual allocation is required")
    @Min(value = 1, message = "Annual allocation must be at least 1 day")
    private Integer annualAllocation;

    private boolean requiresAttachment = false;

    private boolean active = true;

    public LeaveTypeRequest() {
    }

    public LeaveTypeRequest(String name, String description, Integer annualAllocation, boolean requiresAttachment, boolean active) {
        this.name = name;
        this.description = description;
        this.annualAllocation = annualAllocation;
        this.requiresAttachment = requiresAttachment;
        this.active = active;
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
