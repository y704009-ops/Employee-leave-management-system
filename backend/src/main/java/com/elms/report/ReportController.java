package com.elms.report;

import com.elms.common.ApiResponse;
import com.elms.leaverequest.LeaveStatus;
import com.elms.report.dto.AdminDashboardStatsResponse;
import com.elms.report.dto.ReportSummaryResponse;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdminDashboardStatsResponse>> getAdminDashboard() {
        AdminDashboardStatsResponse stats = reportService.getAdminDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats, "Admin dashboard stats retrieved successfully"));
    }

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<ReportSummaryResponse>> getSummaryReport(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(name = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(name = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(name = "departmentId", required = false) Long departmentId,
            @RequestParam(name = "leaveTypeId", required = false) Long leaveTypeId,
            @RequestParam(name = "status", required = false) LeaveStatus status
    ) {
        ReportSummaryResponse report = reportService.getReportSummary(
                userDetails.getUsername(),
                startDate,
                endDate,
                departmentId,
                leaveTypeId,
                status
        );
        return ResponseEntity.ok(ApiResponse.success(report, "Leave report summary retrieved successfully"));
    }

    @GetMapping("/export-csv")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<byte[]> exportCsvReport(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(name = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(name = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(name = "departmentId", required = false) Long departmentId,
            @RequestParam(name = "leaveTypeId", required = false) Long leaveTypeId,
            @RequestParam(name = "status", required = false) LeaveStatus status
    ) {
        byte[] csvData = reportService.exportCsvReport(
                userDetails.getUsername(),
                startDate,
                endDate,
                departmentId,
                leaveTypeId,
                status
        );

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"leave_report_" + LocalDate.now() + ".csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }
}
