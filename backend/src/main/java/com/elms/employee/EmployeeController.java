package com.elms.employee;

import com.elms.common.ApiResponse;
import com.elms.employee.dto.CreateEmployeeRequest;
import com.elms.employee.dto.UpdateEmployeeRequest;
import com.elms.user.Role;
import com.elms.user.dto.UserResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getEmployees(
            @RequestParam(name = "query", required = false) String query,
            @RequestParam(name = "departmentId", required = false) Long departmentId,
            @RequestParam(name = "role", required = false) Role role,
            @RequestParam(name = "active", required = false) Boolean active) {
        List<UserResponse> employees = employeeService.searchEmployees(query, departmentId, role, active);
        return ResponseEntity.ok(ApiResponse.success(employees, "Employees retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getEmployeeById(@PathVariable("id") Long id) {
        UserResponse employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(ApiResponse.success(employee, "Employee retrieved successfully"));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> createEmployee(@Valid @RequestBody CreateEmployeeRequest request) {
        UserResponse created = employeeService.createEmployee(request);
        return new ResponseEntity<>(ApiResponse.success(created, "Employee created successfully"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> updateEmployee(
            @PathVariable("id") Long id,
            @Valid @RequestBody UpdateEmployeeRequest request) {
        UserResponse updated = employeeService.updateEmployee(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Employee updated successfully"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> updateEmployeeStatus(
            @PathVariable("id") Long id,
            @RequestBody Map<String, Boolean> statusUpdate) {
        boolean active = statusUpdate.getOrDefault("active", true);
        UserResponse updated = employeeService.updateStatus(id, active);
        return ResponseEntity.ok(ApiResponse.success(updated, "Employee status updated successfully"));
    }
}
