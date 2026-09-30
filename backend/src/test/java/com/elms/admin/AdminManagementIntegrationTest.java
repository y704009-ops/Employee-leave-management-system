package com.elms.admin;

import com.elms.department.Department;
import com.elms.department.DepartmentRepository;
import com.elms.department.dto.DepartmentRequest;
import com.elms.employee.dto.CreateEmployeeRequest;
import com.elms.employee.dto.UpdateEmployeeRequest;
import com.elms.leavebalance.LeaveBalance;
import com.elms.leavebalance.LeaveBalanceRepository;
import com.elms.leavebalance.dto.AdjustBalanceRequest;
import com.elms.leavetype.LeaveType;
import com.elms.leavetype.LeaveTypeRepository;
import com.elms.leavetype.dto.LeaveTypeRequest;
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
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@SuppressWarnings("null")
public class AdminManagementIntegrationTest {

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
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private String adminToken;
    private String employeeToken;
    private User adminUser;
    private User regularEmployee;

    @BeforeEach
    void setUp() {
        leaveBalanceRepository.deleteAll();
        userRepository.deleteAll();
        departmentRepository.deleteAll();
        leaveTypeRepository.deleteAll();

        // Seed Admin
        adminUser = new User("Admin Chief", "admin@elms.com", passwordEncoder.encode("AdminPass123"), Role.ADMIN);
        adminUser = userRepository.save(adminUser);
        adminToken = "Bearer " + jwtTokenProvider.generateToken(adminUser);

        // Seed Employee
        regularEmployee = new User("Worker Bob", "bob@elms.com", passwordEncoder.encode("WorkerPass123"), Role.EMPLOYEE);
        regularEmployee = userRepository.save(regularEmployee);
        employeeToken = "Bearer " + jwtTokenProvider.generateToken(regularEmployee);
    }

    // ==========================================
    // 1. Employee Management Tests
    // ==========================================

