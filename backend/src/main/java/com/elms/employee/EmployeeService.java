package com.elms.employee;

import com.elms.department.Department;
import com.elms.department.DepartmentRepository;
import com.elms.employee.dto.CreateEmployeeRequest;
import com.elms.employee.dto.UpdateEmployeeRequest;
import com.elms.exception.BadRequestException;
import com.elms.exception.ResourceNotFoundException;
import com.elms.leavebalance.LeaveBalance;
import com.elms.leavebalance.LeaveBalanceRepository;
import com.elms.leavetype.LeaveType;
import com.elms.leavetype.LeaveTypeRepository;
import com.elms.user.Role;
import com.elms.user.User;
import com.elms.user.UserRepository;
import com.elms.user.dto.UserResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("null")
public class EmployeeService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final LeaveTypeRepository leaveTypeRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeService(
            UserRepository userRepository,
            DepartmentRepository departmentRepository,
            LeaveTypeRepository leaveTypeRepository,
            LeaveBalanceRepository leaveBalanceRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.leaveTypeRepository = leaveTypeRepository;
        this.leaveBalanceRepository = leaveBalanceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> searchEmployees(String query, Long departmentId, Role role, Boolean active) {
        return userRepository.findAll()
                .stream()
                .filter(u -> {
                    if (query != null && !query.trim().isEmpty()) {
                        String q = query.toLowerCase().trim();
                        boolean matchName = u.getName() != null && u.getName().toLowerCase().contains(q);
                        boolean matchEmail = u.getEmail() != null && u.getEmail().toLowerCase().contains(q);
                        if (!matchName && !matchEmail) return false;
                    }
                    if (departmentId != null) {
                        if (u.getDepartment() == null || !u.getDepartment().getId().equals(departmentId)) {
                            return false;
                        }
                    }
                    if (role != null && u.getRole() != role) {
                        return false;
                    }
                    if (active != null && u.isActive() != active) {
                        return false;
                    }
                    return true;
                })
                .map(UserResponse::fromUser)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserResponse getEmployeeById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        return UserResponse.fromUser(user);
    }

    @Transactional
    public UserResponse createEmployee(CreateEmployeeRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An employee with email '" + request.getEmail() + "' already exists");
        }

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));
        }

        User manager = null;
        if (request.getManagerId() != null) {
            manager = userRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager not found with id: " + request.getManagerId()));
        }

        User employee = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getRole(),
                department,
                manager
        );

        User saved = userRepository.save(employee);

        // Initialize default annual leave balances for the newly created employee
        int currentYear = LocalDate.now().getYear();
        List<LeaveType> activeLeaveTypes = leaveTypeRepository.findByActiveTrue();
        for (LeaveType leaveType : activeLeaveTypes) {
            if (!leaveBalanceRepository.existsByEmployeeIdAndLeaveTypeIdAndYear(saved.getId(), leaveType.getId(), currentYear)) {
                leaveBalanceRepository.save(new LeaveBalance(
                        saved,
                        leaveType,
                        leaveType.getAnnualAllocation(),
                        currentYear
                ));
            }
        }

        return UserResponse.fromUser(saved);
    }

    @Transactional
    public UserResponse updateEmployee(Long id, UpdateEmployeeRequest request) {
        User employee = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        // Check if email changed and is already taken
        if (!employee.getEmail().equalsIgnoreCase(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email '" + request.getEmail() + "' is already in use by another account");
        }

        if (request.getManagerId() != null && request.getManagerId().equals(id)) {
            throw new BadRequestException("An employee cannot be their own manager");
        }

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));
        }

        User manager = null;
        if (request.getManagerId() != null) {
            manager = userRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager not found with id: " + request.getManagerId()));
        }

        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setRole(request.getRole());
        employee.setDepartment(department);
        employee.setManager(manager);
        if (request.getActive() != null) {
            employee.setActive(request.getActive());
        }

        User updated = userRepository.save(employee);
        return UserResponse.fromUser(updated);
    }

    @Transactional
    public UserResponse updateStatus(Long id, boolean active) {
        User employee = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        employee.setActive(active);
        User updated = userRepository.save(employee);
        return UserResponse.fromUser(updated);
    }
}
