package com.elms.report;

import com.elms.department.Department;
import com.elms.department.DepartmentRepository;
import com.elms.leavebalance.LeaveBalance;
import com.elms.leavebalance.LeaveBalanceRepository;
import com.elms.leaverequest.LeaveRequest;
import com.elms.leaverequest.LeaveRequestRepository;
import com.elms.leaverequest.LeaveStatus;
import com.elms.leavetype.LeaveType;
import com.elms.leavetype.LeaveTypeRepository;
import com.elms.security.JwtTokenProvider;
import com.elms.user.Role;
import com.elms.user.User;
import com.elms.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@SuppressWarnings("null")
public class ReportIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private LeaveTypeRepository leaveTypeRepository;

    @Autowired
    private LeaveBalanceRepository leaveBalanceRepository;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private User admin;
    private User managerA;
    private User managerB;
    private User employeeA;
    private User employeeB;
    private String adminToken;
    private String managerAToken;
    private String employeeToken;
    private Department engDept;
    private Department hrDept;
    private LeaveType annualLeave;
    private LeaveType sickLeave;
    private int currentYear;

    @BeforeEach
    void setUp() {
        leaveRequestRepository.deleteAll();
        leaveBalanceRepository.deleteAll();
        userRepository.deleteAll();
        departmentRepository.deleteAll();
        leaveTypeRepository.deleteAll();

        currentYear = LocalDate.now().getYear();

        engDept = departmentRepository.save(new Department("Engineering", "Tech"));
        hrDept = departmentRepository.save(new Department("Human Resources", "People"));

        admin = new User("System Admin", "admin.rep@elms.com", passwordEncoder.encode("Pass@123"), Role.ADMIN);
        admin.setDepartment(engDept);
        admin = userRepository.save(admin);
        adminToken = "Bearer " + jwtTokenProvider.generateToken(admin);

        managerA = new User("Manager Alice", "alice.rep@elms.com", passwordEncoder.encode("Pass@123"), Role.MANAGER);
        managerA.setDepartment(engDept);
        managerA = userRepository.save(managerA);
        managerAToken = "Bearer " + jwtTokenProvider.generateToken(managerA);

        managerB = new User("Manager Bob", "bob.rep@elms.com", passwordEncoder.encode("Pass@123"), Role.MANAGER);
        managerB.setDepartment(hrDept);
        managerB = userRepository.save(managerB);

        employeeA = new User("Dev Charlie", "charlie.rep@elms.com", passwordEncoder.encode("Pass@123"), Role.EMPLOYEE);
        employeeA.setDepartment(engDept);
        employeeA.setManager(managerA);
        employeeA = userRepository.save(employeeA);

        employeeB = new User("HR David", "david.rep@elms.com", passwordEncoder.encode("Pass@123"), Role.EMPLOYEE);
        employeeB.setDepartment(hrDept);
        employeeB.setManager(managerB);
        employeeB = userRepository.save(employeeB);
        employeeToken = "Bearer " + jwtTokenProvider.generateToken(employeeB);

        annualLeave = leaveTypeRepository.save(new LeaveType("Annual Leave", "Paid annual leave", 15, false));
        sickLeave = leaveTypeRepository.save(new LeaveType("Sick Leave", "Medical leave", 10, true));

        // Balances
        leaveBalanceRepository.save(new LeaveBalance(employeeA, annualLeave, 15, 3, 12, currentYear));
        leaveBalanceRepository.save(new LeaveBalance(employeeB, annualLeave, 15, 5, 10, currentYear));

        // Leave Requests
        // 1. Employee A (Manager A team) - APPROVED
        LeaveRequest req1 = new LeaveRequest(employeeA, annualLeave, LocalDate.of(currentYear, 5, 10), LocalDate.of(currentYear, 5, 12), 3, "Trip");
        req1.setStatus(LeaveStatus.APPROVED);
        req1.setApprovedBy(managerA);
        leaveRequestRepository.save(req1);

        // 2. Employee A (Manager A team) - PENDING
        LeaveRequest req2 = new LeaveRequest(employeeA, sickLeave, LocalDate.of(currentYear, 6, 1), LocalDate.of(currentYear, 6, 2), 2, "Flu");
        req2.setStatus(LeaveStatus.PENDING);
        leaveRequestRepository.save(req2);

        // 3. Employee B (Manager B team) - APPROVED
        LeaveRequest req3 = new LeaveRequest(employeeB, annualLeave, LocalDate.of(currentYear, 5, 15), LocalDate.of(currentYear, 5, 19), 5, "Vacation");
        req3.setStatus(LeaveStatus.APPROVED);
        req3.setApprovedBy(managerB);
        leaveRequestRepository.save(req3);
    }

    @Test
    @DisplayName("Admin dashboard endpoint returns organization-wide statistics, utilization, and trends")
    void testAdminDashboardStats() throws Exception {
        mockMvc.perform(get("/reports/dashboard")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.totalActiveEmployees", is(5))) // admin, mgrA, mgrB, empA, empB
                .andExpect(jsonPath("$.data.totalDepartments", is(2)))
                .andExpect(jsonPath("$.data.pendingRequests", is(1)))
                .andExpect(jsonPath("$.data.approvedRequests", is(2)))
                .andExpect(jsonPath("$.data.totalAllocatedDays", is(30))) // 15 + 15
                .andExpect(jsonPath("$.data.totalUsedDays", is(8))) // 3 + 5
                .andExpect(jsonPath("$.data.utilizationPercentage", is(26.7)))
                .andExpect(jsonPath("$.data.leaveByType", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data.leaveByDepartment", hasSize(2)))
                .andExpect(jsonPath("$.data.monthlyTrends", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @DisplayName("Manager cannot access organization-wide admin dashboard (403 Forbidden)")
    void testManagerCannotAccessAdminDashboard() throws Exception {
        mockMvc.perform(get("/reports/dashboard")
                        .header("Authorization", managerAToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    @DisplayName("Manager report summary is strictly scoped to direct team members")
    void testManagerReportSummaryTeamScoped() throws Exception {
        // Manager A should only see Employee A's requests (1 APPROVED, 1 PENDING, 0 for Employee B)
        mockMvc.perform(get("/reports/summary")
                        .header("Authorization", managerAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.countsByStatus.TOTAL", is(2)))
                .andExpect(jsonPath("$.data.countsByStatus.APPROVED", is(1)))
                .andExpect(jsonPath("$.data.countsByStatus.PENDING", is(1)))
                .andExpect(jsonPath("$.data.records", hasSize(2)))
                .andExpect(jsonPath("$.data.records[*].employeeName", everyItem(is("Dev Charlie"))));
    }

    @Test
    @DisplayName("Admin report summary filters correctly by department, leave type, and status")
    void testAdminReportSummaryWithFilters() throws Exception {
        // Filter by Department: Engineering only
        mockMvc.perform(get("/reports/summary")
                        .param("departmentId", engDept.getId().toString())
                        .param("status", "APPROVED")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.countsByStatus.TOTAL", is(1)))
                .andExpect(jsonPath("$.data.countsByStatus.APPROVED", is(1)))
                .andExpect(jsonPath("$.data.records[0].employeeName", is("Dev Charlie")));
    }

    @Test
    @DisplayName("Export report as CSV produces valid CSV stream with headers")
    void testExportCsvReport() throws Exception {
        mockMvc.perform(get("/reports/export-csv")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", startsWith("text/csv")))
                .andExpect(content().string(containsString("Request ID,Employee Name,Employee Email,Department,Leave Type")))
                .andExpect(content().string(containsString("Dev Charlie")))
                .andExpect(content().string(containsString("HR David")));
    }

    @Test
    @DisplayName("Standard employee cannot access reports (403 Forbidden)")
    void testEmployeeCannotAccessReports() throws Exception {
        mockMvc.perform(get("/reports/summary")
                        .header("Authorization", employeeToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success", is(false)));

        mockMvc.perform(get("/reports/export-csv")
                        .header("Authorization", employeeToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success", is(false)));
    }
}
