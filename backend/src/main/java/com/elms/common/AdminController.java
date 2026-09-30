package com.elms.common;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Map<String, String>>> getAdminStatus() {
        return ResponseEntity.ok(ApiResponse.success(Map.of("adminAccess", "GRANTED"), "Admin access authorized"));
    }
}
