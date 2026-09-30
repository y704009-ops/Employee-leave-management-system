package com.elms.leaverequest;

import com.elms.common.ApiResponse;
import com.elms.leaverequest.dto.ApproveLeaveRequest;
import com.elms.leaverequest.dto.LeaveApplicationRequest;
import com.elms.leaverequest.dto.LeaveRequestResponse;
import com.elms.leaverequest.dto.ManagerLeaveDetailsResponse;
import com.elms.leaverequest.dto.RejectLeaveRequest;
import com.elms.leaverequest.dto.TeamDashboardStatsResponse;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping({"/leave-requests", "/leaves"})
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    public LeaveRequestController(LeaveRequestService leaveRequestService) {
        this.leaveRequestService = leaveRequestService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LeaveRequestResponse>> applyLeave(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody LeaveApplicationRequest request) {
        LeaveRequestResponse created = leaveRequestService.createLeaveRequest(userDetails.getUsername(), request);
        return new ResponseEntity<>(ApiResponse.success(created, "Leave application submitted successfully"), HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<LeaveRequestResponse>>> getMyLeaves(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(name = "status", required = false) LeaveStatus status,
            @RequestParam(name = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(name = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<LeaveRequestResponse> leaves = leaveRequestService.getMyLeaveRequests(userDetails.getUsername(), status, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(leaves, "Leave applications retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LeaveRequestResponse>> getLeaveById(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        LeaveRequestResponse leave = leaveRequestService.getLeaveRequestById(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(leave, "Leave details retrieved successfully"));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<LeaveRequestResponse>> cancelLeave(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        LeaveRequestResponse cancelled = leaveRequestService.cancelLeaveRequest(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(cancelled, "Leave request cancelled successfully"));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<LeaveRequestResponse>>> getPendingLeaves(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<LeaveRequestResponse> pending = leaveRequestService.getPendingApprovalsForManager(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(pending, "Pending leaves queue retrieved successfully"));
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<ApiResponse<LeaveRequestResponse>> approveLeave(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody(required = false) ApproveLeaveRequest request) {
        LeaveRequestResponse approved = leaveRequestService.approveLeaveRequest(id, userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success(approved, "Leave request approved successfully"));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<ApiResponse<LeaveRequestResponse>> rejectLeave(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody RejectLeaveRequest request) {
        LeaveRequestResponse rejected = leaveRequestService.rejectLeaveRequest(id, userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success(rejected, "Leave request rejected successfully"));
    }

    @GetMapping("/{id}/review-details")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<ApiResponse<ManagerLeaveDetailsResponse>> getReviewDetails(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        ManagerLeaveDetailsResponse details = leaveRequestService.getManagerLeaveDetails(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(details, "Leave review details retrieved successfully"));
    }

    @GetMapping({"/team", "/team-calendar"})
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<LeaveRequestResponse>>> getTeamLeaves(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(name = "status", required = false) LeaveStatus status,
            @RequestParam(name = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(name = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<LeaveRequestResponse> leaves = leaveRequestService.getTeamLeaves(userDetails.getUsername(), status, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(leaves, "Team leaves retrieved successfully"));
    }

    @GetMapping("/team-dashboard")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<ApiResponse<TeamDashboardStatsResponse>> getTeamDashboard(
            @AuthenticationPrincipal UserDetails userDetails) {
        TeamDashboardStatsResponse stats = leaveRequestService.getTeamDashboardStats(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(stats, "Team dashboard stats retrieved successfully"));
    }
}
