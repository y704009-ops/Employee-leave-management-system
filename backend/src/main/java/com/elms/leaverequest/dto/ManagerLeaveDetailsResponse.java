package com.elms.leaverequest.dto;

import com.elms.leavebalance.dto.LeaveBalanceResponse;
import java.util.List;

public class ManagerLeaveDetailsResponse {

    private LeaveRequestResponse leaveRequest;
    private LeaveBalanceResponse currentBalance;
    private List<LeaveRequestResponse> employeeLeaveHistory;

    public ManagerLeaveDetailsResponse() {
    }

    public ManagerLeaveDetailsResponse(
            LeaveRequestResponse leaveRequest,
            LeaveBalanceResponse currentBalance,
            List<LeaveRequestResponse> employeeLeaveHistory
    ) {
        this.leaveRequest = leaveRequest;
        this.currentBalance = currentBalance;
        this.employeeLeaveHistory = employeeLeaveHistory;
    }

    public LeaveRequestResponse getLeaveRequest() {
        return leaveRequest;
    }

    public void setLeaveRequest(LeaveRequestResponse leaveRequest) {
        this.leaveRequest = leaveRequest;
    }

    public LeaveBalanceResponse getCurrentBalance() {
        return currentBalance;
    }

    public void setCurrentBalance(LeaveBalanceResponse currentBalance) {
        this.currentBalance = currentBalance;
    }

    public List<LeaveRequestResponse> getEmployeeLeaveHistory() {
        return employeeLeaveHistory;
    }

    public void setEmployeeLeaveHistory(List<LeaveRequestResponse> employeeLeaveHistory) {
        this.employeeLeaveHistory = employeeLeaveHistory;
    }
}
