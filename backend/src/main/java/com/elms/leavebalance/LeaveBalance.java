package com.elms.leavebalance;

import com.elms.leavetype.LeaveType;
import com.elms.user.User;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(
    name = "leave_balances",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_employee_leave_type_year",
            columnNames = {"employee_id", "leave_type_id", "balance_year"}
        )
    },
    indexes = {
        @Index(name = "idx_balance_employee_year", columnList = "employee_id, balance_year"),
        @Index(name = "idx_balance_type", columnList = "leave_type_id")
    }
)
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private User employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "leave_type_id", nullable = false)
    private LeaveType leaveType;

    @Column(name = "allocated_days", nullable = false)
    private Integer allocatedDays;

    @Column(name = "used_days", nullable = false)
    private Integer usedDays = 0;

    @Column(name = "remaining_days", nullable = false)
    private Integer remainingDays;

    @Column(name = "balance_year", nullable = false)
    private Integer year;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    public LeaveBalance() {
    }

    public LeaveBalance(User employee, LeaveType leaveType, Integer allocatedDays, Integer year) {
        this.employee = employee;
        this.leaveType = leaveType;
        this.allocatedDays = allocatedDays;
        this.usedDays = 0;
        this.remainingDays = allocatedDays;
        this.year = year;
    }

    public LeaveBalance(User employee, LeaveType leaveType, Integer allocatedDays, Integer usedDays, Integer remainingDays, Integer year) {
        this.employee = employee;
        this.leaveType = leaveType;
        this.allocatedDays = allocatedDays;
        this.usedDays = usedDays;
        this.remainingDays = remainingDays;
        this.year = year;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        if (this.usedDays == null) {
            this.usedDays = 0;
        }
        if (this.remainingDays == null && this.allocatedDays != null) {
            this.remainingDays = this.allocatedDays - this.usedDays;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
        if (this.allocatedDays != null && this.usedDays != null) {
            this.remainingDays = this.allocatedDays - this.usedDays;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getEmployee() {
        return employee;
    }

    public void setEmployee(User employee) {
        this.employee = employee;
    }

    public LeaveType getLeaveType() {
        return leaveType;
    }

    public void setLeaveType(LeaveType leaveType) {
        this.leaveType = leaveType;
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

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
