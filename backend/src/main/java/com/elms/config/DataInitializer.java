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

@Component
@Profile({ "dev", "demo" })
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

                        // 4. Initial Leave Balances for 2026
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
                        // 5a. Pending request (for manager approval queue or employee cancellation
                        // demo)
                        LeaveRequest pendingLeave = new LeaveRequest(
                                        employee,
                                        annual,
                                        LocalDate.now().plusDays(10),
                                        LocalDate.now().plusDays(12),
                                        3,
                                        "Family road trip vacation planned in advance");
                        pendingLeave.setStatus(LeaveStatus.PENDING);
                        leaveRequestRepository.save(pendingLeave);

                        // 5b. Approved request (for history and calendar)
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

                        // 5c. Rejected request (with required manager comment)
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
}
