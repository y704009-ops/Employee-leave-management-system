package com.elms.leavetype;

import com.elms.common.ApiResponse;
import com.elms.leavetype.dto.LeaveTypeRequest;
import com.elms.leavetype.dto.LeaveTypeResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/leave-types")
public class LeaveTypeController {

    private final LeaveTypeService leaveTypeService;

    public LeaveTypeController(LeaveTypeService leaveTypeService) {
        this.leaveTypeService = leaveTypeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LeaveTypeResponse>>> getLeaveTypes() {
        List<LeaveTypeResponse> types = leaveTypeService.getAllLeaveTypes();
        return ResponseEntity.ok(ApiResponse.success(types, "Leave types retrieved successfully"));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<LeaveTypeResponse>>> getActiveLeaveTypes() {
        List<LeaveTypeResponse> types = leaveTypeService.getActiveLeaveTypes();
        return ResponseEntity.ok(ApiResponse.success(types, "Active leave types retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LeaveTypeResponse>> getLeaveTypeById(@PathVariable("id") Long id) {
        LeaveTypeResponse type = leaveTypeService.getLeaveTypeById(id);
        return ResponseEntity.ok(ApiResponse.success(type, "Leave type retrieved successfully"));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<LeaveTypeResponse>> createLeaveType(@Valid @RequestBody LeaveTypeRequest request) {
        LeaveTypeResponse created = leaveTypeService.createLeaveType(request);
        return new ResponseEntity<>(ApiResponse.success(created, "Leave type created successfully"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<LeaveTypeResponse>> updateLeaveType(
            @PathVariable("id") Long id,
            @Valid @RequestBody LeaveTypeRequest request) {
        LeaveTypeResponse updated = leaveTypeService.updateLeaveType(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Leave type updated successfully"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<LeaveTypeResponse>> updateLeaveTypeStatus(
            @PathVariable("id") Long id,
            @RequestBody Map<String, Boolean> statusUpdate) {
        boolean active = statusUpdate.getOrDefault("active", true);
        LeaveTypeResponse updated = leaveTypeService.updateStatus(id, active);
        return ResponseEntity.ok(ApiResponse.success(updated, "Leave type status updated successfully"));
    }
}
