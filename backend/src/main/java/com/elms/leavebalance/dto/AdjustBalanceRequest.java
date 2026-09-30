package com.elms.leavebalance.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class AdjustBalanceRequest {

    @NotNull(message = "Allocated days is required")
    @Min(value = 0, message = "Allocated days cannot be negative")
    private Integer allocatedDays;

    @NotNull(message = "Used days is required")
    @Min(value = 0, message = "Used days cannot be negative")
    private Integer usedDays;

    @Size(max = 255, message = "Reason cannot exceed 255 characters")
    private String reason;

    public AdjustBalanceRequest() {
    }

    public AdjustBalanceRequest(Integer allocatedDays, Integer usedDays, String reason) {
        this.allocatedDays = allocatedDays;
        this.usedDays = usedDays;
        this.reason = reason;
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

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
