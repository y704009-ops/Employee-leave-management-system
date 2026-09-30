package com.elms.manager;

import com.elms.department.Department;
import com.elms.department.DepartmentRepository;
import com.elms.leavebalance.LeaveBalance;
import com.elms.leavebalance.LeaveBalanceRepository;
import com.elms.leaverequest.LeaveRequest;
import com.elms.leaverequest.LeaveRequestRepository;
import com.elms.leaverequest.LeaveStatus;
import com.elms.leaverequest.dto.ApproveLeaveRequest;
import com.elms.leaverequest.dto.RejectLeaveRequest;
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
public class ManagerApprovalIntegrationTest {

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

    private User managerA;
    private User managerB;
    private User admin;
    private User teamEmployee;
    private String managerAToken;
    private String managerBToken;
    private String adminToken;
    private LeaveType annualLeave;
    private int currentYear;

    @BeforeEach
    void setUp() {
        leaveRequestRepository.deleteAll();
        leaveBalanceRepository.deleteAll();
        userRepository.deleteAll();
        departmentRepository.deleteAll();
        leaveTypeRepository.deleteAll();

        currentYear = LocalDate.now().getYear();

        Department dept = departmentRepository.save(new Department("Engineering", "Software Development"));

        // Manager A
        managerA = new User("Manager Alice", "mgr.alice@elms.com", passwordEncoder.encode("Pass@123"), Role.MANAGER);
        managerA.setDepartment(dept);
        managerA = userRepository.save(managerA);
        managerAToken = "Bearer " + jwtTokenProvider.generateToken(managerA);

        // Manager B (different team)
        managerB = new User("Manager Bob", "mgr.bob@elms.com", passwordEncoder.encode("Pass@123"), Role.MANAGER);
        managerB.setDepartment(dept);
        managerB = userRepository.save(managerB);
        managerBToken = "Bearer " + jwtTokenProvider.generateToken(managerB);

        // Admin
        admin = new User("System Admin", "admin.sys@elms.com", passwordEncoder.encode("Pass@123"), Role.ADMIN);
        admin.setDepartment(dept);
        admin = userRepository.save(admin);
        adminToken = "Bearer " + jwtTokenProvider.generateToken(admin);

        // Employee assigned to Manager A
        teamEmployee = new User("Dev Charlie", "charlie.dev@elms.com", passwordEncoder.encode("Pass@123"), Role.EMPLOYEE);
        teamEmployee.setDepartment(dept);
        teamEmployee.setManager(managerA);
        teamEmployee = userRepository.save(teamEmployee);

        annualLeave = leaveTypeRepository.save(new LeaveType("Annual Leave", "Standard paid annual leave", 15, false));

        leaveBalanceRepository.save(new LeaveBalance(teamEmployee, annualLeave, 15, 0, 15, currentYear));
    }

