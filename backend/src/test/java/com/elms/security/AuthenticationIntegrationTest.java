package com.elms.security;

import com.elms.auth.dto.LoginRequest;
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

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@SuppressWarnings("null")
public class AuthenticationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.elms.leavebalance.LeaveBalanceRepository leaveBalanceRepository;

    @Autowired
    private com.elms.leaverequest.LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private User adminUser;
    private User employeeUser;

    @BeforeEach
    void setUp() {
        leaveRequestRepository.deleteAll();
        leaveBalanceRepository.deleteAll();
        userRepository.deleteAll();

        adminUser = new User(
                "Admin Test User",
                "admin.test@elms.com",
                passwordEncoder.encode("Password@123"),
                Role.ADMIN
        );
        userRepository.save(adminUser);

        employeeUser = new User(
                "Employee Test User",
                "employee.test@elms.com",
                passwordEncoder.encode("Password@123"),
                Role.EMPLOYEE
        );
        userRepository.save(employeeUser);
    }

    @Test
    @DisplayName("1. Successful login returns JWT token and user info without password")
    void testSuccessfulLogin() throws Exception {
        LoginRequest loginRequest = new LoginRequest("admin.test@elms.com", "Password@123");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andExpect(jsonPath("$.data.tokenType", is("Bearer")))
                .andExpect(jsonPath("$.data.user.email", is("admin.test@elms.com")))
                .andExpect(jsonPath("$.data.user.role", is("ADMIN")))
                .andExpect(jsonPath("$.data.user.password").doesNotExist())
                .andExpect(jsonPath("$.data.user.passwordHash").doesNotExist());
    }

    @Test
    @DisplayName("2. Login with invalid password returns 401 Unauthorized")
    void testInvalidCredentials_WrongPassword() throws Exception {
        LoginRequest loginRequest = new LoginRequest("admin.test@elms.com", "WrongPassword!");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.error.code", is("UNAUTHORIZED")));
    }

    @Test
    @DisplayName("3. Login with nonexistent email returns 401 Unauthorized")
    void testInvalidCredentials_NonexistentEmail() throws Exception {
        LoginRequest loginRequest = new LoginRequest("nonexistent@elms.com", "Password@123");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.error.code", is("UNAUTHORIZED")));
    }

    @Test
    @DisplayName("4. Protected endpoint with missing JWT returns 401 Unauthorized")
    void testMissingJwtToken() throws Exception {
        mockMvc.perform(get("/users/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.error.code", is("UNAUTHORIZED")));
    }

    @Test
    @DisplayName("5. Protected endpoint with invalid JWT returns 401 Unauthorized")
    void testInvalidJwtToken() throws Exception {
        mockMvc.perform(get("/users/me")
                        .header("Authorization", "Bearer invalid.malformed.token"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.error.code", is("UNAUTHORIZED")));
    }

    @Test
    @DisplayName("6. Protected endpoint with expired JWT returns 401 Unauthorized")
    void testExpiredJwtToken() throws Exception {
        // Generate a token that expired 10 seconds ago
        String expiredToken = jwtTokenProvider.generateTokenWithExpiration(employeeUser, -10000L);

        mockMvc.perform(get("/users/me")
                        .header("Authorization", "Bearer " + expiredToken))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.error.code", is("UNAUTHORIZED")));
    }

    @Test
    @DisplayName("7. Accessing ADMIN resource with EMPLOYEE role returns 403 Forbidden")
    void testForbiddenRoleAccess() throws Exception {
        String employeeToken = jwtTokenProvider.generateToken(employeeUser);

        mockMvc.perform(get("/admin/status")
                        .header("Authorization", "Bearer " + employeeToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.error.code", is("FORBIDDEN")));
    }

    @Test
    @DisplayName("8. Accessing ADMIN resource with ADMIN role returns 200 OK")
    void testAuthorizedAdminRoleAccess() throws Exception {
        String adminToken = jwtTokenProvider.generateToken(adminUser);

        mockMvc.perform(get("/admin/status")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.adminAccess", is("GRANTED")));
    }

    @Test
    @DisplayName("9. Current user endpoint with valid JWT returns user data")
    void testGetCurrentUserEndpoint() throws Exception {
        String token = jwtTokenProvider.generateToken(employeeUser);

        mockMvc.perform(get("/users/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.email", is("employee.test@elms.com")))
                .andExpect(jsonPath("$.data.role", is("EMPLOYEE")))
                .andExpect(jsonPath("$.data.name", is("Employee Test User")))
                .andExpect(jsonPath("$.data.password").doesNotExist())
                .andExpect(jsonPath("$.data.passwordHash").doesNotExist());
    }

    @Test
    @DisplayName("10. Logout endpoint returns 200 OK")
    void testLogoutEndpoint() throws Exception {
        mockMvc.perform(post("/auth/logout"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.message", containsString("Logged out")));
    }
}