    @Test
    @DisplayName("Admin can create an employee with auto-initialized balances, excluding password hash")
    void testAdminCreateEmployee() throws Exception {
        Department dept = departmentRepository.save(new Department("Engineering", "Software Team"));
        leaveTypeRepository.save(new LeaveType("Annual", "Vacation", 14, false));

        CreateEmployeeRequest request = new CreateEmployeeRequest(
                "Charlie Dev",
                "charlie@elms.com",
                "Password@123",
                Role.EMPLOYEE,
                dept.getId(),
                adminUser.getId()
        );

        mockMvc.perform(post("/employees")
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Charlie Dev"))
                .andExpect(jsonPath("$.data.email").value("charlie@elms.com"))
                .andExpect(jsonPath("$.data.role").value("EMPLOYEE"))
                .andExpect(jsonPath("$.data.departmentName").value("Engineering"))
                .andExpect(jsonPath("$.data.managerName").value("Admin Chief"))
                .andExpect(jsonPath("$.data.password").doesNotExist())
                .andExpect(jsonPath("$.data.passwordHash").doesNotExist());

        // Verify balances were auto-created
        User createdUser = userRepository.findByEmail("charlie@elms.com").orElseThrow();
        List<LeaveBalance> balances = leaveBalanceRepository.findByEmployeeId(createdUser.getId());
        assertEquals(1, balances.size());
        assertEquals(14, balances.get(0).getAllocatedDays());
        assertEquals(14, balances.get(0).getRemainingDays());
    }

    @Test
    @DisplayName("Non-admin user receives 403 Forbidden when attempting to create employee")
    void testNonAdminCannotCreateEmployee() throws Exception {
        CreateEmployeeRequest request = new CreateEmployeeRequest(
                "Hacker User",
                "hacker@elms.com",
                "Password@123",
                Role.EMPLOYEE,
                null,
                null
        );

        mockMvc.perform(post("/employees")
                        .header("Authorization", employeeToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Admin cannot assign employee as their own manager")
    void testSelfManagerValidation() throws Exception {
        UpdateEmployeeRequest updateReq = new UpdateEmployeeRequest(
                "Bob Updated",
                "bob@elms.com",
                Role.EMPLOYEE,
                null,
                regularEmployee.getId(), // Assigning self as manager
                true
        );

        mockMvc.perform(put("/employees/" + regularEmployee.getId())
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.message", containsString("cannot be their own manager")));
    }

    @Test
    @DisplayName("Admin can deactivate and reactivate an employee")
    void testToggleEmployeeStatus() throws Exception {
        mockMvc.perform(patch("/employees/" + regularEmployee.getId() + "/status")
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("active", false))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.active").value(false));

        assertFalse(userRepository.findById(regularEmployee.getId()).orElseThrow().isActive());

        mockMvc.perform(patch("/employees/" + regularEmployee.getId() + "/status")
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("active", true))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.active").value(true));

        assertTrue(userRepository.findById(regularEmployee.getId()).orElseThrow().isActive());
    }

    // ==========================================
    // 2. Department Management Tests
    // ==========================================

    @Test
    @DisplayName("Admin can create, update, and assign employees to department")
    void testDepartmentManagementWorkflow() throws Exception {
        DepartmentRequest createReq = new DepartmentRequest("Marketing", "Promotions and Campaigns");

        mockMvc.perform(post("/departments")
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.name").value("Marketing"));

        Department dept = departmentRepository.findByName("Marketing").orElseThrow();

        // Update Department
        DepartmentRequest updateReq = new DepartmentRequest("Global Marketing", "Worldwide outreach");
        mockMvc.perform(put("/departments/" + dept.getId())
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("Global Marketing"));

        // Assign employee to department
        mockMvc.perform(post("/departments/" + dept.getId() + "/employees")
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("employeeIds", List.of(regularEmployee.getId())))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // View department employees
        mockMvc.perform(get("/departments/" + dept.getId() + "/employees")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].id").value(regularEmployee.getId()))
                .andExpect(jsonPath("$.data[0].name").value("Worker Bob"));
    }

    // ==========================================
    // 3. Leave Type Management Tests
    // ==========================================

    @Test
    @DisplayName("Admin can create, update, and toggle leave type active status")
    void testLeaveTypeManagement() throws Exception {
        LeaveTypeRequest createReq = new LeaveTypeRequest("Maternity Leave", "Parenthood leave", 90, true, true);

        mockMvc.perform(post("/leave-types")
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.name").value("Maternity Leave"))
                .andExpect(jsonPath("$.data.annualAllocation").value(90))
                .andExpect(jsonPath("$.data.requiresAttachment").value(true));

        LeaveType leaveType = leaveTypeRepository.findByName("Maternity Leave").orElseThrow();

        // Update leave type
        LeaveTypeRequest updateReq = new LeaveTypeRequest("Maternity/Paternity", "Parental leave", 100, false, true);
        mockMvc.perform(put("/leave-types/" + leaveType.getId())
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("Maternity/Paternity"))
                .andExpect(jsonPath("$.data.annualAllocation").value(100));

        // Toggle status
        mockMvc.perform(patch("/leave-types/" + leaveType.getId() + "/status")
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("active", false))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.active").value(false));

        assertFalse(leaveTypeRepository.findById(leaveType.getId()).orElseThrow().isActive());
    }

    // ==========================================
    // 4. Leave Balance Management Tests
    // ==========================================

    @Test
    @DisplayName("Admin can view and safely adjust employee leave balance")
    void testLeaveBalanceAdjustment() throws Exception {
        LeaveType sick = leaveTypeRepository.save(new LeaveType("Sick", "Medical illness", 10, true));
        LeaveBalance balance = leaveBalanceRepository.save(new LeaveBalance(regularEmployee, sick, 10, LocalDate.now().getYear()));

        // Admin gets all balances
        mockMvc.perform(get("/leave-balances")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].employeeName").value("Worker Bob"));

        // Admin adjusts balance
        AdjustBalanceRequest adjustReq = new AdjustBalanceRequest(12, 3, "Granted 2 additional days by HR");
        mockMvc.perform(put("/leave-balances/" + balance.getId())
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(adjustReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.allocatedDays").value(12))
                .andExpect(jsonPath("$.data.usedDays").value(3))
                .andExpect(jsonPath("$.data.remainingDays").value(9));

        // Non-admin attempting adjustment gets 403
        mockMvc.perform(put("/leave-balances/" + balance.getId())
                        .header("Authorization", employeeToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(adjustReq)))
                .andExpect(status().isForbidden());

        // Invalid adjustment (used > allocated) gets 400
        AdjustBalanceRequest invalidReq = new AdjustBalanceRequest(5, 10, "Invalid used days");
        mockMvc.perform(put("/leave-balances/" + balance.getId())
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.message", containsString("Used days cannot exceed allocated days")));
    }
}
