package com.elms.security;

import com.elms.common.ApiError;
import com.elms.common.ApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    public JwtAuthenticationEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException, ServletException {
        
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        String message = "Authentication failed: Full authentication is required to access this resource.";
        Object jwtExceptionMsg = request.getAttribute("jwt_error_message");
        if (jwtExceptionMsg != null) {
            message = jwtExceptionMsg.toString();
        } else if (authException != null && authException.getMessage() != null) {
            message = authException.getMessage();
        }

        ApiError apiError = new ApiError("UNAUTHORIZED", message);
        ApiResponse<Object> apiResponse = ApiResponse.error(apiError);

        objectMapper.writeValue(response.getOutputStream(), apiResponse);
    }
}
