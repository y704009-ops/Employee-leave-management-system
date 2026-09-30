package com.elms.leaverequest.dto;

import com.elms.user.dto.UserResponse;
import java.util.List;

public class TeamDashboardStatsResponse {

    private int pendingApprovalsCount;
    private int teamMembersCount;
    private List<UserResponse> teamMembers;
    private List<LeaveRequestResponse> currentlyOnLeave;
    private List<LeaveRequestResponse> upcomingLeave;
    private List<LeaveRequestResponse> recentDecisions;

    public TeamDashboardStatsResponse() {
    }

    public TeamDashboardStatsResponse(
            int pendingApprovalsCount,
            int teamMembersCount,
            List<UserResponse> teamMembers,
            List<LeaveRequestResponse> currentlyOnLeave,
            List<LeaveRequestResponse> upcomingLeave,
            List<LeaveRequestResponse> recentDecisions
    ) {
        this.pendingApprovalsCount = pendingApprovalsCount;
        this.teamMembersCount = teamMembersCount;
        this.teamMembers = teamMembers;
        this.currentlyOnLeave = currentlyOnLeave;
        this.upcomingLeave = upcomingLeave;
        this.recentDecisions = recentDecisions;
    }

    public int getPendingApprovalsCount() {
        return pendingApprovalsCount;
    }

    public void setPendingApprovalsCount(int pendingApprovalsCount) {
        this.pendingApprovalsCount = pendingApprovalsCount;
    }

    public int getTeamMembersCount() {
        return teamMembersCount;
    }

    public void setTeamMembersCount(int teamMembersCount) {
        this.teamMembersCount = teamMembersCount;
    }

    public List<UserResponse> getTeamMembers() {
        return teamMembers;
    }

    public void setTeamMembers(List<UserResponse> teamMembers) {
        this.teamMembers = teamMembers;
    }

    public List<LeaveRequestResponse> getCurrentlyOnLeave() {
        return currentlyOnLeave;
    }

    public void setCurrentlyOnLeave(List<LeaveRequestResponse> currentlyOnLeave) {
        this.currentlyOnLeave = currentlyOnLeave;
    }

    public List<LeaveRequestResponse> getUpcomingLeave() {
        return upcomingLeave;
    }

    public void setUpcomingLeave(List<LeaveRequestResponse> upcomingLeave) {
        this.upcomingLeave = upcomingLeave;
    }

    public List<LeaveRequestResponse> getRecentDecisions() {
        return recentDecisions;
    }

    public void setRecentDecisions(List<LeaveRequestResponse> recentDecisions) {
        this.recentDecisions = recentDecisions;
    }
}
