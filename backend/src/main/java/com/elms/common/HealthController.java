package com.elms.common;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealthStatus() {
        Map<String, Object> healthInfo = new HashMap<>();
        healthInfo.put("status", "UP");
        healthInfo.put("system", "Employee Leave Management System (ELMS)");
        healthInfo.put("version", "1.0.0-SNAPSHOT");
        healthInfo.put("phase", "Phase 1 - Foundation");

        return ResponseEntity.ok(ApiResponse.success(healthInfo, "ELMS API is running healthy"));
    }
}
