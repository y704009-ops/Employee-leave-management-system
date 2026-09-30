package com.elms.domain;

import com.elms.department.Department;
import com.elms.department.DepartmentRepository;
import com.elms.leavebalance.LeaveBalance;
import com.elms.leavebalance.LeaveBalanceRepository;
import com.elms.leaverequest.LeaveRequest;
import com.elms.leaverequest.LeaveRequestRepository;
import com.elms.leaverequest.LeaveStatus;
import com.elms.leavetype.LeaveType;
import com.elms.leavetype.LeaveTypeRepository;
import com.elms.user.Role;
import com.elms.user.User;
import com.elms.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class DomainModelIntegrationTest {

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

    @BeforeEach
    void cleanUp() {
        leaveRequestRepository.deleteAll();
        leaveBalanceRepository.deleteAll();
        userRepository.deleteAll();
        departmentRepository.deleteAll();
        leaveTypeRepository.deleteAll();
    }

    @Test
    @DisplayName("1. Verify Department and User JPA Relationship")
    void testDepartmentAndUserRelationship() {
        Department engineering = departmentRepository.save(new Department("Engineering", "Software division"));

        User user = new User("Alice Developer", "alice@elms.com", "hash123", Role.EMPLOYEE);
        user.setDepartment(engineering);
        User savedUser = userRepository.save(user);

        assertNotNull(savedUser.getId());
        assertEquals("Engineering", savedUser.getDepartment().getName());
        assertEquals(engineering.getId(), savedUser.getDepartmentId());
    }

    @Test
    @DisplayName("2. Verify Employee-Manager Self-Referencing Relationship")
    void testEmployeeManagerSelfRelationship() {
        User manager = userRepository.save(new User("Manager Bob", "bob@elms.com", "hash123", Role.MANAGER));

        User employee = new User("Charlie Staff", "charlie@elms.com", "hash123", Role.EMPLOYEE);
        employee.setManager(manager);
        User savedEmployee = userRepository.save(employee);

        assertNotNull(savedEmployee.getId());
        assertNotNull(savedEmployee.getManager());
        assertEquals(manager.getId(), savedEmployee.getManager().getId());
        assertEquals("Manager Bob", savedEmployee.getManager().getName());
    }

    @Test
    @DisplayName("3. Verify Unique Constraints on Email and Department Name")
    void testUniqueConstraints() {
        departmentRepository.save(new Department("Sales", "Sales division"));
        assertThrows(DataIntegrityViolationException.class, () -> {
            departmentRepository.saveAndFlush(new Department("Sales", "Duplicate sales"));
        });

        userRepository.save(new User("User 1", "test@unique.com", "hash", Role.EMPLOYEE));
        assertThrows(DataIntegrityViolationException.class, () -> {
            userRepository.saveAndFlush(new User("User 2", "test@unique.com", "hash", Role.EMPLOYEE));
        });
    }

    @Test
    @DisplayName("4. Verify Unique (Employee + LeaveType + Year) Constraint on LeaveBalance")
    void testLeaveBalanceUniqueConstraint() {
        User emp = userRepository.save(new User("David", "david@elms.com", "hash", Role.EMPLOYEE));
        LeaveType annual = leaveTypeRepository.save(new LeaveType("Annual", "Vacation", 14, false));

        LeaveBalance balance1 = new LeaveBalance(emp, annual, 14, 2026);
        leaveBalanceRepository.saveAndFlush(balance1);

        LeaveBalance duplicateBalance = new LeaveBalance(emp, annual, 14, 2026);
        assertThrows(DataIntegrityViolationException.class, () -> {
            leaveBalanceRepository.saveAndFlush(duplicateBalance);
        });
    }

    @Test
    @DisplayName("5. Verify LeaveRequest Lifecycle and Overlap Detection Queries")
    void testLeaveRequestAndOverlapQueries() {
        User emp = userRepository.save(new User("Elena", "elena@elms.com", "hash", Role.EMPLOYEE));
        LeaveType sick = leaveTypeRepository.save(new LeaveType("Sick", "Illness", 7, true));

        LocalDate start = LocalDate.of(2026, 10, 5);
        LocalDate end = LocalDate.of(2026, 10, 8);

        LeaveRequest request = new LeaveRequest(emp, sick, start, end, 4, "Flu recovery");
        LeaveRequest savedRequest = leaveRequestRepository.save(request);

        assertNotNull(savedRequest.getId());
        assertEquals(LeaveStatus.PENDING, savedRequest.getStatus());

        // Test repository queries
        List<LeaveRequest> empRequests = leaveRequestRepository.findByEmployeeId(emp.getId());
        assertEquals(1, empRequests.size());

        List<LeaveRequest> pendingRequests = leaveRequestRepository.findByStatus(LeaveStatus.PENDING);
        assertEquals(1, pendingRequests.size());

        // Test overlap query with overlapping date range (Oct 7 - Oct 10 overlaps with Oct 5 - Oct 8)
        List<LeaveRequest> overlaps = leaveRequestRepository.findOverlappingRequests(
                emp.getId(),
                LocalDate.of(2026, 10, 7),
                LocalDate.of(2026, 10, 10),
                List.of(LeaveStatus.PENDING, LeaveStatus.APPROVED)
        );
        assertEquals(1, overlaps.size());

        // Test non-overlapping date range (Oct 15 - Oct 18)
        List<LeaveRequest> noOverlaps = leaveRequestRepository.findOverlappingRequests(
                emp.getId(),
                LocalDate.of(2026, 10, 15),
                LocalDate.of(2026, 10, 18),
                List.of(LeaveStatus.PENDING, LeaveStatus.APPROVED)
        );
        assertEquals(0, noOverlaps.size());
    }

    @Test
    @DisplayName("6. Verify Leave Balance Querying and Remaining Days Calculation")
    void testLeaveBalanceCalculations() {
        User emp = userRepository.save(new User("Frank", "frank@elms.com", "hash", Role.EMPLOYEE));
        LeaveType casual = leaveTypeRepository.save(new LeaveType("Casual", "Short notice", 5, false));

        LeaveBalance balance = new LeaveBalance(emp, casual, 5, 2, 3, 2026);
        leaveBalanceRepository.save(balance);

        Optional<LeaveBalance> retrieved = leaveBalanceRepository.findByEmployeeIdAndLeaveTypeIdAndYear(
                emp.getId(),
                casual.getId(),
                2026
        );

        assertTrue(retrieved.isPresent());
        assertEquals(5, retrieved.get().getAllocatedDays());
        assertEquals(2, retrieved.get().getUsedDays());
        assertEquals(3, retrieved.get().getRemainingDays());
    }
}
