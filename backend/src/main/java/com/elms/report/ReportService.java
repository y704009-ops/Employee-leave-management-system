package com.elms.report;

import com.elms.department.DepartmentRepository;
import com.elms.exception.UnauthorizedException;
import com.elms.leavebalance.LeaveBalanceRepository;
import com.elms.leaverequest.LeaveRequest;
import com.elms.leaverequest.LeaveRequestRepository;
import com.elms.leaverequest.LeaveStatus;
import com.elms.leaverequest.dto.LeaveRequestResponse;
import com.elms.report.dto.AdminDashboardStatsResponse;
import com.elms.report.dto.MonthlyTrendItem;
import com.elms.report.dto.ReportItem;
import com.elms.report.dto.ReportSummaryResponse;
import com.elms.user.Role;
import com.elms.user.User;
import com.elms.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("null")
public class ReportService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;

    private static final DateTimeFormatter MONTH_KEY_FMT = DateTimeFormatter.ofPattern("yyyy-MM");
    private static final DateTimeFormatter MONTH_NAME_FMT = DateTimeFormatter.ofPattern("MMM yyyy");

    public ReportService(
            UserRepository userRepository,
            DepartmentRepository departmentRepository,
            LeaveRequestRepository leaveRequestRepository,
            LeaveBalanceRepository leaveBalanceRepository
    ) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.leaveBalanceRepository = leaveBalanceRepository;
    }

    @Transactional(readOnly = true)
    public AdminDashboardStatsResponse getAdminDashboardStats() {
        int currentYear = LocalDate.now().getYear();

        long totalActiveEmployees = userRepository.countByActiveTrue();
        long totalDepartments = departmentRepository.count();

        long pending = leaveRequestRepository.countByStatus(LeaveStatus.PENDING);
        long approved = leaveRequestRepository.countByStatus(LeaveStatus.APPROVED);
        long rejected = leaveRequestRepository.countByStatus(LeaveStatus.REJECTED);
        long cancelled = leaveRequestRepository.countByStatus(LeaveStatus.CANCELLED);

        Long allocated = leaveBalanceRepository.sumAllocatedDays(null, null, null, currentYear);
        Long used = leaveBalanceRepository.sumUsedDays(null, null, null, currentYear);
        double utilization = (allocated != null && allocated > 0 && used != null)
                ? Math.round(((double) used * 100.0 / allocated) * 10.0) / 10.0
                : 0.0;

        List<LeaveRequest> allRequests = leaveRequestRepository.findRequestsForReport(
                null, null, null, null, null, null
        );

        List<ReportItem> leaveByType = calculateLeaveByType(allRequests);
        List<ReportItem> leaveByDepartment = calculateLeaveByDepartment(allRequests);
        List<MonthlyTrendItem> monthlyTrends = calculateMonthlyTrends(allRequests);

        return new AdminDashboardStatsResponse(
                totalActiveEmployees,
                totalDepartments,
                pending,
                approved,
                rejected,
                cancelled,
                allocated != null ? allocated : 0L,
                used != null ? used : 0L,
                utilization,
                leaveByType,
                leaveByDepartment,
                monthlyTrends
        );
    }

    @Transactional(readOnly = true)
    public ReportSummaryResponse getReportSummary(
            String userEmail,
            LocalDate startDate,
            LocalDate endDate,
            Long departmentId,
            Long leaveTypeId,
            LeaveStatus status
    ) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        Long managerId = (user.getRole() == Role.MANAGER) ? user.getId() : null;
        int currentYear = (startDate != null) ? startDate.getYear() : LocalDate.now().getYear();

        List<LeaveRequest> matchingRequests = leaveRequestRepository.findRequestsForReport(
                managerId, departmentId, leaveTypeId, status, startDate, endDate
        );

        Map<String, Long> countsByStatus = new HashMap<>();
        countsByStatus.put("PENDING", 0L);
        countsByStatus.put("APPROVED", 0L);
        countsByStatus.put("REJECTED", 0L);
        countsByStatus.put("CANCELLED", 0L);
        countsByStatus.put("TOTAL", (long) matchingRequests.size());

        for (LeaveRequest req : matchingRequests) {
            String s = req.getStatus().name();
            countsByStatus.put(s, countsByStatus.getOrDefault(s, 0L) + 1L);
        }

        Long allocated = leaveBalanceRepository.sumAllocatedDays(managerId, departmentId, leaveTypeId, currentYear);
        Long used = leaveBalanceRepository.sumUsedDays(managerId, departmentId, leaveTypeId, currentYear);
        double utilization = (allocated != null && allocated > 0 && used != null)
                ? Math.round(((double) used * 100.0 / allocated) * 10.0) / 10.0
                : 0.0;

        List<ReportItem> leaveByDepartment = calculateLeaveByDepartment(matchingRequests);
        List<ReportItem> leaveByType = calculateLeaveByType(matchingRequests);
        List<MonthlyTrendItem> monthlyTrends = calculateMonthlyTrends(matchingRequests);

        List<LeaveRequestResponse> records = matchingRequests.stream()
                .map(LeaveRequestResponse::fromEntity)
                .collect(Collectors.toList());

        return new ReportSummaryResponse(
                countsByStatus,
                allocated != null ? allocated : 0L,
                used != null ? used : 0L,
                utilization,
                leaveByDepartment,
                leaveByType,
                monthlyTrends,
                records
        );
    }

    @Transactional(readOnly = true)
    public byte[] exportCsvReport(
            String userEmail,
            LocalDate startDate,
            LocalDate endDate,
            Long departmentId,
            Long leaveTypeId,
            LeaveStatus status
    ) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        Long managerId = (user.getRole() == Role.MANAGER) ? user.getId() : null;

        List<LeaveRequest> matchingRequests = leaveRequestRepository.findRequestsForReport(
                managerId, departmentId, leaveTypeId, status, startDate, endDate
        );

        StringBuilder sb = new StringBuilder();
        sb.append("Request ID,Employee Name,Employee Email,Department,Leave Type,Start Date,End Date,Requested Days,Status,Reason,Manager Comment,Approved By,Approved At,Created At\n");

        for (LeaveRequest req : matchingRequests) {
            String deptName = (req.getEmployee() != null && req.getEmployee().getDepartment() != null)
                    ? req.getEmployee().getDepartment().getName() : "Unassigned";
            String empName = (req.getEmployee() != null) ? req.getEmployee().getName() : "";
            String empEmail = (req.getEmployee() != null) ? req.getEmployee().getEmail() : "";
            String leaveType = (req.getLeaveType() != null) ? req.getLeaveType().getName() : "";
            String approver = (req.getApprovedBy() != null) ? req.getApprovedBy().getName() : "";
            String approvedAt = (req.getApprovedAt() != null) ? req.getApprovedAt().toString() : "";
            String createdAt = (req.getCreatedAt() != null) ? req.getCreatedAt().toString() : "";

            sb.append(escapeCsv(String.valueOf(req.getId()))).append(",");
            sb.append(escapeCsv(empName)).append(",");
            sb.append(escapeCsv(empEmail)).append(",");
            sb.append(escapeCsv(deptName)).append(",");
            sb.append(escapeCsv(leaveType)).append(",");
            sb.append(escapeCsv(req.getStartDate() != null ? req.getStartDate().toString() : "")).append(",");
            sb.append(escapeCsv(req.getEndDate() != null ? req.getEndDate().toString() : "")).append(",");
            sb.append(req.getRequestedDays()).append(",");
            sb.append(escapeCsv(req.getStatus().name())).append(",");
            sb.append(escapeCsv(req.getReason())).append(",");
            sb.append(escapeCsv(req.getManagerComment())).append(",");
            sb.append(escapeCsv(approver)).append(",");
            sb.append(escapeCsv(approvedAt)).append(",");
            sb.append(escapeCsv(createdAt)).append("\n");
        }

        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    private List<ReportItem> calculateLeaveByType(List<LeaveRequest> requests) {
        Map<String, long[]> map = new HashMap<>(); // [count, days]
        for (LeaveRequest req : requests) {
            String type = (req.getLeaveType() != null) ? req.getLeaveType().getName() : "Unknown";
            long[] val = map.computeIfAbsent(type, k -> new long[2]);
            val[0]++;
            val[1] += req.getRequestedDays();
        }

        return map.entrySet().stream()
                .map(e -> new ReportItem(e.getKey(), e.getValue()[0], e.getValue()[1]))
                .sorted(Comparator.comparing(item -> item.getName()))
                .collect(Collectors.toList());
    }

    private List<ReportItem> calculateLeaveByDepartment(List<LeaveRequest> requests) {
        Map<String, long[]> map = new HashMap<>();
        for (LeaveRequest req : requests) {
            String dept = (req.getEmployee() != null && req.getEmployee().getDepartment() != null)
                    ? req.getEmployee().getDepartment().getName()
                    : "Unassigned";
            long[] val = map.computeIfAbsent(dept, k -> new long[2]);
            val[0]++;
            val[1] += req.getRequestedDays();
        }

        return map.entrySet().stream()
                .map(e -> new ReportItem(e.getKey(), e.getValue()[0], e.getValue()[1]))
                .sorted(Comparator.comparing(item -> item.getName()))
                .collect(Collectors.toList());
    }

    private List<MonthlyTrendItem> calculateMonthlyTrends(List<LeaveRequest> requests) {
        Map<YearMonth, long[]> map = new TreeMap<>(); // [totalRequests, approvedDays, pendingDays]
        for (LeaveRequest req : requests) {
            if (req.getStartDate() == null) continue;
            YearMonth ym = YearMonth.from(req.getStartDate());
            long[] val = map.computeIfAbsent(ym, k -> new long[3]);
            val[0]++;
            if (req.getStatus() == LeaveStatus.APPROVED) {
                val[1] += req.getRequestedDays();
            } else if (req.getStatus() == LeaveStatus.PENDING) {
                val[2] += req.getRequestedDays();
            }
        }

        List<MonthlyTrendItem> items = new ArrayList<>();
        for (Map.Entry<YearMonth, long[]> entry : map.entrySet()) {
            YearMonth ym = entry.getKey();
            long[] val = entry.getValue();
            items.add(new MonthlyTrendItem(
                    ym.format(MONTH_KEY_FMT),
                    ym.format(MONTH_NAME_FMT),
                    val[0],
                    val[1],
                    val[2]
            ));
        }

        return items;
    }

    private String escapeCsv(String value) {
        if (value == null) return "\"\"";
        String escaped = value.replace("\"", "\"\"");
        return "\"" + escaped + "\"";
    }
}
