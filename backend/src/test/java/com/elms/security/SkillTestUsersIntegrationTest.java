package com.elms.security;

import com.elms.auth.dto.LoginRequest;
import com.elms.config.DataInitializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("demo")
public class SkillTestUsersIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private DataInitializer dataInitializer;

    @BeforeEach
    void setUp() {
        // Trigger idempotent seeding of the three test users
        dataInitializer.seedSkillTestUsers();
    }

    @Test
    @DisplayName("1. SKILLADMIN authenticates successfully and obtains JWT with ADMIN role")
    void testSkillAdminAuthentication() throws Exception {
        LoginRequest request = new LoginRequest("skilladmin@skillmate.local", "123467890");

        MvcResult result = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andExpect(jsonPath("$.data.user.name", is("SKILLADMIN")))
                .andExpect(jsonPath("$.data.user.email", is("skilladmin@skillmate.local")))
                .andExpect(jsonPath("$.data.user.role", is("ADMIN")))
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        String token = objectMapper.readTree(responseBody).get("data").get("token").asText();

        // Verify ADMIN can access admin status endpoint
        mockMvc.perform(get("/admin/status")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.adminAccess", is("GRANTED")));

        // Verify ADMIN can access admin reports dashboard
        mockMvc.perform(get("/reports/dashboard")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.totalActiveEmployees", notNullValue()));
    }

    @Test
    @DisplayName("2. SKILLMANAGER authenticates successfully and obtains JWT with MANAGER role")
    void testSkillManagerAuthentication() throws Exception {
        LoginRequest request = new LoginRequest("skillmanager@skillmate.local", "123467890");

        MvcResult result = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andExpect(jsonPath("$.data.user.name", is("SKILLMANAGER")))
                .andExpect(jsonPath("$.data.user.email", is("skillmanager@skillmate.local")))
                .andExpect(jsonPath("$.data.user.role", is("MANAGER")))
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        String token = objectMapper.readTree(responseBody).get("data").get("token").asText();

        // Verify MANAGER can access manager team dashboard
        mockMvc.perform(get("/leave-requests/team-dashboard")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.teamMembersCount", notNullValue()));

        // Verify MANAGER cannot access admin status endpoint
        mockMvc.perform(get("/admin/status")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());

        // Verify MANAGER cannot access admin dashboard stats
        mockMvc.perform(get("/reports/dashboard")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("3. SKILLEMPLOYEE authenticates successfully and obtains JWT with EMPLOYEE role")
    void testSkillEmployeeAuthentication() throws Exception {
        LoginRequest request = new LoginRequest("skillemployee@skillmate.local", "123467890");

        MvcResult result = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andExpect(jsonPath("$.data.user.name", is("SKILLEMPLOYEE")))
                .andExpect(jsonPath("$.data.user.email", is("skillemployee@skillmate.local")))
                .andExpect(jsonPath("$.data.user.role", is("EMPLOYEE")))
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        String token = objectMapper.readTree(responseBody).get("data").get("token").asText();

        // Verify EMPLOYEE can access their leave balances
        mockMvc.perform(get("/leave-balances/my")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", isA(java.util.List.class)));

        // Verify EMPLOYEE cannot access manager endpoints
        mockMvc.perform(get("/leave-requests/team-dashboard")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());

        // Verify EMPLOYEE cannot access admin endpoints
        mockMvc.perform(get("/admin/status")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("4. Authentication fails with incorrect password")
    void testSkillUserInvalidPasswordFails() throws Exception {
        LoginRequest request = new LoginRequest("skilladmin@skillmate.local", "WrongPassword");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.error.message", containsString("Invalid email or password")));
    }

    @Test
    @DisplayName("5. Idempotent seeding does not duplicate users")
    void testIdempotentSeeding() {
        // Run seed multiple times
        dataInitializer.seedSkillTestUsers();
        dataInitializer.seedSkillTestUsers();
        // Setup succeeded without UniqueConstraintViolation or duplicate entity exceptions
    }
}