    @Test
    @DisplayName("Manager approves team member's pending leave request transactionally")
    void testManagerApproveTeamLeaveRequestSuccess() throws Exception {
        LeaveRequest pendingRequest = new LeaveRequest(
                teamEmployee,
                annualLeave,
                LocalDate.now().plusDays(5),
                LocalDate.now().plusDays(7),
                3,
                "Family vacation trip"
        );
        pendingRequest = leaveRequestRepository.save(pendingRequest);

        ApproveLeaveRequest approveBody = new ApproveLeaveRequest("Approved, have a great vacation!");

        mockMvc.perform(patch("/leave-requests/" + pendingRequest.getId() + "/approve")
                        .header("Authorization", managerAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(approveBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.status", is("APPROVED")))
                .andExpect(jsonPath("$.data.approvedByName", is("Manager Alice")))
                .andExpect(jsonPath("$.data.managerComment", is("Approved, have a great vacation!")));

        // Verify balance updated transactionally in database
        LeaveBalance updatedBalance = leaveBalanceRepository.findByEmployeeIdAndLeaveTypeIdAndYear(
                teamEmployee.getId(), annualLeave.getId(), currentYear).orElseThrow();
        assertEquals(3, updatedBalance.getUsedDays());
        assertEquals(12, updatedBalance.getRemainingDays());

        LeaveRequest updatedRequest = leaveRequestRepository.findById(pendingRequest.getId()).orElseThrow();
        assertEquals(LeaveStatus.APPROVED, updatedRequest.getStatus());
        assertNotNull(updatedRequest.getApprovedAt());
        assertEquals(managerA.getId(), updatedRequest.getApprovedBy().getId());
    }

    @Test
    @DisplayName("Manager rejects team member's pending leave request with mandatory comment")
    void testManagerRejectTeamLeaveRequestSuccess() throws Exception {
        LeaveRequest pendingRequest = new LeaveRequest(
                teamEmployee,
                annualLeave,
                LocalDate.now().plusDays(10),
                LocalDate.now().plusDays(12),
                3,
                "Extended weekend off"
        );
        pendingRequest = leaveRequestRepository.save(pendingRequest);

        RejectLeaveRequest rejectBody = new RejectLeaveRequest("Critical project release scheduled for those dates.");

        mockMvc.perform(patch("/leave-requests/" + pendingRequest.getId() + "/reject")
                        .header("Authorization", managerAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(rejectBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.status", is("REJECTED")))
                .andExpect(jsonPath("$.data.managerComment", containsString("Critical project release")))
                .andExpect(jsonPath("$.data.approvedByName", is("Manager Alice")));

        // Verify balance is NOT permanently deducted
        LeaveBalance balance = leaveBalanceRepository.findByEmployeeIdAndLeaveTypeIdAndYear(
                teamEmployee.getId(), annualLeave.getId(), currentYear).orElseThrow();
        assertEquals(0, balance.getUsedDays());
        assertEquals(15, balance.getRemainingDays());
    }

    @Test
    @DisplayName("Rejecting leave request without comment fails with 400 Bad Request")
    void testManagerRejectWithoutCommentFailsWith400() throws Exception {
        LeaveRequest pendingRequest = new LeaveRequest(
                teamEmployee,
                annualLeave,
                LocalDate.now().plusDays(5),
                LocalDate.now().plusDays(6),
                2,
                "Doctor appointment"
        );
        pendingRequest = leaveRequestRepository.save(pendingRequest);

        RejectLeaveRequest emptyCommentBody = new RejectLeaveRequest("");

        mockMvc.perform(patch("/leave-requests/" + pendingRequest.getId() + "/reject")
                        .header("Authorization", managerAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(emptyCommentBody)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    @DisplayName("Manager B cannot approve or reject another manager's employee request (403 Forbidden)")
    void testManagerCannotApproveAnotherManagersEmployeeRequestWith403() throws Exception {
        LeaveRequest pendingRequest = new LeaveRequest(
                teamEmployee,
                annualLeave,
                LocalDate.now().plusDays(5),
                LocalDate.now().plusDays(7),
                3,
                "Personal days"
        );
        pendingRequest = leaveRequestRepository.save(pendingRequest);

        ApproveLeaveRequest approveBody = new ApproveLeaveRequest("Approved");

        mockMvc.perform(patch("/leave-requests/" + pendingRequest.getId() + "/approve")
                        .header("Authorization", managerBToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(approveBody)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success", is(false)));

        RejectLeaveRequest rejectBody = new RejectLeaveRequest("Rejected by Bob");
        mockMvc.perform(patch("/leave-requests/" + pendingRequest.getId() + "/reject")
                        .header("Authorization", managerBToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(rejectBody)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    @DisplayName("Cannot approve or reject an already APPROVED or CANCELLED request (409 Conflict)")
    void testStateConflictReturns409() throws Exception {
        LeaveRequest alreadyApproved = new LeaveRequest(
                teamEmployee,
                annualLeave,
                LocalDate.now().plusDays(10),
                LocalDate.now().plusDays(11),
                2,
                "Rest days"
        );
        alreadyApproved.setStatus(LeaveStatus.APPROVED);
        alreadyApproved = leaveRequestRepository.save(alreadyApproved);

        mockMvc.perform(patch("/leave-requests/" + alreadyApproved.getId() + "/approve")
                        .header("Authorization", managerAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success", is(false)));

        LeaveRequest alreadyCancelled = new LeaveRequest(
                teamEmployee,
                annualLeave,
                LocalDate.now().plusDays(15),
                LocalDate.now().plusDays(16),
                2,
                "Trip"
        );
        alreadyCancelled.setStatus(LeaveStatus.CANCELLED);
        alreadyCancelled = leaveRequestRepository.save(alreadyCancelled);

        RejectLeaveRequest rejectBody = new RejectLeaveRequest("Not needed anymore");
        mockMvc.perform(patch("/leave-requests/" + alreadyCancelled.getId() + "/reject")
                        .header("Authorization", managerAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(rejectBody)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    @DisplayName("Admin can approve requests across any department or team")
    void testAdminCanApproveAnyRequest() throws Exception {
        LeaveRequest pendingRequest = new LeaveRequest(
                teamEmployee,
                annualLeave,
                LocalDate.now().plusDays(20),
                LocalDate.now().plusDays(21),
                2,
                "Conference attendance"
        );
        pendingRequest = leaveRequestRepository.save(pendingRequest);

        ApproveLeaveRequest approveBody = new ApproveLeaveRequest("Admin override approved");

        mockMvc.perform(patch("/leave-requests/" + pendingRequest.getId() + "/approve")
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(approveBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.status", is("APPROVED")))
                .andExpect(jsonPath("$.data.approvedByName", is("System Admin")));
    }

    @Test
    @DisplayName("Manager review details endpoint returns comprehensive decision context")
    void testManagerReviewDetailsContext() throws Exception {
        LeaveRequest historicalRequest = new LeaveRequest(
                teamEmployee,
                annualLeave,
                LocalDate.now().minusDays(30),
                LocalDate.now().minusDays(28),
                3,
                "Prior past vacation"
        );
        historicalRequest.setStatus(LeaveStatus.APPROVED);
        leaveRequestRepository.save(historicalRequest);

        LeaveRequest currentPending = new LeaveRequest(
                teamEmployee,
                annualLeave,
                LocalDate.now().plusDays(5),
                LocalDate.now().plusDays(6),
                2,
                "Upcoming leave needing approval"
        );
        currentPending = leaveRequestRepository.save(currentPending);

        mockMvc.perform(get("/leave-requests/" + currentPending.getId() + "/review-details")
                        .header("Authorization", managerAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.leaveRequest.id", is(currentPending.getId().intValue())))
                .andExpect(jsonPath("$.data.leaveRequest.employeeName", is("Dev Charlie")))
                .andExpect(jsonPath("$.data.currentBalance.allocatedDays", is(15)))
                .andExpect(jsonPath("$.data.employeeLeaveHistory", hasSize(1)))
                .andExpect(jsonPath("$.data.employeeLeaveHistory[0].reason", is("Prior past vacation")));
    }

    @Test
    @DisplayName("Team dashboard stats and team leaves endpoints return correct aggregations")
    void testTeamDashboardStatsAndLeaves() throws Exception {
        LeaveRequest pending = new LeaveRequest(
                teamEmployee,
                annualLeave,
                LocalDate.now().plusDays(2),
                LocalDate.now().plusDays(3),
                2,
                "Short leave"
        );
        leaveRequestRepository.save(pending);

        mockMvc.perform(get("/leave-requests/team-dashboard")
                        .header("Authorization", managerAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.pendingApprovalsCount", is(1)))
                .andExpect(jsonPath("$.data.teamMembersCount", is(1)))
                .andExpect(jsonPath("$.data.teamMembers[0].name", is("Dev Charlie")));

        mockMvc.perform(get("/leave-requests/team")
                        .param("status", "PENDING")
                        .header("Authorization", managerAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].employeeName", is("Dev Charlie")));
    }
}
