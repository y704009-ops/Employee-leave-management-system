package com.elms.leavetype;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "leave_types", indexes = {
    @Index(name = "idx_leave_type_name", columnList = "name"),
    @Index(name = "idx_leave_type_active", columnList = "active")
})
public class LeaveType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(name = "annual_allocation", nullable = false)
    private Integer annualAllocation;

    @Column(name = "requires_attachment", nullable = false)
    private boolean requiresAttachment = false;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    public LeaveType() {
    }

    public LeaveType(String name, String description, Integer annualAllocation, boolean requiresAttachment) {
        this.name = name;
        this.description = description;
        this.annualAllocation = annualAllocation;
        this.requiresAttachment = requiresAttachment;
        this.active = true;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
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

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
