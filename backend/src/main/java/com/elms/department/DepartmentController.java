package com.elms.department;

import com.elms.common.ApiResponse;
import com.elms.department.dto.DepartmentRequest;
import com.elms.department.dto.DepartmentResponse;
import com.elms.user.dto.UserResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DepartmentResponse>>> getDepartments() {
        List<DepartmentResponse> departments = departmentService.getAllDepartments();
        return ResponseEntity.ok(ApiResponse.success(departments, "Departments retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DepartmentResponse>> getDepartmentById(@PathVariable("id") Long id) {
        DepartmentResponse department = departmentService.getDepartmentById(id);
        return ResponseEntity.ok(ApiResponse.success(department, "Department retrieved successfully"));
    }

    @GetMapping("/{id}/employees")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getDepartmentEmployees(@PathVariable("id") Long id) {
        List<UserResponse> employees = departmentService.getDepartmentEmployees(id);
        return ResponseEntity.ok(ApiResponse.success(employees, "Department employees retrieved successfully"));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DepartmentResponse>> createDepartment(@Valid @RequestBody DepartmentRequest request) {
        DepartmentResponse created = departmentService.createDepartment(request);
        return new ResponseEntity<>(ApiResponse.success(created, "Department created successfully"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DepartmentResponse>> updateDepartment(
            @PathVariable("id") Long id,
            @Valid @RequestBody DepartmentRequest request) {
        DepartmentResponse updated = departmentService.updateDepartment(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Department updated successfully"));
    }

    @PostMapping("/{id}/employees")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> assignEmployeesToDepartment(
            @PathVariable("id") Long id,
            @RequestBody Map<String, List<Long>> requestBody) {
        List<Long> employeeIds = requestBody.get("employeeIds");
        departmentService.assignEmployeesToDepartment(id, employeeIds);
        return ResponseEntity.ok(ApiResponse.success(null, "Employees assigned to department successfully"));
    }
}
