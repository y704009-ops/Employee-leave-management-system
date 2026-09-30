package com.elms.auth;

import com.elms.auth.dto.AuthResponse;
import com.elms.auth.dto.LoginRequest;
import com.elms.exception.ResourceNotFoundException;
import com.elms.exception.UnauthorizedException;
import com.elms.security.JwtTokenProvider;
import com.elms.user.User;
import com.elms.user.UserRepository;
import com.elms.user.dto.UserResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

            if (!user.isActive()) {
                throw new UnauthorizedException("User account is inactive. Please contact administration.");
            }

            String token = jwtTokenProvider.generateToken(user);
            long expiresIn = jwtTokenProvider.getJwtExpirationMs() / 1000;

            return new AuthResponse(token, expiresIn, UserResponse.fromUser(user));
        } catch (BadCredentialsException ex) {
            throw new UnauthorizedException("Invalid email or password");
        } catch (DisabledException ex) {
            throw new UnauthorizedException("User account is disabled");
        }
    }
}
