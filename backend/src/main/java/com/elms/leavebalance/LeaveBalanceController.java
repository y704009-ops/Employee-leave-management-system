package com.elms.leavebalance;

import com.elms.common.ApiResponse;
import com.elms.leavebalance.dto.AdjustBalanceRequest;
import com.elms.leavebalance.dto.LeaveBalanceResponse;
import com.elms.user.User;
import com.elms.user.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leave-balances")
public class LeaveBalanceController {

    private final LeaveBalanceService leaveBalanceService;
    private final UserService userService;

    public LeaveBalanceController(LeaveBalanceService leaveBalanceService, UserService userService) {
        this.leaveBalanceService = leaveBalanceService;
        this.userService = userService;
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<LeaveBalanceResponse>>> getMyBalances(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(name = "year", required = false) Integer year) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        List<LeaveBalanceResponse> balances = (year != null)
                ? leaveBalanceService.getBalancesByEmployeeAndYear(user.getId(), year)
                : leaveBalanceService.getBalancesByEmployee(user.getId());
        return ResponseEntity.ok(ApiResponse.success(balances, "My leave balances retrieved successfully"));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<LeaveBalanceResponse>>> getAllBalances(
            @RequestParam(name = "year", required = false) Integer year) {
        List<LeaveBalanceResponse> balances = leaveBalanceService.getAllBalances(year);
        return ResponseEntity.ok(ApiResponse.success(balances, "Leave balances retrieved successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<LeaveBalanceResponse>> adjustBalance(
            @PathVariable("id") Long id,
            @Valid @RequestBody AdjustBalanceRequest request) {
        LeaveBalanceResponse response = leaveBalanceService.adjustBalance(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Leave balance adjusted successfully"));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<LeaveBalanceResponse>>> getBalancesForEmployee(
            @PathVariable("employeeId") Long employeeId,
            @RequestParam(name = "year", required = false) Integer year) {
        List<LeaveBalanceResponse> balances = (year != null)
                ? leaveBalanceService.getBalancesByEmployeeAndYear(employeeId, year)
                : leaveBalanceService.getBalancesByEmployee(employeeId);
        return ResponseEntity.ok(ApiResponse.success(balances, "Leave balances retrieved successfully"));
    }
}
