package com.elms.leave;

import com.elms.department.Department;
import com.elms.department.DepartmentRepository;
import com.elms.leavebalance.LeaveBalance;
import com.elms.leavebalance.LeaveBalanceRepository;
import com.elms.leaverequest.LeaveRequest;
import com.elms.leaverequest.LeaveRequestRepository;
import com.elms.leaverequest.LeaveStatus;
import com.elms.leaverequest.dto.LeaveApplicationRequest;
import com.elms.leavetype.LeaveType;
import com.elms.leavetype.LeaveTypeRepository;
import com.elms.security.JwtTokenProvider;
import com.elms.user.Role;
import com.elms.user.User;
import com.elms.user.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@SuppressWarnings("null")
public class LeaveManagementIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

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

    @Autowired
    private com.elms.leaverequest.LeaveRequestService leaveRequestService;

    private User employeeUser;
    private User otherEmployee;
    private User adminUser;
    private String employeeToken;
    private String otherEmployeeToken;
    private String adminToken;
    private LeaveType annualLeave;
    private LeaveType sickLeave;

    @BeforeEach
    void setUp() {
        leaveRequestRepository.deleteAll();
        leaveBalanceRepository.deleteAll();
        userRepository.deleteAll();
        departmentRepository.deleteAll();
        leaveTypeRepository.deleteAll();

        Department dept = departmentRepository.save(new Department("Engineering", "Software Team"));

        employeeUser = new User("Alice Developer", "alice.dev@elms.com", passwordEncoder.encode("Pass@123"), Role.EMPLOYEE);
        employeeUser.setDepartment(dept);
        employeeUser = userRepository.save(employeeUser);
        employeeToken = "Bearer " + jwtTokenProvider.generateToken(employeeUser);

        otherEmployee = new User("Bob Staff", "bob.staff@elms.com", passwordEncoder.encode("Pass@123"), Role.EMPLOYEE);
        otherEmployee.setDepartment(dept);
        otherEmployee = userRepository.save(otherEmployee);
        otherEmployeeToken = "Bearer " + jwtTokenProvider.generateToken(otherEmployee);

        adminUser = new User("Admin Boss", "admin.boss@elms.com", passwordEncoder.encode("Pass@123"), Role.ADMIN);
        adminUser.setDepartment(dept);
        adminUser = userRepository.save(adminUser);
        adminToken = "Bearer " + jwtTokenProvider.generateToken(adminUser);

        annualLeave = leaveTypeRepository.save(new LeaveType("Annual Leave", "Standard paid leave", 14, false));
        sickLeave = leaveTypeRepository.save(new LeaveType("Sick Leave", "Medical recovery", 7, true)); // requires attachment

        // Initialize 2026 balances
        int currentYear = LocalDate.now().getYear();
        leaveBalanceRepository.save(new LeaveBalance(employeeUser, annualLeave, 14, 0, 14, currentYear));
        leaveBalanceRepository.save(new LeaveBalance(employeeUser, sickLeave, 7, 0, 7, currentYear));
        leaveBalanceRepository.save(new LeaveBalance(otherEmployee, annualLeave, 14, 0, 14, currentYear));
    }

    @Test
    @DisplayName("1. Valid leave request submission creates PENDING request and reserves balance")
    void testValidLeaveRequestSubmission() throws Exception {
        LocalDate start = LocalDate.now().plusDays(10);
        LocalDate end = LocalDate.now().plusDays(14); // 5 days inclusive

        LeaveApplicationRequest request = new LeaveApplicationRequest(
                annualLeave.getId(),
                start,
                end,
                "Family vacation scheduled in advance."
        );

        mockMvc.perform(post("/leave-requests")
                        .header("Authorization", employeeToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("PENDING"))
                .andExpect(jsonPath("$.data.requestedDays").value(5))
                .andExpect(jsonPath("$.data.employeeEmail").value("alice.dev@elms.com"))
                .andExpect(jsonPath("$.data.leaveTypeName").value("Annual Leave"));

        // Verify balance endpoint reflects 5 reserved pending days and remaining 9
        mockMvc.perform(get("/leave-balances/employee/" + employeeUser.getId())
                        .header("Authorization", employeeToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[?(@.leaveTypeName == 'Annual Leave')].pendingDays").value(5))
                .andExpect(jsonPath("$.data[?(@.leaveTypeName == 'Annual Leave')].remainingDays").value(9));
    }

    @Test
    @DisplayName("2. Invalid dates: start date after end date returns 400 Bad Request")
    void testInvalidDatesStartAfterEnd() throws Exception {
        LocalDate start = LocalDate.now().plusDays(15);
        LocalDate end = LocalDate.now().plusDays(10); // End before start

        LeaveApplicationRequest request = new LeaveApplicationRequest(
                annualLeave.getId(),
                start,
                end,
                "Invalid dates request test."
        );

        mockMvc.perform(post("/leave-requests")
                        .header("Authorization", employeeToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.message", containsString("Start date cannot be after end date")));
    }

    @Test
    @DisplayName("3. Insufficient balance: requesting more days than remaining returns 400 Bad Request")
    void testInsufficientBalance() throws Exception {
        LocalDate start = LocalDate.now().plusDays(5);
        LocalDate end = LocalDate.now().plusDays(25); // 21 days (allocation is only 14)

        LeaveApplicationRequest request = new LeaveApplicationRequest(
                annualLeave.getId(),
                start,
                end,
                "Requesting 21 days with only 14 allocated."
        );

        mockMvc.perform(post("/leave-requests")
                        .header("Authorization", employeeToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.message", containsString("Insufficient leave balance")));
    }

    @Test
    @DisplayName("4. Zero balance: attempting to apply with 0 remaining days returns 400 Bad Request")
    void testZeroBalance() throws Exception {
        // Manually exhaust all 14 days
        int currentYear = LocalDate.now().getYear();
        LeaveBalance bal = leaveBalanceRepository.findByEmployeeIdAndLeaveTypeIdAndYear(
                employeeUser.getId(), annualLeave.getId(), currentYear).orElseThrow();
        bal.setUsedDays(14);
        bal.setRemainingDays(0);
        leaveBalanceRepository.save(bal);

        LocalDate start = LocalDate.now().plusDays(5);
        LocalDate end = LocalDate.now().plusDays(6); // 2 days

        LeaveApplicationRequest request = new LeaveApplicationRequest(
                annualLeave.getId(),
                start,
                end,
                "Requesting when zero balance remains."
        );

        mockMvc.perform(post("/leave-requests")
                        .header("Authorization", employeeToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.message", containsString("zero remaining balance")));
    }

    @Test
    @DisplayName("5. Overlap detection: overlapping dates with active request returns 409 Conflict")
    void testOverlappingRequestConflict() throws Exception {
        LocalDate start1 = LocalDate.of(2026, 11, 2);
        LocalDate end1 = LocalDate.of(2026, 11, 6);

        // Pre-create a PENDING request
        LeaveRequest existing = new LeaveRequest(employeeUser, annualLeave, start1, end1, 5, "First vacation plan");
        leaveRequestRepository.save(existing);

        // Try to apply for dates overlapping with existing request (Nov 4 - Nov 8)
        LocalDate start2 = LocalDate.of(2026, 11, 4);
        LocalDate end2 = LocalDate.of(2026, 11, 8);

        LeaveApplicationRequest overlappingReq = new LeaveApplicationRequest(
                annualLeave.getId(),
                start2,
                end2,
                "Overlapping request attempt."
        );

        mockMvc.perform(post("/leave-requests")
                        .header("Authorization", employeeToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(overlappingReq)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error.code").value("CONFLICT"))
                .andExpect(jsonPath("$.error.message", containsString("overlap")));
    }

    @Test
    @DisplayName("6. Duplicate submission detection returns 409 Conflict")
    void testDuplicateSubmissionConflict() throws Exception {
        LocalDate start = LocalDate.of(2026, 12, 1);
        LocalDate end = LocalDate.of(2026, 12, 3);

        LeaveApplicationRequest request = new LeaveApplicationRequest(
                annualLeave.getId(),
                start,
                end,
                "First submission for December conference."
        );

        // First submission succeeds
        mockMvc.perform(post("/leave-requests")
                        .header("Authorization", employeeToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        // Duplicate submission fails with 409 Conflict
        mockMvc.perform(post("/leave-requests")
                        .header("Authorization", employeeToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error.code").value("CONFLICT"))
                .andExpect(jsonPath("$.error.message", containsString("duplicate")));
    }

    @Test
    @DisplayName("7. Attachment requirement: leave type requiring attachment without attachment returns 400 Bad Request")
    void testAttachmentRequirementValidation() throws Exception {
        LocalDate start = LocalDate.now().plusDays(2);
        LocalDate end = LocalDate.now().plusDays(4);

        // Sick leave requires attachment, but none provided
        LeaveApplicationRequest request = new LeaveApplicationRequest(
                sickLeave.getId(),
                start,
                end,
                "Severe migraine and doctor appointment.",
                null // Missing attachment
        );

        mockMvc.perform(post("/leave-requests")
                        .header("Authorization", employeeToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.message", containsString("attachment is required")));

        // Providing attachment succeeds
        request.setAttachmentName("doctor_prescription.pdf");
        mockMvc.perform(post("/leave-requests")
                        .header("Authorization", employeeToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.attachmentName").value("doctor_prescription.pdf"));
    }

    @Test
    @DisplayName("8. Cancellation: owner can cancel PENDING request, releasing reserved days; other users cannot")
    void testLeaveCancellationWorkflow() throws Exception {
        LocalDate start = LocalDate.now().plusDays(10);
        LocalDate end = LocalDate.now().plusDays(12); // 3 days

        LeaveRequest req = new LeaveRequest(employeeUser, annualLeave, start, end, 3, "Trip planning");
        req.setStatus(LeaveStatus.PENDING);
        req = leaveRequestRepository.save(req);

        // Unauthorized user attempts cancellation -> 403 Forbidden
        mockMvc.perform(patch("/leave-requests/" + req.getId() + "/cancel")
                        .header("Authorization", otherEmployeeToken))
                .andExpect(status().isForbidden());

        // Owner cancels request -> 200 OK with CANCELLED status
        mockMvc.perform(patch("/leave-requests/" + req.getId() + "/cancel")
                        .header("Authorization", employeeToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("CANCELLED"));

        // Verify balance releases reserved days
        mockMvc.perform(get("/leave-balances/employee/" + employeeUser.getId())
                        .header("Authorization", employeeToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[?(@.leaveTypeName == 'Annual Leave')].pendingDays").value(0))
                .andExpect(jsonPath("$.data[?(@.leaveTypeName == 'Annual Leave')].remainingDays").value(14));

        // Attempting to cancel already CANCELLED request returns 400 Bad Request
        mockMvc.perform(patch("/leave-requests/" + req.getId() + "/cancel")
                        .header("Authorization", employeeToken))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.message", containsString("Only PENDING leave requests can be cancelled")));
    }

    @Test
    @DisplayName("9. Employee can fetch own leave history with status filters")
    void testMyLeaveHistoryWithFilters() throws Exception {
        LeaveRequest r1 = new LeaveRequest(employeeUser, annualLeave, LocalDate.of(2026, 5, 1), LocalDate.of(2026, 5, 3), 3, "Spring trip");
        r1.setStatus(LeaveStatus.APPROVED);
        leaveRequestRepository.save(r1);

        LeaveRequest r2 = new LeaveRequest(employeeUser, sickLeave, LocalDate.of(2026, 6, 1), LocalDate.of(2026, 6, 2), 2, "Flu");
        r2.setStatus(LeaveStatus.PENDING);
        leaveRequestRepository.save(r2);

        // All leaves for employee
        mockMvc.perform(get("/leave-requests/my")
                        .header("Authorization", employeeToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(2));

        // Filter by status = PENDING
        mockMvc.perform(get("/leave-requests/my?status=PENDING")
                        .header("Authorization", employeeToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].status").value("PENDING"));

        // Filter by status = APPROVED
        mockMvc.perform(get("/leave-requests/my?status=APPROVED")
                        .header("Authorization", employeeToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].status").value("APPROVED"));
    }

    @Test
    @DisplayName("10. Inactive employee cannot apply for leave (401 via auth filter, and 400 BadRequestException at service)")
    void testInactiveEmployeeCannotApplyForLeave() throws Exception {
        employeeUser.setActive(false);
        userRepository.save(employeeUser);

        LeaveApplicationRequest request = new LeaveApplicationRequest(
                annualLeave.getId(),
                LocalDate.now().plusDays(5),
                LocalDate.now().plusDays(6),
                "Leave application while inactive"
        );

        // Security filter rejects deactivated account with 401 Unauthorized
        mockMvc.perform(post("/leave-requests")
                        .header("Authorization", employeeToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());

        // Service level also explicitly rejects inactive employee
        com.elms.exception.BadRequestException ex = assertThrows(
                com.elms.exception.BadRequestException.class,
                () -> leaveRequestService.createLeaveRequest(employeeUser.getEmail(), request)
        );
        assertTrue(ex.getMessage().contains("Inactive employee accounts cannot submit leave applications"));
    }

    @Test
    @DisplayName("11. Inactive leave type cannot be selected for application (400 Bad Request)")
    void testInactiveLeaveTypeCannotBeRequested() throws Exception {
        annualLeave.setActive(false);
        leaveTypeRepository.save(annualLeave);

        LeaveApplicationRequest request = new LeaveApplicationRequest(
                annualLeave.getId(),
                LocalDate.now().plusDays(5),
                LocalDate.now().plusDays(6),
                "Leave application for inactive leave type"
        );

        mockMvc.perform(post("/leave-requests")
                        .header("Authorization", employeeToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.message", containsString("Selected leave type is inactive")));
    }

    @Test
    @DisplayName("12. Admin can cancel an eligible pending leave request")
    void testAdminCanCancelPendingLeaveRequest() throws Exception {
        LeaveRequest req = new LeaveRequest(
                employeeUser,
                annualLeave,
                LocalDate.now().plusDays(10),
                LocalDate.now().plusDays(12),
                3,
                "Trip to be cancelled by admin"
        );
        req.setStatus(LeaveStatus.PENDING);
        req = leaveRequestRepository.save(req);

        mockMvc.perform(patch("/leave-requests/" + req.getId() + "/cancel")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("CANCELLED"));

        LeaveRequest reloaded = leaveRequestRepository.findById(req.getId()).orElseThrow();
        assertEquals(LeaveStatus.CANCELLED, reloaded.getStatus());
    }

    @Test
    @DisplayName("13. Approving request exceeding allocated days fails transactionally without altering status")
    void testApprovalWithInsufficientBalanceRejectsAndRollsBack() throws Exception {
        // Create request with 5 days
        LeaveRequest req = new LeaveRequest(
                employeeUser,
                annualLeave,
                LocalDate.now().plusDays(10),
                LocalDate.now().plusDays(14),
                5,
                "Request needing 5 days"
        );
        req.setStatus(LeaveStatus.PENDING);
        req = leaveRequestRepository.save(req);

        // Manually adjust balance so allocated is only 4 days
        int currentYear = LocalDate.now().getYear();
        LeaveBalance bal = leaveBalanceRepository.findByEmployeeIdAndLeaveTypeIdAndYear(
                employeeUser.getId(), annualLeave.getId(), currentYear).orElseThrow();
        bal.setAllocatedDays(4);
        bal.setRemainingDays(4);
        bal.setUsedDays(0);
        leaveBalanceRepository.save(bal);

        // Manager / Admin attempts approval
        mockMvc.perform(patch("/leave-requests/" + req.getId() + "/approve")
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.message", containsString("exceed remaining balance")));

        // Verify transactional rollback: LeaveRequest status must remain PENDING
        LeaveRequest reloaded = leaveRequestRepository.findById(req.getId()).orElseThrow();
        assertEquals(LeaveStatus.PENDING, reloaded.getStatus());

        // Verify balance was not modified
        LeaveBalance reloadedBal = leaveBalanceRepository.findById(bal.getId()).orElseThrow();
        assertEquals(0, reloadedBal.getUsedDays());
        assertEquals(4, reloadedBal.getAllocatedDays());
    }
}
