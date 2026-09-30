package com.elms.config;

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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Component
@Profile({ "dev", "demo", "default" })
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final DepartmentRepository departmentRepository;
    private final LeaveTypeRepository leaveTypeRepository;
    private final UserRepository userRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            DepartmentRepository departmentRepository,
            LeaveTypeRepository leaveTypeRepository,
            UserRepository userRepository,
            LeaveBalanceRepository leaveBalanceRepository,
            LeaveRequestRepository leaveRequestRepository,
            PasswordEncoder passwordEncoder) {
        this.departmentRepository = departmentRepository;
        this.leaveTypeRepository = leaveTypeRepository;
        this.userRepository = userRepository;
        this.leaveBalanceRepository = leaveBalanceRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedInitialDemoData();
        seedSkillTestUsers();
    }

    private void seedInitialDemoData() {
        if (departmentRepository.count() == 0 && userRepository.count() == 0) {
            logger.info("Seeding development demo data...");

            // 1. Departments
            Department engineering = departmentRepository
                    .save(new Department("Engineering & Technology", "Core software development"));

            // 2. Leave Types
            LeaveType annual = leaveTypeRepository
                    .save(new LeaveType("Annual Paid Leave", "Standard annual leave", 14, false));
            LeaveType sick = leaveTypeRepository
                    .save(new LeaveType("Sick Leave", "Medical leave", 7, true));
            LeaveType casual = leaveTypeRepository
                    .save(new LeaveType("Casual Leave", "Personal emergency leave", 5, false));

            // 3. Users
            User admin = userRepository.save(new User(
                    "System Admin",
                    "admin@elms.com",
                    passwordEncoder.encode("Admin@123"),
                    Role.ADMIN,
                    engineering,
                    null));

            User manager = userRepository.save(new User(
                    "Robert Manager",
                    "manager@elms.com",
                    passwordEncoder.encode("Manager@123"),
                    Role.MANAGER,
                    engineering,
                    admin));

            User employee = userRepository.save(new User(
                    "Jane Employee",
                    "employee@elms.com",
                    passwordEncoder.encode("Employee@123"),
                    Role.EMPLOYEE,
                    engineering,
                    manager));

            // 4. Initial Leave Balances for current year
            int currentYear = LocalDate.now().getYear();
            leaveBalanceRepository.save(
                    new LeaveBalance(employee, annual, annual.getAnnualAllocation(), currentYear));
            leaveBalanceRepository.save(
                    new LeaveBalance(employee, sick, sick.getAnnualAllocation(), currentYear));
            // Casual leave with 2 used days (for the approved sample request)
            leaveBalanceRepository.save(new LeaveBalance(employee, casual, casual.getAnnualAllocation(), 2,
                    3, currentYear));

            leaveBalanceRepository.save(
                    new LeaveBalance(manager, annual, annual.getAnnualAllocation(), currentYear));
            leaveBalanceRepository
                    .save(new LeaveBalance(manager, sick, sick.getAnnualAllocation(), currentYear));

            // 5. Sample Leave Requests
            LeaveRequest pendingLeave = new LeaveRequest(
                    employee,
                    annual,
                    LocalDate.now().plusDays(10),
                    LocalDate.now().plusDays(12),
                    3,
                    "Family road trip vacation planned in advance");
            pendingLeave.setStatus(LeaveStatus.PENDING);
            leaveRequestRepository.save(pendingLeave);

            LeaveRequest approvedLeave = new LeaveRequest(
                    employee,
                    casual,
                    LocalDate.now().minusDays(15),
                    LocalDate.now().minusDays(14),
                    2,
                    "Attending family wedding reception in hometown");
            approvedLeave.setStatus(LeaveStatus.APPROVED);
            approvedLeave.setApprovedBy(manager);
            approvedLeave.setApprovedAt(Instant.now().minusSeconds(86400 * 16));
            approvedLeave.setManagerComment("Approved. Enjoy the celebration!");
            leaveRequestRepository.save(approvedLeave);

            LeaveRequest rejectedLeave = new LeaveRequest(
                    employee,
                    sick,
                    LocalDate.now().minusDays(5),
                    LocalDate.now().minusDays(4),
                    2,
                    "Severe allergy and medical consultation");
            rejectedLeave.setStatus(LeaveStatus.REJECTED);
            rejectedLeave.setApprovedBy(manager);
            rejectedLeave.setApprovedAt(Instant.now().minusSeconds(86400 * 5));
            rejectedLeave.setManagerComment(
                    "Medical documentation was incomplete. Please resubmit with doctor prescription.");
            leaveRequestRepository.save(rejectedLeave);

            logger.info("Demo entities and sample leave requests seeded successfully.");
        }
    }

    /**
     * Idempotently seeds the three mandatory test accounts:
     * - SKILLADMIN (skilladmin@skillmate.local) with role ADMIN
     * - SKILLMANAGER (skillmanager@skillmate.local) with role MANAGER
     * - SKILLEMPLOYEE (skillemployee@skillmate.local) with role EMPLOYEE
     * All passwords are BCrypt hashed.
     */
    public void seedSkillTestUsers() {
        logger.info("Checking/seeding SkillMate test users (SKILLADMIN, SKILLMANAGER, SKILLEMPLOYEE)...");

        // 1. Department
        Department department = departmentRepository.findAll().stream().findFirst().orElseGet(() ->
                departmentRepository.save(new Department("Engineering & Technology", "Core software development"))
        );

        // 2. Ensure basic leave types exist for balance assignment
        LeaveType annual = leaveTypeRepository.findAll().stream()
                .filter(t -> t.getName().toLowerCase().contains("annual"))
                .findFirst()
                .orElseGet(() -> leaveTypeRepository.save(new LeaveType("Annual Paid Leave", "Standard annual leave", 14, false)));

        LeaveType sick = leaveTypeRepository.findAll().stream()
                .filter(t -> t.getName().toLowerCase().contains("sick"))
                .findFirst()
                .orElseGet(() -> leaveTypeRepository.save(new LeaveType("Sick Leave", "Medical leave", 7, true)));

        LeaveType casual = leaveTypeRepository.findAll().stream()
                .filter(t -> t.getName().toLowerCase().contains("casual"))
                .findFirst()
                .orElseGet(() -> leaveTypeRepository.save(new LeaveType("Casual Leave", "Personal emergency leave", 5, false)));

        // 3. Test Admin: SKILLADMIN (skilladmin@skillmate.local)
        User skillAdmin = userRepository.findByEmail("skilladmin@skillmate.local").orElseGet(() -> {
            logger.info("Creating test admin user: SKILLADMIN (skilladmin@skillmate.local)");
            return userRepository.save(new User(
                    "SKILLADMIN",
                    "skilladmin@skillmate.local",
                    passwordEncoder.encode("123467890"),
                    Role.ADMIN,
                    department,
                    null
            ));
        });

        boolean adminChanged = false;
        if (skillAdmin.getRole() != Role.ADMIN) {
            skillAdmin.setRole(Role.ADMIN);
            adminChanged = true;
        }
        if (!skillAdmin.isActive()) {
            skillAdmin.setActive(true);
            adminChanged = true;
        }
        if (!passwordEncoder.matches("123467890", skillAdmin.getPasswordHash())) {
            skillAdmin.setPasswordHash(passwordEncoder.encode("123467890"));
            adminChanged = true;
        }
        if (adminChanged) {
            skillAdmin = userRepository.save(skillAdmin);
        }

        // 4. Test Manager: SKILLMANAGER (skillmanager@skillmate.local)
        final User adminReference = skillAdmin;
        User skillManager = userRepository.findByEmail("skillmanager@skillmate.local").orElseGet(() -> {
            logger.info("Creating test manager user: SKILLMANAGER (skillmanager@skillmate.local)");
            return userRepository.save(new User(
                    "SKILLMANAGER",
                    "skillmanager@skillmate.local",
                    passwordEncoder.encode("123467890"),
                    Role.MANAGER,
                    department,
                    adminReference
            ));
        });

        boolean managerChanged = false;
        if (skillManager.getRole() != Role.MANAGER) {
            skillManager.setRole(Role.MANAGER);
            managerChanged = true;
        }
        if (!skillManager.isActive()) {
            skillManager.setActive(true);
            managerChanged = true;
        }
        if (skillManager.getManager() == null && adminReference != null) {
            skillManager.setManager(adminReference);
            managerChanged = true;
        }
        if (!passwordEncoder.matches("123467890", skillManager.getPasswordHash())) {
            skillManager.setPasswordHash(passwordEncoder.encode("123467890"));
            managerChanged = true;
        }
        if (managerChanged) {
            skillManager = userRepository.save(skillManager);
        }

        // 5. Test Employee: SKILLEMPLOYEE (skillemployee@skillmate.local)
        final User managerReference = skillManager;
        User skillEmployee = userRepository.findByEmail("skillemployee@skillmate.local").orElseGet(() -> {
            logger.info("Creating test employee user: SKILLEMPLOYEE (skillemployee@skillmate.local)");
            return userRepository.save(new User(
                    "SKILLEMPLOYEE",
                    "skillemployee@skillmate.local",
                    passwordEncoder.encode("123467890"),
                    Role.EMPLOYEE,
                    department,
                    managerReference
            ));
        });

        boolean employeeChanged = false;
        if (skillEmployee.getRole() != Role.EMPLOYEE) {
            skillEmployee.setRole(Role.EMPLOYEE);
            employeeChanged = true;
        }
        if (!skillEmployee.isActive()) {
            skillEmployee.setActive(true);
            employeeChanged = true;
        }
        if (skillEmployee.getManager() == null && managerReference != null) {
            skillEmployee.setManager(managerReference);
            employeeChanged = true;
        }
        if (!passwordEncoder.matches("123467890", skillEmployee.getPasswordHash())) {
            skillEmployee.setPasswordHash(passwordEncoder.encode("123467890"));
            employeeChanged = true;
        }
        if (employeeChanged) {
            skillEmployee = userRepository.save(skillEmployee);
        }

        // 6. Ensure leave balances for SKILLEMPLOYEE & SKILLMANAGER for the current year
        int currentYear = LocalDate.now().getYear();
        List<LeaveType> leaveTypes = List.of(annual, sick, casual);
        for (LeaveType lt : leaveTypes) {
            if (!leaveBalanceRepository.existsByEmployeeIdAndLeaveTypeIdAndYear(skillEmployee.getId(), lt.getId(), currentYear)) {
                leaveBalanceRepository.save(new LeaveBalance(skillEmployee, lt, lt.getAnnualAllocation(), currentYear));
            }
            if (!leaveBalanceRepository.existsByEmployeeIdAndLeaveTypeIdAndYear(skillManager.getId(), lt.getId(), currentYear)) {
                leaveBalanceRepository.save(new LeaveBalance(skillManager, lt, lt.getAnnualAllocation(), currentYear));
            }
        }

        logger.info("SkillMate test users (SKILLADMIN, SKILLMANAGER, SKILLEMPLOYEE) initialized successfully.");
    }
}
